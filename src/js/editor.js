import * as monaco from 'monaco-editor';

/**
 * Default configuration options for the diff editor
 */
const DEFAULT_EDITOR_OPTIONS = {
    enableSplitViewResizing: true,
    renderSideBySide: true,
    readOnly: false,
    originalEditable: true,
    automaticLayout: true,
    scrollBeyondLastLine: false,
    minimap: { enabled: false },
    fontSize: 14,
    lineNumbers: 'on',
    renderWhitespace: 'selection',
    wordWrap: 'off'
};

/**
 * Creates a Monaco diff editor instance
 * @param {string} containerId - The ID of the container element
 * @param {Object} options - Additional editor options to override defaults
 * @returns {monaco.editor.IStandaloneDiffEditor} The created diff editor instance
 */
export function createDiffEditor(containerId, options = {}) {
    const container = document.getElementById(containerId);
    
    if (!container) {
        throw new Error(`Container element with id "${containerId}" not found`);
    }
    
    const editorOptions = { ...DEFAULT_EDITOR_OPTIONS, ...options };
    
    const diffEditor = monaco.editor.createDiffEditor(container, editorOptions);
    
    return diffEditor;
}

/**
 * Disposes existing models if present
 * @param {monaco.editor.IStandaloneDiffEditor} diffEditor - The diff editor instance
 */
function disposeExistingModels(diffEditor) {
    const existingModels = diffEditor.getModel();
    if (existingModels) {
        existingModels.original?.dispose();
        existingModels.modified?.dispose();
    }
}

/**
 * Initializes the diff editor with content
 * @param {monaco.editor.IStandaloneDiffEditor} diffEditor - The diff editor instance
 * @param {string} leftText - Content for the original (left) editor
 * @param {string} rightText - Content for the modified (right) editor
 * @param {string} language - Language identifier for syntax highlighting
 */
export function initializeDiffEditor(
    diffEditor,
    leftText,
    rightText,
    language = 'plaintext'
) {
    // Clean up existing models to prevent memory leaks
    disposeExistingModels(diffEditor);
    
    // Create new models
    const originalModel = monaco.editor.createModel(leftText, language);
    const modifiedModel = monaco.editor.createModel(rightText, language);
    
    // Set the models
    diffEditor.setModel({
        original: originalModel,
        modified: modifiedModel
    });
}

/**
 * Updates editor options dynamically
 * @param {monaco.editor.IStandaloneDiffEditor} diffEditor - The diff editor instance
 * @param {Object} options - Options to update
 */
export function updateEditorOptions(diffEditor, options) {
    if (!diffEditor) {
        console.error('Diff editor instance is required');
        return;
    }
    
    diffEditor.updateOptions(options);
}