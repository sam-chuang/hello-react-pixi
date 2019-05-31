import { Sprite, useTick, useApp } from "@inlet/react-pixi"
import React, { useContext } from "react"
import { randomIntegerFromRange, randomFloatFromRange } from "./number"
import { Texture } from "pixi.js"
import { updateById } from "./list"
import { StarsDispatch } from "./context"
import memoize from "fast-memoize"

export const DefaultColor = "#FAFDEC"
const DefaultShadowColor = "#E3EAEF"

const Add = "Add"
const Update = "Update"

export const Action = {
    Add,
    Update
}

export const reducer = (stars, { action, star, delta = 1, screen }) => {
    let { id } = star
    switch (action) {
        case Add:
            stars.push(star)
            break
        case Update:
            stars = updateById(
                id, 
                () => move(star, { delta, screen }),
                stars
            )
            break
        default:
            throw Error("illegal action!")
    }

    return stars.filter(isAlive)
}

const hitBottom = ({ y, radius, velocity }, height) => y + radius + velocity.y > height

const shatter = star => {
    let { miniStars = [], radius, color = DefaultColor} = star
    const MinRadius = 2
    radius -= 10
    if (radius < MinRadius) {
        radius = MinRadius
    }

    const MaxSize = 32
    let size = miniStars.length > MaxSize ? 0 : 16
    for (let i = 0; i < size ; i++) {
        let miniStar = Object.assign(
            {}, 
            star, 
            {
                id: Math.random().toString(36),
                radius,
                color,
                velocity: {
                    x: randomIntegerFromRange(-5, 5),
                    y: randomIntegerFromRange(-15, 15)
                },
                gravity: randomFloatFromRange(0.1, 0.4),
                timeToLife: 100,
                alpha: 1
            }
        )
        miniStars.push(miniStar)
    }
    return miniStars
}

const isAlive = ({ radius, miniStars = [], timeToLife = null }) => {
    return radius > 0 
        || (Number.isFinite(timeToLife) && timeToLife > 0)
        || (miniStars.length > 0)
}

const move = (star, context) => {
    let { miniStars = [] } = star
    miniStars = moveMini(miniStars, context)

    let { screen } = context
    if (hitBottom(star, screen.height)) {
        star = bounce(star)
        if (star.radius > 0) {
            miniStars = shatter(star)
        }
    } else {
        star = accelerate(star, context)
    }

    return changePosition(
        { ...star, miniStars }, 
        context
    )
}

const moveMini = (stars = [], context) => 
    stars.reduce((result, star) => {
        let { timeToLife, alpha = 1 } = star
        timeToLife -= 1
        if (timeToLife <= 0) {
            return result
        }

        alpha -= 1 / timeToLife
        if (alpha <= 0.1) {
            return result
        }

        let { screen } = context
        if (hitBottom(star, screen.height)) {
            star = bounce(star)
            if (star.radius < 0) {
                return result
            }
        } else {
            star = accelerate(star)
        }

        star = changePosition(star, context)
        let { x } = star
        if (x < 0 || x > context.screen.width) {
            return result
        }

        result.push(star)
        return result
    }, [])

const bounce = ({ radius = 0, ...star }) => {
    radius -= 5
    if (radius <= 0) {
        return {
            ...star,
            radius
        }
    }

    let { velocity, friction = 0.8 } = star
    velocity.y = -velocity.y * friction

    return {
        ...star,
        radius,
        velocity
    }
}

const accelerate = star => {
    let { velocity = {}, gravity = 1 } = star
    return {
        ...star,
        velocity: {
            x: velocity.x,
            y: velocity.y + gravity
        }
    }
}

const changePosition = (star, { delta, screen }) => {
    let { x, y, radius, velocity = {} } = star
    x += delta * velocity.x
    y += delta * velocity.y
    y = Math.min(y, screen.height - radius)

    return {
        ...star,
        x,
        y
    }
}

const Star = ( props ) => {
    let dispatch = useContext(StarsDispatch)
    let app = useApp()
    let { screen } = app
    let { falling = false } = props
    
    useTick(
        delta => dispatch({ action: Update, star: props, delta, screen }), 
        falling
    )

    let { miniStars = [], ...star } = props
    return (
        <>
            {
                star.radius > 0 && 
                    <Sprite 
                        {...star}
                        texture={starTexture({ radius: star.radius, color: star.color })}
                    />
            }
            {
                miniStars.map(miniStar => {
                    return (
                        <Sprite 
                            key={miniStar.id}
                            {...miniStar}
                            texture={starTexture({ radius: miniStar.radius, color: miniStar.color })}
                        />
                    )
                })
            }
        </>
    )
}

//TODO: auto clear cache
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

export default Star