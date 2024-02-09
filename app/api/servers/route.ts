import { currentprofile } from "@/lib/current-profile";
import prisma from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";
import {v4 as uuidv4} from "uuid";


export const POST =async(req:Request) =>{
    try {
        const {name,imageUrl} = await req.json();      
        const profile = await currentprofile();

        if(!profile){
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const server = await prisma.server.create({
            data:{
                profileid:profile.id,
                name:name,
                imageUrl:imageUrl,
                inviteCode:uuidv4(),
                channels:{
                    create:[
                        { name:"general" , profileId:profile.id}
                    ]
                },
                members:{
                    create:[
                        {profileId:profile.id ,role:MemberRole.ADMIN}
                    ]
                }

            }
        })
        return NextResponse.json(server);

    } catch (error) {
        console.log("[SERVERS_POST]",error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}