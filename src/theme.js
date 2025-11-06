import * as monaco from 'monaco-editor';

export function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'vs-dark' : 'vs';
}

export function applyTheme(themeSelection) {
    let actualTheme;

    if (themeSelection === 'system') {
        actualTheme = getSystemTheme();
    } else {
        actualTheme = themeSelection;
    }

    monaco.editor.setTheme(actualTheme);

    // Update controls background to match theme
    const controls = document.getElementById('controls');
    const languageSelector = document.getElementById('language-selector');
    const themeSelector = document.getElementById('theme-selector');
    
    if (actualTheme === 'vs-dark') {
        controls.style.backgroundColor = '#1e1e1e';
        controls.style.borderBottomColor = '#3e3e3e';
        controls.style.color = '#cccccc';
        
        // Style dropdowns for dark theme
        [languageSelector, themeSelector].forEach(selector => {
            selector.style.backgroundColor = '#3c3c3c';
            selector.style.color = '#cccccc';
            selector.style.border = '1px solid #3e3e3e';
        });
    } else {
        controls.style.backgroundColor = '#f0f0f0';
        controls.style.borderBottomColor = '#ccc';
        controls.style.color = '#000000';
        
        // Style dropdowns for light theme
        [languageSelector, themeSelector].forEach(selector => {
            selector.style.backgroundColor = '#ffffff';
            selector.style.color = '#000000';
            selector.style.border = '1px solid #ccc';
        });
    }
}

export function setupThemeListeners(diffEditor) {
    const themeSelector = document.getElementById('theme-selector');
    
    // Add theme selector event listener
    themeSelector.addEventListener('change', (event) => {
        const selectedTheme = event.target.value;
        applyTheme(selectedTheme);
    });

    // Listen for system theme changes when 'system' is selected
    const systemThemeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    systemThemeMediaQuery.addEventListener('change', (event) => {
        // Only apply system theme change if user has 'system' selected
        if (themeSelector.value === 'system') {
            applyTheme('system');
        }
    });
}