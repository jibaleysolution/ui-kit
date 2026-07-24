import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import {
    Button,
    StatusBadge,
    Alert,
    Spinner,
    Checkbox,
    Toggle,
    Avatar,
    StatCard,
    EmptyState,
    BarChart,
    DateField,
    DateRangeField,
    toneFor,
    brandRamp,
    useBrandColor,
} from '../src/index';

describe('Button', () => {
    it('renders its slot and the primary brand fill', () => {
        const w = mount(Button, { props: { variant: 'primary' }, slots: { default: 'Save' } });
        expect(w.text()).toBe('Save');
        expect(w.classes().join(' ')).toContain('bg-brand-500');
    });

    it('disables and shows a spinner while loading', () => {
        const w = mount(Button, { props: { loading: true } });
        expect(w.attributes('disabled')).toBeDefined();
        expect(w.find('svg').exists()).toBe(true);
    });
});

describe('StatusBadge', () => {
    it('maps tone to the soft-tint pill classes', () => {
        const w = mount(StatusBadge, { props: { label: 'Active', tone: 'green' } });
        expect(w.text()).toContain('Active');
        expect(w.html()).toContain('bg-emerald-50');
    });
});

describe('Alert', () => {
    it('renders role=alert with the tone icon', () => {
        const w = mount(Alert, { props: { tone: 'danger', title: 'Oops' }, slots: { default: 'body' } });
        expect(w.attributes('role')).toBe('alert');
        expect(w.text()).toContain('Oops');
        expect(w.html()).toContain('bg-red-50');
    });
});

describe('Spinner', () => {
    it('exposes a loading status role', () => {
        const w = mount(Spinner);
        expect(w.attributes('role')).toBe('status');
    });
});

describe('Checkbox / Toggle v-model', () => {
    it('Checkbox emits update on toggle', async () => {
        const w = mount(Checkbox, { props: { modelValue: false } });
        await w.find('label').trigger('click');
        expect(w.emitted('update:modelValue')).toBeTruthy();
    });

    it('Toggle flips its bound value', async () => {
        const w = mount(Toggle, { props: { modelValue: false } });
        await w.find('button').trigger('click');
        expect(w.emitted('update:modelValue')![0]).toEqual([true]);
    });
});

describe('Avatar', () => {
    it('derives initials from name', () => {
        const w = mount(Avatar, { props: { name: 'Ada Lovelace' } });
        expect(w.text()).toContain('AL');
    });
});

describe('StatCard / EmptyState', () => {
    it('StatCard shows its value', () => {
        expect(mount(StatCard, { props: { label: 'Orders', value: 42 } }).text()).toContain('42');
    });

    it('EmptyState shows its title', () => {
        expect(mount(EmptyState, { props: { title: 'Nothing here' } }).text()).toContain('Nothing here');
    });
});

describe('BarChart', () => {
    it('renders a bar per label', () => {
        const w = mount(BarChart, { props: { labels: ['a', 'b', 'c'], data: [1, 2, 3] } });
        expect(w.findAll('span').filter((s) => ['a', 'b', 'c'].includes(s.text()))).toHaveLength(3);
    });
});

describe('DateField / DateRangeField', () => {
    it('DateField renders a native date input bound via v-model', async () => {
        const w = mount(DateField, { props: { modelValue: '' } });
        const input = w.find('input');
        expect(input.attributes('type')).toBe('date');
        await input.setValue('2026-07-24');
        expect(w.emitted('update:modelValue')![0]).toEqual(['2026-07-24']);
    });

    it('DateRangeField exposes two bound date inputs', () => {
        const w = mount(DateRangeField, { props: { modelValue: { start: '2026-01-01', end: '2026-12-31' } } });
        const inputs = w.findAll('input');
        expect(inputs).toHaveLength(2);
        expect((inputs[0].element as HTMLInputElement).value).toBe('2026-01-01');
        expect((inputs[1].element as HTMLInputElement).value).toBe('2026-12-31');
    });
});

describe('theming', () => {
    it('toneFor resolves mapped keys and falls back', () => {
        const map = { paid: 'green', overdue: 'red' } as const;
        expect(toneFor(map, 'paid')).toBe('green');
        expect(toneFor(map, 'unknown')).toBe('neutral');
        expect(toneFor(map, null, 'amber')).toBe('amber');
    });

    it('brandRamp returns all 10 shades as color-mix strings', () => {
        const ramp = brandRamp('#2563eb');
        expect(Object.keys(ramp)).toHaveLength(10);
        expect(ramp['--color-brand-500']).toBe('#2563eb');
        expect(ramp['--color-brand-50']).toContain('color-mix');
    });

    it('useBrandColor injects the ramp onto a target element', () => {
        const el = document.createElement('div');
        useBrandColor('#2563eb', el);
        expect(el.style.getPropertyValue('--color-brand-500')).toBe('#2563eb');
        expect(el.style.getPropertyValue('--color-brand-900')).toContain('color-mix');
    });

    it('useBrandColor no-ops on empty input', () => {
        const el = document.createElement('div');
        useBrandColor('', el);
        expect(el.style.getPropertyValue('--color-brand-500')).toBe('');
    });
});
