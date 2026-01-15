/**
 * Ziyo International - Charts & Data Visualization
 * Lightweight chart library for mining data visualization
 * Version: 1.0
 */

// ============================================
// BAR CHART COMPONENT
// ============================================
class BarChart {
  constructor(container, options = {}) {
    this.container = typeof container === 'string'
      ? document.querySelector(container)
      : container;
    this.options = {
      height: options.height || 300,
      barWidth: options.barWidth || 40,
      barGap: options.barGap || 20,
      colors: options.colors || ['#B87333', '#CD853F', '#DAA520', '#50C878', '#4169E1'],
      animated: options.animated !== false,
      showValues: options.showValues !== false,
      showLabels: options.showLabels !== false,
      horizontal: options.horizontal || false,
      gridLines: options.gridLines || 5,
      ...options
    };
    this.data = [];
  }

  setData(data) {
    this.data = data;
    this.render();
    return this;
  }

  render() {
    if (!this.container || !this.data.length) return;

    const maxValue = Math.max(...this.data.map(d => d.value));
    const width = this.data.length * (this.options.barWidth + this.options.barGap);

    let html = `
      <div class="ziyo-chart ziyo-bar-chart" style="height: ${this.options.height}px;">
        <div class="chart-grid">
          ${this.renderGridLines(maxValue)}
        </div>
        <div class="chart-bars" style="height: ${this.options.height - 40}px;">
    `;

    this.data.forEach((item, index) => {
      const percentage = (item.value / maxValue) * 100;
      const color = item.color || this.options.colors[index % this.options.colors.length];
      const delay = this.options.animated ? index * 100 : 0;

      html += `
        <div class="chart-bar-wrapper" style="width: ${this.options.barWidth + this.options.barGap}px;">
          <div class="chart-bar-container">
            <div class="chart-bar"
                 style="height: ${this.options.animated ? 0 : percentage}%;
                        background: ${color};
                        width: ${this.options.barWidth}px;
                        transition-delay: ${delay}ms;"
                 data-height="${percentage}">
              ${this.options.showValues ? `
                <span class="chart-bar-value">${this.formatValue(item.value)}</span>
              ` : ''}
            </div>
          </div>
          ${this.options.showLabels ? `
            <div class="chart-bar-label">${item.label}</div>
          ` : ''}
        </div>
      `;
    });

    html += `
        </div>
      </div>
    `;

    this.container.innerHTML = html;

    // Animate bars
    if (this.options.animated) {
      requestAnimationFrame(() => {
        this.container.querySelectorAll('.chart-bar').forEach(bar => {
          bar.style.height = bar.dataset.height + '%';
        });
      });
    }
  }

  renderGridLines(maxValue) {
    let html = '';
    for (let i = 0; i <= this.options.gridLines; i++) {
      const value = (maxValue / this.options.gridLines) * (this.options.gridLines - i);
      const top = (i / this.options.gridLines) * 100;
      html += `
        <div class="grid-line" style="top: ${top}%;">
          <span class="grid-value">${this.formatValue(value)}</span>
        </div>
      `;
    }
    return html;
  }

  formatValue(value) {
    if (value >= 1000000) return '$' + (value / 1000000).toFixed(1) + 'M';
    if (value >= 1000) return '$' + (value / 1000).toFixed(0) + 'K';
    return value.toLocaleString();
  }
}

// ============================================
// DONUT CHART COMPONENT
// ============================================
class DonutChart {
  constructor(container, options = {}) {
    this.container = typeof container === 'string'
      ? document.querySelector(container)
      : container;
    this.options = {
      size: options.size || 200,
      thickness: options.thickness || 30,
      colors: options.colors || ['#B87333', '#CD853F', '#DAA520', '#50C878', '#4169E1', '#9370DB'],
      animated: options.animated !== false,
      showLegend: options.showLegend !== false,
      centerText: options.centerText || '',
      centerSubtext: options.centerSubtext || '',
      ...options
    };
    this.data = [];
  }

  setData(data) {
    this.data = data;
    this.render();
    return this;
  }

  render() {
    if (!this.container || !this.data.length) return;

    const total = this.data.reduce((sum, d) => sum + d.value, 0);
    const radius = this.options.size / 2;
    const innerRadius = radius - this.options.thickness;

    let html = `
      <div class="ziyo-chart ziyo-donut-chart">
        <div class="donut-container" style="width: ${this.options.size}px; height: ${this.options.size}px;">
          <svg viewBox="0 0 ${this.options.size} ${this.options.size}">
            ${this.renderSegments(total, radius, innerRadius)}
          </svg>
          <div class="donut-center">
            <div class="donut-center-text">${this.options.centerText}</div>
            <div class="donut-center-subtext">${this.options.centerSubtext}</div>
          </div>
        </div>
        ${this.options.showLegend ? this.renderLegend(total) : ''}
      </div>
    `;

    this.container.innerHTML = html;

    // Animate segments
    if (this.options.animated) {
      this.animateSegments();
    }
  }

  renderSegments(total, radius, innerRadius) {
    let html = '';
    let cumulativeAngle = -90; // Start from top

    this.data.forEach((item, index) => {
      const angle = (item.value / total) * 360;
      const color = item.color || this.options.colors[index % this.options.colors.length];

      const startAngle = cumulativeAngle;
      const endAngle = cumulativeAngle + angle;

      const path = this.describeArc(
        radius, radius, radius - this.options.thickness / 2,
        startAngle, endAngle, this.options.thickness
      );

      html += `
        <path class="donut-segment"
              d="${path}"
              fill="none"
              stroke="${color}"
              stroke-width="${this.options.thickness}"
              stroke-linecap="round"
              data-index="${index}"
              style="stroke-dasharray: 0 1000; transition: stroke-dasharray 0.8s ease ${index * 150}ms;">
        </path>
      `;

      cumulativeAngle = endAngle;
    });

    return html;
  }

  describeArc(x, y, radius, startAngle, endAngle, thickness) {
    const start = this.polarToCartesian(x, y, radius, endAngle);
    const end = this.polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
  }

  polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    const angleInRadians = (angleInDegrees * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians)
    };
  }

  renderLegend(total) {
    let html = '<div class="donut-legend">';
    this.data.forEach((item, index) => {
      const color = item.color || this.options.colors[index % this.options.colors.length];
      const percentage = ((item.value / total) * 100).toFixed(1);
      html += `
        <div class="legend-item">
          <span class="legend-color" style="background: ${color};"></span>
          <span class="legend-label">${item.label}</span>
          <span class="legend-value">${percentage}%</span>
        </div>
      `;
    });
    html += '</div>';
    return html;
  }

  animateSegments() {
    const total = this.data.reduce((sum, d) => sum + d.value, 0);
    const circumference = Math.PI * (this.options.size - this.options.thickness);

    this.container.querySelectorAll('.donut-segment').forEach((segment, index) => {
      const item = this.data[index];
      const segmentLength = (item.value / total) * circumference;

      requestAnimationFrame(() => {
        segment.style.strokeDasharray = `${segmentLength} ${circumference}`;
      });
    });
  }
}

// ============================================
// LINE CHART COMPONENT
// ============================================
class LineChart {
  constructor(container, options = {}) {
    this.container = typeof container === 'string'
      ? document.querySelector(container)
      : container;
    this.options = {
      width: options.width || 600,
      height: options.height || 300,
      padding: options.padding || 40,
      lineColor: options.lineColor || '#B87333',
      fillGradient: options.fillGradient !== false,
      showDots: options.showDots !== false,
      showGrid: options.showGrid !== false,
      animated: options.animated !== false,
      ...options
    };
    this.data = [];
  }

  setData(data) {
    this.data = data;
    this.render();
    return this;
  }

  render() {
    if (!this.container || !this.data.length) return;

    const { width, height, padding } = this.options;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    const maxValue = Math.max(...this.data.map(d => d.value));
    const minValue = Math.min(...this.data.map(d => d.value));
    const range = maxValue - minValue || 1;

    const points = this.data.map((d, i) => ({
      x: padding + (i / (this.data.length - 1)) * chartWidth,
      y: height - padding - ((d.value - minValue) / range) * chartHeight
    }));

    const pathD = this.createSmoothPath(points);
    const areaD = this.createAreaPath(points, height - padding);

    let html = `
      <div class="ziyo-chart ziyo-line-chart">
        <svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color: ${this.options.lineColor}; stop-opacity: 0.3;"/>
              <stop offset="100%" style="stop-color: ${this.options.lineColor}; stop-opacity: 0.05;"/>
            </linearGradient>
          </defs>

          ${this.options.showGrid ? this.renderGrid(width, height, padding, maxValue, minValue) : ''}

          ${this.options.fillGradient ? `
            <path class="line-area" d="${areaD}" fill="url(#lineGradient)" opacity="${this.options.animated ? 0 : 1}"/>
          ` : ''}

          <path class="line-path" d="${pathD}"
                fill="none"
                stroke="${this.options.lineColor}"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
                ${this.options.animated ? `stroke-dasharray="${this.getPathLength(points)}" stroke-dashoffset="${this.getPathLength(points)}"` : ''}/>

          ${this.options.showDots ? this.renderDots(points) : ''}

          ${this.renderLabels(points)}
        </svg>
      </div>
    `;

    this.container.innerHTML = html;

    if (this.options.animated) {
      this.animateLine();
    }
  }

  createSmoothPath(points) {
    if (points.length < 2) return '';

    let d = `M ${points[0].x} ${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];
      const midX = (current.x + next.x) / 2;

      d += ` C ${midX} ${current.y}, ${midX} ${next.y}, ${next.x} ${next.y}`;
    }

    return d;
  }

  createAreaPath(points, bottom) {
    if (points.length < 2) return '';

    let d = `M ${points[0].x} ${bottom}`;
    d += ` L ${points[0].x} ${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];
      const midX = (current.x + next.x) / 2;

      d += ` C ${midX} ${current.y}, ${midX} ${next.y}, ${next.x} ${next.y}`;
    }

    d += ` L ${points[points.length - 1].x} ${bottom} Z`;

    return d;
  }

  renderGrid(width, height, padding, maxValue, minValue) {
    let html = '<g class="chart-grid-lines">';
    const steps = 5;

    for (let i = 0; i <= steps; i++) {
      const y = padding + (i / steps) * (height - padding * 2);
      const value = maxValue - (i / steps) * (maxValue - minValue);

      html += `
        <line x1="${padding}" y1="${y}" x2="${width - padding}" y2="${y}"
              stroke="rgba(255,255,255,0.1)" stroke-dasharray="4"/>
        <text x="${padding - 10}" y="${y + 4}"
              fill="rgba(255,255,255,0.5)"
              font-size="10"
              text-anchor="end">${this.formatValue(value)}</text>
      `;
    }

    html += '</g>';
    return html;
  }

  renderDots(points) {
    return points.map((p, i) => `
      <circle class="line-dot"
              cx="${p.x}" cy="${p.y}" r="5"
              fill="${this.options.lineColor}"
              stroke="#0A0A0A"
              stroke-width="2"
              style="opacity: ${this.options.animated ? 0 : 1}; transition: opacity 0.3s ${i * 100 + 800}ms;">
        <title>${this.data[i].label}: ${this.formatValue(this.data[i].value)}</title>
      </circle>
    `).join('');
  }

  renderLabels(points) {
    return points.map((p, i) => `
      <text x="${p.x}" y="${this.options.height - 10}"
            fill="rgba(255,255,255,0.7)"
            font-size="11"
            text-anchor="middle">${this.data[i].label}</text>
    `).join('');
  }

  getPathLength(points) {
    let length = 0;
    for (let i = 1; i < points.length; i++) {
      const dx = points[i].x - points[i - 1].x;
      const dy = points[i].y - points[i - 1].y;
      length += Math.sqrt(dx * dx + dy * dy);
    }
    return length * 1.5; // Account for curve
  }

  animateLine() {
    const path = this.container.querySelector('.line-path');
    const area = this.container.querySelector('.line-area');

    if (path) {
      requestAnimationFrame(() => {
        path.style.transition = 'stroke-dashoffset 1.5s ease-out';
        path.style.strokeDashoffset = '0';
      });
    }

    if (area) {
      setTimeout(() => {
        area.style.transition = 'opacity 0.5s ease';
        area.style.opacity = '1';
      }, 1000);
    }
  }

  formatValue(value) {
    if (value >= 1000000) return '$' + (value / 1000000).toFixed(1) + 'M';
    if (value >= 1000) return '$' + (value / 1000).toFixed(0) + 'K';
    return value.toFixed(0);
  }
}

// ============================================
// GAUGE CHART COMPONENT
// ============================================
class GaugeChart {
  constructor(container, options = {}) {
    this.container = typeof container === 'string'
      ? document.querySelector(container)
      : container;
    this.options = {
      size: options.size || 200,
      thickness: options.thickness || 20,
      min: options.min || 0,
      max: options.max || 100,
      value: options.value || 0,
      colors: options.colors || [
        { stop: 0, color: '#dc3545' },
        { stop: 50, color: '#ffc107' },
        { stop: 75, color: '#B87333' },
        { stop: 100, color: '#50C878' }
      ],
      label: options.label || '',
      unit: options.unit || '%',
      animated: options.animated !== false,
      ...options
    };
  }

  setValue(value) {
    this.options.value = Math.min(Math.max(value, this.options.min), this.options.max);
    this.render();
    return this;
  }

  render() {
    if (!this.container) return;

    const { size, thickness, min, max, value, colors, label, unit } = this.options;
    const radius = (size - thickness) / 2;
    const circumference = Math.PI * radius;
    const percentage = (value - min) / (max - min);
    const dashOffset = circumference * (1 - percentage);

    // Get color based on percentage
    const color = this.getColor(percentage * 100);

    let html = `
      <div class="ziyo-chart ziyo-gauge-chart" style="width: ${size}px; height: ${size / 2 + 20}px;">
        <svg viewBox="0 0 ${size} ${size / 2 + 20}">
          <defs>
            <linearGradient id="gaugeGradient${Date.now()}" x1="0%" y1="0%" x2="100%" y2="0%">
              ${colors.map(c => `<stop offset="${c.stop}%" style="stop-color: ${c.color}"/>`).join('')}
            </linearGradient>
          </defs>

          <!-- Background arc -->
          <path d="M ${thickness / 2} ${size / 2}
                   A ${radius} ${radius} 0 0 1 ${size - thickness / 2} ${size / 2}"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                stroke-width="${thickness}"
                stroke-linecap="round"/>

          <!-- Value arc -->
          <path class="gauge-value"
                d="M ${thickness / 2} ${size / 2}
                   A ${radius} ${radius} 0 0 1 ${size - thickness / 2} ${size / 2}"
                fill="none"
                stroke="${color}"
                stroke-width="${thickness}"
                stroke-linecap="round"
                stroke-dasharray="${circumference}"
                stroke-dashoffset="${this.options.animated ? circumference : dashOffset}"
                data-offset="${dashOffset}"/>

          <!-- Value text -->
          <text x="${size / 2}" y="${size / 2 - 10}"
                text-anchor="middle"
                fill="${color}"
                font-size="${size / 5}"
                font-weight="700">${value}${unit}</text>

          <!-- Label -->
          <text x="${size / 2}" y="${size / 2 + 15}"
                text-anchor="middle"
                fill="rgba(255,255,255,0.7)"
                font-size="${size / 12}">${label}</text>
        </svg>
      </div>
    `;

    this.container.innerHTML = html;

    if (this.options.animated) {
      this.animate(dashOffset);
    }
  }

  getColor(percentage) {
    const { colors } = this.options;

    for (let i = colors.length - 1; i >= 0; i--) {
      if (percentage >= colors[i].stop) {
        return colors[i].color;
      }
    }
    return colors[0].color;
  }

  animate(targetOffset) {
    const path = this.container.querySelector('.gauge-value');
    if (path) {
      requestAnimationFrame(() => {
        path.style.transition = 'stroke-dashoffset 1s ease-out';
        path.style.strokeDashoffset = targetOffset;
      });
    }
  }
}

// ============================================
// CHART STYLES
// ============================================
const chartStyles = document.createElement('style');
chartStyles.textContent = `
  .ziyo-chart {
    font-family: 'Inter', sans-serif;
    color: var(--text-primary, #F5F5F5);
  }

  /* Bar Chart */
  .ziyo-bar-chart {
    position: relative;
    display: flex;
    flex-direction: column;
  }

  .ziyo-bar-chart .chart-grid {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 40px;
  }

  .ziyo-bar-chart .grid-line {
    position: absolute;
    left: 0;
    right: 0;
    border-top: 1px dashed rgba(255,255,255,0.1);
  }

  .ziyo-bar-chart .grid-value {
    position: absolute;
    left: 0;
    transform: translateY(-50%);
    font-size: 10px;
    color: rgba(255,255,255,0.5);
  }

  .ziyo-bar-chart .chart-bars {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding-left: 50px;
  }

  .ziyo-bar-chart .chart-bar-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .ziyo-bar-chart .chart-bar-container {
    height: 100%;
    display: flex;
    align-items: flex-end;
  }

  .ziyo-bar-chart .chart-bar {
    border-radius: 4px 4px 0 0;
    transition: height 0.8s ease-out;
    position: relative;
  }

  .ziyo-bar-chart .chart-bar-value {
    position: absolute;
    top: -25px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 11px;
    font-weight: 600;
    white-space: nowrap;
    color: var(--text-primary, #F5F5F5);
  }

  .ziyo-bar-chart .chart-bar-label {
    margin-top: 8px;
    font-size: 11px;
    color: rgba(255,255,255,0.7);
    text-align: center;
  }

  /* Donut Chart */
  .ziyo-donut-chart {
    display: flex;
    align-items: center;
    gap: 30px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .donut-container {
    position: relative;
  }

  .donut-center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
  }

  .donut-center-text {
    font-size: 24px;
    font-weight: 700;
    color: var(--copper-gold, #B87333);
  }

  .donut-center-subtext {
    font-size: 12px;
    color: rgba(255,255,255,0.6);
  }

  .donut-legend {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
  }

  .legend-color {
    width: 12px;
    height: 12px;
    border-radius: 3px;
    flex-shrink: 0;
  }

  .legend-label {
    flex: 1;
    color: rgba(255,255,255,0.8);
  }

  .legend-value {
    font-weight: 600;
    color: var(--text-primary, #F5F5F5);
  }

  /* Line Chart */
  .ziyo-line-chart svg {
    width: 100%;
    height: auto;
  }

  .line-path {
    filter: drop-shadow(0 2px 4px rgba(184, 115, 51, 0.3));
  }

  .line-dot {
    cursor: pointer;
    transition: r 0.2s;
  }

  .line-dot:hover {
    r: 7;
  }

  /* Gauge Chart */
  .ziyo-gauge-chart {
    display: flex;
    justify-content: center;
  }

  .gauge-value {
    filter: drop-shadow(0 0 6px currentColor);
  }

  /* Responsive */
  @media (max-width: 768px) {
    .ziyo-donut-chart {
      flex-direction: column;
    }

    .ziyo-bar-chart .chart-bars {
      padding-left: 40px;
    }

    .ziyo-bar-chart .chart-bar-value {
      font-size: 9px;
    }
  }
`;
document.head.appendChild(chartStyles);

// ============================================
// EXPORT
// ============================================
window.ZiyoCharts = {
  BarChart,
  DonutChart,
  LineChart,
  GaugeChart
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { BarChart, DonutChart, LineChart, GaugeChart };
}

console.log('Ziyo Charts - Data visualization library loaded');
