import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export const CssVersion = () => {
    const { siteConfig } = useDocusaurusContext();
    return <>{siteConfig.customFields.cssVersion}</>;
};
