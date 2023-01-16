import React from "react";
import { useStaticQuery, graphql } from "gatsby";
import { StaticImage } from "gatsby-plugin-image";

import { FooterWrapper, LinkWrapper } from "./footer-styles";

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
  `);

  return (
    <FooterWrapper>
      <LinkWrapper>
        {rrssData.site.siteMetadata.rrss.map(rs => (
          <a key={rs.name} href={rs.url} target="_blank" rel="noreferrer">
            {rs.name}
          </a>
        ))}
      </LinkWrapper>
      <div className="footer">
        <code>
          created by <span>Sabmus</span>
        </code>
        <a
          href="https://www.gatsbyjs.com/"
          target="_blank"
          rel="noreferrer"
          style={{ width: "20px", height: "20px" }}
        >
          <StaticImage
            loading="eager"
            layout="fixed"
            formats={["auto", "webp", "avif"]}
            src="../../images/gatsby-icon.png"
            width={20}
            height={20}
            quality={95}
            alt="Gatsby Icon"
            style={{ display: "inline-block" }}
          />
        </a>
      </div>
    </FooterWrapper>
  );
};

export default Footer;
