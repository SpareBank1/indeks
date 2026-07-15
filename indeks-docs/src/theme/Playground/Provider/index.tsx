import { type ReactNode } from 'react';
import OriginalPlaygroundProvider from '@theme-original/Playground/Provider';
import type { Props } from '@theme/Playground/Provider';

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
            `<textarea${attrs} defaultValue=${JSON.stringify(content.trim())}></textarea>`,
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

function htmlAttrsToJsx(code: string): string {
    const withAttrs = Object.entries(HTML_TO_JSX_ATTRS).reduce(
        (acc, [html, jsx]) => acc.replace(new RegExp(`\\b${html}`, 'g'), jsx),
        code
    );
    return inputAttrsToJsx(textareaChildrenToDefaultValue(withAttrs));
}

export default function PlaygroundProvider(props: Props): ReactNode {
    const transformCode = props.transformCode ?? ((code: string) => `${htmlAttrsToJsx(code)};`);
    return <OriginalPlaygroundProvider {...props} transformCode={transformCode} />;
}
