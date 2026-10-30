// Map lowercase HTML attributes to their JSX equivalents so live HTML examples
// don't trigger React "Invalid DOM property" warnings through sucrase.
const HTML_TO_JSX_ATTRS: Record<string, string> = {
    'class=': 'className=',
    'maxlength=': 'maxLength=',
    'minlength=': 'minLength=',
    'autocomplete=': 'autoComplete=',
    'readonly=': 'readOnly=',
    'inputmode=': 'inputMode=',
    'tabindex=': 'tabIndex=',
    'autofocus=': 'autoFocus=',
    'colspan=': 'colSpan=',
    'rowspan=': 'rowSpan=',
    'for=': 'htmlFor=',
};

// <textarea ...>text</textarea> → <textarea ... defaultValue="text"></textarea>
// Valid HTML but React warns about children on textarea.
function textareaChildrenToDefaultValue(code: string): string {
    return code.replace(
        /<textarea(\s[^>]*)?>([^<]+)<\/textarea>/g,
        (_, attrs = '', content: string) =>
            `<textarea${attrs} defaultValue=${JSON.stringify(content.trim())}></textarea>`
    );
}

// Real HTML <input> attributes that make a live (React) example non-interactive:
// `value` on a text input without onChange renders read-only, and `checked`
// without onChange can't be toggled. Rewrite them to the uncontrolled React
// equivalents — but only on literal <input> tags, so React component props like
// `<CheckboxButton value="…">` and `<option value="…">` are left untouched. On
// radio/checkbox, `value` is the submit identity (not the field text), so only
// `checked` is converted there.
function inputAttrsToJsx(code: string): string {
    return code.replace(/<input\b[^>]*\/?>/g, (tag) => {
        let out = tag
            .replace(/(\s)checked(?=[\s/>])/g, '$1defaultChecked')
            // bare boolean `readonly` (the `readonly=`/`readonly="…"` form is
            // already handled by the attribute map above)
            .replace(/(\s)readonly(?=[\s/>])/g, '$1readOnly');
        const isChoice = /\btype\s*=\s*["'](?:radio|checkbox)["']/.test(tag);
        if (!isChoice) {
            out = out.replace(/(\s)value=/g, '$1defaultValue=');
        }
        return out;
    });
}

export function htmlAttrsToJsx(code: string): string {
    const withAttrs = Object.entries(HTML_TO_JSX_ATTRS).reduce(
        (acc, [html, jsx]) => acc.replace(new RegExp(`\\b${html}`, 'g'), jsx),
        code
    );
    return styleStringToObject(inputAttrsToJsx(textareaChildrenToDefaultValue(withAttrs)));
}

// Splitter på `;` utenfor parenteser og anførselstegn, så `url(data:…;base64,…)`
// ikke deles.
function splitDeclarations(css: string): string[] {
    const parts: string[] = [];
    let depth = 0;
    let quote: string | null = null;
    let current = '';
    for (const ch of css) {
        if (quote) {
            if (ch === quote) quote = null;
        } else if (ch === '"' || ch === "'") {
            quote = ch;
        } else if (ch === '(') {
            depth++;
        } else if (ch === ')') {
            depth--;
        } else if (ch === ';' && depth === 0) {
            parts.push(current);
            current = '';
            continue;
        }
        current += ch;
    }
    parts.push(current);
    return parts;
}

// Custom properties beholdes som de er. Ellers camelCase som React forventer:
// -webkit-mask-image → WebkitMaskImage, men -ms-… → ms… (Reacts unntak).
function cssPropertyToJsx(name: string): string {
    if (name.startsWith('--')) return name;
    return name.replace(/^-ms-/, 'ms-').replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
}

export function cssToStyleObject(css: string): Record<string, string> {
    const style: Record<string, string> = {};
    for (const declaration of splitDeclarations(css)) {
        const colon = declaration.indexOf(':');
        if (colon === -1) continue;
        const name = declaration.slice(0, colon).trim();
        const value = declaration.slice(colon + 1).trim();
        if (name && value) style[cssPropertyToJsx(name)] = value;
    }
    return style;
}

// style="color: red" → style={{"color":"red"}}. React krasjer på style som streng.
function styleStringToObject(code: string): string {
    return code.replace(
        /(\s)style=(["'])([\s\S]*?)\2/g,
        (_, space: string, _quote: string, css: string) => `${space}style={${JSON.stringify(cssToStyleObject(css))}}`
    );
}
