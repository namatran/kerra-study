"use client";

import { useSyncExternalStore } from "react";

const EVENT = "preloader:done";

/** Called by the preloader once its overlay has gone (or straight away when it is skipped). */
export function markPreloaderDone() {
  document.documentElement.dataset.ready = "true";
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  return () => window.removeEventListener(EVENT, onChange);
}

/** True once the preloader has finished, so entrance animations can start. */
export function usePreloaderDone() {
  return useSyncExternalStore(
    subscribe,
    () => document.documentElement.dataset.ready === "true",
    () => false,
  );
}
