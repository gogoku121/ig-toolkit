// Main application entry point
import './styles/main.css';
import { Config } from './core/config.js';
import { AppState } from './core/state.js';
import { PreferencesStorage, HistoryStorage, FavoritesStorage } from './core/storage.js';
import { eventBus, Events } from './core/eventBus.js';
import { $, $$, debounce, generateId } from './core/dom.js';
import { Toast } from './components/Toast.js';
import { Modal } from './components/Modal.js';
import { Button } from './components/Button.js';
import { Input, Select, Slider, Textarea, ToggleGroup } from './components/FormElements.js';
import { ContentCard, LoadingCard, ErrorCard } from './components/ContentCard.js';
import {
  CaptionGenerator,
  HashtagGenerator,
  ReelsGenerator,
  ProductGenerator,
  StoryGenerator,
  ReplyGenerator
} from './generators/index.js';

class App {
  constructor() {
    this.elements = {};
    this.toolComponents = {};
    this.generators = {
      captions: CaptionGenerator,
      hashtags: HashtagGenerator,
      reels: ReelsGenerator,
      products: ProductGenerator,
      stories: StoryGenerator,
      replies: ReplyGenerator
    };
    this._init();
  }

  async _init() {
    // Load saved preferences
    const savedPrefs = PreferencesStorage.load();
    AppState.update(savedPrefs);

    // Apply saved theme
    document.documentElement.setAttribute('data-theme', AppState.get('theme') || 'dark');

    // Cache DOM elements
    this._cacheElements();

    // Initialize UI components
    this._initThemeToggle();
    this._initNavigation();
    this._initKeyboardShortcuts();

    // Initialize each tool
    this._initTool('captions');
    this._initTool('hashtags');
    this._initTool('reels');
    this._initTool('products');
    this._initTool('stories');
    this._initTool('replies');

    // Show initial tool
    this._switchTool(AppState.get('activeTool') || 'captions');

    // Subscribe to state changes
    this._subscribeToState();

    console.log('IG Toolkit initialized');
  }

  _cacheElements() {
    this.elements = {
      sidebar: $('#sidebar'),
      navBtns: $$('.nav-btn'),
      toolPanels: $$('.tool-panel'),
      toolTitle: $('#toolTitle'),
      toolDescription: $('#toolDescription'),
      themeToggle: $('#themeToggle')
    };
  }

  _initThemeToggle() {
    const toggle = this.elements.themeToggle;
    if (!toggle) return;

    toggle.addEventListener('click', () => {
      const currentTheme = AppState.get('theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      AppState.set('theme', newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
      PreferencesStorage.set('theme', newTheme);
      eventBus.emit(Events.THEME_CHANGE, newTheme);
      Toast.info(`Switched to ${newTheme} mode`);
    });
  }

  _initNavigation() {
    this.elements.navBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tool = btn.dataset.tool;
        if (tool) {
          this._switchTool(tool);
        }
      });
    });
  }

  _switchTool(tool) {
    // Update active nav button
    this.elements.navBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tool === tool);
      btn.setAttribute('aria-current', btn.dataset.tool === tool ? 'page' : 'false');
    });

    // Update active panel
    this.elements.toolPanels.forEach(panel => {
      const isActive = panel.id === `panel-${tool}`;
      panel.classList.toggle('active', isActive);
      panel.hidden = !isActive;
    });

    // Update header
    const toolInfo = {
      captions: { title: 'Caption Generator', desc: 'Create engaging captions that capture attention and drive engagement' },
      hashtags: { title: 'Hashtag Generator', desc: 'Discover the perfect hashtags to boost your post reach and discovery' },
      reels: { title: 'Reels Ideas Generator', desc: 'Get creative Reels concepts with hooks, scripts, and trending audio' },
      products: { title: 'Product Description Generator', desc: 'Craft compelling product descriptions that convert' },
      stories: { title: 'Story Posts Generator', desc: 'Generate engaging Story concepts that keep your audience hooked' },
      replies: { title: 'Reply Suggestions Generator', desc: 'Get smart reply templates for any comment type' }
    };

    const info = toolInfo[tool] || {};
    if (this.elements.toolTitle) this.elements.toolTitle.textContent = info.title || '';
    if (this.elements.toolDescription) this.elements.toolDescription.textContent = info.desc || '';

    // Save active tool
    AppState.set('activeTool', tool);
    PreferencesStorage.set('activeTool', tool);

    eventBus.emit(Events.TOOL_CHANGE, tool);
  }

  _initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ignore if typing in input
      if (e.target.matches('input, textarea, select')) return;

      const key = e.key.toLowerCase();
      const tool = Config.shortcuts[key];

      if (tool === 'toggleTheme') {
        this.elements.themeToggle?.click();
      } else if (tool === 'generate') {
        const activeTool = AppState.get('activeTool');
        const generateBtn = $(`#panel-${activeTool} .btn-generate`);
        generateBtn?.click();
      } else if (this.generators[tool]) {
        this._switchTool(tool);
      }
    });
  }

  _subscribeToState() {
    AppState.subscribe('theme', (theme) => {
      document.documentElement.setAttribute('data-theme', theme);
    });
  }

  _initTool(tool) {
    const panel = $(`#panel-${tool}`);
    if (!panel) return;

    const generateBtn = panel.querySelector('.btn-generate');
    const outputSection = panel.querySelector('.output-section');

    if (generateBtn && outputSection) {
      generateBtn.addEventListener('click', () => this._handleGenerate(tool));
    }
  }

  async _handleGenerate(tool) {
    const panel = $(`#panel-${tool}`);
    const outputSection = panel.querySelector('.output-section');
    const generateBtn = panel.querySelector('.btn-generate');

    // Get input values based on tool type
    const inputs = this._getToolInputs(tool, panel);

    // Validate inputs
    if (!this._validateInputs(tool, inputs)) {
      return;
    }

    // Show loading state
    const loadingCard = new LoadingCard('Generating content...');
    loadingCard.show(outputSection);
    generateBtn.setAttribute('aria-busy', 'true');
    generateBtn.disabled = true;

    AppState.set('isLoading', true);

    try {
      // Simulate async generation (for future AI API integration)
      await this._delay(800);

      // Generate content
      const results = this._generateContent(tool, inputs);

      // Add to history
      const historyEntry = {
        tool,
        inputs,
        results,
        timestamp: Date.now()
      };
      HistoryStorage.add(historyEntry);
      eventBus.emit(Events.HISTORY_ADD, historyEntry);

      // Render results
      this._renderResults(tool, results, outputSection);

      Toast.success('Content generated successfully!');

    } catch (error) {
      console.error('Generation error:', error);
      new ErrorCard(error.message || 'Failed to generate content').show(outputSection);
      Toast.error(error.message || 'Generation failed');
    } finally {
      loadingCard.hide();
      generateBtn.setAttribute('aria-busy', 'false');
      generateBtn.disabled = false;
      AppState.set('isLoading', false);
    }
  }

  _getToolInputs(tool, panel) {
    const getValue = (selector) => {
      const el = panel.querySelector(selector);
      if (!el) return '';
      return el.value || el.dataset.value || '';
    };

    switch (tool) {
      case 'captions':
        return {
          topic: getValue('#captionTopic'),
          tone: getValue('#captionTone'),
          length: getValue('#captionLength')
        };
      case 'hashtags':
        return {
          keywords: getValue('#hashtagTopic'),
          count: parseInt(getValue('#hashtagCount')) || 15
        };
      case 'reels':
        return {
          category: getValue('#reelsCategory'),
          audience: getValue('#reelsAudience'),
          style: panel.querySelector('.toggle-btn.active')?.dataset.style || 'trendy'
        };
      case 'products':
        return {
          name: getValue('#productName'),
          features: getValue('#productFeatures'),
          price: getValue('#productPrice'),
          audience: getValue('#productAudience')
        };
      case 'stories':
        return {
          type: getValue('#storyType'),
          topic: getValue('#storyTopic')
        };
      case 'replies':
        return {
          type: getValue('#replyType'),
          context: getValue('#replyContext')
        };
      default:
        return {};
    }
  }

  _validateInputs(tool, inputs) {
    const errors = {
      captions: { topic: 'Please enter a topic' },
      hashtags: { keywords: 'Please enter keywords' },
      products: { name: 'Please enter a product name' }
    };

    const toolErrors = errors[tool];
    if (toolErrors) {
      for (const [field, message] of Object.entries(toolErrors)) {
        if (!inputs[field]?.trim()) {
          Toast.warning(message);
          return false;
        }
      }
    }

    return true;
  }

  _generateContent(tool, inputs) {
    const generator = this.generators[tool];
    if (!generator) {
      throw new Error('Unknown tool');
    }

    return generator.generate(inputs);
  }

  _renderResults(tool, results, container) {
    // Clear previous results
    container.innerHTML = '';

    // Render based on tool type
    switch (tool) {
      case 'captions':
      case 'reels':
      case 'products':
      case 'stories':
      case 'replies':
        this._renderCards(results, container);
        break;
      case 'hashtags':
        this._renderHashtagGroups(results, container);
        break;
      default:
        this._renderCards(results, container);
    }

    // Add copy all button for hashtags
    if (tool === 'hashtags' && results.length > 0) {
      const copyAllBtn = new Button({
        text: 'Copy All',
        variant: 'secondary',
        size: 'small',
        onClick: () => this._copyAllHashtags(results)
      });
      copyAllBtn.element.style.marginBottom = '16px';
      copyAllBtn.element.style.alignSelf = 'flex-end';
      copyAllBtn.render(container);
    }
  }

  _renderCards(results, container) {
    results.forEach(result => {
      const card = new ContentCard({
        id: result.id,
        title: result.title || '',
        content: result.content || JSON.stringify(result),
        type: result.type,
        metadata: result.metadata,
        onCopy: (content) => {
          eventBus.emit(Events.CONTENT_COPY, { id: result.id, content });
        },
        onFavorite: (id, isFavorite) => {
          const item = { id, ...result };
          FavoritesStorage.toggle(item);
          eventBus.emit(Events.CONTENT_FAVORITE, { id, isFavorite });
        }
      });
      card.render(container);
    });
  }

  _renderHashtagGroups(results, container) {
    results.forEach(group => {
      const groupEl = document.createElement('div');
      groupEl.className = 'hashtag-group';

      const label = document.createElement('div');
      label.className = 'hashtag-group-label';
      label.textContent = group.title;
      groupEl.appendChild(label);

      const tagsContainer = document.createElement('div');
      tagsContainer.className = 'hashtags-container';

      group.tags.forEach(tag => {
        const span = document.createElement('span');
        span.className = 'hashtag';
        span.textContent = tag;
        span.setAttribute('role', 'button');
        span.setAttribute('tabindex', '0');
        span.setAttribute('title', 'Click to copy');
        
        span.addEventListener('click', () => this._copyText(tag));
        span.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this._copyText(tag);
          }
        });

        tagsContainer.appendChild(span);
      });

      groupEl.appendChild(tagsContainer);
      container.appendChild(groupEl);
    });
  }

  async _copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      Toast.success('Copied!');
    } catch (err) {
      Toast.error('Failed to copy');
    }
  }

  async _copyAllHashtags(results) {
    const allTags = results.flatMap(r => r.tags || []).join(' ');
    await this._copyText(allTags);
  }

  _delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});

export default App;
