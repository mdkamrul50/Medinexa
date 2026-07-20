"use client";

import { Fragment } from "react";
import Link from "next/link";
import { FiChevronRight, FiHome } from "react-icons/fi";
import { BreadcrumbItem } from "./types";

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm">
      <Link
        href="/dashboard"
        className="flex items-center gap-1 text-muted hover:text-primary transition-colors"
      >
        <FiHome className="h-4 w-4" />
      </Link>
      {items.map((item, index) => (
        <Fragment key={index}>
          <FiChevronRight className="h-3.5 w-3.5 text-muted/50" />
          {item.href ? (
            <Link
              href={item.href}
              className="text-muted hover:text-primary transition-colors font-medium"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-heading font-semibold">{item.label}</span>
          )}
        </Fragment>
      ))}
    </nav>
  );
}
