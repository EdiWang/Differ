// View mode constants
const VIEW_MODES = {
    SIDE_BY_SIDE: 'side-by-side',
    INLINE: 'inline'
};

/**
 * Validates view mode value
 * @param {string} viewMode - The view mode to validate
 * @returns {boolean} True if valid, false otherwise
 */
function isValidViewMode(viewMode) {
    return Object.values(VIEW_MODES).includes(viewMode);
}

/**
 * Sets up the view mode radio buttons to switch between side-by-side and inline diff views
 * @param {monaco.editor.IStandaloneDiffEditor} diffEditor - The Monaco diff editor instance
 */
export function setupViewModeSelector(diffEditor) {
    const viewModeRadios = document.querySelectorAll('input[name="view-mode"]');
    
    if (viewModeRadios.length === 0) {
        console.error('View mode radio buttons not found');
        return;
    }

    viewModeRadios.forEach(radio => {
        radio.addEventListener('change', (event) => {
            if (event.target.checked) {
                const viewMode = event.target.value;
                
                if (isValidViewMode(viewMode)) {
                    applyViewMode(diffEditor, viewMode);
                } else {
                    console.error(`Invalid view mode: ${viewMode}`);
                }
            }
        });
    });
}

/**
 * Applies the specified view mode to the diff editor
 * @param {monaco.editor.IStandaloneDiffEditor} diffEditor - The Monaco diff editor instance
 * @param {string} viewMode - Either 'side-by-side' or 'inline'
 */
export function applyViewMode(diffEditor, viewMode) {
    if (!diffEditor) {
        console.error('Diff editor instance is required');
        return;
    }
    
    if (!isValidViewMode(viewMode)) {
        console.error(`Invalid view mode: ${viewMode}`);
        return;
    }
    
    const renderSideBySide = viewMode === VIEW_MODES.SIDE_BY_SIDE;
    
    diffEditor.updateOptions({
        renderSideBySide
    });
}

// Export constants for external use
export { VIEW_MODES };