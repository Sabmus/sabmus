import * as React from "react";
import { graphql } from "gatsby";

import Welcome from "../components/welcome/welcome-component";
import Layout from "../components/layout";
import Seo from "../components/seo";
import Post from "../components/post/post-component";

import { LastPostWrapper } from "../styles/pages/index/index-styles";

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`;
  const posts = data.allFile.nodes;

  return (
    <Layout location={location} title={siteTitle}>
      <Welcome />

      <LastPostWrapper>
        <h2>Last Posts</h2>

        {posts.map(post => (
          <Post
            key={post.childMarkdownRemark.id}
            post={post.childMarkdownRemark}
          />
        ))}
      </LastPostWrapper>
    </Layout>
  );
};

export default BlogIndex;

export const Head = () => <Seo title="All posts" />;

export const pageQuery = graphql`
  query pageData($limit: Int = 3) {
    site {
      siteMetadata {
        title
      }
    }
    allFile(
      filter: { sourceInstanceName: { eq: "blog" }, extension: { eq: "md" } }
      sort: { childMarkdownRemark: { frontmatter: { date: DESC } } }
      limit: $limit
    ) {
      nodes {
        childMarkdownRemark {
          id
          excerpt
          fields {
            slug
          }
          frontmatter {
            title
            description
            date(formatString: "MMMM D, YYYY")
          }
        }
      }
    }
  }
`;
