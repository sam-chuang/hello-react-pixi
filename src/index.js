import { Stage, Sprite } from "@inlet/react-pixi"
import React, { useReducer, useMemo } from "react"
import { render } from "react-dom"
import { StarsDispatch } from "./context"
import Star, { reducer as starsReducer, Action } from "./star"
import { Gradient as BackgroundGradient } from "./background"
import usInterval from "./useInterval"
import Mountain from "./mountain"
import { randomIntegerFromRange } from "./number"

const width = 800
const height = 600

const backgroundStars = []
for (let i = 0; i < 100; i++) {
    backgroundStars.push({
        id: Math.random().toString(36),
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 3
    })
}

const newFallingStar = radius => (
    {
        id: Math.random().toString(36),
        falling: true,
        x: width / 2 - radius,
        y: randomIntegerFromRange(radius, radius * 1.5),
        radius,
        velocity: { 
            x: randomIntegerFromRange(-2, 2), 
            y: randomIntegerFromRange(3, 6)
        }
    }
)

const App = () => {

    let [ stars, dispatch ] = useReducer(starsReducer, [ newFallingStar(25) ])

    usInterval(() => {
        if (stars.length == 0) {
            dispatch({
                action: Action.Add,
                star: newFallingStar(25)
            })
        }
    }, 4000)

    return (
        <Stage
            width={width} 
            height={height} 
            options={{ 
                antialias: true,
                transparent: true,
                sharedTicker: true
            }}>
            <BackgroundGradient 
                width={width} 
                height={height} />
            {useMemo(
                () => backgroundStars.map(star => (
                    <Star 
                        key={star.id}
                        {...star}
                    />
                )),
                backgroundStars  
            )}
            <Mountain 
                amount={1}
                height={height - 100}
                color={0x384551}/>
            <Mountain 
                amount={2}
                height={height - 150}
                color={0x2B3843}/>
            <Mountain 
                amount={3}
                height={height - 200}
                color={0x26333E}/>
            <Sprite
                image="https://s3-us-west-2.amazonaws.com/s.cdpn.io/693612/IaUrttj.png"
                x={100}
                y={100}
            />
            <StarsDispatch.Provider value={dispatch}>
                {
                    stars.map(star => (
                        <Star 
                            key={star.id}
                            {...star}/>
                    ))
                }
            </StarsDispatch.Provider>
        </Stage>
    )
}

render(
    <App />, 
    document.getElementById("app")
)


const Lab = shadowEffect

const shadowEffect = () => {
    const canvas = document.createElement("canvas")
    const c = canvas.getContext("2d")

    c.beginPath()
    c.arc(20, 20, 20, 0, Math.PI * 2, false)
    c.fillStyle = "red"
    c.shadowColor = "blue"
    c.shadowBlur = 20
    c.fill()
    c.closePath()

    return canvas
}

const backgroundGradientEffect = () => {
    const canvas = document.createElement("canvas")
    canvas.width = width
    canvas.height = height

    const ctx = canvas.getContext("2d")
    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, "#171E26")
    gradient.addColorStop(1, "#3F586B")

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

    return canvas
}

//document.getElementById("lab").appendChild(Lab())