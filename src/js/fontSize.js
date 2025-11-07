import { updateEditorOptions } from './editor.js';

/**
 * Setup font size selector and event listener
 * @param {monaco.editor.IStandaloneDiffEditor} diffEditor - The diff editor instance
 */
export function setupFontSizeSelector(diffEditor) {
    const fontSizeSelector = document.getElementById('font-size-selector');
    
    if (!fontSizeSelector) {
        console.error('Font size selector element not found');
        return;
    }
    
    fontSizeSelector.addEventListener('change', (event) => {
        const fontSize = parseInt(event.target.value, 10);
        updateEditorOptions(diffEditor, { fontSize });
    });
}

/**
 * Apply font size to the editor
 * @param {monaco.editor.IStandaloneDiffEditor} diffEditor - The diff editor instance
 * @param {number} fontSize - Font size value
 */
export function applyFontSize(diffEditor, fontSize) {
    if (!diffEditor) {
        console.error('Diff editor instance is required');
        return;
    }
    
    const validFontSize = Math.min(Math.max(fontSize, 14), 20);
    updateEditorOptions(diffEditor, { fontSize: validFontSize });
}