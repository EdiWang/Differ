/**
 * Sets up the view mode selector to switch between side-by-side and inline diff views
 * @param {monaco.editor.IStandaloneDiffEditor} diffEditor - The Monaco diff editor instance
 */
export function setupViewModeSelector(diffEditor) {
    const viewModeSelector = document.getElementById('view-mode-selector');
    
    if (!viewModeSelector) {
        console.error('View mode selector not found');
        return;
    }

    viewModeSelector.addEventListener('change', (event) => {
        const viewMode = event.target.value;
        applyViewMode(diffEditor, viewMode);
    });
}

/**
 * Applies the specified view mode to the diff editor
 * @param {monaco.editor.IStandaloneDiffEditor} diffEditor - The Monaco diff editor instance
 * @param {string} viewMode - Either 'side-by-side' or 'inline'
 */
export function applyViewMode(diffEditor, viewMode) {
    const renderSideBySide = viewMode === 'side-by-side';
    
    diffEditor.updateOptions({
        renderSideBySide: renderSideBySide
    });
}