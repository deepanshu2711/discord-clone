import { currentprofile } from "@/lib/current-profile";
import prisma from "@/lib/db";

import { ChannelType } from "@prisma/client";
import { redirect } from "next/navigation";
import ServerHeader from "./server-Header";

interface ServerSidebarProps {
  serverId: string;
}
const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {
  const profile = await currentprofile();
  if (!profile) return redirect("/");

  const server = await prisma.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        },
      },
    },
  });

  const TextChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.TEXT
  );
  const AudioChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.AUDIO
  );
  const VedioChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.VEDIO
  );
  const members = server?.members.map(
    (member) => member.profileId !== profile.id
  );

  if (!server) {
    return redirect("/");
  }

  const role = server.members.find(
    (member) => member.profileId === profile.id
  )?.role;

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <ServerHeader server={server} role={role} />
    </div>
  );
};

export default ServerSidebar;
