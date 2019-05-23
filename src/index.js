import { Stage, Sprite } from "@inlet/react-pixi"
import React, { useState } from "react"
import { render } from "react-dom"
import { updateById } from "./list"
import Star from "./star"

const App = () => {

    let [ stars, setStars] = useState([{
        id: Math.random().toString(36),
        x: 30,
        y: 30,
        radius: 30,
        velocity: { 
            x: 0, 
            y: 3 
        }
    }])

    return (
        <Stage
            width={500} 
            height={500} 
            options={{ 
                antialias: true,
                backgroundColor: 0x012b30 
            }}>
            <Sprite
                image="https://s3-us-west-2.amazonaws.com/s.cdpn.io/693612/IaUrttj.png"
                x={100}
                y={100}
            />
            {
                stars.map((props, index, stars) => (
                    <Star 
                        key={props.id}
                        {...props} 
                        update={newProps => 
                            setStars(updateById(newProps.id, () => newProps, stars))
                        }/>
                ))
            }
        </Stage>
    )
}

render(
    <App />, 
    document.body
)