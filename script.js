// AquaSync Documentation Interactive Features

document.addEventListener('DOMContentLoaded', () => {
    // Navigation active state handling
    initNavigation();
    
    // Copy button functionality
    initCopyButtons();
    
    // Smooth scroll for anchor links
    initSmoothScroll();
    
    // Syntax highlighting
    initSyntaxHighlighting();
});

/**
 * Initialize navigation highlighting based on scroll position
 */
function initNavigation() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    // Intersection Observer for section visibility
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                updateActiveNav(id);
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // Click handler for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
}

/**
 * Update active navigation link
 */
function updateActiveNav(sectionId) {
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
        }
    });
}

/**
 * Initialize copy-to-clipboard functionality for code blocks
 */
function initCopyButtons() {
    const copyButtons = document.querySelectorAll('.copy-btn');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const codeBlock = button.closest('.code-block');
            const code = codeBlock.querySelector('code');
            
            // Get raw text without HTML tags
            const rawText = code.textContent;
            
            try {
                await navigator.clipboard.writeText(rawText);
                
                // Visual feedback
                const originalText = button.textContent;
                button.textContent = 'Copied!';
                button.style.background = 'rgba(16, 185, 129, 0.3)';
                
                setTimeout(() => {
                    button.textContent = originalText;
                    button.style.background = '';
                }, 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
                button.textContent = 'Error';
                setTimeout(() => {
                    button.textContent = 'Copy';
                }, 2000);
            }
        });
    });
}

/**
 * Initialize smooth scrolling for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update URL without triggering scroll
                history.pushState(null, null, this.getAttribute('href'));
            }
        });
    });
}

/**
 * Simple syntax highlighting for code blocks
 */
function initSyntaxHighlighting() {
    const codeBlocks = document.querySelectorAll('.code-block code');
    
    codeBlocks.forEach(block => {
        const lang = detectLanguage(block);
        block.innerHTML = highlightCode(block.textContent, lang);
    });
}

/**
 * Detect language from parent code-header or content
 */
function detectLanguage(block) {
    const header = block.closest('.code-block')?.querySelector('.code-header span');
    const headerText = header?.textContent?.toLowerCase() || '';
    
    if (headerText.includes('javascript') || headerText.includes('evalscript')) return 'javascript';
    if (headerText.includes('python')) return 'python';
    if (headerText.includes('sql') || headerText.includes('postgis')) return 'sql';
    if (headerText.includes('json')) return 'json';
    if (headerText.includes('bash') || headerText.includes('terminal')) return 'bash';
    
    // Auto-detect from content
    const content = block.textContent;
    if (content.includes('function ') || content.includes('const ') || content.includes('let ')) return 'javascript';
    if (content.includes('import ') && content.includes('def ')) return 'python';
    if (content.includes('SELECT ') || content.includes('CREATE TABLE')) return 'sql';
    if (content.trim().startsWith('{') || content.trim().startsWith('[')) return 'json';
    
    return 'generic';
}

/**
 * Apply syntax highlighting based on language
 */
function highlightCode(code, lang) {
    // Escape HTML first
    let escaped = code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    
    switch(lang) {
        case 'javascript':
            return highlightJavaScript(escaped);
        case 'python':
            return highlightPython(escaped);
        case 'sql':
            return highlightSQL(escaped);
        case 'json':
            return highlightJSON(escaped);
        case 'bash':
            return highlightBash(escaped);
        default:
            return highlightGeneric(escaped);
    }
}

function highlightJavaScript(code) {
    // Comments (single line and multi-line)
    code = code.replace(/(\/\/.*$)/gm, '<span class="comment">$1</span>');
    code = code.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="comment">$1</span>');
    
    // Strings (double and single quotes, template literals)
    code = code.replace(/("(?:[^"\\]|\\.)*")/g, '<span class="string">$1</span>');
    code = code.replace(/('(?:[^'\\]|\\.)*')/g, '<span class="string">$1</span>');
    code = code.replace(/(`(?:[^`\\]|\\.)*`)/g, '<span class="string">$1</span>');
    
    // Keywords
    const jsKeywords = /\b(const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|new|this|class|extends|import|export|from|async|await|try|catch|throw|typeof|instanceof|in|of|true|false|null|undefined)\b/g;
    code = code.replace(jsKeywords, '<span class="keyword">$1</span>');
    
    // Numbers
    code = code.replace(/\b(\d+\.?\d*)\b/g, '<span class="number">$1</span>');
    
    // Function calls
    code = code.replace(/\b([a-zA-Z_]\w*)\s*\(/g, '<span class="function">$1</span>(');
    
    return code;
}

function highlightPython(code) {
    // Comments
    code = code.replace(/(#.*$)/gm, '<span class="comment">$1</span>');
    
    // Docstrings and strings
    code = code.replace(/("""[\s\S]*?""")/g, '<span class="string">$1</span>');
    code = code.replace(/('''[\s\S]*?''')/g, '<span class="string">$1</span>');
    code = code.replace(/("(?:[^"\\]|\\.)*")/g, '<span class="string">$1</span>');
    code = code.replace(/('(?:[^'\\]|\\.)*')/g, '<span class="string">$1</span>');
    
    // Keywords
    const pyKeywords = /\b(def|class|return|if|elif|else|for|while|break|continue|import|from|as|try|except|raise|with|lambda|yield|global|nonlocal|pass|True|False|None|and|or|not|in|is|async|await)\b/g;
    code = code.replace(pyKeywords, '<span class="keyword">$1</span>');
    
    // Built-in functions
    const pyBuiltins = /\b(print|len|range|str|int|float|list|dict|set|tuple|open|input|type|isinstance|hasattr|getattr|setattr)\b/g;
    code = code.replace(pyBuiltins, '<span class="function">$1</span>');
    
    // Numbers
    code = code.replace(/\b(\d+\.?\d*)\b/g, '<span class="number">$1</span>');
    
    // Decorators
    code = code.replace(/(@\w+)/g, '<span class="keyword">$1</span>');
    
    return code;
}

function highlightSQL(code) {
    // Comments
    code = code.replace(/(--.*$)/gm, '<span class="comment">$1</span>');
    
    // Strings
    code = code.replace(/('(?:[^'\\]|\\.)*')/g, '<span class="string">$1</span>');
    
    // Keywords (case-insensitive)
    const sqlKeywords = /\b(SELECT|FROM|WHERE|AND|OR|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|TABLE|INDEX|PRIMARY|KEY|FOREIGN|REFERENCES|JOIN|LEFT|RIGHT|INNER|OUTER|ON|AS|ORDER|BY|GROUP|HAVING|LIMIT|OFFSET|DISTINCT|COUNT|SUM|AVG|MAX|MIN|NOT|NULL|DEFAULT|SERIAL|TEXT|INTEGER|FLOAT|BOOLEAN|TIMESTAMPTZ|GEOMETRY|USING|GIST|EXISTS|IN|LIKE|BETWEEN)\b/gi;
    code = code.replace(sqlKeywords, '<span class="keyword">$1</span>');
    
    // PostGIS functions
    const postgisFuncs = /\b(ST_Intersects|ST_Contains|ST_Within|ST_Area|ST_Intersection|ST_SetSRID|ST_MakePoint|ST_DWithin|ST_Buffer|ST_Transform|ST_AsText|ST_GeomFromText)\b/g;
    code = code.replace(postgisFuncs, '<span class="function">$1</span>');
    
    // Numbers
    code = code.replace(/\b(\d+\.?\d*)\b/g, '<span class="number">$1</span>');
    
    return code;
}

function highlightJSON(code) {
    // Property keys
    code = code.replace(/"([^"]+)"(\s*:)/g, '<span class="variable">"$1"</span>$2');
    
    // String values
    code = code.replace(/:(\s*)"([^"]*)"/g, ':$1<span class="string">"$2"</span>');
    
    // Numbers
    code = code.replace(/:(\s*)(\d+\.?\d*)/g, ':$1<span class="number">$2</span>');
    
    // Booleans and null
    code = code.replace(/\b(true|false|null)\b/g, '<span class="keyword">$1</span>');
    
    return code;
}

function highlightBash(code) {
    // Comments
    code = code.replace(/(#.*$)/gm, '<span class="comment">$1</span>');
    
    // Strings
    code = code.replace(/("(?:[^"\\]|\\.)*")/g, '<span class="string">$1</span>');
    code = code.replace(/('(?:[^'\\]|\\.)*')/g, '<span class="string">$1</span>');
    
    // Commands at start of line or after pipe/semicolon
    const bashCommands = /\b(git|npm|python|pip|node|curl|wget|cd|ls|mkdir|rm|cp|mv|cat|echo|export|source|chmod|sudo|apt|brew|docker|kubectl)\b/g;
    code = code.replace(bashCommands, '<span class="function">$1</span>');
    
    // Flags
    code = code.replace(/(\s)(--?[\w-]+)/g, '$1<span class="variable">$2</span>');
    
    return code;
}

function highlightGeneric(code) {
    // Comments
    code = code.replace(/(#.*$)/gm, '<span class="comment">$1</span>');
    code = code.replace(/(\/\/.*$)/gm, '<span class="comment">$1</span>');
    
    // Strings
    code = code.replace(/("(?:[^"\\]|\\.)*")/g, '<span class="string">$1</span>');
    code = code.replace(/('(?:[^'\\]|\\.)*')/g, '<span class="string">$1</span>');
    
    // Numbers
    code = code.replace(/\b(\d+\.?\d*)\b/g, '<span class="number">$1</span>');
    
    // Arrows and operators
    code = code.replace(/(→|─|│|┌|┐|└|┘|├|┤|▼|▲)/g, '<span class="operator">$1</span>');
    
    return code;
}

/**
 * Toggle mobile sidebar (for responsive design)
 */
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('open');
}

/**
 * Theme toggle (optional dark/light mode)
 */
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
}

// Load saved theme preference
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-theme');
}

// Console welcome message for developers
console.log(`
🌊 AquaSync Developer Documentation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Space-to-Citizen Water Quality Monitoring

EU Space Infrastructure:
• Copernicus (Sentinel-1, 2, 3)
• Galileo HAS + OSNMA
• CDSE APIs
`);
