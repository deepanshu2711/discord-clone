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
        const {messageId,serverId,channelId} = req.query
        const {content} = req.body

        if(!profile){
            return res.status(401).json({error:"Unauthorized"})
        }

        if(!serverId){
            return res.status(401).json({error:"Server Id missing"})
        }

        if(!channelId){
            return res.status(401).json({error:"Channel Id missing"})
        }

        if(!messageId){
            return res.status(401).json({error:"Message Id missing"})
        }

        const server = await prisma.server.findFirst({
            where:{
                id:serverId as string,
                members:{
                    some:{
                        profileId:profile.id
                    }
                }
            },
            include:{
                members:true
            }
        })

        if(!server){
            return res.status(401).json({error:"server not found"})
        }

        const channel = await prisma.channel.findFirst({
            where:{
                id:channelId as string,
                serverId:serverId as string
            }
        })

        if(!channel){
            return res.status(401).json({error:"Channel not found"})
        }

        const member = server.members.find((member) =>member.profileId === profile.id)

        if(!member){
            return res.status(401).json({error:"You are not a member of the server"})
        }

        let message = await prisma.message.findFirst({
            where:{
                id:messageId as string,
                channelId: channelId as string
            },
            include:{
                member:{
                    include:{
                        profile:true
                    }
                }
            }
        })

        if(!message || message.deleted){
            return res.status(401).json({error:"Message not found"})
        }

        const isMessageOwner = message.memberId === member.id
        const isAdmin  = member.role === MemberRole.ADMIN
        const isModerator  = member.role === MemberRole.MODERATOR
        const CanModify = isMessageOwner || isAdmin || isModerator

        if(!CanModify){
            return res.status(401).json({error:"You are not authorized to delete this message"})
        }

        if(req.method === "DELETE"){
            message = await prisma.message.update({
                where:{
                    id:messageId as string
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

            message = await prisma.message.update({
                where:{
                    id:messageId as string
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

        const updateKey = `chat:${channelId}:messages:update`;
        res?.socket?.server?.io?.emit(updateKey,message);

        return res.status(200).json(message);

    } catch (error) {
        console.log("MESSAGE_ID_ERROR",error)
        return res.status(500).json({error:"Something went wrong"})
    }
    
}