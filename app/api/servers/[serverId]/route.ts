import { currentprofile } from "@/lib/current-profile"
import { NextResponse } from "next/server"

import prisma from "@/lib/db";

export async function PATCH(req:Request,{params}:{params:{serverId:string}}) {
    try {
        const profile = await currentprofile();
        const {name,imageUrl} = await req.json();
        if(!profile) return new NextResponse("unauthorized" ,{status:401})
        if(!params.serverId) return new NextResponse("ServerId missing" ,{status:400})
        
        const server = await prisma.server.update({
            where:{
                id:params.serverId,
                profileid:profile.id
            },
            data:{
                name:name,
                imageUrl:imageUrl
            }
        })

        return NextResponse.json(server)
    } catch (error) {
        console.log(error)
        return new NextResponse("Internal error" ,{status:500})
    }
    
}

export async function DELETE(req:Request,{params}:{params:{serverId:string}}) {
    try {
        const profile = await currentprofile();
        if(!profile) return new NextResponse("unauthorized" ,{status:401})
        if(!params.serverId) return new NextResponse("ServerId missing" ,{status:400})
        
        const server = await prisma.server.delete({
            where:{
                id:params.serverId,
                profileid:profile.id
            }
        })

        return NextResponse.json(server)
    } catch (error) {
        console.log(error)
        return new NextResponse("Internal error" ,{status:500})
    }
    
}