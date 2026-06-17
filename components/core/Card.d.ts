import * as React from "react";

/** A quiet charcoal surface with a hairline border. Set `interactive` for hover lift + gold border. */
export interface CardProps {
  children: React.ReactNode;
  padding?: string;
  interactive?: boolean;
  style?: React.CSSProperties;
}

export function Card(props: CardProps): JSX.Element;
