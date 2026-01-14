/**
 * Advanced Investment Calculator with Real-time LME Copper Prices
 * Comprehensive mining investment analysis tool
 */

class InvestmentCalculator {
  constructor() {
    this.copperPrice = 13200; // Default fallback price (USD per metric ton) - Updated to current LME price
    this.isLoading = true;

    // Default parameters (all editable by user)
    this.params = {
      // Copper Price
      copperPriceLME: 13200, // LME Copper Price ($/ton) - Current market price

      // Exploration
      explorationAcres: 1500, // Exploration area in acres
      explorationCostPerAcre: 667, // ~$1M / 1500 acres

      // Excavation & Processing
      excavationCost: 85, // Cost to excavate per ton ($/ton)
      processingCost: 50, // Cost to process per ton ($/ton)
      plantCapacity: 350, // Plant capacity (tons/day)
      operatingDays: 300, // Operating days per year

      // Copper Content & Recovery
      rawCopperPercentage: 2.5, // Raw copper percentage in ore (%)
      recoveryRate: 88, // Processing plant recovery rate (%)
      finalProductPercentage: 18, // Final copper concentrate grade (%)

      // LME Payable & Pricing
      lmePayableRate: 96.5, // LME payable rate (% of LME price)
      treatmentCharge: 80, // Treatment charge ($/ton of concentrate)
      wasteDisposalCharge: 5, // Waste disposal charge ($/ton of ore processed)

      // Investment
      totalInvestment: 6600000 // Total initial investment ($)
    };

    this.init();
  }

  async init() {
    await this.fetchCopperPrice();
    this.setupEventListeners();
    this.calculate();
    this.startPriceRefresh();
  }

  /**
   * Fetch real-time LME copper price using free public sources
   * Uses Yahoo Finance API which doesn't require authentication
   */
  async fetchCopperPrice() {
    try {
      this.isLoading = true;
      this.updatePriceDisplay();

      // Yahoo Finance provides free copper futures data (HG=F is Copper Futures)
      // Price is in USD per pound, need to convert to USD per metric ton
      const response = await fetch('https://query1.finance.yahoo.com/v8/finance/chart/HG=F?interval=1d&range=1d');

      if (response.ok) {
        const data = await response.json();
        const quote = data.chart.result[0].meta.regularMarketPrice;

        // Convert USD per pound to USD per metric ton (1 metric ton = 2204.62 lbs)
        const pricePerTon = Math.round(quote * 2204.62);

        if (pricePerTon && pricePerTon > 0) {
          this.copperPrice = pricePerTon;
          this.params.copperPriceLME = pricePerTon;

          // Update the input field if it exists
          const priceInput = document.getElementById('input-copper-price');
          if (priceInput && !document.activeElement === priceInput) {
            priceInput.value = pricePerTon;
          }
        }
      }
    } catch (error) {
      console.warn('Failed to fetch live copper price, using fallback:', error);
      this.copperPrice = 13200;
      this.params.copperPriceLME = 13200;
    } finally {
      this.isLoading = false;
      this.updatePriceDisplay();
    }
  }

  /**
   * Refresh copper price every 5 minutes
   */
  startPriceRefresh() {
    setInterval(() => {
      this.fetchCopperPrice();
      this.calculate();
    }, 300000); // 5 minutes
  }

  /**
   * Setup event listeners for user inputs
   */
  setupEventListeners() {
    // Get all input fields
    const inputs = document.querySelectorAll('.calc-input');

    inputs.forEach(input => {
      input.addEventListener('input', (e) => {
        const param = e.target.dataset.param;
        let value = parseFloat(e.target.value);

        if (!isNaN(value) && value >= 0) {
          this.params[param] = value;

          // If copper price is manually changed, update the copperPrice variable
          if (param === 'copperPriceLME') {
            this.copperPrice = value;
          }

          this.calculate();
        }
      });

      // Real-time validation
      input.addEventListener('blur', (e) => {
        const min = parseFloat(e.target.min);
        const max = parseFloat(e.target.max);
        let value = parseFloat(e.target.value);

        if (value < min) {
          e.target.value = min;
          value = min;
        }
        if (max && value > max) {
          e.target.value = max;
          value = max;
        }

        // Update param after validation
        const param = e.target.dataset.param;
        if (param) {
          this.params[param] = value;
          this.calculate();
        }
      });
    });

    // Reset button
    const resetBtn = document.getElementById('calc-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.reset());
    }
  }

  /**
   * Main calculation function with comprehensive mining economics
   */
  calculate() {
    const p = this.params;

    // 1. EXPLORATION COSTS
    const explorationCosts = this.calculateExplorationCosts(p.explorationAcres);

    // 2. ANNUAL PROCESSING VOLUME
    const annualProcessing = p.plantCapacity * p.operatingDays; // tons of ore per year

    // 3. EXCAVATION & PROCESSING COSTS
    const totalExcavationProcessingCost = p.excavationCost + p.processingCost; // $/ton
    const annualExcavationProcessingCosts = annualProcessing * totalExcavationProcessingCost;

    // 4. RAW COPPER CONTENT
    const rawCopperInOre = annualProcessing * (p.rawCopperPercentage / 100); // tons of copper in ore

    // 5. RECOVERED COPPER (after processing plant recovery)
    const recoveredCopper = rawCopperInOre * (p.recoveryRate / 100); // tons of copper recovered

    // 6. CONCENTRATE PRODUCTION
    // Concentrate contains recoveredCopper at finalProductPercentage grade
    const concentrateProduced = recoveredCopper / (p.finalProductPercentage / 100); // tons of concentrate

    // 7. LME PAYABLE CALCULATION
    const payableCopper = recoveredCopper * (p.lmePayableRate / 100); // tons of payable copper

    // 8. REVENUE CALCULATION
    // Revenue from payable copper at LME price
    const grossRevenue = payableCopper * p.copperPriceLME;

    // 9. TREATMENT CHARGES & WASTE DISPOSAL
    const treatmentCharges = concentrateProduced * p.treatmentCharge;
    const wasteDisposalCharges = annualProcessing * p.wasteDisposalCharge;
    const totalTCWD = treatmentCharges + wasteDisposalCharges;

    // 10. NET REVENUE
    const netRevenue = grossRevenue - totalTCWD;

    // 11. TOTAL OPERATING COSTS
    const totalOperatingCosts = annualExcavationProcessingCosts;

    // 12. NET PROFIT (before exploration costs for Year 2+)
    const netProfit = netRevenue - totalOperatingCosts;

    // 13. ROI CALCULATION (Year 2 based on total investment)
    const roi = (netProfit / p.totalInvestment) * 100;

    // 14. PAYBACK PERIOD
    const paybackMonths = netProfit > 0 ? (p.totalInvestment / netProfit) * 12 : 0;

    // 15. YEAR 3+ PROJECTIONS (double capacity)
    const year3Processing = annualProcessing * 2;
    const year3RecoveredCopper = recoveredCopper * 2;
    const year3PayableCopper = payableCopper * 2;
    const year3GrossRevenue = year3PayableCopper * p.copperPriceLME;
    const year3TCWD = totalTCWD * 2;
    const year3NetRevenue = year3GrossRevenue - year3TCWD;
    const year3OperatingCosts = totalOperatingCosts * 2;
    const year3NetProfit = year3NetRevenue - year3OperatingCosts;

    // 16. PROFIT PER TON METRICS
    const profitPerTonOre = netProfit / annualProcessing;
    const profitPerTonCopper = netProfit / recoveredCopper;

    // Update display
    this.updateDisplay({
      // Production Metrics
      annualProcessing,
      rawCopperInOre,
      recoveredCopper,
      concentrateProduced,
      payableCopper,

      // Cost Breakdown
      explorationCosts,
      annualExcavationProcessingCosts,
      totalOperatingCosts,
      treatmentCharges,
      wasteDisposalCharges,
      totalTCWD,

      // Revenue & Profit
      grossRevenue,
      netRevenue,
      netProfit,
      roi,
      paybackMonths,
      profitPerTonOre,
      profitPerTonCopper,

      // Year 3+ Projections
      year3Processing,
      year3RecoveredCopper,
      year3NetRevenue,
      year3OperatingCosts,
      year3NetProfit
    });
  }

  /**
   * Calculate detailed exploration costs
   */
  calculateExplorationCosts(acres) {
    const mapping = acres * 50; // Geological mapping: $50/acre
    const drilling = Math.ceil(acres / 30) * 15000; // Drilling: 1 hole per 30 acres @ $15k each
    const labAnalysis = Math.ceil(acres / 12) * 1000; // Lab analysis: ~$1k per 12 acres
    const surveys = acres * 33.33; // Topographical surveys: ~$33.33/acre

    return {
      mapping,
      drilling,
      labAnalysis,
      surveys,
      total: mapping + drilling + labAnalysis + surveys
    };
  }

  /**
   * Update all display elements with calculated results
   */
  updateDisplay(results) {
    // Format numbers
    const fmt = (num, decimals = 0) => {
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      }).format(num);
    };

    const fmtCurrency = (num) => {
      if (Math.abs(num) >= 1000000) {
        return `$${fmt(num / 1000000, 2)}M`;
      }
      return `$${fmt(num, 0)}`;
    };

    // Production Metrics
    this.updateElement('calc-annual-processing', `${fmt(results.annualProcessing)} tons`);
    this.updateElement('calc-raw-copper', `${fmt(results.rawCopperInOre, 1)} tons Cu`);
    this.updateElement('calc-recovered-copper', `${fmt(results.recoveredCopper, 1)} tons Cu`);
    this.updateElement('calc-concentrate', `${fmt(results.concentrateProduced, 1)} tons`);
    this.updateElement('calc-payable-copper', `${fmt(results.payableCopper, 1)} tons Cu`);

    // Cost Breakdown
    this.updateElement('calc-excavation-processing', fmtCurrency(results.annualExcavationProcessingCosts));
    this.updateElement('calc-treatment-charges', fmtCurrency(results.treatmentCharges));
    this.updateElement('calc-waste-disposal', fmtCurrency(results.wasteDisposalCharges));
    this.updateElement('calc-total-tcwd', fmtCurrency(results.totalTCWD));
    this.updateElement('calc-operating-costs', fmtCurrency(results.totalOperatingCosts));

    // Revenue & Profit
    this.updateElement('calc-gross-revenue', fmtCurrency(results.grossRevenue));
    this.updateElement('calc-net-revenue', fmtCurrency(results.netRevenue));
    this.updateElement('calc-net-profit', fmtCurrency(results.netProfit));
    this.updateElement('calc-roi', `${fmt(results.roi, 1)}%`);
    this.updateElement('calc-payback', `${fmt(results.paybackMonths, 1)} months`);
    this.updateElement('calc-profit-per-ton-ore', `$${fmt(results.profitPerTonOre, 2)}`);
    this.updateElement('calc-profit-per-ton-copper', `$${fmt(results.profitPerTonCopper, 0)}`);

    // Exploration costs breakdown
    this.updateElement('calc-exploration-mapping', fmtCurrency(results.explorationCosts.mapping));
    this.updateElement('calc-exploration-drilling', fmtCurrency(results.explorationCosts.drilling));
    this.updateElement('calc-exploration-lab', fmtCurrency(results.explorationCosts.labAnalysis));
    this.updateElement('calc-exploration-surveys', fmtCurrency(results.explorationCosts.surveys));
    this.updateElement('calc-exploration-total', fmtCurrency(results.explorationCosts.total));

    // Year 3+ projections
    this.updateElement('calc-year3-processing', `${fmt(results.year3Processing)} tons`);
    this.updateElement('calc-year3-copper', `${fmt(results.year3RecoveredCopper, 1)} tons Cu`);
    this.updateElement('calc-year3-revenue', fmtCurrency(results.year3NetRevenue));
    this.updateElement('calc-year3-costs', fmtCurrency(results.year3OperatingCosts));
    this.updateElement('calc-year3-profit', fmtCurrency(results.year3NetProfit));

    // Update ROI color coding
    const roiElement = document.getElementById('calc-roi');
    if (roiElement) {
      roiElement.parentElement.classList.remove('text-success', 'text-warning', 'text-danger', 'text-copper');
      if (results.roi >= 80) {
        roiElement.parentElement.classList.add('text-success');
      } else if (results.roi >= 50) {
        roiElement.parentElement.classList.add('text-copper');
      } else if (results.roi >= 25) {
        roiElement.parentElement.classList.add('text-warning');
      } else {
        roiElement.parentElement.classList.add('text-danger');
      }
    }

    // Update investment summary chart
    this.updateInvestmentChart(results);
  }

  /**
   * Update copper price display with loading state
   */
  updatePriceDisplay() {
    const priceElement = document.getElementById('copper-price-live');
    const statusElement = document.getElementById('price-status');
    const lastUpdateElement = document.getElementById('price-last-update');

    if (priceElement) {
      if (this.isLoading) {
        priceElement.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Loading...';
      } else {
        const formatted = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(this.copperPrice);

        priceElement.innerHTML = `${formatted}/ton`;
      }
    }

    if (statusElement) {
      statusElement.innerHTML = this.isLoading
        ? '<i class="fa-solid fa-circle-notch fa-spin text-warning"></i> Updating...'
        : '<i class="fa-solid fa-circle text-success"></i> Live';
    }

    if (lastUpdateElement) {
      const now = new Date();
      lastUpdateElement.textContent = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  }

  /**
   * Update investment summary chart
   */
  updateInvestmentChart(results) {
    const chartCanvas = document.getElementById('investment-chart');
    if (!chartCanvas) return;

    const data = [
      { label: 'Year 1', value: -this.params.totalInvestment, color: '#dc3545' },
      { label: 'Year 2', value: results.netProfit, color: '#B87333' },
      { label: 'Year 3+', value: results.year3NetProfit, color: '#50C878' }
    ];

    let chartHTML = '<div class="simple-chart">';
    const maxValue = Math.max(...data.map(d => Math.abs(d.value)));

    data.forEach(d => {
      const percentage = (Math.abs(d.value) / maxValue) * 100;
      const formatted = d.value >= 0
        ? `+$${(d.value / 1000000).toFixed(2)}M`
        : `-$${(Math.abs(d.value) / 1000000).toFixed(2)}M`;

      chartHTML += `
        <div class="chart-row">
          <div class="chart-label">${d.label}</div>
          <div class="chart-bar-container">
            <div class="chart-bar" style="width: ${percentage}%; background: ${d.color};"></div>
          </div>
          <div class="chart-value" style="color: ${d.color};">${formatted}</div>
        </div>
      `;
    });
    chartHTML += '</div>';

    chartCanvas.innerHTML = chartHTML;
  }

  /**
   * Helper function to update element safely
   */
  updateElement(id, value) {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = value;
    }
  }

  /**
   * Reset calculator to default values
   */
  reset() {
    // Reset parameters
    this.params = {
      copperPriceLME: this.copperPrice, // Keep current live price
      explorationAcres: 1500,
      explorationCostPerAcre: 667,
      excavationCost: 85,
      processingCost: 50,
      plantCapacity: 350,
      operatingDays: 300,
      rawCopperPercentage: 2.5,
      recoveryRate: 88,
      finalProductPercentage: 18,
      lmePayableRate: 96.5,
      treatmentCharge: 80,
      wasteDisposalCharge: 5,
      totalInvestment: 6600000
    };

    // Reset input fields
    document.querySelectorAll('.calc-input').forEach(input => {
      const param = input.dataset.param;
      if (this.params[param] !== undefined) {
        input.value = this.params[param];
      }
    });

    // Recalculate
    this.calculate();

    // Show reset confirmation
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = '<i class="fa-solid fa-check-circle text-success"></i> Calculator reset to default values';
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('investment-calculator')) {
    window.investmentCalc = new InvestmentCalculator();
  }
});
