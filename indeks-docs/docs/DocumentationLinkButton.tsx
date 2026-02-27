import Link from '@docusaurus/Link';
import { Icon } from '@sb1/indeks-react';
import React from 'react';
import './documentation-link-button.css';

interface DocumentationLinkButtonProps {
    href: string;
    linkText: string;
}

export const DocumentationLinkButton: React.FC<DocumentationLinkButtonProps> = ({ href, linkText }) => {
    return (
        <div className="documentation-link-button">
            <div>
                <Link to={href}>{linkText}</Link>
            </div>
            <Icon materialDesignName="chevron_forward" size="md" className="ix-ml-sm" />
        </div>
    );
};

export default DocumentationLinkButton;
