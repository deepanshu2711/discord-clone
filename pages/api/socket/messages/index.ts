
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
        const {serverId,channelId} = req.query

        if(!profile){
            return res.status(401).json({error:"Unauthorized"});
        }
        if(!serverId){
            return res.status(401).json({error:"Server Id missing"});
        }
        if(!channelId){
            return res.status(401).json({error:"Channel Id missing"});
        }
        if(!content){
            return res.status(401).json({error:"Content missing"});
        }

        const server = await prisma.server.findUnique({
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
        });

        if(!server){
            return res.status(401).json({error:"Server not found"});
        }

        const channel = await prisma.channel.findUnique({
            where:{
                id:channelId as string,
                serverId:server.id as string
            }
        });

        if(!channel){
            return res.status(401).json({error:"Channel not found"});
        }
        const member = server.members.find((member) => member.profileId === profile.id);

        if(!member){
            return res.status(401).json({error:"You are not a member of the server"});
        }

        const message = await prisma.message.create({
            data:{
                content,
                fileUrl,
                memberId:member.id,
                channelId:channel.id
            },
            include:{
                member:{
                    include:{
                        profile:true
                    }
                }
            }
        });

        const channelKey = `chat:${channelId}:messages`;

        res?.socket?.server?.io?.emit(channelKey, message);

        return res.status(200).json({message});

    } catch (error) {
        console.log("MESSAGES_POST" ,error)
        return res.status(500).json({error:"Internal error"});
    }
}