import { NextResponse } from "next/server"
import prisma from "@/lib/db"
import { currentprofile } from "@/lib/current-profile"
import { MemberRole } from "@prisma/client";

export async function POST(req:Request) {
    try {
        const profile = await currentprofile();
        const {name ,type} = await req.json();
        const {searchParams} = new URL(req.url);
        const serverId  = searchParams.get("serverId");

        if(!profile) return new NextResponse("Unauthorized" ,{status:401});
        if(!serverId) return new NextResponse("Missing serverId" ,{status:400});

        if(name ==="general") return new NextResponse("Name cannot be general" ,{status:400});

        const server = await prisma.server.update({
            where:{
                id:serverId,
                members:{
                    some:{
                        profileId:profile.id,
                        role:{
                            in:[MemberRole.ADMIN , MemberRole.MODERATOR]
                        }
                    }
                }
            },
            data:{
                channels:{
                    create:{
                        profileId:profile.id,
                        name:name,
                        type:type
                    }
                }
            }
        })

        return NextResponse.json(server);
    } catch (error) {
        console.log("CHANNELS_POST",error)
        return new NextResponse("Internal error" ,{status:500})
    }
}