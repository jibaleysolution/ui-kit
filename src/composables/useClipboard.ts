import { ref } from 'vue';

export function useClipboard(resetAfter = 1500) {
    const copied = ref(false);

    const copy = async (text: string): Promise<void> => {
        try {
            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(text);
            } else {
                const el = document.createElement('textarea');
                el.value = text;
                el.style.position = 'fixed';
                el.style.opacity = '0';
                document.body.appendChild(el);
                el.select();
                document.execCommand('copy');
                document.body.removeChild(el);
            }
            copied.value = true;
            window.setTimeout(() => (copied.value = false), resetAfter);
        } catch {
            copied.value = false;
        }
    };

    return { copied, copy };
}
