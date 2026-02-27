import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
    cleanup(); //Så domen blir renset hver gang, unngår at rendret tester piler up
});
