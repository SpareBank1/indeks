import { Tag } from '@sb1/indeks-react';
import React from 'react';
import rader from './ffe-farger.json';

/* Avstand i OKLab. Rundt 0,02 er så vidt synlig, over 0,1 ser de tydelig forskjellige ut. */
const MERKBART = 0.1;

type Rad = {
    ffe: string;
    ix: string | null;
    ffeLys: string;
    ffeMork: string;
    ixLys?: string;
    ixMork?: string;
    avvikLys?: number;
    avvikMork?: number;
};

const bakgrunn = (rader as Rad[]).find((r) => r.ffe === '--ffe-color-background-default')!;

/* Gjennomsiktige farger vises over bakgrunnen til sitt eget system og sin egen modus. */
function Prove({ navn, hex, bak }: { navn: string; hex: string; bak: string }) {
    return (
        <div className="ix-flex ix-items-center ix-gap-xs">
            <span className="ix-font-size-xs" style={{ minWidth: '3.5em' }}>
                {navn}
            </span>
            <span
                aria-hidden
                style={{
                    display: 'inline-block',
                    width: '1.25rem',
                    height: '1.25rem',
                    flexShrink: 0,
                    background: `linear-gradient(${hex}, ${hex}), ${bak}`,
                    border: '1px solid var(--ix-color-border-main-default)',
                    borderRadius: 'var(--ix-border-radius-sm)',
                }}
            />
            <code className="ix-font-size-xs">{hex}</code>
        </div>
    );
}

function Modus({ ffe, ix, avvik, mork }: { ffe: string; ix?: string; avvik?: number; mork?: boolean }) {
    return (
        <div className="ix-flex ix-flex-col ix-gap-2xs">
            <Prove navn="FFE" hex={ffe} bak={mork ? bakgrunn.ffeMork : bakgrunn.ffeLys} />
            {ix && <Prove navn="Indeks" hex={ix} bak={(mork ? bakgrunn.ixMork : bakgrunn.ixLys)!} />}
            {avvik !== undefined && avvik > MERKBART && (
                <div>
                    <Tag variant="warning" type="subtle" size="sm">
                        Merkbart avvik
                    </Tag>
                </div>
            )}
        </div>
    );
}

export function FfeMigreringTabell() {
    return (
        <table>
            <thead>
                <tr>
                    <th scope="col">FFE-token</th>
                    <th scope="col">Indeks-token</th>
                    <th scope="col">Lys modus</th>
                    <th scope="col">Mørk modus</th>
                </tr>
            </thead>
            <tbody>
                {(rader as Rad[]).map((r) => (
                    <tr key={r.ffe}>
                        <td>
                            <code className="ix-font-size-xs">{r.ffe}</code>
                        </td>
                        <td>{r.ix ? <code className="ix-font-size-xs">{r.ix}</code> : <span>Ingen</span>}</td>
                        <td>
                            <Modus ffe={r.ffeLys} ix={r.ixLys} avvik={r.avvikLys} />
                        </td>
                        <td>
                            <Modus ffe={r.ffeMork} ix={r.ixMork} avvik={r.avvikMork} mork />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
