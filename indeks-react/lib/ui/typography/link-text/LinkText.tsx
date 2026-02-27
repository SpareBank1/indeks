import type {
  ElementType,
  JSX,
  ComponentPropsWithoutRef,
} from "react";
import clsx from "clsx";
import {
  extractComponentSizeClassname,
  type ComponentSize,
} from "../../../types/types";

export type LinkTextProps<As extends ElementType = "a"> = {
  as?: As;
  className?: string;
  size?: ComponentSize;
  underline?: boolean;
  isActive?: boolean;
} & ComponentPropsWithoutRef<As>;

export function LinkText<As extends ElementType = "a">(
  props: LinkTextProps<As>
): JSX.Element {
  const {
    as: Component = "a",
    size = "md",
    underline = true,
    isActive = false,
    className,
    ...restProps
  } = props;

  const { componentSizeClassName } = extractComponentSizeClassname(size);

  return (
    <Component
      {...restProps}
      className={clsx(
        "ix-link-text",
        componentSizeClassName,
        { "ix-link-text--underline": underline },
        { "ix-link-text--active": isActive },
        className
      )}
    />
  );
}