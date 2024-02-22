
import { currentprofilePages } from "@/lib/current-profile -pages";
import { NextApiResponceServerIo } from "@/types";
import { NextApiRequest } from "next";

import prisma from "@/lib/db";

export default async function handler(req:NextApiRequest, res:NextApiResponceServerIo){
    if(req.method !== "POST"){
        return res.status(405).json({error:"Method not allowerd"});
    }

    try {
        const profile  = await currentprofilePages(req);
        const {content ,fileUrl} = req.body
        const {conversationId} = req.query

        if(!profile){
            return res.status(401).json({error:"Unauthorized"});
        }
        if(!conversationId){
            return res.status(401).json({error:"conversation Id missing"});
        }
        if(!content){
            return res.status(401).json({error:"Content missing"});
        }

        
        const conversation = await prisma.conversation.findFirst({
            where:{
                id:conversationId as string,
                OR:[
                    {
                        memberOne:{
                            profileId:profile.id
                        }
                    },
                    {
                        memberTwo:{
                            profileId:profile.id
                        }
                    }
                ]
            },
            include:{
                memberOne:{
                    include:{
                        profile:true
                    }
                },
                memberTwo:{
                    include:{
                        profile:true
                    }
                }
            }
        });


        if(!conversation){
            return res.status(401).json({error:"Conversation not found"});
        }

        const member = conversation.memberOne.profileId === profile.id?conversation.memberOne:conversation.memberTwo

        if(!member){
            return res.status(401).json({error:"You are not a member of the server"});
        }

        const message = await prisma.directMessage.create({
            data:{
                content,
                fileUrl,
                memberId:member.id,
                conversationId:conversationId as string
            },
            include:{
                member:{
                    include:{
                        profile:true
                    }
                }
            }
        });

        const channelKey = `chat:${conversationId}:messages`;

        res?.socket?.server?.io?.emit(channelKey, message);

        return res.status(200).json({message});

    } catch (error) {
        console.log("DIRECT_MESSAGES_POST" ,error)
        return res.status(500).json({error:"Internal error"});
    }
}