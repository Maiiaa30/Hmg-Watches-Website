import * as React from "react";

/** Square hairline checkbox that fills gold when checked. Used in catalogue filters. */
export interface CheckboxProps {
  label?: React.ReactNode;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  style?: React.CSSProperties;
}

export function Checkbox(props: CheckboxProps): JSX.Element;
