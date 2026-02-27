import clsx from "clsx";
import type { JSX, ReactNode } from "react";

export type FormProps = {
  children?: ReactNode;
  className?: string;
};

export function Form(props: FormProps): JSX.Element {
  const { children, className, ...restProps } = {
    ...props,
  };

  return (
    <form className={clsx("ix-form", className)} {...restProps}>
      {children}
    </form>
  );
}
