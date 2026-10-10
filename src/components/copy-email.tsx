"use client";

import { useState } from "react";

// Copies the address instead of opening a mailto: link, which would launch
// whatever mail app the visitor's OS defaults to.
export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can be blocked; the address is still on screen to
      // select by hand.
    }
  }

  return (
    <span className="inline-flex items-baseline gap-3">
      <button
        type="button"
        onClick={copy}
        className="cursor-pointer underline decoration-dotted underline-offset-[3px] hover:decoration-solid"
        title="Copy email address"
      >
        {email}
      </button>
      <span aria-live="polite" className="text-sm text-neutral-500">
        {copied ? "Copied" : ""}
      </span>
    </span>
  );
}
