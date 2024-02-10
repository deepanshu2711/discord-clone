import { currentprofile } from "@/lib/current-profile"
import { NextResponse } from "next/server"

import {v4 as uuidv4} from "uuid"

import prisma from "@/lib/db";

export async function PATCH(req:Request,{params}:{params:{serverId:string}}) {
    try {
        const profile = await currentprofile();
        if(!profile) return new NextResponse("unauthorized" ,{status:401})
        if(!params.serverId) return new NextResponse("ServerId missing" ,{status:400})
        const server = await prisma.server.update({
            where:{
                id:params.serverId,
                profileid:profile.id
            },
            data:{
                inviteCode: uuidv4()
            }
        })
        return NextResponse.json(server)
    } catch (error) {
        console.log("SERVER_ID",error)
        return new NextResponse("Internal error" ,{status:500})
    }
}