import { currentprofilePages } from "@/lib/current-profile -pages";
import { NextApiResponceServerIo } from "@/types";
import { NextApiRequest } from "next";
import prisma from "@/lib/db";
import { MemberRole } from "@prisma/client";


export default async function handler(req:NextApiRequest , res:NextApiResponceServerIo) {

    if(req.method !== "DELETE" && req.method !== "PATCH"){
        return res.status(405).json({error:"methon not allowed"})

    }

    try {
        const profile = await currentprofilePages(req);
        const {directMessageId , conversationId} = req.query
        const {content} = req.body

        if(!profile){
            return res.status(401).json({error:"Unauthorized"})
        }

        if(!conversationId){
            return res.status(401).json({error:"conversation Id missing"})
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
        })

        if(!conversation){
            return res.status(401).json({error:"conversation not found"})
        }

        const member = conversation.memberOne.profileId === profile.id ?conversation.memberOne:conversation.memberTwo

        if(!member){
            return res.status(401).json({error:"You are not a member of the server"})
        }

        let directMessage = await prisma.directMessage.findFirst({
            where:{
                id:directMessageId as string,
                conversationId: conversationId as string
            },
            include:{
                member:{
                    include:{
                        profile:true
                    }
                }
            }
        })

        if(!directMessage || directMessage.deleted){
            return res.status(401).json({error:"Message not found"})
        }

        const isMessageOwner = directMessage.memberId === member.id
        const isAdmin  = member.role === MemberRole.ADMIN
        const isModerator  = member.role === MemberRole.MODERATOR
        const CanModify = isMessageOwner || isAdmin || isModerator

        if(!CanModify){
            return res.status(401).json({error:"You are not authorized to delete this message"})
        }

        if(req.method === "DELETE"){
            directMessage = await prisma.directMessage.update({
                where:{
                    id:directMessageId as string
                },
                data:{
                    fileUrl:null,
                    content:"This messages has been deleted",
                    deleted:true
                },
                include:{
                    member:{
                        include:{
                            profile:true
                        }
                    }
                }

            })
        }
        
        if(req.method === "PATCH"){

            if(!isMessageOwner){
                return res.status(401).json({error:"Unauthorized"})
            }

            directMessage = await prisma.directMessage.update({
                where:{
                    id:directMessageId as string
                },
                data:{
                    content:content
                },
                include:{
                    member:{
                        include:{
                            profile:true
                        }
                    }
                }

            })
        }

        const updateKey = `chat:${conversation.id}:messages:update`;
        res?.socket?.server?.io?.emit(updateKey,directMessage);

        return res.status(200).json(directMessage);

    } catch (error) {
        console.log("MESSAGE_ID_ERROR",error)
        return res.status(500).json({error:"Something went wrong"})
    }
    
}