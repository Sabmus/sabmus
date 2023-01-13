import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"

import { WelcomeWrapper } from "./welcome-styles"

const Welcome = () => {
  const imgWidth = 130
  const imgHeight = 130
  const imgQuality = 95

  const data = useStaticQuery(graphql`
    query WelcomeQuery {
      site {
        siteMetadata {
          author {
            name
            summary
          }
        }
      }
    }
  `)

  const author = data.site.siteMetadata?.author

  return (
    <WelcomeWrapper>
      <StaticImage
        loading="eager"
        layout="fixed"
        formats={["auto", "webp", "avif"]}
        src="../../images/profile.jpg"
        width={imgWidth}
        height={imgHeight}
        quality={imgQuality}
        alt="Profile picture"
        className="hero-container"
        imgClassName="hero-img"
      />
      <div>
        <p>
          Hello there! I'm <strong>{author.name}</strong>, {author.summary}
        </p>
      </div>
    </WelcomeWrapper>
  )
}

export default Welcome
