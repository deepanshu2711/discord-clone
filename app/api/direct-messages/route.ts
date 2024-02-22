import { NextResponse } from "next/server"
import prisma from "@/lib/db"
import { currentprofile } from "@/lib/current-profile"
import { DirectMessage } from "@prisma/client";
export async function GET(req:Request) {
    try {
        const profile = currentprofile();
        const {searchParams} = new URL(req.url);
        const cursor = searchParams.get("cursor");
        const conversationId =searchParams.get("conversationId");
        const MESSAGES_BATCH = 10

        if(!conversationId){
            return new NextResponse("conversationId missing" ,{status:400})
        }
        if(!profile){
            return new NextResponse("UnAuthorized" ,{status:401})
        }
        let messages :DirectMessage[] = [];

        if(cursor){
            messages = await prisma.directMessage.findMany({
                take:MESSAGES_BATCH,
                skip:1,
                cursor:{
                    id:cursor
                },
                where:{
                    conversationId
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
            messages = await prisma.directMessage.findMany({
                take:MESSAGES_BATCH,
                where:{
                    conversationId
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
        console.log("DIRECT_MESSAGES_GET",error)
        return new NextResponse("internal error" ,{status:500})
    }
}