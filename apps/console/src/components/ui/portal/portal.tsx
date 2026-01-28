import React, { useEffect, useState } from 'react';

import { createPortal } from 'react-dom';

export interface PortalProps {
  /**
   * The content to be rendered in the portal
   */
  children: React.ReactNode;

  /**
   * The container element to render the portal into.
   * If not provided, it will use document.body
   */
  container?: HTMLElement | null;

  /**
   * Callback when the portal is mounted
   */
  onMount?: () => void;

  /**
   * Callback when the portal is unmounted
   */
  onUnmount?: () => void;

  /**
   * Whether to disable the portal and render children directly
   * @default false
   */
  disablePortal?: boolean;
}

/**
 * Portal component that renders children into a DOM node that exists outside
 * the DOM hierarchy of the parent component.
 */
export const Portal = ({
  children,
  container,
  onMount,
  onUnmount,
  disablePortal = false
}: PortalProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // If portal is disabled, skip mounting logic
    if (disablePortal) return () => {};

    setMounted(true);

    if (onMount) {
      onMount();
    }

    return () => {
      setMounted(false);

      if (onUnmount) {
        onUnmount();
      }
    };
  }, [disablePortal, onMount, onUnmount]);

  // If portal is disabled, render children directly
  if (disablePortal) {
    return <>{children}</>;
  }

  // Don't render on server-side or before mounting
  if (!mounted || typeof document === 'undefined') {
    return null;
  }

  // Use the specified container or fall back to document.body
  const targetContainer = container || document.body;

  return createPortal(children, targetContainer);
};
