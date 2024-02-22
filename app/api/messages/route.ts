import { NextResponse } from "next/server"
import prisma from "@/lib/db"
import { currentprofile } from "@/lib/current-profile"
import { Message } from "@prisma/client";
export async function GET(req:Request) {
    try {
        const profile = currentprofile();
        const {searchParams} = new URL(req.url);
        const cursor = searchParams.get("cursor");
        const channelId =searchParams.get("channelId");
        const MESSAGES_BATCH = 10

        if(!channelId){
            return new NextResponse("ChannelId missing" ,{status:400})
        }
        if(!profile){
            return new NextResponse("UnAuthorized" ,{status:401})
        }
        let messages :Message[] = [];

        if(cursor){
            messages = await prisma.message.findMany({
                take:MESSAGES_BATCH,
                skip:1,
                cursor:{
                    id:cursor
                },
                where:{
                    channelId:channelId
                },
                include:{
                    member:{
                        include:{
                            profile:true
                        }
                    }
                },
                orderBy:{
                    createdAt:"desc"
                }
            })
        }else{
            messages = await prisma.message.findMany({
                take:MESSAGES_BATCH,
                where:{
                    channelId:channelId
                },
                include:{
                    member:{
                        include:{
                            profile:true
                        }
                    }
                },
                orderBy:{
                    createdAt:"desc"
                }
            })
        }
        
        let nextCursor = null;
    
        if(messages.length === MESSAGES_BATCH){
            nextCursor = messages[MESSAGES_BATCH-1].id
        }

        return NextResponse.json({
            items : messages,
            nextCursor : nextCursor
        })

    } catch (error) {
        console.log("MESSAGES_GET",error)
        return new NextResponse("internal error" ,{status:500})
    }
}