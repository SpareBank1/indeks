import React, { useState } from 'react';
import { glossary, GlossaryTerm } from '../data/glossary';
import styles from './Term.module.css';

interface TermProps {
    children: GlossaryTerm;
}

export default function Term({ children }: TermProps) {
    const [visible, setVisible] = useState(false);
    const entry = glossary[children];

    return (
        <a
            href={`/docs/ordbok#${children}`}
            className={styles.term}
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
            onFocus={() => setVisible(true)}
            onBlur={() => setVisible(false)}
        >
            {children}
            {visible && (
                <span className={styles.tooltip} role="tooltip">
                    {entry.short}
                </span>
            )}
        </a>
    );
}
