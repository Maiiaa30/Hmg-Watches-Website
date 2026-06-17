import * as React from "react";

/** Underline-on-dark text field with a gold focus state and uppercase label. */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
}

export function Input(props: InputProps): JSX.Element;
