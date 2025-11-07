import { configureMonacoWorkers } from './workers.js';
import { leftText, rightText } from './sampleData.js';
import { applyTheme, setupThemeListeners } from './theme.js';
import { setupLanguageSelector } from './language.js';
import { setupFontSizeSelector, applyFontSize } from './fontSize.js';
import { createDiffEditor, initializeDiffEditor } from './editor.js';
import { loadSession, saveSession, setupAutoSave, clearSession } from './storage.js';
import { setupViewModeSelector, applyViewMode } from './viewMode.js';

// Constants
const DEFAULT_LANGUAGE = 'plaintext';
const DEFAULT_THEME = 'system';
const DEFAULT_VIEW_MODE = 'side-by-side';
const DEFAULT_FONT_SIZE = 14;
const AUTO_SAVE_INTERVAL = 2000;

// DOM Elements Cache
const elements = {
    languageSelector: null,
    themeSelector: null,
    fontSizeSelector: null,
    clearSessionBtn: null,
    viewModeToggle: null,
    loadingIndicator: null
};

/**
 * Cache DOM elements to avoid repeated queries
 */
function cacheElements() {
    elements.languageSelector = document.getElementById('language-selector');
    elements.themeSelector = document.getElementById('theme-selector');
    elements.fontSizeSelector = document.getElementById('font-size-selector');
    elements.clearSessionBtn = document.getElementById('clear-session-btn');
    elements.viewModeToggle = document.getElementById('view-mode-toggle');
    elements.loadingIndicator = document.getElementById('loading-indicator');
}

/**
 * Hide the loading indicator
 */
function hideLoadingIndicator() {
    if (elements.loadingIndicator) {
        elements.loadingIndicator.classList.add('hidden');
        // Remove from DOM after transition
        setTimeout(() => {
            elements.loadingIndicator.style.display = 'none';
        }, 300);
    }
}

/**
 * Get the currently selected language
 * @returns {string} Selected language or default
 */
function getCurrentLanguage() {
    return elements.languageSelector?.value ?? DEFAULT_LANGUAGE;
}

/**
 * Get the currently selected theme
 * @returns {string} Selected theme or default
 */
function getCurrentTheme() {
    return elements.themeSelector?.value ?? DEFAULT_THEME;
}

/**
 * Get the currently selected view mode
 * @returns {string} Selected view mode or default
 */
function getCurrentViewMode() {
    const activeOption = elements.viewModeToggle?.querySelector('.toggle-option.active');
    return activeOption?.dataset.value ?? DEFAULT_VIEW_MODE;
}

/**
 * Get the currently selected font size
 * @returns {number} Selected font size or default
 */
function getCurrentFontSize() {
    const value = elements.fontSizeSelector?.value;
    return value ? parseInt(value, 10) : DEFAULT_FONT_SIZE;
}

/**
 * Initialize the editor with saved session or default values
 * @param {monaco.editor.IStandaloneDiffEditor} diffEditor - The diff editor instance
 */
function initializeEditor(diffEditor) {
    const savedSession = loadSession();
    
    if (savedSession) {
        restoreSession(diffEditor, savedSession);
    } else {
        loadDefaultSession(diffEditor);
    }
}

/**
 * Restore a saved session
 * @param {monaco.editor.IStandaloneDiffEditor} diffEditor - The diff editor instance
 * @param {Object} session - The saved session data
 */
function restoreSession(diffEditor, session) {
    const {
        originalText,
        modifiedText,
        language = DEFAULT_LANGUAGE,
        theme = DEFAULT_THEME,
        viewMode = DEFAULT_VIEW_MODE,
        fontSize = DEFAULT_FONT_SIZE
    } = session;
    
    // Initialize editor content
    initializeDiffEditor(diffEditor, originalText, modifiedText, language);
    
    // Restore theme
    applyTheme(theme);
    if (elements.themeSelector) {
        elements.themeSelector.value = theme;
    }
    
    // Restore language
    if (elements.languageSelector) {
        elements.languageSelector.value = language;
    }
    
    // Restore font size
    applyFontSize(diffEditor, fontSize);
    if (elements.fontSizeSelector) {
        elements.fontSizeSelector.value = fontSize.toString();
    }
    
    // Restore view mode
    applyViewMode(diffEditor, viewMode);
    if (elements.viewModeToggle) {
        const toggleOptions = elements.viewModeToggle.querySelectorAll('.toggle-option');
        toggleOptions.forEach(option => {
            if (option.dataset.value === viewMode) {
                option.classList.add('active');
                option.setAttribute('aria-pressed', 'true');
            } else {
                option.classList.remove('active');
                option.setAttribute('aria-pressed', 'false');
            }
        });
    }
}

/**
 * Load default session values
 * @param {monaco.editor.IStandaloneDiffEditor} diffEditor - The diff editor instance
 */
function loadDefaultSession(diffEditor) {
    initializeDiffEditor(diffEditor, leftText, rightText, DEFAULT_LANGUAGE);
    applyTheme(DEFAULT_THEME);
    applyFontSize(diffEditor, DEFAULT_FONT_SIZE);
}

/**
 * Reset the editor to default values
 * @param {monaco.editor.IStandaloneDiffEditor} diffEditor - The diff editor instance
 */
function resetToDefaults(diffEditor) {
    clearSession();
    loadDefaultSession(diffEditor);
    
    // Reset UI controls
    if (elements.languageSelector) {
        elements.languageSelector.value = DEFAULT_LANGUAGE;
    }
    
    if (elements.themeSelector) {
        elements.themeSelector.value = DEFAULT_THEME;
    }
    
    if (elements.fontSizeSelector) {
        elements.fontSizeSelector.value = DEFAULT_FONT_SIZE.toString();
    }
    
    // Reset view mode toggle
    if (elements.viewModeToggle) {
        const toggleOptions = elements.viewModeToggle.querySelectorAll('.toggle-option');
        toggleOptions.forEach(option => {
            if (option.dataset.value === DEFAULT_VIEW_MODE) {
                option.classList.add('active');
                option.setAttribute('aria-pressed', 'true');
            } else {
                option.classList.remove('active');
                option.setAttribute('aria-pressed', 'false');
            }
        });
    }
    
    applyViewMode(diffEditor, DEFAULT_VIEW_MODE);
}

/**
 * Setup event listeners for controls
 * @param {monaco.editor.IStandaloneDiffEditor} diffEditor - The diff editor instance
 */
function setupEventListeners(diffEditor) {
    const saveCurrentSession = () => {
        saveSession(
            diffEditor,
            getCurrentLanguage(),
            getCurrentTheme(),
            getCurrentViewMode(),
            getCurrentFontSize()
        );
    };
    
    // Language selector change
    elements.languageSelector?.addEventListener('change', saveCurrentSession);
    
    // Theme selector change
    elements.themeSelector?.addEventListener('change', saveCurrentSession);
    
    // Font size selector change
    elements.fontSizeSelector?.addEventListener('change', saveCurrentSession);
    
    // View mode toggle buttons change
    if (elements.viewModeToggle) {
        const toggleOptions = elements.viewModeToggle.querySelectorAll('.toggle-option');
        toggleOptions.forEach(option => {
            option.addEventListener('click', saveCurrentSession);
        });
    }
    
    // Clear session button
    elements.clearSessionBtn?.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear the saved session and reset to default values?')) {
            resetToDefaults(diffEditor);
        }
    });
}

/**
 * Initialize the application
 */
async function init() {
    try {
        // Configure Monaco Environment for web workers
        configureMonacoWorkers();
        
        // Cache DOM elements
        cacheElements();
        
        // Create the diff editor
        const diffEditor = createDiffEditor('container');
        
        // Initialize editor with saved or default data
        initializeEditor(diffEditor);
        
        // Setup all feature modules
        setupLanguageSelector(diffEditor);
        setupThemeListeners(diffEditor);
        setupFontSizeSelector(diffEditor);
        setupViewModeSelector(diffEditor);
        
        // Setup event listeners
        setupEventListeners(diffEditor);
        
        // Setup auto-save
        setupAutoSave(
            diffEditor,
            getCurrentLanguage,
            getCurrentTheme,
            getCurrentViewMode,
            getCurrentFontSize,
            AUTO_SAVE_INTERVAL
        );
        
        // Hide loading indicator after initialization
        hideLoadingIndicator();
    } catch (error) {
        console.error('Error initializing editor:', error);
        hideLoadingIndicator();
    }
}

// Start the application
init();