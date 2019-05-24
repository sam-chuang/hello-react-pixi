import { Texture } from "pixi.js"
import { Sprite } from "@inlet/react-pixi"
import React from "react"

export const Gradient = props => {
    let { width, height } = props

    const canvas = document.createElement("canvas")
    canvas.width = width
    canvas.height = height
    
    const ctx = canvas.getContext("2d")
    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, "#171E26")
    gradient.addColorStop(1, "#3F586B")

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

    return (
        <Sprite 
            {...props}
            texture={Texture.from(canvas)}/>
    )
}