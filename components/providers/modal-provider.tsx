"use client";

import { useEffect, useState } from "react";

import CreateServerModel from "../modals/create-server-model";
import InviteModal from "../modals/inviteModal";
import EditServerModal from "../modals/edit-server-modal";
import MembersModal from "../modals/membersModal";
import CreateChannelModal from "../modals/create-channel-model";

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
      <EditServerModal />
      <MembersModal />
      <CreateChannelModal />
    </>
  );
};
