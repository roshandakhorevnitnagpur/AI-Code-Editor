import Image from "next/image";
import React from "react";

const Page = ()=>{
    return(
        <>
            <Image src={"/login.svg"} alt="Login-Image" height={300} width={300}/>
        </>
    )
}

export default Page;