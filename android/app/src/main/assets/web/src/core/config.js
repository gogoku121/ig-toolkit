// Application configuration
export const Config = {
  // App info
  app: {
    name: 'IG Toolkit',
    version: '2.0.0',
    package: 'com.igtoolkit.app'
  },

  // Storage keys
  storage: {
    theme: 'ig-toolkit-theme',
    preferences: 'ig-toolkit-preferences',
    history: 'ig-toolkit-history',
    favorites: 'ig-toolkit-favorites'
  },

  // Default preferences
  defaults: {
    theme: 'dark',
    activeTool: 'captions',
    tone: 'casual',
    length: 'medium'
  },

  // Keyboard shortcuts
  shortcuts: {
    '1': 'captions',
    '2': 'hashtags',
    '3': 'reels',
    '4': 'products',
    '5': 'stories',
    '6': 'replies',
    'g': 'generate',
    't': 'toggleTheme',
    '?': 'showHelp'
  },

  // Animation durations (ms)
  animation: {
    fast: 150,
    normal: 300,
    slow: 500
  },

  // Generation settings
  generation: {
    captionCount: 3,
    hashtagMin: 5,
    hashtagMax: 30,
    hashtagDefault: 15,
    reelsCount: 5,
    storyCount: 5,
    replyCount: 10
  }
};

// Freeze config to prevent modifications
Object.freeze(Config);
Object.freeze(Config.app);
Object.freeze(Config.storage);
Object.freeze(Config.defaults);
Object.freeze(Config.shortcuts);
Object.freeze(Config.animation);
Object.freeze(Config.generation);

export default Config;
