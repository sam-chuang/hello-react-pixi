import { Stage, Sprite } from "@inlet/react-pixi/dist/react-pixi.cjs"
import React from "React"
import { render } from "react-dom"


const App = () => (
    <Stage
        width={500} 
        height={500} 
        options={{ backgroundColor: 0x012b30 }}>
        <Sprite
            image="https://s3-us-west-2.amazonaws.com/s.cdpn.io/693612/IaUrttj.png"
            x={100}
            y={100}
        />
    </Stage>
)

render(
    <App />, 
    document.body
)