import { describe, it, expect } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { defineComponent, h, ref } from 'vue';
import { SegmentedControl, StatusBadge, TranslatableField, type TranslatableValue } from '../src/index';

const LOCALES = ['fr', 'en', 'ar'];
const FILLED = { fr: 'Bonjour', en: 'Hello', ar: 'مرحبا' };

/** A field in page-driven mode unless `activeLocale` is overridden. */
function field(props: Record<string, unknown> = {}) {
    return mount(TranslatableField, {
        props: { name: 'title', label: 'Titre', locales: LOCALES, modelValue: FILLED, activeLocale: 'fr', ...props },
    });
}

type Field = ReturnType<typeof field>;

const control = (w: Field) => w.find('input, textarea');
const referenceOf = (w: Field) => w.find('p.bg-canvas');
/** The lines naming a locale in error that is not on screen. */
const noticesOf = (w: Field) => w.findAll('p.text-red-600.flex');
/** The error of the locale on screen, rendered by FieldError. */
const inlineErrorsOf = (w: Field) => w.findAll('p.text-red-600:not(.flex)');

describe('TranslatableField, page-driven locale (activeLocale)', () => {
    describe('single-locale render', () => {
        it('renders only the active locale, with no tab bar and no grid', () => {
            const w = field({ activeLocale: 'ar' });

            expect(w.findAll('input')).toHaveLength(1);
            expect((control(w).element as HTMLInputElement).value).toBe('مرحبا');
            expect(control(w).attributes('id')).toBe('title-ar');
            expect(control(w).attributes('dir')).toBe('rtl');
            expect(w.find('[role="tablist"]').exists()).toBe(false);
            expect(w.find('[role="tab"]').exists()).toBe(false);
            expect(w.find('.grid').exists()).toBe(false);
        });

        it('renders a textarea with the locale direction when multiline', () => {
            const w = field({ activeLocale: 'ar', multiline: true, rows: 6 });

            expect(w.find('input').exists()).toBe(false);
            expect(w.findAll('textarea')).toHaveLength(1);
            expect(control(w).attributes('dir')).toBe('rtl');
            expect(control(w).attributes('rows')).toBe('6');
        });

        it('follows the parent when activeLocale changes, on a fresh element', async () => {
            const w = field({ activeLocale: 'fr' });
            const french = control(w).element;

            await w.setProps({ activeLocale: 'en' });

            expect((control(w).element as HTMLInputElement).value).toBe('Hello');
            expect(control(w).attributes('id')).toBe('title-en');
            expect(control(w).attributes('dir')).toBe('ltr');
            // One element per language, as with the tabs: undo history and
            // validity do not leak from one locale into the next.
            expect(control(w).element).not.toBe(french);
        });

        it('ignores layout while activeLocale is set', () => {
            const w = field({ activeLocale: 'en', layout: 'grid' });

            expect(w.findAll('input')).toHaveLength(1);
            expect(w.find('.grid').exists()).toBe(false);
        });

        it('keeps its own tabs when activeLocale is not one of its locales', async () => {
            // The page is on a language this field does not have. Showing another
            // locale's box with nothing to say so would invite text in the wrong
            // language, so the field falls back to tabs that name what it has.
            const w = field({
                activeLocale: 'en',
                locales: ['fr', 'ar'],
                referenceLocale: 'fr',
                missingLabel: 'À traduire',
                modelValue: { fr: 'Bonjour', ar: '' },
            });

            expect(w.findAll('[role="tab"]').map((tab) => tab.text())).toEqual(['FR', 'AR']);
            expect(referenceOf(w).exists()).toBe(false);
            expect(w.findComponent(StatusBadge).exists()).toBe(false);

            await w.setProps({ activeLocale: 'ar' });
            expect(w.find('[role="tablist"]').exists()).toBe(false);
            expect(control(w).attributes('id')).toBe('title-ar');
        });

        it('treats an empty activeLocale as not set', () => {
            const w = field({ activeLocale: '' });

            expect(w.find('[role="tablist"]').exists()).toBe(true);
        });

        it('points the label at the shown control', async () => {
            const w = field({ activeLocale: 'fr' });
            expect(w.find('label').attributes('for')).toBe('title-fr');

            await w.setProps({ activeLocale: 'ar' });
            expect(w.find('label').attributes('for')).toBe('title-ar');
            expect(w.findAll('label')).toHaveLength(1);
        });

        it('stars the label only while the shown locale is the required one', async () => {
            const w = field({ activeLocale: 'fr', required: true, requiredLocale: 'fr' });
            expect(w.find('label').text()).toBe('Titre *');
            expect(control(w).attributes('required')).toBeDefined();

            await w.setProps({ activeLocale: 'en' });
            expect(w.find('label').text()).toBe('Titre');
            expect(control(w).attributes('required')).toBeUndefined();

            // `required` still gates everything: without it, no asterisk anywhere.
            const optional = field({ activeLocale: 'fr', requiredLocale: 'fr' });
            expect(optional.text()).not.toContain('*');
            expect(control(optional).attributes('required')).toBeUndefined();
        });

        it('keeps the hint, the placeholder, disabled and the group error', () => {
            const w = field({
                activeLocale: 'en',
                hint: 'Stored as JSON.',
                placeholder: 'Type…',
                disabled: true,
                errors: { title: 'The title field must be an array.' },
            });

            expect(w.text()).toContain('Stored as JSON.');
            expect(control(w).attributes('placeholder')).toBe('Type…');
            expect(control(w).attributes('disabled')).toBeDefined();
            expect(w.text()).toContain('The title field must be an array.');
        });
    });

    describe('JSON contract', () => {
        it('re-emits every configured locale as a string and preserves unconfigured ones', async () => {
            const w = field({ activeLocale: 'en', modelValue: { fr: 'a', de: 'keep' } });

            await control(w).setValue('x');

            expect(w.emitted('update:modelValue')![0][0]).toEqual({ fr: 'a', en: 'x', ar: '', de: 'keep' });
        });

        it('turns non-string stored values into empty strings', async () => {
            const w = field({ activeLocale: 'fr', modelValue: { fr: 'a', en: null, ar: undefined } });

            await control(w).setValue('b');

            expect(w.emitted('update:modelValue')![0][0]).toEqual({ fr: 'b', en: '', ar: '' });
        });

        it('emits a new object on every write and never mutates the bound one', async () => {
            const bound = { fr: 'a', en: '', ar: '' };
            const w = field({ activeLocale: 'en', modelValue: bound });

            await control(w).setValue('x');
            await control(w).setValue('xy');

            const [first, second] = w.emitted('update:modelValue')!.map((args) => args[0]);
            expect(first).not.toBe(bound);
            expect(second).not.toBe(first);
            expect(bound).toEqual({ fr: 'a', en: '', ar: '' });
        });

        it('writes to the locale on screen after the parent switched language', async () => {
            const w = field({ activeLocale: 'fr', modelValue: { fr: 'a', en: '', ar: '' } });

            await w.setProps({ activeLocale: 'ar' });
            await control(w).setValue('ب');

            expect(w.emitted('update:modelValue')![0][0]).toEqual({ fr: 'a', en: '', ar: 'ب' });
        });
    });

    describe('reference text', () => {
        it('shows the reference value above the control, with the locale code in front', () => {
            const w = field({ activeLocale: 'en', referenceLocale: 'fr' });
            const reference = referenceOf(w);

            expect(reference.exists()).toBe(true);
            expect(reference.findAll('span').map((span) => span.text())).toEqual(['FR', 'Bonjour']);
            // Read-only text, not a second control.
            expect(reference.find('input, textarea').exists()).toBe(false);
            expect(w.findAll('input, textarea')).toHaveLength(1);
            // Above the control.
            expect(
                reference.element.compareDocumentPosition(control(w).element) & Node.DOCUMENT_POSITION_FOLLOWING,
            ).toBeTruthy();
        });

        it('uses the classes of the approved design', () => {
            const reference = referenceOf(field({ activeLocale: 'ar', referenceLocale: 'fr' }));

            expect(reference.attributes('class')).toBe(
                'mb-1.5 flex gap-2 rounded-md bg-canvas px-3 py-2 text-xs leading-relaxed text-muted',
            );
            expect(reference.find('span').attributes('class')).toBe('font-semibold text-ink');
        });

        it('is hidden on the reference locale itself', () => {
            expect(referenceOf(field({ activeLocale: 'fr', referenceLocale: 'fr' })).exists()).toBe(false);
        });

        it('is hidden while the reference value is empty', async () => {
            const w = field({ activeLocale: 'en', referenceLocale: 'fr', modelValue: { fr: '', en: 'Hello', ar: '' } });
            expect(referenceOf(w).exists()).toBe(false);

            await w.setProps({ modelValue: { fr: '   ', en: 'Hello', ar: '' } });
            expect(referenceOf(w).exists()).toBe(false);

            await w.setProps({ modelValue: { fr: 'Bonjour', en: 'Hello', ar: '' } });
            expect(referenceOf(w).text()).toContain('Bonjour');
        });

        it('is hidden without referenceLocale', () => {
            expect(referenceOf(field({ activeLocale: 'en' })).exists()).toBe(false);
        });

        it('reads the reference text in its own direction', () => {
            const w = field({ activeLocale: 'fr', referenceLocale: 'ar' });
            const [code, text] = referenceOf(w).findAll('span');

            expect(code.text()).toBe('AR');
            expect(text.text()).toBe('مرحبا');
            expect(text.attributes('dir')).toBe('rtl');
        });

        it('shows a reference locale that is stored but not configured', () => {
            const w = field({
                activeLocale: 'en',
                referenceLocale: 'fr',
                locales: ['en', 'ar'],
                modelValue: { fr: 'Bonjour', en: '', ar: '' },
            });

            expect(referenceOf(w).findAll('span').map((span) => span.text())).toEqual(['FR', 'Bonjour']);
        });
    });

    describe('missing badge', () => {
        const untranslated = { fr: 'Bonjour', en: '', ar: '' };
        const badgeProps = { referenceLocale: 'fr', missingLabel: 'À traduire', modelValue: untranslated };

        it('shows an amber StatusBadge beside the label while the translation is empty', () => {
            const w = field({ activeLocale: 'en', ...badgeProps });
            const badge = w.findComponent(StatusBadge);

            expect(badge.exists()).toBe(true);
            expect(badge.props()).toMatchObject({ label: 'À traduire', tone: 'amber' });
            expect(badge.html()).toContain('bg-amber-50');
            // Same row as the label.
            expect(badge.element.parentElement).toBe(w.find('label').element.parentElement);
        });

        it('goes away once the translation has text, and comes back when it is cleared', async () => {
            const w = field({ activeLocale: 'en', ...badgeProps });

            await w.setProps({ modelValue: { fr: 'Bonjour', en: 'Hello', ar: '' } });
            expect(w.findComponent(StatusBadge).exists()).toBe(false);

            await w.setProps({ modelValue: { fr: 'Bonjour', en: '  ', ar: '' } });
            expect(w.findComponent(StatusBadge).exists()).toBe(true);
        });

        it('never shows on the reference locale, even when it is empty', () => {
            const w = field({ activeLocale: 'fr', ...badgeProps, modelValue: { fr: '', en: '', ar: '' } });

            expect(w.findComponent(StatusBadge).exists()).toBe(false);
        });

        it('does not depend on the reference value', () => {
            const w = field({ activeLocale: 'ar', ...badgeProps, modelValue: { fr: '', en: '', ar: '' } });

            expect(w.findComponent(StatusBadge).exists()).toBe(true);
            expect(referenceOf(w).exists()).toBe(false);
        });

        it('has no built-in copy: no missingLabel, no badge', () => {
            const w = field({ activeLocale: 'en', referenceLocale: 'fr', modelValue: untranslated });

            expect(w.findComponent(StatusBadge).exists()).toBe(false);
        });

        it('needs referenceLocale to know which locale is the source', () => {
            const w = field({ activeLocale: 'en', missingLabel: 'À traduire', modelValue: untranslated });

            expect(w.findComponent(StatusBadge).exists()).toBe(false);
        });

        it('still shows on a field without a label', () => {
            const w = field({ activeLocale: 'en', ...badgeProps, label: undefined });

            expect(w.find('label').exists()).toBe(false);
            expect(w.findComponent(StatusBadge).text()).toBe('À traduire');
        });
    });

    describe('errors on a locale that is not shown', () => {
        const frRequired = { 'title.fr': 'Le titre est obligatoire.' };

        it('asks the parent for the locale in error after a failed submit', async () => {
            const w = field({ activeLocale: 'ar', errors: {} });

            await w.setProps({ errors: frRequired });

            expect(w.emitted('update:activeLocale')).toEqual([['fr']]);
        });

        it('asks for the first locale in error, in the order of locales', async () => {
            const w = field({ activeLocale: 'fr', errors: {} });

            await w.setProps({ errors: { 'title.ar': 'طويل جدا', 'title.en': 'Too long.' } });

            expect(w.emitted('update:activeLocale')).toEqual([['en']]);
        });

        it('never pulls the user away from a locale that itself shows an error', async () => {
            const w = field({ activeLocale: 'en', errors: {} });

            await w.setProps({ errors: { 'title.fr': 'Obligatoire.', 'title.en': 'Too long.' } });

            expect(w.emitted('update:activeLocale')).toBeUndefined();
            expect(inlineErrorsOf(w).map((p) => p.text())).toEqual(['Too long.']);
        });

        it('does not ask while the shown locale is the one in error', async () => {
            const w = field({ activeLocale: 'fr', errors: {} });

            await w.setProps({ errors: frRequired });

            expect(w.emitted('update:activeLocale')).toBeUndefined();
            expect(control(w).attributes('aria-invalid')).toBe('true');
            expect(inlineErrorsOf(w).map((p) => p.text())).toEqual(['Le titre est obligatoire.']);
            expect(noticesOf(w)).toHaveLength(0);
        });

        it('asks once per failed submit, not on every render', async () => {
            const w = field({ activeLocale: 'ar', errors: {} });

            await w.setProps({ errors: frRequired });
            // The user looks at another language, types, and the same errors
            // come back in a new bag: none of that is a new reason to ask.
            await w.setProps({ activeLocale: 'en' });
            await control(w).setValue('Hello again');
            await w.setProps({ errors: { ...frRequired } });

            expect(w.emitted('update:activeLocale')).toEqual([['fr']]);
        });

        it('asks again when a later submit fails on another locale', async () => {
            const w = field({ activeLocale: 'en', errors: {} });

            await w.setProps({ errors: frRequired });
            await w.setProps({ activeLocale: 'fr' });
            await w.setProps({ errors: { 'title.ar': 'طويل جدا' } });

            expect(w.emitted('update:activeLocale')).toEqual([['fr'], ['ar']]);
        });

        it('does not ask when the errors are cleared', async () => {
            const w = field({ activeLocale: 'fr', errors: frRequired });

            await w.setProps({ errors: {} });

            expect(w.emitted('update:activeLocale')).toBeUndefined();
        });

        it('names the locale in error under the field when the parent does not bind the model', async () => {
            // Mounted with `activeLocale` only: nobody listens to the request.
            const w = field({ activeLocale: 'ar', errors: {} });

            await w.setProps({ errors: frRequired });

            expect(control(w).attributes('id')).toBe('title-ar');
            expect(control(w).attributes('aria-invalid')).toBeUndefined();
            expect(inlineErrorsOf(w)).toHaveLength(0);

            const notices = noticesOf(w);
            expect(notices).toHaveLength(1);
            expect(notices[0].findAll('span').map((span) => span.text())).toEqual(['FR', 'Le titre est obligatoire.']);
            // Under the field, in the FieldError style.
            expect(notices[0].classes()).toEqual(expect.arrayContaining(['mt-1.5', 'text-sm', 'text-red-600']));
            expect(
                control(w).element.compareDocumentPosition(notices[0].element) & Node.DOCUMENT_POSITION_FOLLOWING,
            ).toBeTruthy();
        });

        it('names the locale by its label', () => {
            const w = field({
                activeLocale: 'fr',
                locales: [{ code: 'fr', label: 'Français' }, { code: 'ar', label: 'العربية' }],
                errors: { 'title.ar': 'طويل جدا' },
            });

            expect(noticesOf(w)[0].findAll('span').map((span) => span.text())).toEqual(['العربية', 'طويل جدا']);
        });

        it('names every hidden locale in error, next to the error of the shown one', () => {
            const w = field({
                activeLocale: 'en',
                errors: { 'title.fr': 'Obligatoire.', 'title.en': 'Too long.', 'title.ar': 'طويل جدا' },
            });

            expect(inlineErrorsOf(w).map((p) => p.text())).toEqual(['Too long.']);
            expect(noticesOf(w).map((p) => p.text())).toEqual(['FRObligatoire.', 'ARطويل جدا']);
        });

        it('shows errors that are already there at mount, without asking', () => {
            const w = field({ activeLocale: 'en', errors: frRequired });

            expect(w.emitted('update:activeLocale')).toBeUndefined();
            expect(noticesOf(w).map((p) => p.text())).toEqual(['FRLe titre est obligatoire.']);
        });

        it('drops the notice when the parent shows that locale', async () => {
            const w = field({ activeLocale: 'en', errors: frRequired });

            await w.setProps({ activeLocale: 'fr' });

            expect(noticesOf(w)).toHaveLength(0);
            expect(inlineErrorsOf(w).map((p) => p.text())).toEqual(['Le titre est obligatoire.']);
        });

        it('resolves errors through a nested dotted path', async () => {
            const w = field({ name: 'sections.2.items.0.title', activeLocale: 'fr', errors: {} });

            await w.setProps({ errors: { 'sections.2.items.0.title.ar': 'طويل جدا' } });

            expect(w.emitted('update:activeLocale')).toEqual([['ar']]);
            expect(control(w).attributes('id')).toBe('sections-2-items-0-title-fr');
        });
    });

    describe('one language switch driving several fields', () => {
        /** A page: one SegmentedControl, three fields bound to it with `v-model:active-locale`. */
        function page(bind = true) {
            const lang = ref('fr');
            const errors = ref<Record<string, string>>({});
            const form = ref<Record<string, TranslatableValue>>({
                title: { fr: 'Titre', en: '', ar: '' },
                lead: { fr: 'Introduction', en: 'Lead', ar: '' },
                cta: { fr: 'Demander un devis', en: 'Get a quote', ar: 'اطلب عرض سعر' },
            });

            const Page = defineComponent({
                setup: () => () =>
                    h('div', [
                        h(SegmentedControl, {
                            modelValue: lang.value,
                            'onUpdate:modelValue': (value?: string) => (lang.value = value ?? lang.value),
                            segments: LOCALES.map((code) => ({ value: code, label: code.toUpperCase() })),
                        }),
                        ...Object.keys(form.value).map((name) =>
                            h(TranslatableField, {
                                key: name,
                                name,
                                label: name,
                                locales: LOCALES,
                                errors: errors.value,
                                referenceLocale: 'fr',
                                missingLabel: 'À traduire',
                                multiline: name === 'lead',
                                modelValue: form.value[name],
                                'onUpdate:modelValue': (value: TranslatableValue) => (form.value[name] = value),
                                activeLocale: lang.value,
                                ...(bind ? { 'onUpdate:activeLocale': (code: string) => (lang.value = code) } : {}),
                            }),
                        ),
                    ]),
            });

            return { w: mount(Page), lang, errors, form };
        }

        const ids = (w: ReturnType<typeof mount>) => w.findAll('input, textarea').map((c) => c.attributes('id'));

        it('switches every field with one click', async () => {
            const { w } = page();
            expect(ids(w)).toEqual(['title-fr', 'lead-fr', 'cta-fr']);
            expect(w.findAllComponents(StatusBadge)).toHaveLength(0);

            await w.findAll('button').find((b) => b.text() === 'AR')!.trigger('click');

            expect(ids(w)).toEqual(['title-ar', 'lead-ar', 'cta-ar']);
            expect(w.findAll('input, textarea').every((c) => c.attributes('dir') === 'rtl')).toBe(true);
            // French above each box; amber mark on the two that have no Arabic yet.
            expect(w.findAll('p.bg-canvas')).toHaveLength(3);
            expect(w.findAllComponents(StatusBadge)).toHaveLength(2);
        });

        it('keeps the other languages intact while one is edited', async () => {
            const { w, lang, form } = page();

            lang.value = 'en';
            await w.vm.$nextTick();
            await w.find('#title-en').setValue('Title');

            expect(form.value.title).toEqual({ fr: 'Titre', en: 'Title', ar: '' });
            expect(w.findAllComponents(StatusBadge)).toHaveLength(0);
        });

        it('moves the switch to the locale in error after a failed submit', async () => {
            const { w, lang, errors } = page();
            lang.value = 'ar';
            await w.vm.$nextTick();

            errors.value = { 'title.fr': 'Le titre est obligatoire.' };
            await w.vm.$nextTick();
            await w.vm.$nextTick();

            expect(lang.value).toBe('fr');
            expect(ids(w)).toEqual(['title-fr', 'lead-fr', 'cta-fr']);
            expect(w.find('#title-fr').attributes('aria-invalid')).toBe('true');
            expect(w.text()).toContain('Le titre est obligatoire.');
            expect(w.findAll('p.text-red-600.flex')).toHaveLength(0);
            // The switch itself shows where the page went.
            const activeSegment = w.findAll('button').find((b) => b.classes().includes('bg-brand-500'))!;
            expect(activeSegment.text()).toBe('FR');
        });

        it('leaves no error invisible when fields fail in different languages', async () => {
            const { w, lang, errors } = page();
            const bag = {
                'title.en': 'The title is too long.',
                'lead.ar': 'المقدمة طويلة جدا',
                'cta.fr': 'Le bouton est obligatoire.',
            };

            errors.value = bag;
            await w.vm.$nextTick();
            await w.vm.$nextTick();

            // One switch cannot show three languages: wherever it lands, every
            // message is on screen, inline or as a named line under its field.
            for (const message of Object.values(bag)) {
                expect(w.text()).toContain(message);
            }
            const inline = w.findAll('p.text-red-600:not(.flex)');
            const named = w.findAll('p.text-red-600.flex');
            expect(inline.length + named.length).toBe(3);
            expect(inline.length).toBeGreaterThan(0);
            expect(LOCALES).toContain(lang.value);
        });

        it('stays put and names the locales when the page does not bind the model', async () => {
            const { w, lang, errors } = page(false);

            errors.value = { 'title.en': 'The title is too long.', 'cta.ar': 'النص طويل جدا' };
            await w.vm.$nextTick();
            await w.vm.$nextTick();

            expect(lang.value).toBe('fr');
            expect(ids(w)).toEqual(['title-fr', 'lead-fr', 'cta-fr']);
            expect(w.findAll('p.text-red-600.flex').map((p) => p.text())).toEqual([
                'ENThe title is too long.',
                'ARالنص طويل جدا',
            ]);
        });
    });
});

describe('TranslatableField, tabs and grid stay as they were', () => {
    const legacy = (props: Record<string, unknown> = {}) =>
        mount(TranslatableField, {
            props: { name: 'name', label: 'Nom', locales: LOCALES, modelValue: FILLED, ...props },
        });

    it('tabs: a tab per locale and one control on screen', () => {
        const w = legacy();

        expect(w.find('[role="tablist"]').exists()).toBe(true);
        expect(w.findAll('[role="tab"]').map((tab) => tab.text())).toEqual(['FR', 'EN', 'AR']);
        expect(w.findAll('input')).toHaveLength(1);
        expect(w.find('input').attributes('id')).toBe('name-fr');
        expect(w.find('label').attributes('for')).toBe('name-fr');
    });

    it('tabs: the label is starred whenever the field is required, whatever the tab', () => {
        const w = legacy({ required: true, requiredLocale: 'ar' });

        expect(w.find('label').text()).toBe('Nom *');
        expect(w.findAll('[role="tab"]').map((tab) => tab.text())).toEqual(['FR', 'EN', 'AR*']);
    });

    it('tabs: switches itself to the first tab in error, without asking the parent', async () => {
        const w = legacy({ errors: {} });

        await w.setProps({ errors: { 'name.ar': 'requis' } });
        // reka-ui swaps the panels a tick after the tab changes.
        await flushPromises();

        expect(w.find('[role="tab"][data-state="active"]').text()).toContain('AR');
        expect(w.findAll('input').map((input) => input.attributes('id'))).toEqual(['name-ar']);
        expect(w.text()).toContain('requis');
        expect(w.emitted('update:activeLocale')).toBeUndefined();
    });

    it('tabs: stays on a tab that itself shows an error', async () => {
        const w = legacy({ errors: {} });

        await w.setProps({ errors: { 'name.fr': 'requis', 'name.ar': 'trop long' } });
        await flushPromises();

        expect(w.find('[role="tab"][data-state="active"]').text()).toContain('FR');
        expect(w.findAll('input').map((input) => input.attributes('id'))).toEqual(['name-fr']);
    });

    it('grid: one labelled control per locale, each with its own error', () => {
        const w = legacy({ layout: 'grid', required: true, requiredLocale: 'fr', errors: { 'name.en': 'Too long.' } });

        expect(w.find('[role="tablist"]').exists()).toBe(false);
        expect(w.find('.grid').exists()).toBe(true);
        expect(w.findAll('input').map((input) => input.attributes('id'))).toEqual(['name-fr', 'name-en', 'name-ar']);
        expect(w.findAll('label').map((label) => label.text())).toEqual(['Nom *', 'FR *', 'EN', 'AR']);
        expect(w.findAll('input').map((input) => input.attributes('aria-invalid'))).toEqual([undefined, 'true', undefined]);
        expect(w.text()).toContain('Too long.');
    });

    it('grid: never asks the parent for a locale', async () => {
        const w = legacy({ layout: 'grid', errors: {} });

        await w.setProps({ errors: { 'name.ar': 'requis' } });

        expect(w.emitted('update:activeLocale')).toBeUndefined();
    });

    it.each(['tabs', 'grid'])('%s: referenceLocale and missingLabel change nothing', (layout) => {
        const props = { layout, modelValue: { fr: 'Bonjour', en: '', ar: '' }, errors: { 'name.ar': 'requis' } };
        const plain = legacy(props);
        const extra = legacy({ ...props, referenceLocale: 'fr', missingLabel: 'À traduire' });

        expect(extra.html()).toBe(plain.html());
        expect(extra.findComponent(StatusBadge).exists()).toBe(false);
        expect(extra.find('p.bg-canvas').exists()).toBe(false);
    });
});
