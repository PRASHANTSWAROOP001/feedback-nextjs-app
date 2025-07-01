"use client"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation"

type RouterAddress = {
    routeAddress:string,
    buttonName:string
}

function RouteManageButton ({routeAddress, buttonName}:RouterAddress){

    const router = useRouter()

    return(
        <Button onClick={()=>router.push(routeAddress)}>
            {buttonName}
        </Button>
    )

}

export default RouteManageButton