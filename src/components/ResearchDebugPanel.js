/**
 * ResearchDebugPanel
 * Developer mode panel showing research engine status
 */

export class ResearchDebugPanel {
  constructor(researchEngine) {
    this.engine = researchEngine;
    this.visible = false;
    this.element = null;
    this.autoRefresh = false;
    this.refreshInterval = null;
  }

  /**
   * Initialize the debug panel
   */
  init() {
    // Create panel element
    this.element = document.createElement('div');
    this.element.id = 'research-debug-panel';
    this.element.className = 'debug-panel';
    
    // Create toggle button
    this.createToggleButton();
    
    // Build panel content
    this.buildPanel();
    
    // Add to DOM
    document.body.appendChild(this.element);
    
    // Listen for research events
    this.bindEvents();
  }

  /**
   * Create toggle button
   */
  createToggleButton() {
    this.toggleBtn = document.createElement('button');
    this.toggleBtn.id = 'debug-toggle';
    this.toggleBtn.className = 'debug-toggle-btn';
    this.toggleBtn.innerHTML = '🔍 Debug';
    this.toggleBtn.title = 'Toggle Research Debug Panel';
    
    this.toggleBtn.addEventListener('click', () => {
      this.toggle();
    });
    
    document.body.appendChild(this.toggleBtn);
  }

  /**
   * Build panel HTML
   */
  buildPanel() {
    this.element.innerHTML = `
      <div class="debug-header">
        <h3>🔬 Research Engine Debug</h3>
        <div class="debug-controls">
          <button id="debug-refresh" class="debug-btn">↻ Refresh</button>
          <button id="debug-auto" class="debug-btn">Auto: OFF</button>
          <button id="debug-close" class="debug-btn">✕ Close</button>
        </div>
      </div>
      
      <div class="debug-content">
        <div class="debug-section">
          <h4>📊 Status</h4>
          <div id="debug-status" class="debug-grid"></div>
        </div>
        
        <div class="debug-section">
          <h4>🌐 Provider Health</h4>
          <div id="debug-health" class="debug-list"></div>
        </div>
        
        <div class="debug-section">
          <h4>📈 Research Quality</h4>
          <div id="debug-quality" class="debug-metrics"></div>
        </div>
        
        <div class="debug-section">
          <h4>📝 Debug Log</h4>
          <div id="debug-log" class="debug-log"></div>
        </div>
      </div>
    `;
    
    // Bind controls
    this.element.querySelector('#debug-refresh').addEventListener('click', () => this.refresh());
    this.element.querySelector('#debug-auto').addEventListener('click', () => this.toggleAuto());
    this.element.querySelector('#debug-close').addEventListener('click', () => this.hide());
  }

  /**
   * Bind to research events
   */
  bindEvents() {
    document.addEventListener('research:start', () => this.refresh());
    document.addEventListener('research:complete', () => this.refresh());
    document.addEventListener('research:error', () => this.refresh());
  }

  /**
   * Refresh debug data
   */
  refresh() {
    if (!this.visible) return;
    
    const status = this.engine.getStatus();
    const debug = this.engine.getDebugInfo();
    
    this.updateStatus(status);
    this.updateHealth(debug.providerHealth);
    this.updateQuality(debug);
    this.updateLog(debug.debugLog);
  }

  /**
   * Update status section
   */
  updateStatus(status) {
    const container = this.element.querySelector('#debug-status');
    
    const modeColors = {
      'ONLINE': 'var(--color-success, green)',
      'CACHE': 'var(--color-warning, orange)',
      'MEMORY': 'var(--color-info, blue)',
      'OFFLINE': 'var(--color-error, red)'
    };
    
    const modeColor = modeColors[status.state] || 'gray';
    
    container.innerHTML = `
      <div class="status-item">
        <span class="label">Mode:</span>
        <span class="value" style="color: ${modeColor}; font-weight: bold;">${status.state || 'UNKNOWN'}</span>
      </div>
      <div class="status-item">
        <span class="label">Research Status:</span>
        <span class="value">${status.researchStatus || 'READY'}</span>
      </div>
      <div class="status-item">
        <span class="label">Active Provider:</span>
        <span class="value">${status.provider || 'none'}</span>
      </div>
      <div class="status-item">
        <span class="label">Quality Threshold:</span>
        <span class="value">${status.qualityThreshold || 40}</span>
      </div>
      <div class="status-item">
        <span class="label">Connectivity:</span>
        <span class="value">${status.connectivity?.online ? '🟢 Online' : '🔴 Offline'}</span>
      </div>
    `;
  }

  /**
   * Update provider health section
   */
  updateHealth(health) {
    const container = this.element.querySelector('#debug-health');
    
    if (!health || !health.providers) {
      container.innerHTML = '<div class="no-data">No provider data</div>';
      return;
    }
    
    container.innerHTML = health.providers.map(p => {
      const h = p.health;
      const statusIcon = h.isHealthy ? '🟢' : '🔴';
      const statusClass = h.isHealthy ? 'healthy' : 'unhealthy';
      
      const authStatus = h.apiKeyConfigured ? '🔑 Configured' : '⚠️ Not Set';
      
      return `
        <div class="provider-item ${statusClass}">
          <div class="provider-header">
            <span class="status-icon">${statusIcon}</span>
            <span class="provider-name">${h.name}</span>
          </div>
          <div class="provider-details">
            <div class="detail-row">
              <span>Status:</span>
              <span>${h.status}</span>
            </div>
            <div class="detail-row">
              <span>API Key:</span>
              <span>${authStatus}</span>
            </div>
            <div class="detail-row">
              <span>Success Rate:</span>
              <span>${h.successRate}%</span>
            </div>
            <div class="detail-row">
              <span>Latency:</span>
              <span>${h.latency?.avg || 0}ms avg</span>
            </div>
            <div class="detail-row">
              <span>Last Error:</span>
              <span>${h.lastError || 'none'}</span>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  /**
   * Update quality section
   */
  updateQuality(debug) {
    const container = this.element.querySelector('#debug-quality');
    
    const quality = debug.quality || {};
    const score = quality.score || 0;
    
    let scoreColor = 'red';
    if (score >= 70) scoreColor = 'green';
    else if (score >= 40) scoreColor = 'orange';
    
    container.innerHTML = `
      <div class="quality-score" style="--score: ${score}; --color: ${scoreColor};">
        <div class="score-circle">
          <span class="score-value">${score}</span>
        </div>
        <div class="score-label">${quality.quality || 'unknown'}</div>
      </div>
      <div class="breakdown">
        <h5>Score Breakdown:</h5>
        ${this.renderBreakdown(quality.breakdown)}
      </div>
    `;
  }

  /**
   * Render breakdown bars
   */
  renderBreakdown(breakdown) {
    if (!breakdown) return '<div>No breakdown available</div>';
    
    const items = [
      { key: 'usefulResults', label: 'Results' },
      { key: 'entities', label: 'Entities' },
      { key: 'questions', label: 'Questions' },
      { key: 'trends', label: 'Trends' },
      { key: 'insights', label: 'Insights' },
      { key: 'freshness', label: 'Freshness' },
      { key: 'diversity', label: 'Diversity' }
    ];
    
    return items.map(item => {
      const value = breakdown[item.key] || 0;
      return `
        <div class="breakdown-item">
          <span class="breakdown-label">${item.label}</span>
          <div class="breakdown-bar">
            <div class="breakdown-fill" style="width: ${value}%;"></div>
          </div>
          <span class="breakdown-value">${value}%</span>
        </div>
      `;
    }).join('');
  }

  /**
   * Update debug log
   */
  updateLog(logs) {
    const container = this.element.querySelector('#debug-log');
    
    if (!logs || logs.length === 0) {
      container.innerHTML = '<div class="no-data">No log entries</div>';
      return;
    }
    
    container.innerHTML = logs.slice(-20).map(entry => {
      const time = new Date(entry.time).toLocaleTimeString();
      return `<div class="log-entry"><span class="log-time">${time}</span> ${entry.message}</div>`;
    }).join('');
  }

  /**
   * Toggle auto refresh
   */
  toggleAuto() {
    this.autoRefresh = !this.autoRefresh;
    
    const btn = this.element.querySelector('#debug-auto');
    btn.textContent = `Auto: ${this.autoRefresh ? 'ON' : 'OFF'}`;
    btn.classList.toggle('active', this.autoRefresh);
    
    if (this.autoRefresh) {
      this.refreshInterval = setInterval(() => this.refresh(), 2000);
    } else if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
  }

  /**
   * Toggle panel visibility
   */
  toggle() {
    this.visible = !this.visible;
    this.element.classList.toggle('visible', this.visible);
    
    if (this.visible) {
      this.refresh();
    }
  }

  /**
   * Show panel
   */
  show() {
    this.visible = true;
    this.element.classList.add('visible');
    this.refresh();
  }

  /**
   * Hide panel
   */
  hide() {
    this.visible = false;
    this.element.classList.remove('visible');
  }

  /**
   * Add CSS
   */
  addStyles() {
    const styles = document.createElement('style');
    styles.textContent = `
      .debug-toggle-btn {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
        padding: 8px 16px;
        background: #333;
        color: white;
        border: none;
        border-radius: 20px;
        cursor: pointer;
        font-size: 14px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
      }
      
      .debug-panel {
        position: fixed;
        top: 0;
        right: -450px;
        width: 450px;
        height: 100vh;
        background: #1a1a2e;
        color: #eee;
        z-index: 10000;
        transition: right 0.3s ease;
        display: flex;
        flex-direction: column;
        font-family: 'Monaco', 'Menlo', monospace;
        font-size: 12px;
      }
      
      .debug-panel.visible {
        right: 0;
      }
      
      .debug-header {
        padding: 15px;
        background: #16213e;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #333;
      }
      
      .debug-header h3 {
        margin: 0;
        font-size: 14px;
      }
      
      .debug-controls {
        display: flex;
        gap: 8px;
      }
      
      .debug-btn {
        padding: 4px 8px;
        background: #333;
        border: none;
        color: white;
        border-radius: 4px;
        cursor: pointer;
        font-size: 11px;
      }
      
      .debug-btn:hover {
        background: #444;
      }
      
      .debug-btn.active {
        background: #4CAF50;
      }
      
      .debug-content {
        flex: 1;
        overflow-y: auto;
        padding: 15px;
      }
      
      .debug-section {
        margin-bottom: 20px;
      }
      
      .debug-section h4 {
        margin: 0 0 10px 0;
        font-size: 13px;
        color: #888;
      }
      
      .debug-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
      }
      
      .status-item {
        background: #252540;
        padding: 8px;
        border-radius: 4px;
      }
      
      .status-item .label {
        color: #888;
        font-size: 11px;
      }
      
      .status-item .value {
        display: block;
        margin-top: 4px;
      }
      
      .debug-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      
      .provider-item {
        background: #252540;
        padding: 10px;
        border-radius: 4px;
        border-left: 3px solid transparent;
      }
      
      .provider-item.healthy {
        border-left-color: #4CAF50;
      }
      
      .provider-item.unhealthy {
        border-left-color: #f44336;
      }
      
      .provider-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
      }
      
      .provider-name {
        font-weight: bold;
      }
      
      .detail-row {
        display: flex;
        justify-content: space-between;
        font-size: 11px;
        padding: 2px 0;
      }
      
      .detail-row span:first-child {
        color: #888;
      }
      
      .debug-metrics {
        display: flex;
        gap: 20px;
        align-items: flex-start;
      }
      
      .quality-score {
        text-align: center;
      }
      
      .score-circle {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background: conic-gradient(var(--color) var(--score), #333 var(--score));
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .score-circle::before {
        content: '';
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: #1a1a2e;
      }
      
      .score-value {
        position: relative;
        z-index: 1;
        font-size: 24px;
        font-weight: bold;
        color: var(--color);
      }
      
      .score-label {
        margin-top: 8px;
        text-transform: uppercase;
        font-size: 11px;
        color: #888;
      }
      
      .breakdown {
        flex: 1;
      }
      
      .breakdown h5 {
        margin: 0 0 10px 0;
        font-size: 11px;
        color: #888;
      }
      
      .breakdown-item {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 6px;
      }
      
      .breakdown-label {
        width: 80px;
        font-size: 11px;
        color: #aaa;
      }
      
      .breakdown-bar {
        flex: 1;
        height: 8px;
        background: #333;
        border-radius: 4px;
        overflow: hidden;
      }
      
      .breakdown-fill {
        height: 100%;
        background: #4CAF50;
        transition: width 0.3s ease;
      }
      
      .breakdown-value {
        width: 35px;
        text-align: right;
        font-size: 10px;
        color: #888;
      }
      
      .debug-log {
        background: #111;
        padding: 10px;
        border-radius: 4px;
        max-height: 200px;
        overflow-y: auto;
        font-size: 11px;
      }
      
      .log-entry {
        padding: 4px 0;
        border-bottom: 1px solid #222;
      }
      
      .log-time {
        color: #666;
        margin-right: 8px;
      }
      
      .no-data {
        color: #666;
        font-style: italic;
        padding: 10px;
      }
    `;
    document.head.appendChild(styles);
  }
}

export default ResearchDebugPanel;
