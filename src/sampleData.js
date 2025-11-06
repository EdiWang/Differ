export const leftText = `Product Requirements Document
Version: 1.0
Last Updated: 2024-03-15

PROJECT OVERVIEW
The Monaco Diff Viewer is a web-based application for comparing text documents.

CORE FEATURES
- Side-by-side text comparison
- Basic syntax highlighting
- Theme selection (light/dark)

USER INTERFACE
The application consists of two panels:
- Left panel: Original document
- Right panel: Modified document

TECHNICAL REQUIREMENTS
- Browser: Chrome 90+, Firefox 88+
- No authentication required
- Maximum file size: 1MB

FUTURE CONSIDERATIONS
- May add line numbering
- Consider mobile support`;

export const rightText = `Product Requirements Document
Version: 2.0
Last Updated: 2024-11-06

PROJECT OVERVIEW
The Monaco Diff Viewer is a powerful web-based application for comparing 
text documents with advanced features and multi-language support.

CORE FEATURES
- Side-by-side text comparison with resizable panels
- Advanced syntax highlighting for multiple languages
- Theme selection (light/dark/system)
- Language selector (plaintext, JavaScript, TypeScript, JSON, HTML, CSS)
- Real-time diff detection
- Editable content in both panels

USER INTERFACE
The application consists of:
- Top control bar with language and theme selectors
- Left panel: Original document (editable)
- Right panel: Modified document (editable)
- Automatic layout adjustment

TECHNICAL REQUIREMENTS
- Browser: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- No authentication required
- Maximum file size: 10MB
- Web Workers support required
- Local storage for preferences

ACCESSIBILITY
- Keyboard navigation support
- Screen reader compatible
- High contrast mode available

FUTURE CONSIDERATIONS
- Export diff to various formats (PDF, HTML)
- Collaborative editing features
- Version history tracking
- Cloud storage integration`;