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
 * Sets up the view mode toggle buttons to switch between side-by-side and inline diff views
 * @param {monaco.editor.IStandaloneDiffEditor} diffEditor - The Monaco diff editor instance
 */
export function setupViewModeSelector(diffEditor) {
    const viewModeToggle = document.getElementById('view-mode-toggle');
    
    if (!viewModeToggle) {
        console.error('View mode toggle not found');
        return;
    }

    const toggleOptions = viewModeToggle.querySelectorAll('.toggle-option');
    
    if (toggleOptions.length === 0) {
        console.error('View mode toggle options not found');
        return;
    }

    toggleOptions.forEach(option => {
        option.addEventListener('click', () => {
            const viewMode = option.dataset.value;
            
            if (isValidViewMode(viewMode)) {
                // Remove active class from all options
                toggleOptions.forEach(opt => {
                    opt.classList.remove('active');
                    opt.setAttribute('aria-pressed', 'false');
                });
                
                // Add active class to clicked option
                option.classList.add('active');
                option.setAttribute('aria-pressed', 'true');
                
                // Apply the view mode
                applyViewMode(diffEditor, viewMode);
            } else {
                console.error(`Invalid view mode: ${viewMode}`);
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