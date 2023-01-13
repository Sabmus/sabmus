import React from "react"
import { graphql, useStaticQuery, Link } from "gatsby"

import { NavContainer, Nav } from "./navigation-styles"

const Navigation = () => {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          navRoutes {
            name
            path
          }
        }
      }
    }
  `)

  return (
    <NavContainer>
      <Nav>
        {data.site.siteMetadata.navRoutes.map(route => (
          <div key={route.name}>
            <Link to={route.path} activeClassName="active">
              {route.name}
            </Link>
          </div>
        ))}
      </Nav>
    </NavContainer>
  )
}

export default Navigation
