import { useEffect, useRef } from 'react';

const DRAFT_KEY = 'giya_readiness_draft';

export function loadFormDraft() {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.form) return null;
    return { form: parsed.form, step: parsed.step || 1 };
  } catch {
    return null;
  }
}

export function clearFormDraft() {
  try {
    sessionStorage.removeItem(DRAFT_KEY);
  } catch {
    /* ignore */
  }
}

/** Persist in-progress answers so refresh does not lose work. */
export function useFormDraft(form, step) {
  const hydrated = useRef(false);

  useEffect(() => {
    if (!hydrated.current) {
      hydrated.current = true;
      return;
    }
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ form, step, savedAt: Date.now() }));
    } catch {
      /* quota / private mode */
    }
  }, [form, step]);
}
