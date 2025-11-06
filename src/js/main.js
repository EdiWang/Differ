import { configureMonacoWorkers } from './workers.js';
import { leftText, rightText } from './sampleData.js';
import { applyTheme, setupThemeListeners } from './theme.js';
import { setupLanguageSelector } from './language.js';
import { createDiffEditor, initializeDiffEditor } from './editor.js';
import { loadSession, saveSession, setupAutoSave, clearSession } from './storage.js';

// Configure Monaco Environment for web workers
configureMonacoWorkers();

// Create the diff editor
const diffEditor = createDiffEditor('container');

// Try to load saved session
const savedSession = loadSession();

// Initialize editor with saved session or sample data
if (savedSession) {
    initializeDiffEditor(
        diffEditor, 
        savedSession.originalText, 
        savedSession.modifiedText, 
        savedSession.language
    );
    
    // Apply saved theme
    if (savedSession.theme) {
        applyTheme(savedSession.theme);
        const themeSelector = document.getElementById('theme-selector');
        if (themeSelector) {
            themeSelector.value = savedSession.theme;
        }
    }
    
    // Set saved language
    if (savedSession.language) {
        const languageSelector = document.getElementById('language-selector');
        if (languageSelector) {
            languageSelector.value = savedSession.language;
        }
    }
} else {
    initializeDiffEditor(diffEditor, leftText, rightText, 'plaintext');
    applyTheme('system');
}

// Setup event listeners
setupLanguageSelector(diffEditor);
setupThemeListeners(diffEditor);

// Helper functions to get current state
const getCurrentLanguage = () => {
    const selector = document.getElementById('language-selector');
    return selector ? selector.value : 'plaintext';
};

const getCurrentTheme = () => {
    const selector = document.getElementById('theme-selector');
    return selector ? selector.value : 'system';
};

// Setup auto-save with 2 second debounce
setupAutoSave(diffEditor, getCurrentLanguage, getCurrentTheme, 2000);

// Manual save on language/theme change
document.getElementById('language-selector')?.addEventListener('change', () => {
    saveSession(diffEditor, getCurrentLanguage(), getCurrentTheme());
});

document.getElementById('theme-selector')?.addEventListener('change', () => {
    saveSession(diffEditor, getCurrentLanguage(), getCurrentTheme());
});

// Clear session button handler
document.getElementById('clear-session-btn')?.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear the saved session and reset to default values?')) {
        // Clear session from localStorage
        clearSession();
        
        // Reset to default values
        initializeDiffEditor(diffEditor, leftText, rightText, 'plaintext');
        
        // Reset selectors
        const languageSelector = document.getElementById('language-selector');
        if (languageSelector) {
            languageSelector.value = 'plaintext';
        }
        
        const themeSelector = document.getElementById('theme-selector');
        if (themeSelector) {
            themeSelector.value = 'system';
        }
        
        // Apply system theme
        applyTheme('system');
    }
});