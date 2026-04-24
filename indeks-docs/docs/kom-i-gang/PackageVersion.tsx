import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

type Pkg = 'css' | 'react' | 'web' | 'tokens' | 'utils';

export const PackageVersion = ({ pkg }: { pkg: Pkg }) => {
    const { siteConfig } = useDocusaurusContext();
    return <>{siteConfig.customFields?.[`${pkg}Version`] as string}</>;
};

export const CssVersion = () => <PackageVersion pkg="css" />;
export const ReactVersion = () => <PackageVersion pkg="react" />;
export const WebVersion = () => <PackageVersion pkg="web" />;
export const TokensVersion = () => <PackageVersion pkg="tokens" />;
export const UtilsVersion = () => <PackageVersion pkg="utils" />;
