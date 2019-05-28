import { Sprite, Container, useTick, useApp } from "@inlet/react-pixi"
import React, { useCallback, useMemo } from "react"
import { randomFromRange } from "./number"
import { Texture } from "pixi.js"
import { GlowFilter  } from "@pixi/filter-glow"
import { OutlineFilter } from "@pixi/filter-outline"
import memoize from "fast-memoize"

export const DefaultColor = "#FAFDEC"
const DefaultShadowColor = "#E3EAEF"

const starTexture = memoize(props => {
    let { radius, color = DefaultColor, shadow = { color: DefaultShadowColor, blur: 20 } } = props
    const canvas = document.createElement("canvas")
    let size = radius * 2 + shadow.blur * 2
    canvas.width = size
    canvas.height = size

    const c = canvas.getContext("2d")
    c.beginPath()
    c.arc(radius + shadow.blur, radius + shadow.blur, radius, 0, Math.PI * 2, false)
    c.fillStyle = color
    c.shadowColor = shadow.color
    c.shadowBlur = shadow.blur
    c.fill()
    c.closePath()
    let result = Texture.from(canvas)    
    result.defaultAnchor.set(0.5)

    return result
})

const miniStartTexture = memoize(props => {
    let { color: DefaultColor, radius, shadow = { color: DefaultShadowColor, blur: 20 } } = props
    const canvas = document.createElement("canvas")
    const c = canvas.getContext("2d")

    c.beginPath()
    c.arc(0, 0, radius, 0, Math.PI * 2, false)
    c.fillStyle = DefaultColor
    c.shadowColor = shadow.color
    c.shadowBlur = shadow.blur
    c.fill()
    c.closePath()

    return Texture.from(canvas)
})

const hitBottom = ({ y, radius, velocity }, height) => y + radius + velocity.y > height

const shatter = star => {
    let { miniStars = [], color = DefaultColor} = star
    let size = 32
    for (let i = 0; i < size ; i++) {
        let miniStar = Object.assign(
            {}, 
            star, 
            {
                id: Math.random().toString(36),
                miniStars: [],
                radius: 2,
                color,
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

const move = (stars, screen) => 
    stars.reduce((result, star) => {
        let { x, y, timeToLife, alpha = 1, velocity, friction = 0.8, gravity = 1 } = star
        timeToLife -= 1
        if (timeToLife <= 0) {
            return result
        }

        alpha -= 1 / timeToLife
        if (alpha <= 0.1) {
            return result
        }

        if (hitBottom(star, screen.height)) {
            velocity.y = -velocity.y * friction
        } else {
            velocity.y += gravity
        }

        x += velocity.x
        y += velocity.y
        
        result.push({
            ...star,
            x,
            y,
            timeToLife,
            alpha
        })
        return result 
    }, [])

export default function Star ( props ) {
    let app = useApp()
    let { falling = false } = props

    useTick(delta => {
        let { screen } = app
        let { y, radius, velocity, friction = 0.8, gravity = 1, update, miniStars = [] } = props

        miniStars = move(miniStars, screen)
        if (miniStars.length === 0 && radius <= 0) {//done
            update({
                ...props,
                miniStars: [],
                falling: false
            })
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
    }, falling)

    let { miniStars = [], ...star } = props
    return (
        <Container>
            {
                star.radius > 0 && 
                    <Sprite 
                        {...star}
                        texture={starTexture({ radius: star.radius, color: star.color })}
                    />
            }
            {
                miniStars.map((miniStar) => (
                    <Sprite 
                        key={miniStar.id}
                        {...miniStar}
                        texture={miniStartTexture({ radius: miniStar.radius, color: miniStar.color })}
                    />
                ))
            }
        </Container>
    )
}