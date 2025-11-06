import * as monaco from 'monaco-editor';

export function createDiffEditor(containerId, initialLanguage = 'plaintext') {
    const diffEditor = monaco.editor.createDiffEditor(document.getElementById(containerId), {
        enableSplitViewResizing: true,
        renderSideBySide: true,
        readOnly: false,
        originalEditable: true,
        automaticLayout: true
    });

    return diffEditor;
}

export function initializeDiffEditor(diffEditor, leftText, rightText, language = 'plaintext') {
    diffEditor.setModel({
        original: monaco.editor.createModel(leftText, language),
        modified: monaco.editor.createModel(rightText, language)
    });
}