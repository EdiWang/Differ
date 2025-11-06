const STORAGE_KEY = 'differ-session';

export function saveSession(diffEditor, language, theme, viewMode = 'side-by-side') {
    try {
        const models = diffEditor.getModel();
        if (!models) return;

        const session = {
            originalText: models.original.getValue(),
            modifiedText: models.modified.getValue(),
            language: language,
            theme: theme,
            viewMode: viewMode,
            timestamp: new Date().toISOString()
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } catch (error) {
        console.error('Failed to save session:', error);
    }
}

export function loadSession() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return null;

        return JSON.parse(stored);
    } catch (error) {
        console.error('Failed to load session:', error);
        return null;
    }
}

export function clearSession() {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.error('Failed to clear session:', error);
    }
}

export function setupAutoSave(diffEditor, getLanguage, getTheme, getViewMode, interval = 2000) {
    // Save on content change with debouncing
    let saveTimeout;
    const debouncedSave = () => {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
            const language = getLanguage();
            const theme = getTheme();
            const viewMode = getViewMode();
            saveSession(diffEditor, language, theme, viewMode);
        }, interval);
    };

    // Listen to content changes in both editors
    const models = diffEditor.getModel();
    if (models) {
        models.original.onDidChangeContent(debouncedSave);
        models.modified.onDidChangeContent(debouncedSave);
    }

    // Save on beforeunload
    window.addEventListener('beforeunload', () => {
        const language = getLanguage();
        const theme = getTheme();
        const viewMode = getViewMode();
        saveSession(diffEditor, language, theme, viewMode);
    });

    return () => clearTimeout(saveTimeout);
}