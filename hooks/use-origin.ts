import { useEffect, useState } from "react"

export const useOrigin =() =>{
    const [mounted,setmounter] = useState(false);

    useEffect(() =>{
        setmounter(true);
    },[])

    const origin = typeof window !== "undefined" && window.location.origin ? window.location.origin :"";

    if(!mounted) return "";
    
    return origin;
}