import React from "react";
import { graphql } from "gatsby";

import BlogsContainer from "./blogs-container";
import Blogs from "../components/blogs/blogs-component";

const BlogsAll = ({ data, pageContext }) => {
  const posts = data.allMarkdownRemark.nodes;

  return (
    <BlogsContainer>
      <Blogs posts={posts} pageContext={pageContext} title={"All Posts"} />
    </BlogsContainer>
  );
};

export default BlogsAll;

export const allBlogsQuery = graphql`
  query ($skip: Int!, $limit: Int!) {
    allMarkdownRemark(
      sort: { frontmatter: { date: DESC } }
      skip: $skip
      limit: $limit
    ) {
      nodes {
        excerpt
        id
        frontmatter {
          title
          description
          date(formatString: "MMMM D, YYYY")
        }
        fields {
          slug
        }
      }
    }
  }
`;
