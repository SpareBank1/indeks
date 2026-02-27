import clsx from "clsx";
import type { JSX, ReactNode } from "react";
import {
  type ComponentSize
} from "../../../types/types";

export type TableProps = {
  children?: ReactNode;
  className?: string;
  size?: ComponentSize;
};

export function Table(props: TableProps): JSX.Element {
  const {
    size = "md",
    className,
    ...restProps
  } = {
    ...props,
  };

  return (
    <table
      className={clsx(
        "ix-table",
        [`ix-table--${size}`],
        className
      )}
      {...restProps}
    >
      <caption>Front-end web developer course 2021</caption>
      <thead className="ix-table__header">
        <tr className="ix-table__header-row">
          <th scope="col" className="ix-table__cell">Person</th>
          <th scope="col" className="ix-table__cell">Most interest in</th>
          <th scope="col" className="ix-table__cell">Age</th>
        </tr>
      </thead>
      <tbody>
        <tr className="ix-table__row">
          <th scope="row" className="ix-table__cell">Chris</th>
          <td className="ix-table__cell">HTML tables</td>
          <td className="ix-table__cell">22</td>
        </tr>
        <tr className="ix-table__row">
          <th scope="row" className="ix-table__cell">Dennis</th>
          <td className="ix-table__cell">Web accessibility</td>
          <td className="ix-table__cell">45</td>
        </tr>
        <tr className="ix-table__row">
          <th scope="row" className="ix-table__cell">Sarah</th>
          <td className="ix-table__cell">JavaScript frameworks</td>
          <td className="ix-table__cell">29</td>
        </tr>
        <tr className="ix-table__row">
          <th scope="row" className="ix-table__cell">Karen</th>
          <td className="ix-table__cell">Web performance</td>
          <td className="ix-table__cell">36</td>
        </tr>
      </tbody>
      <tfoot className="ix-table__footer">
        <tr className="ix-table__row">
          <th scope="row" colSpan={2}>
            Average age
          </th>
          <td className="ix-table__cell">33</td>
        </tr>
      </tfoot>
    </table>
  );
}
