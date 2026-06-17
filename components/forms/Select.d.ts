import * as React from "react";

/** Underline-style dropdown matching Input. Options accept strings or {value,label}. */
export interface SelectOption { value: string; label: string; }
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options?: (string | SelectOption)[];
}

export function Select(props: SelectProps): JSX.Element;
