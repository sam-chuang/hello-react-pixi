import { Graphics, useTick, useApp } from "@inlet/react-pixi"
import React from "react"

const draw = ( star, graphics ) => {
    const { radius, color = 0xDE3249 } = star
    const EmptyOutline = 0

    graphics.clear()
    graphics.lineStyle(EmptyOutline)
    graphics.beginFill(color, 1);
    graphics.drawCircle(0, 0, radius);
    graphics.endFill()
}

const hitBottom = ({ y, radius, velocity }, height) => y + radius + velocity.y > height

export default function Star ( props ) {
    let app = useApp()

    useTick(delta => {
        let { screen } = app
        let { y, velocity, update } = props
        

        if (hitBottom(props, screen.height)) {
            velocity.y = -velocity.y * 0.8
        } else {
            velocity.y += 1
        }

        y += delta * velocity.y

        update({
            ...props,
            y
        })
    })

    return (
        <Graphics
            {...props}
            draw={graphics => draw(props, graphics)}
        />
    )
}