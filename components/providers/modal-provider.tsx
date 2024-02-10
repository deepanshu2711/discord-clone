"use client";

import { useEffect, useState } from "react";

import CreateServerModel from "../modals/create-server-model";
import InviteModal from "../modals/inviteModal";

export const ModalProvider = () => {
  const [isMounted, setisMounted] = useState(false);

  useEffect(() => {
    setisMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <CreateServerModel />
      <InviteModal />
    </>
  );
};
