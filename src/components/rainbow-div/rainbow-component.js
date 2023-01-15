import * as React from "react"
import { rainbow } from "./rainbow.module.css"

const RainbowDiv = ({ children }) => {
  return <div className={rainbow}>{children}</div>
}

export default RainbowDiv
