import { Member, Server,Profile } from "@prisma/client"

export type ServerWithMenbersWithProfile = Server & {
    members:(Member & {profile:Profile})[];
}