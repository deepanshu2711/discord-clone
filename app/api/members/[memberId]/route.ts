import { currentprofile } from "@/lib/current-profile"
import { NextResponse } from "next/server"
import prisma from "@/lib/db"

export async function PATCH(req:Request,{params}:{params:{memberId:string}}) {
    try {
        const profile = await currentprofile()
        const {searchParams} = new URL(req.url)
        const {role} = await req.json();

        const serverId = searchParams.get("serverId")

        if(!profile) return new NextResponse("Unauthorized" ,{status:401})
        if(!serverId) return new NextResponse("ServerId missing" ,{status:400})
        if(!params.memberId) return new NextResponse("MemberId missing" ,{status:400})

        const server = await prisma.server.update({
            where:{
                id:serverId,
                profileid:profile.id
            },
            data:{
                members:{
                    update:{
                        where:{
                            id:params.memberId,
                            profileId:{
                                not:profile.id
                            }
                        },
                        data:{
                            role
                        }
                    }
                }
            },
            include:{
                members:{
                    include:{
                        profile:true
                    },
                    orderBy:{
                        role:"asc"
                    }
                }
            }
        })
        return NextResponse.json(server)

    } catch (error) {
        console.log("MEMBERID_PATCH" ,error)
        return new NextResponse("Internal error" ,{status:500})
    }
}


export async function DELETE(req:Request,{params}:{params:{memberId:string}}) {
    try {
        const profile = await currentprofile();
        const {searchParams} = new URL(req.url)
        const serverId = searchParams.get("serverId")

        if(!profile) return new NextResponse("Unauthorized",{status:401})
        if(!serverId) return new NextResponse("ServerId missing",{status:400})
        if(!params.memberId) return new NextResponse("MemberId missing",{status:400})
        const server = await prisma.server.update({
            where:{
                id:serverId,
                profileid:profile.id
            },
            data:{
                members:{
                    deleteMany:{
                        id:params.memberId,
                        profileId:{
                            not:profile.id
                        }
                    }
                }
            },
            include:{
                members:{
                    include:{
                        profile:true
                    },
                    orderBy:{
                        role:"asc"
                    }
                }
            }
        })
        return NextResponse.json(server);
    } catch (error) {
        console.log("MEMBER_ID_DELETE",error)
        return new NextResponse("Internal error" ,{status:500})
    }
    
}