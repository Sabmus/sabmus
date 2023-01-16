import React from "react";
import { graphql } from "gatsby";

import BlogsContainer from "./blogs-container";
import Blogs from "../components/blogs/blogs-component";

const BlogTags = ({ data, pageContext }) => {
  const posts = data.allMarkdownRemark.nodes;

  return (
    <BlogsContainer>
      <Blogs posts={posts} pageContext={pageContext} title={pageContext.eq} />
    </BlogsContainer>
  );
};

export default BlogTags;

export const blogsTagsQuery = graphql`
  query ($skip: Int!, $limit: Int!, $eq: String = "") {
    allMarkdownRemark(
      sort: { frontmatter: { date: DESC } }
      skip: $skip
      limit: $limit
      filter: { frontmatter: { tags: { eq: $eq } } }
    ) {
      nodes {
        excerpt
        id
        frontmatter {
          categories
          date(formatString: "MMMM D, YYYY")
          description
          tags
          title
        }
        fields {
          slug
        }
      }
    }
  }
`;
