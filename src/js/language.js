import * as monaco from 'monaco-editor';

export function setupLanguageSelector(diffEditor) {
    const languageSelector = document.getElementById('language-selector');
    
    languageSelector.addEventListener('change', (event) => {
        const selectedLanguage = event.target.value;

        // Get current content from both editors
        const originalModel = diffEditor.getOriginalEditor().getModel();
        const modifiedModel = diffEditor.getModifiedEditor().getModel();
        const originalContent = originalModel.getValue();
        const modifiedContent = modifiedModel.getValue();

        // Create new models with the selected language
        diffEditor.setModel({
            original: monaco.editor.createModel(originalContent, selectedLanguage),
            modified: monaco.editor.createModel(modifiedContent, selectedLanguage)
        });

        // Dispose old models to prevent memory leaks
        originalModel.dispose();
        modifiedModel.dispose();
    });
}