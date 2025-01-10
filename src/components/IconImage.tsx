"use client"
import classNames from "classnames"
import Image from "next/image"
import { useState } from "react"
const IconImage = ({ iconParam, size }: { iconParam: string | undefined, size: number, }) => {
    const [icon, setIcon] = useState(iconParam)
    return (<Image height={size} width={size} src={icon ? icon : "/alt-cryptosymbol.png"} alt={''} className={classNames("!mt-0 aspect-square rounded-full border",`size-${size}`)}
        onError={() => setIcon("/alt-cryptosymbol.png")}
    />)
}

export default IconImage