import { Graphics, Container, useTick, useApp } from "@inlet/react-pixi"
import React from "react"
import { randomFromRange } from "./number"

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

const shatter = star => {
    let { miniStars = [] } = star
    let size = 8
    for (let i = 0; i < size ; i++) {
        let miniStar = Object.assign(
            {}, 
            star, 
            {
                id: Math.random().toString(36),
                miniStars: [],
                radius: 2,
                color: 0x7FDBFF,
                velocity: {
                    x: randomFromRange(-5, 5),
                    y: randomFromRange(-15, 15)
                },
                gravity: 0.1,
                timeToLife: 100,
                alpha: 1
            }
        )
        miniStars.push(miniStar)
    }
    return miniStars
}

//TODO: need delta?
const move = (stars, screen) => 
    stars.map(star => {
        let { x, y, timeToLife, alpha = 1, velocity, friction = 0.8, gravity = 1 } = star
        if (hitBottom(star, screen.height)) {
            velocity.y = -velocity.y * friction
        } else {
            velocity.y += gravity
        }

        x += velocity.x
        y += velocity.y
        timeToLife -= 1
        alpha -= 1 / timeToLife
        return {
            ...star,
            x,
            y,
            timeToLife,
            alpha
        }
    })

export default function Star ( props ) {
    let app = useApp()

    useTick(delta => {
        let { screen } = app
        let { y, radius, velocity, friction = 0.8, gravity = 1, update, miniStars = [] } = props

        miniStars = move(miniStars, screen).filter(({ timeToLife, alpha }) => timeToLife > 0 && alpha > 0)
        if (miniStars.length === 0 && radius <= 0) {//done
            //TODO: remove tick?
            return
        }

        if (hitBottom(props, screen.height)) {
            velocity.y = -velocity.y * friction
            radius -= 3
            if (radius > 0) {
                miniStars = shatter(props)
            }
        } else {
            velocity.y += gravity
        }

        y +=  delta * velocity.y
        y = Math.min(y, screen.height - radius)

        update({
            ...props,
            radius,
            y,
            miniStars
        })
    })

    let { miniStars = [], ...star } = props
    return (
        <Container>
            {
                star.radius > 0 && 
                    <Graphics
                        {...star}
                        draw={graphics => draw(props, graphics)}>
                    </Graphics>
            }
            {
                miniStars.map(miniStar => (
                    <Graphics
                        key={miniStar.id}
                        {...miniStar}
                        draw={graphics => {
                            draw(miniStar, graphics)
                        }}
                        >
                    </Graphics>
                ))
            }
        </Container>
    )
}