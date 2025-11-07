import * as monaco from 'monaco-editor';

// Theme constants
const THEMES = {
    LIGHT: 'vs',
    DARK: 'vs-dark',
    SYSTEM: 'system'
};

// Theme styles configuration
const THEME_STYLES = {
    'vs-dark': {
        backgroundColor: '#1e1e1e',
        borderColor: '#3e3e3e',
        textColor: '#cccccc',
        linkColor: '#4fc3f7',
        controlBackground: '#3c3c3c'
    },
    'vs': {
        backgroundColor: '#f0f0f0',
        borderColor: '#ccc',
        textColor: '#000000',
        linkColor: '#0066cc',
        controlBackground: '#ffffff',
        footerTextColor: '#666'
    }
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
 * Get DOM elements that need theme styling
 * @returns {Object} Object containing all themed elements
 */
function getThemedElements() {
    return {
        controls: document.getElementById('controls'),
        footer: document.getElementById('footer'),
        languageSelector: document.getElementById('language-selector'),
        themeSelector: document.getElementById('theme-selector'),
        fontSizeSelector: document.getElementById('font-size-selector'),
        viewModeGroup: document.getElementById('view-mode-group'),
        clearSessionBtn: document.getElementById('clear-session-btn')
    };
}

/**
 * Apply styles to a specific element
 * @param {HTMLElement} element - The element to style
 * @param {Object} styles - Object containing style properties
 */
function applyStyles(element, styles) {
    if (!element) return;
    
    Object.entries(styles).forEach(([property, value]) => {
        element.style[property] = value;
    });
}

/**
 * Apply theme styles to controls bar
 * @param {HTMLElement} controls - The controls bar element
 * @param {Object} theme - Theme configuration object
 */
function applyControlsTheme(controls, theme) {
    if (!controls) return;
    
    applyStyles(controls, {
        backgroundColor: theme.backgroundColor,
        borderBottomColor: theme.borderColor,
        color: theme.textColor
    });
}

/**
 * Apply theme styles to footer
 * @param {HTMLElement} footer - The footer element
 * @param {Object} theme - Theme configuration object
 */
function applyFooterTheme(footer, theme) {
    if (!footer) return;
    
    applyStyles(footer, {
        backgroundColor: theme.backgroundColor,
        borderTopColor: theme.borderColor,
        color: theme.footerTextColor || theme.textColor
    });
    
    // Update footer links
    const footerLinks = footer.querySelectorAll('a');
    footerLinks.forEach(link => {
        link.style.color = theme.linkColor;
    });
}

/**
 * Apply theme styles to dropdown selectors
 * @param {Array<HTMLElement>} selectors - Array of selector elements
 * @param {Object} theme - Theme configuration object
 */
function applySelectorTheme(selectors, theme) {
    selectors.forEach(selector => {
        if (selector) {
            applyStyles(selector, {
                backgroundColor: theme.controlBackground,
                color: theme.textColor,
                border: `1px solid ${theme.borderColor}`
            });
        }
    });
}

/**
 * Apply theme styles to all UI elements
 * @param {string} actualTheme - The resolved theme ('vs' or 'vs-dark')
 */
function applyUITheme(actualTheme) {
    const themeConfig = THEME_STYLES[actualTheme];
    if (!themeConfig) return;
    
    const elements = getThemedElements();
    
    applyControlsTheme(elements.controls, themeConfig);
    applyFooterTheme(elements.footer, themeConfig);
    applySelectorTheme(
        [elements.languageSelector, elements.themeSelector, elements.fontSizeSelector],
        themeConfig
    );
    
    if (elements.viewModeGroup) {
        elements.viewModeGroup.style.color = themeConfig.textColor;
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
    
    // Apply UI theme
    applyUITheme(actualTheme);
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