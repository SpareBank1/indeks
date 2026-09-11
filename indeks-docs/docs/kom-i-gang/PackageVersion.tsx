import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

type Pkg = 'css' | 'react' | 'web' | 'tokens' | 'utils';

export const usePackageVersion = (pkg: Pkg): string => {
    const { siteConfig } = useDocusaurusContext();
    return siteConfig.customFields?.[`${pkg}Version`] as string;
};

export const PackageVersion = ({ pkg }: { pkg: Pkg }) => <>{usePackageVersion(pkg)}</>;
