import * as React from "react";

/** Small uppercase gold eyebrow label with generous tracking, set above headings. */
export interface OverlineProps {
  children: React.ReactNode;
  color?: string;
  style?: React.CSSProperties;
}

export function Overline(props: OverlineProps): JSX.Element;
