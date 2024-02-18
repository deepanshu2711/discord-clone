import { Member, Server,Profile } from "@prisma/client"
import {Server as NetServer ,Socket} from "net"
import { NextApiResponse } from "next"
import  {Server as SocketIoServer } from "socket.io"





export type ServerWithMenbersWithProfile = Server & {
    members:(Member & {profile:Profile})[];
}

export type NextApiResponceServerIo = NextApiResponse & {
    socket:Socket &{
        server:NetServer &{
            io:SocketIoServer
        }
    }
}

