
import { currentprofile } from "@/lib/current-profile"
import prisma from "@/lib/db"
import { NextResponse } from "next/server";
export async function PATCH(req:Request,{params}:{params:{serverId:string}}) {
    try {
        const profile = await currentprofile();
        if(!profile) return new NextResponse("unauthorized" ,{status:401})
        if(!params.serverId) return new NextResponse("ServerId missing" ,{status:400})
        const server = await prisma.server.update({
            where:{
                id:params.serverId,
                profileid:{
                    not:profile.id
                },
                members:{
                    some:{
                        profileId:profile.id
                    }
                }
            },
            data:{
                members:{
                    deleteMany:{
                        profileId:profile.id
                    }
                }
            }
        })
        return NextResponse.json(server)

    } catch (error) {
        console.log("LEAVE_SERVER" ,error)
        return new NextResponse("Internal error" ,{status:500})
    }
}