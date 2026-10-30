import { describe, expect, it } from 'vitest';
import { cssToStyleObject, htmlAttrsToJsx } from './htmlToJsx';

describe('htmlAttrsToJsx', () => {
    it('oversetter class og for', () => {
        expect(htmlAttrsToJsx('<label class="a" for="b"></label>')).toBe('<label className="a" htmlFor="b"></label>');
    });

    it('gjør value og checked på input ukontrollert', () => {
        expect(htmlAttrsToJsx('<input value="x" />')).toBe('<input defaultValue="x" />');
        expect(htmlAttrsToJsx('<input type="checkbox" value="x" checked />')).toBe(
            '<input type="checkbox" value="x" defaultChecked />'
        );
    });

    it('oversetter style-streng til objekt', () => {
        expect(htmlAttrsToJsx('<div style="max-width: 350px"></div>')).toBe('<div style={{"maxWidth":"350px"}}></div>');
    });

    it('oversetter style med enkle anførselstegn og over flere linjer', () => {
        expect(htmlAttrsToJsx("<div style='color: red;\n  margin: 0'></div>")).toBe(
            '<div style={{"color":"red","margin":"0"}}></div>'
        );
    });

    it('lar style-objekt i JSX stå urørt', () => {
        const jsx = "<div style={{ maxWidth: '350px' }}></div>";
        expect(htmlAttrsToJsx(jsx)).toBe(jsx);
    });
});

describe('cssToStyleObject', () => {
    it('beholder custom properties og url med anførselstegn', () => {
        expect(cssToStyleObject("--ii-icon-url: url('https://cdn.sparebank1.no/icons/home.svg')")).toEqual({
            '--ii-icon-url': "url('https://cdn.sparebank1.no/icons/home.svg')",
        });
    });

    it('camelCaser prefiks som React forventer', () => {
        expect(cssToStyleObject('-webkit-mask-image: url(a.svg); -ms-flex: 1')).toEqual({
            WebkitMaskImage: 'url(a.svg)',
            msFlex: '1',
        });
    });

    it('deler ikke på semikolon inne i url()', () => {
        expect(cssToStyleObject('background: url(data:image/svg+xml;base64,AAA=); color: red;')).toEqual({
            background: 'url(data:image/svg+xml;base64,AAA=)',
            color: 'red',
        });
    });
});
