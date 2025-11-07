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
                applyViewMode(diffEditor, viewMode);
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
    const renderSideBySide = viewMode === 'side-by-side';
    
    diffEditor.updateOptions({
        renderSideBySide: renderSideBySide
    });
}