import * as monaco from 'monaco-editor';

/**
 * Updates the editor language while preserving content
 * @param {monaco.editor.IStandaloneDiffEditor} diffEditor - The diff editor instance
 * @param {string} language - The language identifier
 */
function updateEditorLanguage(diffEditor, language) {
    const models = diffEditor.getModel();
    if (!models) {
        console.error('No models found in diff editor');
        return;
    }
    
    const originalModel = models.original;
    const modifiedModel = models.modified;
    
    // Get current content
    const originalContent = originalModel.getValue();
    const modifiedContent = modifiedModel.getValue();

    // Create new models with the selected language
    const newOriginalModel = monaco.editor.createModel(originalContent, language);
    const newModifiedModel = monaco.editor.createModel(modifiedContent, language);
    
    // Set new models
    diffEditor.setModel({
        original: newOriginalModel,
        modified: newModifiedModel
    });

    // Dispose old models to prevent memory leaks
    originalModel.dispose();
    modifiedModel.dispose();
}

/**
 * Setup language selector event listener
 * @param {monaco.editor.IStandaloneDiffEditor} diffEditor - The diff editor instance
 */
export function setupLanguageSelector(diffEditor) {
    const languageSelector = document.getElementById('language-selector');
    
    if (!languageSelector) {
        console.error('Language selector element not found');
        return;
    }
    
    languageSelector.addEventListener('change', (event) => {
        const selectedLanguage = event.target.value;
        updateEditorLanguage(diffEditor, selectedLanguage);
    });
}