"use client";

import { useEffect, useState } from "react";

import CreateServerModel from "../modals/create-server-model";

export const ModalProvider = () => {
  const [isMounted, setisMounted] = useState(false);

  useEffect(() => {
    setisMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <CreateServerModel />
    </>
  );
};
