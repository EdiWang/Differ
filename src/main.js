import * as monaco from 'monaco-editor';

const originalCode = `function hello() {
    console.log("Hello World");
}`;

const modifiedCode = `function hello() {
    console.log("Hello Monaco Editor");
    console.log("Diff Editor Example");
}`;

const diffEditor = monaco.editor.createDiffEditor(document.getElementById('container'), {
    enableSplitViewResizing: true,
    renderSideBySide: true,
    readOnly: false,
    automaticLayout: true,
    theme: 'vs-dark'
});

diffEditor.setModel({
    original: monaco.editor.createModel(originalCode, 'javascript'),
    modified: monaco.editor.createModel(modifiedCode, 'javascript')
});