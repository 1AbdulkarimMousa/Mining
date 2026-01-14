# Ziyo International Website Development Plan
## Netflix/Hollywood Elite World Standard Design

---

**Project:** Ziyo International Pvt. Ltd. Corporate Website  
**Version:** 1.0  
**Date:** January 2026  
**Technology Stack:** Bootstrap 5.3, Font Awesome SVGs, Three.js, JSON (Bilingual EN/CN)

---

## Table of Contents

1. [Executive Overview](#1-executive-overview)
2. [Site Architecture & Map](#2-site-architecture--map)
3. [Technology Stack](#3-technology-stack)
4. [Design Philosophy](#4-design-philosophy)
5. [Page-by-Page Specifications](#5-page-by-page-specifications)
6. [UI/UX Design System](#6-uiux-design-system)
7. [Three.js 3D Implementations](#7-threejs-3d-implementations)
8. [Bilingual JSON Structure](#8-bilingual-json-structure)
9. [Component Library](#9-component-library)
10. [Animation & Interaction Guide](#10-animation--interaction-guide)
11. [Responsive Design](#11-responsive-design)
12. [File Structure & Timeline](#12-file-structure--timeline)

---

## 1. Executive Overview

### Project Vision

Create a **cinematic, immersive digital experience** that positions Ziyo International as a world-class mining enterprise. The website will rival premium corporate sites like Netflix, Apple, and Tesla with stunning 3D visuals, fluid animations, and a sophisticated bilingual interface.

### Design Inspiration

| Reference | Element to Adopt |
|-----------|------------------|
| Netflix | Dark cinematic theme, smooth scrolling, card-based content |
| Apple | Minimalist typography, scroll-triggered animations, premium feel |
| Tesla | Full-screen hero sections, immersive product showcases |
| Rio Tinto | Mining industry credibility, data visualization |
| BHP | Corporate trust signals, investor-focused content |

### Key Objectives

- **Premium Brand Perception:** Position as elite mining enterprise
- **Investor Confidence:** Professional, data-rich presentation
- **Bilingual Accessibility:** Seamless English/Chinese switching
- **Immersive Experience:** 3D elements and cinematic animations
- **Mobile Excellence:** Flawless responsive design
- **Fast Performance:** Sub-3 second load times

---

## 2. Site Architecture & Map

### 2.1 Site Map (8 Pages)

```
┌─────────────────────────────────────────────────────────────────┐
│                        ZIYO INTERNATIONAL                        │
│                         WEBSITE SITEMAP                          │
└─────────────────────────────────────────────────────────────────┘

                              ┌─────────┐
                              │  HOME   │
                              │  (1)    │
                              └────┬────┘
                                   │
        ┌──────────┬───────────┬───┴───┬───────────┬──────────┐
        │          │           │       │           │          │
   ┌────▼────┐ ┌───▼───┐ ┌────▼────┐ ┌▼────────┐ ┌▼────────┐ │
   │  ABOUT  │ │PROJECTS│ │OPERATIONS│ │INVESTMENT│ │  TEAM   │ │
   │   (2)   │ │  (3)   │ │   (4)    │ │   (5)    │ │   (6)   │ │
   └─────────┘ └────────┘ └──────────┘ └──────────┘ └─────────┘ │
                                                                │
                          ┌─────────────────────────────────────┘
                          │
                ┌─────────▼─────────┐   ┌─────────────────┐
                │   SUSTAINABILITY   │   │     CONTACT     │
                │        (7)         │   │       (8)       │
                └───────────────────┘   └─────────────────┘
```

### 2.2 Page Hierarchy

| # | Page | URL | Priority | Purpose |
|---|------|-----|----------|---------|
| 1 | Home | `/` | Critical | First impression, brand showcase |
| 2 | About | `/about` | High | Company story, vision, values |
| 3 | Projects | `/projects` | Critical | Mine portfolios, 3D maps |
| 4 | Operations | `/operations` | High | Processing, technology, capacity |
| 5 | Investment | `/investment` | Critical | ROI, financials, opportunities |
| 6 | Team | `/team` | Medium | Leadership, expertise |
| 7 | Sustainability | `/sustainability` | Medium | ESG, community, environment |
| 8 | Contact | `/contact` | High | Inquiries, locations, form |

### 2.3 Navigation Structure

```
┌──────────────────────────────────────────────────────────────────────────┐
│ [LOGO]  Home  About  Projects  Operations  Investment  Team  Contact    │
│                                                          [EN/中文] [☰]  │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Technology Stack

### 3.1 Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| Bootstrap | 5.3.2 | Responsive grid, components |
| Three.js | r158 | 3D graphics, WebGL rendering |
| Font Awesome | 6.5.1 | SVG icons |
| GSAP | 3.12 | Advanced animations |
| Vanilla JS | ES6+ | Core functionality |
| JSON | - | Bilingual content management |

### 3.2 CDN Links

```html
<!-- Bootstrap 5.3 -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>

<!-- Font Awesome 6.5 -->
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" rel="stylesheet">

<!-- Three.js -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r158/three.min.js"></script>

<!-- GSAP -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
```

---

## 4. Design Philosophy

### 4.1 Color Palette

```css
:root {
  /* Primary Colors */
  --copper-gold: #B87333;
  --copper-light: #CD853F;
  --copper-dark: #8B4513;
  
  /* Accent Colors */
  --accent-blue: #1E90FF;
  --accent-teal: #008B8B;
  --accent-emerald: #50C878;
  
  /* Neutral Colors */
  --dark-primary: #0A0A0A;
  --dark-secondary: #141414;
  --dark-tertiary: #1F1F1F;
  --dark-card: #262626;
  
  /* Text Colors */
  --text-primary: #FFFFFF;
  --text-secondary: #B3B3B3;
  --text-muted: #737373;
  
  /* Gradients */
  --gradient-copper: linear-gradient(135deg, #B87333 0%, #CD853F 50%, #DAA520 100%);
  --gradient-dark: linear-gradient(180deg, #0A0A0A 0%, #1F1F1F 100%);
}
```

### 4.2 Typography

```css
/* Font Stack */
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-display: 'Playfair Display', Georgia, serif;
--font-chinese: 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif;

/* Fluid Typography */
--text-5xl: clamp(3rem, 2rem + 5vw, 6rem);
--text-4xl: clamp(2.5rem, 1.8rem + 3.5vw, 4rem);
--text-3xl: clamp(2rem, 1.5rem + 2.5vw, 3rem);
--text-2xl: clamp(1.5rem, 1.2rem + 1.5vw, 2rem);
--text-xl: clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem);
```

### 4.3 Design Principles

| Principle | Implementation |
|-----------|----------------|
| **Cinematic Darkness** | Dark backgrounds (95% of surface area) |
| **Copper Accents** | Gold/copper highlights for premium feel |
| **Generous Whitespace** | Minimum 80px section padding |
| **Scroll Storytelling** | Content reveals on scroll |
| **Micro-interactions** | Hover states, button feedback |
| **3D Depth** | Parallax, shadows, layered elements |

---

## 5. Page-by-Page Specifications

### PAGE 1: HOME (index.html)

```
┌─────────────────────────────────────────────────────────────────┐
│                     HERO SECTION (100vh)                        │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │           [Three.js 3D Copper Ore Animation]            │   │
│  │                                                          │   │
│  │     "UNLOCKING PAKISTAN'S                               │   │
│  │      COPPER POTENTIAL"                                  │   │
│  │                                                          │   │
│  │     [Explore Projects]  [Investment Opportunity]        │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    KEY METRICS TICKER                           │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │ 3,000+   │ │ 5        │ │ 50%      │ │ 24-32    │          │
│  │ Acres    │ │ Mines    │ │ ROI      │ │ Months   │          │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘          │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    FEATURED PROJECTS (Netflix Cards)            │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐              │
│  │   MINE 1    │ │   MINE 4    │ │   MINE 5    │  ← Scroll → │
│  │  1,096 ac   │ │   600 ac    │ │   485 ac    │              │
│  └─────────────┘ └─────────────┘ └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    3D INTERACTIVE GLOBE                         │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │     [Three.js Globe with Mine Location Markers]         │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    INVESTMENT CTA                               │
│     "Ready to Invest in Pakistan's Copper Future?"             │
│     [Download Report]  [Schedule Meeting]                      │
└─────────────────────────────────────────────────────────────────┘
```

---

### PAGE 2: ABOUT (about.html)

```
┌─────────────────────────────────────────────────────────────────┐
│  HERO: "OUR STORY" - Building Pakistan's Mining Future         │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  TIMELINE: 2020 ──── 2022 ──── 2024 ──── 2025                  │
│            Founded   Expansion  Operations  Restructured        │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  VISION & MISSION (Split Cards)                                │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  CORE VALUES: Scientific | Transparent | Responsible | Global  │
└─────────────────────────────────────────────────────────────────┘
```

---

### PAGE 3: PROJECTS (projects.html)

```
┌─────────────────────────────────────────────────────────────────┐
│  HERO: "MINING PORTFOLIO" - 3,000+ Acres                       │
│  [Three.js Terrain Animation]                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  MINE CARDS (Netflix Hover Expand Style)                       │
│  ┌───────────────────────────────────────────────────────┐     │
│  │  MINE 1 - Featured (1,096 acres | Active | 10% Cu)    │     │
│  └───────────────────────────────────────────────────────┘     │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌──────────┐ │
│  │   MINE 2    │ │   MINE 3    │ │   MINE 4    │ │  MINE 5  │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └──────────┘ │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  3D TOPOGRAPHIC MAP (Interactive)                              │
└─────────────────────────────────────────────────────────────────┘
```

---

### PAGE 4: OPERATIONS (operations.html)

```
┌─────────────────────────────────────────────────────────────────┐
│  HERO: "OPERATIONAL EXCELLENCE" - From Ore to Concentrate      │
│  [Three.js Processing Plant Animation]                         │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  PROCESS FLOW: Mining → Crushing → Grinding → Flotation        │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  PLANT SPECS: 350 t/day | 88% Recovery | 20% Concentrate      │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  SGS QUALITY CERTIFICATION                                     │
└─────────────────────────────────────────────────────────────────┘
```

---

### PAGE 5: INVESTMENT (investment.html)

```
┌─────────────────────────────────────────────────────────────────┐
│  HERO: "INVESTMENT OPPORTUNITY"                                │
│  ROI: 16-50% | Payback: 24-32 months                          │
│  [Download Deck] [Schedule Call]                               │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  METRICS: $3.05M Investment | $1.74M Profit | 50% ROI         │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  ANIMATED PIE CHART (Investment Breakdown)                     │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  PARTNERSHIP OPTIONS: Fixed Fee | Joint Venture | Success-Based│
└─────────────────────────────────────────────────────────────────┘
```

---

### PAGE 6: TEAM (team.html)

```
┌─────────────────────────────────────────────────────────────────┐
│  HERO: "LEADERSHIP" - Experience. Expertise. Excellence.       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  FOUNDER SPOTLIGHT                                             │
│  ┌────────────┐ Dr. Syed Waqi Ur Rehman                       │
│  │   Photo    │ PhD Environmental Engineering                  │
│  │            │ Tsinghua University                            │
│  └────────────┘ [LinkedIn] [ResearchGate]                     │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  EXPERTISE: Water | Mining | Cross-Border | Processing | ESG  │
└─────────────────────────────────────────────────────────────────┘
```

---

### PAGE 7: SUSTAINABILITY (sustainability.html)

```
┌─────────────────────────────────────────────────────────────────┐
│  HERO: "SUSTAINABLE MINING" - Responsibility at Our Core       │
│  [Nature/Community Video Background]                           │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  ESG PILLARS: Environmental | Social | Governance              │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  COMMUNITY IMPACT GALLERY                                      │
└─────────────────────────────────────────────────────────────────┘
```

---

### PAGE 8: CONTACT (contact.html)

```
┌─────────────────────────────────────────────────────────────────┐
│  HERO: "GET IN TOUCH" - Let's Build the Future Together       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  ┌──────────────────┐  ┌────────────────────────────────────┐  │
│  │   INQUIRY FORM   │  │  CONTACT INFO                      │  │
│  │   Name           │  │  📍 Islamabad, Pakistan            │  │
│  │   Email          │  │  📧 waqi.rehman@outlook.com        │  │
│  │   Type ▼         │  │  📱 +92 333 5566 981               │  │
│  │   Message        │  │  📱 +86 130 2107 8132              │  │
│  │   [Send]         │  │  [LinkedIn] [WeChat]               │  │
│  └──────────────────┘  └────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  3D GLOBE: Office Locations (Islamabad | Beijing | Waziristan)│
└─────────────────────────────────────────────────────────────────┘
```

---

## 6. UI/UX Design System

### 6.1 Button Styles

```css
/* Primary CTA */
.btn-copper {
  background: linear-gradient(135deg, #B87333, #CD853F);
  color: #0A0A0A;
  padding: 16px 32px;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-copper:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 40px rgba(184, 115, 51, 0.3);
}

/* Secondary Outline */
.btn-outline-copper {
  background: transparent;
  border: 1px solid #B87333;
  color: #B87333;
  padding: 16px 32px;
}

.btn-outline-copper:hover {
  background: #B87333;
  color: #0A0A0A;
}
```

### 6.2 Card Styles (Netflix)

```css
.project-card {
  background: #262626;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.project-card:hover {
  transform: scale(1.05);
  z-index: 10;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.project-card:hover .card-content {
  opacity: 1;
  transform: translateY(0);
}
```

### 6.3 Font Awesome Icons Used

```html
<!-- Navigation -->
<i class="fa-solid fa-globe"></i>           <!-- Language -->
<i class="fa-solid fa-bars"></i>            <!-- Mobile Menu -->

<!-- Mining Icons -->
<i class="fa-solid fa-mountain"></i>        <!-- Mining -->
<i class="fa-solid fa-gem"></i>             <!-- Ore -->
<i class="fa-solid fa-industry"></i>        <!-- Processing -->
<i class="fa-solid fa-hard-hat"></i>        <!-- Operations -->

<!-- Business Icons -->
<i class="fa-solid fa-chart-line"></i>      <!-- ROI -->
<i class="fa-solid fa-coins"></i>           <!-- Investment -->
<i class="fa-solid fa-handshake"></i>       <!-- Partnership -->

<!-- Contact Icons -->
<i class="fa-solid fa-envelope"></i>        <!-- Email -->
<i class="fa-solid fa-phone"></i>           <!-- Phone -->
<i class="fa-solid fa-location-dot"></i>    <!-- Location -->
<i class="fa-brands fa-linkedin"></i>       <!-- LinkedIn -->
<i class="fa-brands fa-weixin"></i>         <!-- WeChat -->

<!-- Actions -->
<i class="fa-solid fa-arrow-right"></i>     <!-- CTA Arrow -->
<i class="fa-solid fa-download"></i>        <!-- Download -->
<i class="fa-solid fa-play"></i>            <!-- Video -->
```

---

## 7. Three.js 3D Implementations

### 7.1 Hero - Rotating Copper Ore

```javascript
// hero-copper-ore.js
class CopperOreScene {
  constructor(container) {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    // Copper ore geometry
    const geometry = new THREE.IcosahedronGeometry(2, 1);
    const material = new THREE.MeshStandardMaterial({
      color: 0xB87333,
      metalness: 0.7,
      roughness: 0.3
    });
    
    this.ore = new THREE.Mesh(geometry, material);
    this.scene.add(this.ore);
    
    // Lighting
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    this.scene.add(light);
    
    this.animate();
  }
  
  animate() {
    requestAnimationFrame(() => this.animate());
    this.ore.rotation.x += 0.002;
    this.ore.rotation.y += 0.003;
    this.renderer.render(this.scene, this.camera);
  }
}
```

### 7.2 Interactive Globe Map

```javascript
// globe-map.js
class GlobeMap {
  constructor(container) {
    this.mineLocations = [
      { name: 'Mine 1', lat: 32.9, lng: 69.9, acres: 1096 },
      { name: 'Mine 2', lat: 32.85, lng: 69.85, acres: 400 },
      { name: 'Mine 3', lat: 32.88, lng: 69.92, acres: 497 },
      { name: 'Mine 4', lat: 32.92, lng: 69.88, acres: 600 },
      { name: 'Mine 5', lat: 32.87, lng: 69.95, acres: 485 }
    ];
    
    // Create Earth sphere with texture
    // Add copper-colored markers at mine locations
    // Enable click interaction to show mine details
  }
}
```

### 7.3 Processing Plant Animation

```javascript
// processing-plant.js
class ProcessingPlant {
  constructor(container) {
    // Create stylized processing plant:
    // - Conveyor belt with moving ore particles
    // - Rotating ball mill
    // - Flotation cells with animated bubbles
    // - Output concentrate pile
  }
}
```

---

## 8. Bilingual JSON Structure

### 8.1 English (en.json)

```json
{
  "meta": {
    "lang": "en",
    "locale": "en-US"
  },
  "navigation": {
    "home": "Home",
    "about": "About",
    "projects": "Projects",
    "operations": "Operations",
    "investment": "Investment",
    "team": "Team",
    "sustainability": "Sustainability",
    "contact": "Contact",
    "language_toggle": "中文"
  },
  "home": {
    "hero": {
      "title": "Unlocking Pakistan's Copper Potential",
      "subtitle": "Strategic Mining Operations in North Waziristan",
      "cta_primary": "Explore Projects",
      "cta_secondary": "Investment Opportunity"
    },
    "metrics": {
      "acres": { "value": "3,000+", "label": "Acres" },
      "mines": { "value": "5", "label": "Active Mines" },
      "roi": { "value": "50%", "label": "ROI Potential" },
      "payback": { "value": "24-32", "label": "Months Payback" }
    }
  },
  "projects": {
    "mines": [
      {
        "id": 1,
        "name": "Mine 1",
        "area": "1,096 acres",
        "grade": "0.5-10% Cu",
        "status": "Active Production"
      }
    ]
  },
  "investment": {
    "metrics": {
      "investment": "$3.05M",
      "profit": "$1.74M",
      "roi": "50%",
      "payback": "24-32 months"
    }
  },
  "contact": {
    "info": {
      "address": "Islamabad, Pakistan",
      "email": "waqi.rehman@outlook.com",
      "phone_pk": "+92 333 5566 981",
      "phone_cn": "+86 130 2107 8132"
    }
  },
  "footer": {
    "copyright": "© 2026 Ziyo International Pvt. Ltd."
  }
}
```

### 8.2 Chinese (cn.json)

```json
{
  "meta": {
    "lang": "zh",
    "locale": "zh-CN"
  },
  "navigation": {
    "home": "首页",
    "about": "关于我们",
    "projects": "项目",
    "operations": "运营",
    "investment": "投资",
    "team": "团队",
    "sustainability": "可持续发展",
    "contact": "联系我们",
    "language_toggle": "English"
  },
  "home": {
    "hero": {
      "title": "释放巴基斯坦铜矿潜力",
      "subtitle": "北瓦济里斯坦战略采矿运营",
      "cta_primary": "探索项目",
      "cta_secondary": "投资机会"
    },
    "metrics": {
      "acres": { "value": "3,000+", "label": "英亩" },
      "mines": { "value": "5", "label": "活跃矿场" },
      "roi": { "value": "50%", "label": "投资回报潜力" },
      "payback": { "value": "24-32", "label": "月回收期" }
    }
  },
  "projects": {
    "mines": [
      {
        "id": 1,
        "name": "1号矿",
        "area": "1,096英亩",
        "grade": "0.5-10% 铜",
        "status": "活跃生产"
      }
    ]
  },
  "investment": {
    "metrics": {
      "investment": "305万美元",
      "profit": "174万美元",
      "roi": "50%",
      "payback": "24-32个月"
    }
  },
  "contact": {
    "info": {
      "address": "巴基斯坦伊斯兰堡",
      "email": "waqi.rehman@outlook.com",
      "phone_pk": "+92 333 5566 981",
      "phone_cn": "+86 130 2107 8132"
    }
  },
  "footer": {
    "copyright": "© 2026 自由国际私人有限公司"
  }
}
```

### 8.3 Language Switcher

```javascript
// language-switcher.js
class LanguageSwitcher {
  constructor() {
    this.currentLang = localStorage.getItem('lang') || 'en';
    this.translations = {};
  }
  
  async loadTranslations(lang) {
    const response = await fetch(`/locales/${lang}.json`);
    this.translations = await response.json();
    this.applyTranslations();
  }
  
  applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const value = this.getNestedValue(this.translations, key);
      if (value) el.textContent = value;
    });
  }
  
  toggle() {
    this.currentLang = this.currentLang === 'en' ? 'cn' : 'en';
    localStorage.setItem('lang', this.currentLang);
    this.loadTranslations(this.currentLang);
    document.documentElement.lang = this.currentLang === 'cn' ? 'zh' : 'en';
  }
}
```

---

## 9. Component Library

| Component | File | Pages |
|-----------|------|-------|
| Navbar | `components/navbar.html` | All |
| Footer | `components/footer.html` | All |
| Hero Section | `components/hero.html` | All |
| Project Card | `components/project-card.html` | Home, Projects |
| Metric Card | `components/metric-card.html` | Home, Investment |
| Timeline | `components/timeline.html` | About |
| Contact Form | `components/contact-form.html` | Contact |
| Modal | `components/modal.html` | Projects |
| Language Toggle | `components/lang-toggle.html` | Navbar |

---

## 10. Animation & Interaction Guide

### 10.1 Scroll Animations (GSAP)

```javascript
// animations.js
gsap.registerPlugin(ScrollTrigger);

// Fade up elements
gsap.utils.toArray('.fade-up').forEach(elem => {
  gsap.from(elem, {
    scrollTrigger: { trigger: elem, start: 'top 80%' },
    y: 60,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
  });
});

// Counter animation
gsap.utils.toArray('.counter').forEach(counter => {
  gsap.from(counter, {
    scrollTrigger: { trigger: counter, start: 'top 80%' },
    textContent: 0,
    duration: 2,
    snap: { textContent: 1 }
  });
});

// Parallax effect
gsap.utils.toArray('.parallax').forEach(el => {
  gsap.to(el, {
    scrollTrigger: { trigger: el, scrub: true },
    y: '30%'
  });
});
```

### 10.2 CSS Animation Classes

```css
/* Fade Up */
.fade-up {
  opacity: 0;
  transform: translateY(40px);
  transition: all 0.8s ease;
}
.fade-up.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Scale In */
.scale-in {
  opacity: 0;
  transform: scale(0.9);
  transition: all 0.6s ease;
}
.scale-in.visible {
  opacity: 1;
  transform: scale(1);
}

/* Slide Left */
.slide-left {
  opacity: 0;
  transform: translateX(-60px);
  transition: all 0.8s ease;
}
.slide-left.visible {
  opacity: 1;
  transform: translateX(0);
}
```

---

## 11. Responsive Design

### Bootstrap 5.3 Breakpoints

```css
/* Mobile First Approach */
/* xs: 0-575px (default) */
/* sm: 576px+ */
/* md: 768px+ */
/* lg: 992px+ */
/* xl: 1200px+ */
/* xxl: 1400px+ */

@media (max-width: 767.98px) {
  /* Mobile Styles */
  .hero-title { font-size: 2.5rem; }
  .section-padding { padding: 60px 0; }
  .navbar-brand { font-size: 1.2rem; }
}

@media (min-width: 768px) and (max-width: 991.98px) {
  /* Tablet Styles */
  .hero-title { font-size: 3.5rem; }
}

@media (min-width: 992px) {
  /* Desktop Styles */
  .hero-title { font-size: 5rem; }
  .section-padding { padding: 120px 0; }
}
```

---

## 12. File Structure & Timeline

### 12.1 Project Structure

```
ziyo-website/
├── index.html
├── about.html
├── projects.html
├── operations.html
├── investment.html
├── team.html
├── sustainability.html
├── contact.html
│
├── assets/
│   ├── css/
│   │   ├── main.css
│   │   ├── components.css
│   │   └── responsive.css
│   │
│   ├── js/
│   │   ├── main.js
│   │   ├── animations.js
│   │   ├── language-switcher.js
│   │   └── three-scenes/
│   │       ├── hero-copper-ore.js
│   │       ├── globe-map.js
│   │       └── processing-plant.js
│   │
│   ├── images/
│   │   ├── logo/
│   │   ├── heroes/
│   │   ├── mines/
│   │   └── team/
│   │
│   └── videos/
│       └── hero-bg.mp4
│
├── locales/
│   ├── en.json
│   └── cn.json
│
└── docs/
    └── investment-report.pdf
```

### 12.2 Development Timeline

| Phase | Duration | Tasks |
|-------|----------|-------|
| **Phase 1** | Week 1 | Setup, Bootstrap, structure |
| **Phase 2** | Week 2-3 | Core pages (Home, About, Contact) |
| **Phase 3** | Week 4 | Business pages (Projects, Operations, Investment) |
| **Phase 4** | Week 5 | Three.js 3D scenes |
| **Phase 5** | Week 6 | Bilingual JSON integration |
| **Phase 6** | Week 7 | Animations, responsive polish |
| **Phase 7** | Week 8 | Testing, optimization, launch |

**Total Duration: 8 Weeks**

---

## Summary

This comprehensive plan delivers a **Netflix/Hollywood elite standard website** for Ziyo International featuring:

✅ **8 Strategic Pages** covering all business aspects  
✅ **Cinematic Dark Theme** with copper gold accents  
✅ **Three.js 3D Elements** (Rotating ore, Globe map, Plant animation)  
✅ **Seamless Bilingual Support** (English/Chinese JSON)  
✅ **Bootstrap 5.3** responsive framework  
✅ **Font Awesome 6.5** SVG icons throughout  
✅ **GSAP Scroll Animations** for premium feel  
✅ **Mobile-First Design** for all devices  

The website will position Ziyo International as a **world-class mining enterprise** ready for international investment and partnerships.

---

*Document Version: 1.0 | January 2026*  
*Prepared for: Ziyo International Pvt. Ltd.*
