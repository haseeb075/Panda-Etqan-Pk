"use client";

import React from "react";
import ErrorBoundary from "./ErrorBoundary";

interface ErrorBoundaryWrapperProps {
  children: React.ReactNode;
}

/**
 * Client component wrapper for ErrorBoundary
 * This ensures proper client/server boundary in Next.js App Router
 */
export default function ErrorBoundaryWrapper({
  children,
}: ErrorBoundaryWrapperProps) {
  return <ErrorBoundary>{children}</ErrorBoundary>;
}

