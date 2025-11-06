import * as monaco from 'monaco-editor';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

// Configure Monaco Environment for web workers
self.MonacoEnvironment = {
    getWorker(_, label) {
        if (label === 'json') {
            return new jsonWorker();
        }
        if (label === 'css' || label === 'scss' || label === 'less') {
            return new cssWorker();
        }
        if (label === 'html' || label === 'handlebars' || label === 'razor') {
            return new htmlWorker();
        }
        if (label === 'typescript' || label === 'javascript') {
            return new tsWorker();
        }
        return new editorWorker();
    }
};

const leftText = `Flora

In gardens where the flowers bloom,
There walks a soul that light the room.
Flora, with grace like morning dew,
Each moment spent feels bright and new.

Her laughter dances on the breeze,
As gentle as the swaying trees.`;

const rightText = `Flora

In gardens where the flowers bloom,
There walks a soul that lights the room.
Flora, with grace like morning dew,
Each moment spent feels bright and new.

Her laughter dances on the breeze,
As gentle as the swaying trees.
Her smile, a sun that warms the day,
In her presence, worries fade away.

Like petals soft, her kindness shows,
A beauty that forever grows.`;

const diffEditor = monaco.editor.createDiffEditor(document.getElementById('container'), {
    enableSplitViewResizing: true,
    renderSideBySide: true,
    readOnly: false,
    originalEditable: true,
    automaticLayout: true
});

// Initialize with plain text language
diffEditor.setModel({
    original: monaco.editor.createModel(leftText, 'plaintext'),
    modified: monaco.editor.createModel(rightText, 'plaintext')
});

// Add language selector event listener
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