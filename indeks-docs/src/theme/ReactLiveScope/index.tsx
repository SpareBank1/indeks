import React from 'react';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import {
    Accordion,
    Button,
    Card,
    Checkbox,
    Field,
    Form,
    Heading,
    HStack,
    Icon,
    Label,
    LinkText,
    ListElement,
    Message,
    MessageRegion,
    RadioButton,
    RadioGroup,
    Select,
    Spinner,
    Table,
    Tag,
    Text,
    TextArea,
    TextField,
    ValidationMessage,
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
    Accordion,
    Button,
    Card,
    Checkbox,
    Field,
    Form,
    Heading,
    HStack,
    Icon,
    Label,
    LinkText,
    ListElement,
    Message,
    MessageRegion,
    RadioButton,
    RadioGroup,
    Select,
    Spinner,
    Table,
    Tag,
    Text,
    TextArea,
    TextField,
    ValidationMessage,
    VStack,
};

export default ReactLiveScope;
