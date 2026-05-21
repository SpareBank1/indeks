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

function htmlAttrsToJsx(code: string): string {
    const withAttrs = Object.entries(HTML_TO_JSX_ATTRS).reduce(
        (acc, [html, jsx]) => acc.replace(new RegExp(`\\b${html}`, 'g'), jsx),
        code
    );
    return textareaChildrenToDefaultValue(withAttrs);
}

export default function PlaygroundProvider(props: Props): ReactNode {
    const transformCode = props.transformCode ?? ((code: string) => `${htmlAttrsToJsx(code)};`);
    return <OriginalPlaygroundProvider {...props} transformCode={transformCode} />;
}
