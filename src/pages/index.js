import * as React from "react"
import { Link, graphql } from "gatsby"

import Welcome from "../components/welcome/welcome-component"
import Layout from "../components/layout"
import Seo from "../components/seo"

import {
  LastPostWrapper,
  PostsWrapper,
  PostsHead,
} from "../styles/pages/index/index-styles"

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const posts = data.allMarkdownRemark.nodes

  return (
    <Layout location={location} title={siteTitle}>
      <Welcome />

      <LastPostWrapper>
        <h2>Last Posts</h2>

        {posts.map(post => (
          <PostsWrapper key={post.id}>
            <PostsHead>
              <Link to={post.fields.slug}>
                <h4>{post.frontmatter.title || "No-title!"}</h4>
              </Link>
              <span>{post.frontmatter.date}</span>
            </PostsHead>
            <div>
              <p>
                <em>{post.frontmatter.description || post.excerpt}</em>
              </p>
            </div>
          </PostsWrapper>
        ))}
      </LastPostWrapper>
    </Layout>
  )
}

export default BlogIndex

export const Head = () => <Seo title="All posts" />

export const pageQuery = graphql`
  query pageData($limit: Int = 3) {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { frontmatter: { date: DESC } }, limit: $limit) {
      nodes {
        excerpt
        fields {
          slug
        }
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          title
          description
        }
        id
      }
    }
  }
`
