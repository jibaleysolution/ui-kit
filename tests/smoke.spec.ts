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
    Tabs,
    TranslatableField,
    toneFor,
    brandRamp,
    useBrandColor,
    dirForLocale,
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

describe('TranslatableField', () => {
    it('emits the full locale map on every write (all keys, empty strings)', async () => {
        const w = mount(TranslatableField, {
            props: { name: 'name', layout: 'grid', locales: ['fr', 'ar', 'en'], modelValue: { fr: 'a' } },
        });
        await w.findAll('input')[1].setValue('x');
        expect(w.emitted('update:modelValue')![0][0]).toEqual({ fr: 'a', ar: 'x', en: '' });
    });

    it('preserves locales stored on the value but not configured', async () => {
        const w = mount(TranslatableField, {
            props: { name: 'name', layout: 'grid', locales: ['fr', 'ar'], modelValue: { fr: 'a', en: 'keep' } },
        });
        await w.findAll('input')[0].setValue('b');
        expect(w.emitted('update:modelValue')![0][0]).toEqual({ fr: 'b', ar: '', en: 'keep' });
    });

    it('resolves errors through the dotted path, including nested indices', () => {
        const w = mount(TranslatableField, {
            props: {
                name: 'option_groups.0.name',
                layout: 'grid',
                errors: { 'option_groups.0.name.fr': 'Le nom est requis' },
            },
        });
        expect(w.text()).toContain('Le nom est requis');
    });

    it('marks only the erroring tab with a dot', () => {
        const w = mount(TranslatableField, {
            props: { name: 'name', errors: { 'name.ar': 'requis' } },
        });
        const triggers = w.findAll('[role="tab"]');
        const fr = triggers.find((t) => t.text().startsWith('FR'))!;
        const ar = triggers.find((t) => t.text().startsWith('AR'))!;
        expect(ar.html()).toContain('bg-red-500');
        expect(fr.html()).not.toContain('bg-red-500');
    });

    it('applies the required attribute only to the required locale', () => {
        const marked = mount(TranslatableField, {
            props: {
                name: 'name',
                label: 'Nom',
                layout: 'grid',
                locales: ['fr', 'ar'],
                required: true,
                requiredLocale: 'ar',
            },
        });
        const inputs = marked.findAll('input');
        expect(inputs[0].attributes('required')).toBeUndefined();
        expect(inputs[1].attributes('required')).toBeDefined();
        expect(marked.text()).toContain('*');

        const bare = mount(TranslatableField, {
            props: { name: 'name', layout: 'grid', locales: ['fr', 'ar'] },
        });
        expect(bare.findAll('input').every((i) => i.attributes('required') === undefined)).toBe(true);
        expect(bare.text()).not.toContain('*');
    });

    it('renders one control per locale in grid layout', () => {
        const text = mount(TranslatableField, {
            props: { name: 'name', layout: 'grid', locales: ['fr', 'ar', 'en'] },
        });
        expect(text.findAll('input')).toHaveLength(3);

        const multi = mount(TranslatableField, {
            props: { name: 'bio', layout: 'grid', locales: ['fr', 'ar'], multiline: true },
        });
        expect(multi.findAll('textarea')).toHaveLength(2);
    });

    it('gives RTL locales dir="rtl"', () => {
        const w = mount(TranslatableField, { props: { name: 'name', layout: 'grid', locales: ['fr', 'ar'] } });
        const inputs = w.findAll('input');
        expect(inputs[0].attributes('dir')).toBe('ltr');
        expect(inputs[1].attributes('dir')).toBe('rtl');
    });
});

describe('dirForLocale', () => {
    it('detects RTL by primary subtag', () => {
        for (const code of ['ar', 'ar-MA', 'he', 'fa', 'ur', 'AR']) {
            expect(dirForLocale(code)).toBe('rtl');
        }
        for (const code of ['fr', 'en', 'fr-CA', 'tr']) {
            expect(dirForLocale(code)).toBe('ltr');
        }
    });
});

describe('Tabs', () => {
    it('still renders plain labels without the tab-label slot', () => {
        const w = mount(Tabs, {
            props: { tabs: [{ value: 'a', label: 'Alpha' }, { value: 'b', label: 'Beta' }], modelValue: 'a' },
        });
        expect(w.text()).toContain('Alpha');
        expect(w.text()).toContain('Beta');
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
