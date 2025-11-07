import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

/**
 * Worker label constants
 */
const WORKER_LABELS = {
    JSON: 'json',
    CSS: 'css',
    SCSS: 'scss',
    LESS: 'less',
    HTML: 'html',
    HANDLEBARS: 'handlebars',
    RAZOR: 'razor',
    TYPESCRIPT: 'typescript',
    JAVASCRIPT: 'javascript'
};

/**
 * Configures Monaco Editor web workers for syntax highlighting and IntelliSense
 * This must be called before creating any Monaco editor instances
 */
export function configureMonacoWorkers() {
    self.MonacoEnvironment = {
        /**
         * Gets the appropriate web worker for the specified language
         * @param {string} _ - Unused worker ID parameter
         * @param {string} label - Language/worker label
         * @returns {Worker} The appropriate web worker instance
         */
        getWorker(_, label) {
            switch (label) {
                case WORKER_LABELS.JSON:
                    return new jsonWorker();
                
                case WORKER_LABELS.CSS:
                case WORKER_LABELS.SCSS:
                case WORKER_LABELS.LESS:
                    return new cssWorker();
                
                case WORKER_LABELS.HTML:
                case WORKER_LABELS.HANDLEBARS:
                case WORKER_LABELS.RAZOR:
                    return new htmlWorker();
                
                case WORKER_LABELS.TYPESCRIPT:
                case WORKER_LABELS.JAVASCRIPT:
                    return new tsWorker();
                
                default:
                    return new editorWorker();
            }
        }
    };
}