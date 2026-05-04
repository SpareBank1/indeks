import MDXComponents from '@theme-original/MDXComponents';
import { MobilbankOnly } from '@site/src/components/MobilbankOnly';

// Registrerer egne komponenter slik at MDX-forfattere kan bruke dem uten import.
export default {
    ...MDXComponents,
    MobilbankOnly,
};
