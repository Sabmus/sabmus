import React from "react"
import { Link } from "gatsby"

import { HeaderWrapper } from "./header-styles"

const Header = () => {
  return (
    <HeaderWrapper>
      <div>
        <Link to="/">Sabmus</Link>
      </div>
      <div>theme</div>
    </HeaderWrapper>
  )
}

export default Header
