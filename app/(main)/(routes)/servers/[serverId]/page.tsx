import { currentprofile } from "@/lib/current-profile";
import { redirectToSignIn } from "@clerk/nextjs";

import prisma from "@/lib/db";
import { redirect } from "next/navigation";

interface ServerIdPageprops {
  params: {
    serverId: string;
  };
}

const ServerIdPage = async ({ params }: ServerIdPageprops) => {
  const profile = await currentprofile();

  if (!profile) {
    return redirectToSignIn();
  }

  const server = await prisma.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
    include: {
      channels: {
        where: {
          name: "general",
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  const initialChannel = server?.channels[0];

  if (initialChannel?.name !== "general") {
    return null;
  }

  return redirect(`/servers/${params.serverId}/channels/${initialChannel.id}`);
};

export default ServerIdPage;
