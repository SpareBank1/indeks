import clsx from "clsx";
import type {
  ElementType,
  JSX,
  ReactNode,
} from "react";
import {
  type ComponentSize
} from "../../../types/types";

export type ListElementProps<As extends ElementType> = {
  as?: As;
  children?: ReactNode;
  className?: string;
  size?: ComponentSize;
};

export function ListElement<As extends ElementType = "div">(
  props: ListElementProps<As>
): JSX.Element {
  const {
    as: Component = "div",
    size,
    className,
    ...restProps
  } = {
    ...props,
  };


  return (
    <Component
      {...restProps}
      className={clsx(
        "ix-list-element",
        className
      )}
    />
  );
}
