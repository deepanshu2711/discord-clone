"use client";

import { useEffect, useState } from "react";

import CreateServerModel from "../modals/create-server-model";
import InviteModal from "../modals/inviteModal";
import EditServerModal from "../modals/edit-server-modal";
import MembersModal from "../modals/membersModal";
import CreateChannelModal from "../modals/create-channel-model";
import LeaveServerModal from "../modals/leave-server-modal";
import DeleteServerModal from "../modals/delete-server-modal";
import DeleteChannelModal from "../modals/delete-channel-modal";
import EditChannelModal from "../modals/edit-channel-modal";
import MessageFileModal from "../modals/Message-file-modal";
import DeleteMessageModal from "../modals/delete-message-modal";

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
      <LeaveServerModal />
      <DeleteServerModal />
      <DeleteChannelModal />
      <EditChannelModal />
      <MessageFileModal />
      <DeleteMessageModal />
    </>
  );
};
