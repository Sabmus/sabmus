import React from "react"
import { useStaticQuery, graphql } from "gatsby"

import { FooterWrapper, LinkWrapper } from "./footer-styles"

const Footer = () => {
  const rrssData = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          rrss {
            name
            url
          }
        }
      }
    }
  `)

  return (
    <FooterWrapper>
      <LinkWrapper>
        {rrssData.site.siteMetadata.rrss.map(rs => (
          <a href={rs.url} target="_blank" rel="noreferrer">
            {rs.name}
          </a>
        ))}
      </LinkWrapper>
      <div>
        <code>
          created by <span>Sabmus</span>
        </code>
      </div>
    </FooterWrapper>
  )
}

export default Footer
