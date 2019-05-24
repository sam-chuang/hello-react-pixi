
import { Graphics, Container, useApp } from "@inlet/react-pixi"
import React, { useMemo } from "react"

const create = (props) =>  {
    let { amount, height, color } = props
    let { screen } = useApp()

    return useMemo(() => {
        let mountains = []
        const mountainWidth = screen.width / amount
        for (let i = 0; i < amount; i++) {
            mountains.push((
                <Graphics 
                    key={i}
                    draw={graphics => {
                        graphics.beginFill(color)

                        graphics.moveTo(i * mountainWidth, screen.height)
                        graphics.lineTo(i * mountainWidth + mountainWidth, screen.height)
                        graphics.lineTo(i * mountainWidth + mountainWidth / 2, screen.height - height)
                        graphics.lineTo(i * mountainWidth, screen.height)

                        graphics.endFill()
                    }}
                />
            ))
        }
        return mountains
    }, [ amount, height, color, screen.width, screen.height ])
}

export default function (props) {
    
    let mountains = create(props)
    return (
        <Container>
            {mountains}
        </Container>
    )
}