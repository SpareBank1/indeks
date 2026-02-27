import { HStack } from '@sb1/indeks-react';
import React from 'react';
import { Link } from 'react-router-dom';


interface MenuItem {
    path: string;
    label: string;
}

interface SubMenuProps {
    menuItems: MenuItem[];
    basePath: string;
}

export const SubMenu: React.FC<SubMenuProps> = ({ menuItems, basePath }) => {
    const [activePage, setActivePage] = React.useState<string>(`${basePath}/${menuItems[0].path}`);
    const linkStyles = (path: string) => ({
        color:
            activePage === path
                ? 'var(--ix-color-foreground-interactive-active)'
                : 'var(--ix-color-foreground-main-subtle)',
    });

    return (
        <HStack justifyContent="center" fullWidth>
            {menuItems.map(({ path, label }) => {
                const fullPath = `${basePath}/${path}`;
                return (
                    <Link
                        key={path}
                        to={fullPath}
                        style={linkStyles(fullPath)}
                        onClick={() => setActivePage(fullPath)}
                        className={activePage === fullPath ? 'ix-underline' : ''}
                    >
                        {label}
                    </Link>
                );
            })}
        </HStack>
    );
};
