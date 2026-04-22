import React from 'react';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import {
    Button,
    Card,
    Checkbox,
    Dropdown,
    Field,
    Form,
    Heading,
    HStack,
    Icon,
    LinkText,
    ListElement,
    RadioGroup,
    Spinner,
    Table,
    Tag,
    Text,
    TextArea,
    TextField,
    VStack,
} from '@sb1/indeks-react';

// Web components (ix-field osv.) bruker HTMLElement som ikke finnes i Node.js.
// Importerer kun på klientsiden for å unngå SSR-krasj.
if (ExecutionEnvironment.canUseDOM) {
    import('@sb1/indeks-web');
}

const ReactLiveScope = {
    React,
    ...React,
    Button,
    Card,
    Checkbox,
    Dropdown,
    Field,
    Form,
    Heading,
    HStack,
    Icon,
    LinkText,
    ListElement,
    RadioGroup,
    Spinner,
    Table,
    Tag,
    Text,
    TextArea,
    TextField,
    VStack,
};

export default ReactLiveScope;
