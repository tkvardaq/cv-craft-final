"use client";

import { useEffect } from "react";
import { useCvStore } from "./cv-store";

export function CvStoreHydrator() {
  useEffect(() => {
    useCvStore.persist.rehydrate();
  }, []);
  return null;
}
