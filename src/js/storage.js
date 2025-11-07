const STORAGE_KEY = 'differ-session';
const SESSION_VERSION = '1.0';

/**
 * Validates session data structure
 * @param {Object} session - Session data to validate
 * @returns {boolean} True if valid, false otherwise
 */
function isValidSession(session) {
    return session &&
        typeof session.originalText === 'string' &&
        typeof session.modifiedText === 'string' &&
        typeof session.language === 'string' &&
        typeof session.theme === 'string';
}

/**
 * Retrieves editor models safely
 * @param {monaco.editor.IStandaloneDiffEditor} diffEditor - The diff editor instance
 * @returns {Object|null} Models object or null if not available
 */
function getEditorModels(diffEditor) {
    try {
        return diffEditor?.getModel();
    } catch (error) {
        console.error('Failed to get editor models:', error);
        return null;
    }
}

/**
 * Saves the current editor session to localStorage
 * @param {monaco.editor.IStandaloneDiffEditor} diffEditor - The diff editor instance
 * @param {string} language - Current language setting
 * @param {string} theme - Current theme setting
 * @param {string} viewMode - Current view mode
 * @param {number} fontSize - Current font size
 */
export function saveSession(diffEditor, language, theme, viewMode = 'side-by-side', fontSize = 14) {
    try {
        const models = getEditorModels(diffEditor);
        if (!models) {
            console.warn('Cannot save session: No models available');
            return;
        }

        const session = {
            version: SESSION_VERSION,
            originalText: models.original.getValue(),
            modifiedText: models.modified.getValue(),
            language,
            theme,
            viewMode,
            fontSize,
            timestamp: new Date().toISOString()
        };

        const serialized = JSON.stringify(session);
        localStorage.setItem(STORAGE_KEY, serialized);
    } catch (error) {
        if (error.name === 'QuotaExceededError') {
            console.error('localStorage quota exceeded. Cannot save session.');
        } else {
            console.error('Failed to save session:', error);
        }
    }
}

/**
 * Loads a saved session from localStorage
 * @returns {Object|null} The saved session or null if not found/invalid
 */
export function loadSession() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return null;

        const session = JSON.parse(stored);
        
        if (!isValidSession(session)) {
            console.warn('Invalid session data found, clearing session');
            clearSession();
            return null;
        }
        
        return session;
    } catch (error) {
        console.error('Failed to load session:', error);
        clearSession(); // Clear corrupted data
        return null;
    }
}

/**
 * Clears the saved session from localStorage
 */
export function clearSession() {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.error('Failed to clear session:', error);
    }
}

/**
 * Creates a debounced save function
 * @param {Function} saveFunc - The save function to debounce
 * @param {number} delay - Debounce delay in milliseconds
 * @returns {Object} Object with debounced function and cleanup method
 */
function createDebouncedSave(saveFunc, delay) {
    let timeoutId = null;
    
    const debouncedFunc = () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        
        timeoutId = setTimeout(() => {
            saveFunc();
            timeoutId = null;
        }, delay);
    };
    
    const cleanup = () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }
    };
    
    return { debouncedFunc, cleanup };
}

/**
 * Sets up auto-save functionality with debouncing
 * @param {monaco.editor.IStandaloneDiffEditor} diffEditor - The diff editor instance
 * @param {Function} getLanguage - Function to get current language
 * @param {Function} getTheme - Function to get current theme
 * @param {Function} getViewMode - Function to get current view mode
 * @param {Function} getFontSize - Function to get current font size
 * @param {number} interval - Debounce interval in milliseconds
 * @returns {Function} Cleanup function to remove listeners
 */
export function setupAutoSave(diffEditor, getLanguage, getTheme, getViewMode, getFontSize, interval = 2000) {
    const saveFunc = () => {
        saveSession(
            diffEditor,
            getLanguage(),
            getTheme(),
            getViewMode(),
            getFontSize()
        );
    };
    
    const { debouncedFunc, cleanup: cleanupDebounce } = createDebouncedSave(saveFunc, interval);
    
    // Setup content change listeners
    const models = getEditorModels(diffEditor);
    const disposables = [];
    
    if (models) {
        disposables.push(models.original.onDidChangeContent(debouncedFunc));
        disposables.push(models.modified.onDidChangeContent(debouncedFunc));
    }

    // Save on beforeunload
    const beforeUnloadHandler = () => saveFunc();
    window.addEventListener('beforeunload', beforeUnloadHandler);

    // Return cleanup function
    return () => {
        cleanupDebounce();
        disposables.forEach(disposable => disposable.dispose());
        window.removeEventListener('beforeunload', beforeUnloadHandler);
    };
}