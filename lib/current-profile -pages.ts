import { getAuth } from "@clerk/nextjs/server";

import prisma from "./db";
import { NextApiRequest } from "next";

export const currentprofilePages =async(req:NextApiRequest) =>{
    const {userId} = getAuth(req);
    if(!userId){
        return null
    }

    const profile = await prisma.profile.findUnique({
        where:{
            userId
        }
    });

    return profile;
}