"use client";

import { PageTransition } from "@/components/MotionWrapper";

export default function Template({ children }) {
  return <PageTransition>{children}</PageTransition>;
}
