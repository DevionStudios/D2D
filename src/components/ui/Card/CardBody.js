import clsx from "clsx";
import { ReactNode } from "react";

export function CardBody({ children, noPadding, className }) {
  return (
    <div className={clsx(noPadding ? "p-0" : "px-4 py-3", className)}>
      {children}
    </div>
  );
}
