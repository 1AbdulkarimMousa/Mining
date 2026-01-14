/**
 * Ziyo International - Three.js Particle Animation
 * Copper-themed 3D particle system for hero sections
 * Version: 1.0
 */

class ParticleSystem {
  constructor(container) {
    this.container = container || document.querySelector('.hero-3d-container');
    if (!this.container) return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.particles = null;
    this.mouseX = 0;
    this.mouseY = 0;
    this.clock = null;
    this.animationId = null;
    this.isRunning = false;

    // Configuration
    this.config = {
      particleCount: 2000,
      particleSize: 2,
      colors: {
        primary: 0xB87333,    // Copper
        secondary: 0xCD853F,  // Copper light
        accent: 0xFFD700      // Gold
      },
      movement: {
        speed: 0.0005,
        amplitude: 100,
        rotationSpeed: 0.0002
      }
    };

    this.init();
  }

  init() {
    // Check for WebGL support
    if (!this.checkWebGL()) {
      console.warn('WebGL not supported, falling back to CSS animation');
      this.createFallbackAnimation();
      return;
    }

    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    this.setupScene();
    this.createParticles();
    this.addEventListeners();
    this.animate();
  }

  checkWebGL() {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  }

  setupScene() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    // Scene
    this.scene = new THREE.Scene();

    // Camera
    this.camera = new THREE.PerspectiveCamera(75, width / height, 1, 5000);
    this.camera.position.z = 1000;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(width, height);
    this.renderer.setClearColor(0x000000, 0);
    this.container.appendChild(this.renderer.domElement);

    // Clock for animations
    this.clock = new THREE.Clock();
  }

  createParticles() {
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
    const sizes = [];

    const colorPrimary = new THREE.Color(this.config.colors.primary);
    const colorSecondary = new THREE.Color(this.config.colors.secondary);
    const colorAccent = new THREE.Color(this.config.colors.accent);

    for (let i = 0; i < this.config.particleCount; i++) {
      // Position - spread in a spherical distribution
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 300 + Math.random() * 500;

      positions.push(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi)
      );

      // Color - mix between copper tones
      const colorChoice = Math.random();
      let color;
      if (colorChoice < 0.6) {
        color = colorPrimary;
      } else if (colorChoice < 0.9) {
        color = colorSecondary;
      } else {
        color = colorAccent;
      }
      colors.push(color.r, color.g, color.b);

      // Size variation
      sizes.push(this.config.particleSize * (0.5 + Math.random()));
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

    // Custom shader material for better particles
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        pixelRatio: { value: this.renderer.getPixelRatio() }
      },
      vertexShader: `
        attribute float size;
        varying vec3 vColor;
        uniform float time;
        uniform float pixelRatio;

        void main() {
          vColor = color;

          vec3 pos = position;
          pos.x += sin(time + position.y * 0.01) * 20.0;
          pos.y += cos(time + position.x * 0.01) * 20.0;

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * pixelRatio * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;

        void main() {
          float r = distance(gl_PointCoord, vec2(0.5, 0.5));
          if (r > 0.5) discard;

          float alpha = 1.0 - smoothstep(0.3, 0.5, r);
          gl_FragColor = vec4(vColor, alpha * 0.8);
        }
      `,
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  addEventListeners() {
    // Mouse movement for interactivity
    document.addEventListener('mousemove', (e) => {
      this.mouseX = (e.clientX - window.innerWidth / 2) * 0.5;
      this.mouseY = (e.clientY - window.innerHeight / 2) * 0.5;
    });

    // Resize handler
    window.addEventListener('resize', () => this.handleResize());

    // Visibility change to pause when hidden
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pause();
      } else {
        this.resume();
      }
    });
  }

  handleResize() {
    if (!this.container || !this.camera || !this.renderer) return;

    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    this.isRunning = true;
    const render = () => {
      if (!this.isRunning) return;
      this.animationId = requestAnimationFrame(render);

      const elapsedTime = this.clock.getElapsedTime();

      // Update shader uniform
      if (this.particles && this.particles.material.uniforms) {
        this.particles.material.uniforms.time.value = elapsedTime;
      }

      // Rotate particle system
      if (this.particles) {
        this.particles.rotation.y += this.config.movement.rotationSpeed;
        this.particles.rotation.x = Math.sin(elapsedTime * 0.1) * 0.1;
      }

      // Camera follows mouse
      this.camera.position.x += (this.mouseX - this.camera.position.x) * 0.02;
      this.camera.position.y += (-this.mouseY - this.camera.position.y) * 0.02;
      this.camera.lookAt(this.scene.position);

      this.renderer.render(this.scene, this.camera);
    };

    render();
  }

  pause() {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  resume() {
    if (!this.isRunning) {
      this.animate();
    }
  }

  createFallbackAnimation() {
    // Create CSS-based particle fallback
    this.container.innerHTML = '';
    this.container.style.overflow = 'hidden';

    for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle-fallback';
      particle.style.cssText = `
        position: absolute;
        width: ${2 + Math.random() * 4}px;
        height: ${2 + Math.random() * 4}px;
        background: ${Math.random() > 0.5 ? '#B87333' : '#CD853F'};
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        opacity: ${0.3 + Math.random() * 0.5};
        animation: floatParticle ${5 + Math.random() * 10}s ease-in-out infinite;
        animation-delay: ${Math.random() * 5}s;
      `;
      this.container.appendChild(particle);
    }

    // Add keyframe animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes floatParticle {
        0%, 100% { transform: translateY(0) translateX(0); }
        25% { transform: translateY(-30px) translateX(10px); }
        50% { transform: translateY(-10px) translateX(-10px); }
        75% { transform: translateY(-40px) translateX(5px); }
      }
    `;
    document.head.appendChild(style);
  }

  destroy() {
    this.pause();
    if (this.renderer) {
      this.renderer.dispose();
      this.container.removeChild(this.renderer.domElement);
    }
    if (this.particles) {
      this.particles.geometry.dispose();
      this.particles.material.dispose();
    }
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.particles = null;
  }
}

// ============================================
// GEOMETRIC MESH ANIMATION
// ============================================
class GeometricMesh {
  constructor(container) {
    this.container = container || document.querySelector('.mesh-3d-container');
    if (!this.container) return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.mesh = null;
    this.clock = null;

    this.init();
  }

  init() {
    if (!window.THREE) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    this.setupScene();
    this.createMesh();
    this.animate();
  }

  setupScene() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(50, width / height, 1, 2000);
    this.camera.position.z = 500;

    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(width, height);
    this.renderer.setClearColor(0x000000, 0);
    this.container.appendChild(this.renderer.domElement);

    this.clock = new THREE.Clock();
  }

  createMesh() {
    // Create icosahedron wireframe
    const geometry = new THREE.IcosahedronGeometry(200, 1);
    const material = new THREE.MeshBasicMaterial({
      color: 0xB87333,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.scene.add(this.mesh);

    // Add inner mesh
    const innerGeometry = new THREE.IcosahedronGeometry(150, 1);
    const innerMaterial = new THREE.MeshBasicMaterial({
      color: 0xCD853F,
      wireframe: true,
      transparent: true,
      opacity: 0.2
    });

    const innerMesh = new THREE.Mesh(innerGeometry, innerMaterial);
    this.mesh.add(innerMesh);
  }

  animate() {
    const render = () => {
      requestAnimationFrame(render);

      const time = this.clock.getElapsedTime();

      if (this.mesh) {
        this.mesh.rotation.x = time * 0.1;
        this.mesh.rotation.y = time * 0.15;
      }

      this.renderer.render(this.scene, this.camera);
    };

    render();

    window.addEventListener('resize', () => {
      const width = this.container.clientWidth;
      const height = this.container.clientHeight;
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    });
  }
}

// ============================================
// INITIALIZE THREE.JS ANIMATIONS
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  // Initialize particle system for hero sections
  const heroContainer = document.querySelector('.hero-3d-container');
  if (heroContainer && window.THREE) {
    window.particleSystem = new ParticleSystem(heroContainer);
  }

  // Initialize geometric mesh if container exists
  const meshContainer = document.querySelector('.mesh-3d-container');
  if (meshContainer && window.THREE) {
    window.geometricMesh = new GeometricMesh(meshContainer);
  }

  console.log('Ziyo International - Three.js animations initialized');
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ParticleSystem, GeometricMesh };
}
