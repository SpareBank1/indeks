import type {
  ElementType,
  JSX,
  ComponentPropsWithoutRef,
} from "react";
import { cn } from '@/cn';
import type { ComponentSize } from "../../../types/types";

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

  return (
    <Component
      {...restProps}
      data-size={size}
      className={cn(
        "ix-link-text",
        { "ix-link-text--no-underline": !underline },
        { "ix-link-text--active": isActive },
        className
      )}
    />
  );
}