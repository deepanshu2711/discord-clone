import { currentprofile } from "@/lib/current-profile";
import prisma from "@/lib/db";

import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface InviteCodePageprops {
  params: {
    inviteCode: string;
  };
}

const InviteCodePage = async ({ params }: InviteCodePageprops) => {
  const profile = await currentprofile();
  if (!profile) return redirectToSignIn();
  if (!params.inviteCode) return redirect("/");

  const existingServer = await prisma.server.findFirst({
    where: {
      inviteCode: params.inviteCode,
      members: { some: { profileId: profile.id } },
    },
  });

  if (existingServer) return redirect(`/servers/${existingServer.id}`);

  const server = await prisma.server.update({
    where: {
      inviteCode: params.inviteCode,
    },
    data: {
      members: {
        create: [{ profileId: profile.id }],
      },
    },
  });

  if (server) return redirect(`/servers/${server.id}`);

  return null;
};

export default InviteCodePage;
