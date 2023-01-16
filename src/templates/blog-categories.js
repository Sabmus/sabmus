import React from "react";
import { graphql } from "gatsby";

import BlogsContainer from "../templates/blogs-container";
import Blogs from "../components/blogs/blogs-component";

const BlogCategories = ({ data, pageContext }) => {
  const posts = data.allMarkdownRemark.nodes;

  return (
    <BlogsContainer>
      <Blogs posts={posts} pageContext={pageContext} title={pageContext.eq} />
    </BlogsContainer>
  );
};

export default BlogCategories;

export const blogsCategoriesQuery = graphql`
  query ($skip: Int!, $limit: Int!, $eq: String = "") {
    allMarkdownRemark(
      sort: { frontmatter: { date: DESC } }
      skip: $skip
      limit: $limit
      filter: { frontmatter: { categories: { eq: $eq } } }
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
