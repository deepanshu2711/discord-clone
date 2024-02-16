import { currentprofile } from "@/lib/current-profile";
import prisma from "@/lib/db";

import { ChannelType, MemberRole } from "@prisma/client";
import { redirect } from "next/navigation";
import ServerHeader from "./server-Header";
import { ScrollArea } from "../ui/scroll-area";
import ServerSearch from "./server-search";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";
import { SelectSeparator } from "../ui/select";
import ServerSection from "./server-section";
import ServerChannel from "./server-channel";
import ServerMember from "./server-member";

interface ServerSidebarProps {
  serverId: string;
}

const IconMap = {
  [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
  [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
  [ChannelType.VEDIO]: <Video className="mr-2 h-4 w-4" />,
};

const roleIconMap = {
  [MemberRole.ADMIN]: <ShieldAlert className="mr-2 h-4 w-4 text-rose-500" />,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="mr-2 h-4 w-4 text-indigo-500" />
  ),
  [MemberRole.GUEST]: null,
};

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
  const members = server?.members.filter(
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
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <ServerSearch
            data={[
              {
                lable: "Text Channels",
                type: "channel",
                data: TextChannels?.map((channel) => ({
                  icon: IconMap[channel.type],
                  name: channel.name,
                  id: channel.id,
                })),
              },
              {
                lable: "Voice Channels",
                type: "channel",
                data: AudioChannels?.map((channel) => ({
                  icon: IconMap[channel.type],
                  name: channel.name,
                  id: channel.id,
                })),
              },
              {
                lable: "Video Channels",
                type: "channel",
                data: VedioChannels?.map((channel) => ({
                  icon: IconMap[channel.type],
                  name: channel.name,
                  id: channel.id,
                })),
              },
              {
                lable: "Members",
                type: "member",
                data: members?.map((member) => ({
                  icon: roleIconMap[member.role],
                  name: member.profile.name,
                  id: member.id,
                })),
              },
            ]}
          />
        </div>
        <SelectSeparator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
        {!!TextChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.TEXT}
              role={role}
              lable="Text Channels"
            />
            <div className="space-y-[2px]">
              {TextChannels.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  server={server}
                  role={role}
                />
              ))}
            </div>
          </div>
        )}

        {!!AudioChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.AUDIO}
              role={role}
              lable="Voice Channels"
            />
            <div className="space-y-[2px]">
              {AudioChannels.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  server={server}
                  role={role}
                />
              ))}
            </div>
          </div>
        )}

        {!!VedioChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.VEDIO}
              role={role}
              lable="Video Channels"
            />
            <div className="space-y-[2px]">
              {VedioChannels.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  server={server}
                  role={role}
                />
              ))}
            </div>
          </div>
        )}

        {!!members?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="members"
              role={role}
              lable="Members"
              server={server}
            />
            <div className="space-y-[2px]">
              {members.map((member) => (
                <ServerMember key={member.id} member={member} server={server} />
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ServerSidebar;
