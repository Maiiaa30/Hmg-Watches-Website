import * as React from "react";

/**
 * Ghost-first button for HMG Watches. Public surfaces use `ghost-gold` and
 * `ghost-light` only; `solid` is reserved for the admin panel.
 *
 * @startingPoint section="Core" subtitle="Ghost-first button, three variants" viewport="700x200"
 */
export interface ButtonProps {
  children: React.ReactNode;
  /** Visual style. Public site = ghost only. */
  variant?: "ghost-gold" | "ghost-light" | "solid";
  size?: "sm" | "md" | "lg";
  /** Render as an anchor instead of a button. */
  as?: "button" | "a";
  href?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  style?: React.CSSProperties;
}

export function Button(props: ButtonProps): JSX.Element;
