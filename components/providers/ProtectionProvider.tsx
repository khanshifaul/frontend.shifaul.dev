"use client";

import React, { useEffect } from "react";

/**
 * ProtectionProvider
 * Disables right-click (context menu) globally to prevent easy asset theft
 * or inspecting.
 */
export const ProtectionProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      // Allow right-click on inputs/textareas if needed, but for a portfolio 
      // often the user wants it fully disabled.
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
        return;
      }
      e.preventDefault();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U (Common DevTools shortcuts)
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J" || e.key === "C")) ||
        (e.ctrlKey && e.key === "u")
      ) {
        e.preventDefault();
      }
    };

    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return <>{children}</>;
};
