import * as monaco from 'monaco-editor';

// Theme constants
const THEMES = {
    LIGHT: 'vs',
    DARK: 'vs-dark',
    SYSTEM: 'system'
};

/**
 * Determines the system's preferred color scheme
 * @returns {string} 'vs-dark' or 'vs' based on system preference
 */
export function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? THEMES.DARK 
        : THEMES.LIGHT;
}

/**
 * Resolves the actual theme to apply (handles 'system' theme)
 * @param {string} themeSelection - The selected theme ('vs', 'vs-dark', or 'system')
 * @returns {string} The actual Monaco theme to apply
 */
function resolveTheme(themeSelection) {
    return themeSelection === THEMES.SYSTEM ? getSystemTheme() : themeSelection;
}

/**
 * Update the data-theme attribute on body for CSS to respond
 * @param {string} themeSelection - The theme selection ('vs', 'vs-dark', or 'system')
 */
function updateBodyTheme(themeSelection) {
    if (themeSelection === THEMES.SYSTEM) {
        // Remove data-theme attribute to let CSS media query take over
        document.body.removeAttribute('data-theme');
    } else {
        // Set explicit theme
        const theme = themeSelection === THEMES.DARK ? 'dark' : 'light';
        document.body.setAttribute('data-theme', theme);
    }
}

/**
 * Applies the specified theme to Monaco Editor and UI elements
 * @param {string} themeSelection - The theme to apply ('vs', 'vs-dark', or 'system')
 */
export function applyTheme(themeSelection) {
    const actualTheme = resolveTheme(themeSelection);
    
    // Apply Monaco theme
    monaco.editor.setTheme(actualTheme);
    
    // Update body data-theme for CSS custom properties
    updateBodyTheme(themeSelection);
}

/**
 * Setup theme-related event listeners
 * @param {monaco.editor.IStandaloneDiffEditor} diffEditor - The diff editor instance
 */
export function setupThemeListeners(diffEditor) {
    const themeSelector = document.getElementById('theme-selector');
    if (!themeSelector) return;
    
    // Handle theme selector changes
    themeSelector.addEventListener('change', (event) => {
        applyTheme(event.target.value);
    });

    // Handle system theme changes
    const systemThemeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    systemThemeMediaQuery.addEventListener('change', () => {
        // Only apply system theme change if user has 'system' selected
        if (themeSelector.value === THEMES.SYSTEM) {
            applyTheme(THEMES.SYSTEM);
        }
    });
}