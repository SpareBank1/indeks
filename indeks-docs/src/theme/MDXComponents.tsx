import MDXComponents from '@theme-original/MDXComponents';
import { MobilbankOnly } from '@site/src/components/MobilbankOnly';
import IconAnalyseTable from '@site/src/components/IconAnalyseTable';

// Registrerer egne komponenter slik at MDX-forfattere kan bruke dem uten import.
export default {
    ...MDXComponents,
    MobilbankOnly,
    IconAnalyseTable,
};
