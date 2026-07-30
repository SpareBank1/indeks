import { act, renderHook } from '@testing-library/react';
import type { ChangeEvent } from 'react';
import { describe, expect, it } from 'vitest';
import { toggleValue, useCheckboxGroup } from './toggle-value';

// toggleValue leser kun target.value/target.checked — et minimalt stand-in holder.
function changeEvent(value: string, checked: boolean): ChangeEvent<HTMLInputElement> {
    return { target: { value, checked } } as ChangeEvent<HTMLInputElement>;
}

describe('toggleValue', () => {
    it('legger til verdi når checkboxen krysses av', () => {
        expect(toggleValue(['epost'], changeEvent('sms', true))).toEqual(['epost', 'sms']);
    });

    it('fjerner verdi når checkboxen krysses bort', () => {
        expect(toggleValue(['epost', 'sms'], changeEvent('epost', false))).toEqual(['sms']);
    });

    it('legger ikke til duplikat når verdien allerede finnes', () => {
        expect(toggleValue(['epost'], changeEvent('epost', true))).toEqual(['epost']);
    });

    it('er en no-op når en fraværende verdi krysses bort', () => {
        expect(toggleValue(['epost'], changeEvent('sms', false))).toEqual(['epost']);
    });

    it('muterer ikke input-arrayet', () => {
        const prev = ['epost'];
        toggleValue(prev, changeEvent('sms', true));
        expect(prev).toEqual(['epost']);
    });
});

describe('useCheckboxGroup', () => {
    it('starter tomt uten initialverdi', () => {
        const { result } = renderHook(() => useCheckboxGroup());
        expect(result.current.value).toEqual([]);
    });

    it('bruker initialverdien', () => {
        const { result } = renderHook(() => useCheckboxGroup(['epost']));
        expect(result.current.value).toEqual(['epost']);
    });

    it('onChange legger til og fjerner verdier', () => {
        const { result } = renderHook(() => useCheckboxGroup(['epost']));
        act(() => result.current.onChange(changeEvent('sms', true)));
        expect(result.current.value).toEqual(['epost', 'sms']);
        act(() => result.current.onChange(changeEvent('epost', false)));
        expect(result.current.value).toEqual(['sms']);
    });

    it('setValue styrer utvalget programmatisk', () => {
        const { result } = renderHook(() => useCheckboxGroup());
        act(() => result.current.setValue(['telefon']));
        expect(result.current.value).toEqual(['telefon']);
    });
});
