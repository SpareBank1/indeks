import type {
  ElementType,
  JSX,
  ComponentPropsWithoutRef,
} from "react";
import { cn } from '../../../cn';
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
      data-active={isActive || undefined}
      data-no-underline={!underline || undefined}
      className={cn("ix-link-text", className)}
    />
  );
}