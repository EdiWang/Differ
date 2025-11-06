import { configureMonacoWorkers } from './workers.js';
import { leftText, rightText } from './sampleData.js';
import { applyTheme, setupThemeListeners } from './theme.js';
import { setupLanguageSelector } from './language.js';
import { createDiffEditor, initializeDiffEditor } from './editor.js';

// Configure Monaco Environment for web workers
configureMonacoWorkers();

// Create and initialize the diff editor
const diffEditor = createDiffEditor('container');
initializeDiffEditor(diffEditor, leftText, rightText, 'plaintext');

// Apply initial theme (system)
applyTheme('system');

// Setup event listeners
setupLanguageSelector(diffEditor);
setupThemeListeners(diffEditor);