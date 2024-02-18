import {Server as NetServer} from "http"
import { NextApiRequest } from "next";
import { Server as ServerIo } from "socket.io";

import { NextApiResponceServerIo } from "@/types";

export const config = {
    api: {
        bodyParser: false
    }
}


const ioHandler =(req:NextApiRequest, res:NextApiResponceServerIo) => {
    if(!res.socket.server.io){
        const path = "/api/socket/io"
        const httpServer:NetServer = res.socket.server as any
        const io = new ServerIo(httpServer, {
            path:path,
            addTrailingSlash:false
        })
        res.socket.server.io = io
    }    
    res.end()
}
export default ioHandler