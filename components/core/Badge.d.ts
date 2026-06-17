import * as React from "react";

/**
 * Discreet status pill — watch availability and market trend.
 *
 * @startingPoint section="Core" subtitle="Status & trend pills" viewport="700x140"
 */
export interface BadgeProps {
  /** available = green dot, sold = grey, gold = outlined, up/down = market trend. */
  variant?: "available" | "sold" | "gold" | "up" | "down";
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export function Badge(props: BadgeProps): JSX.Element;
