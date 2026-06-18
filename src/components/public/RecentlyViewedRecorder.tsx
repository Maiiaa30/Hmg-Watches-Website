"use client";

import { useEffect } from "react";
import { recordWatch, type RecentWatch } from "@/lib/recently-viewed";

/** Records the current watch into the visitor's local "recently viewed" list. */
export function RecentlyViewedRecorder({ watch }: { watch: RecentWatch }) {
  useEffect(() => {
    recordWatch(watch);
  }, [watch]);

  return null;
}
