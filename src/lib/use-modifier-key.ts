"use client";

import { useEffect, useState } from "react";

/**
 * The palette shortcut label for the current platform: ⌘K on Apple hardware,
 * Ctrl K everywhere else. Server-renders the Ctrl form (the majority case) and
 * corrects itself after mount, so hydration always matches.
 */
export function useModifierKey() {
  const [isApple, setIsApple] = useState(false);

  useEffect(() => {
    setIsApple(/Mac|iPhone|iPad|iPod/i.test(navigator.userAgent));
  }, []);

  return isApple ? "⌘K" : "Ctrl K";
}
