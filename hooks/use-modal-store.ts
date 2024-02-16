import { Server } from "@prisma/client";
import {create} from "zustand"

export type ModalType = "createServer" | "inviteModal" |"editServer" | "members" |"createChannel" |"leaveServer"|"deleteServer";

interface ModalData{
    server?:Server
}

interface ModalStore{
    type: ModalType | null
    data:ModalData
    isOpen:boolean
    onOpen:(type:ModalType,data?:ModalData) =>void
    onClose:() =>void
}

export const useModel = create<ModalStore>((set) =>({
    type: null,
    data:{},
    isOpen: false,
    onOpen: (type,data={}) => set({type, isOpen: true, data}),
    onClose: () => set({type: null, isOpen: false}),    
}))