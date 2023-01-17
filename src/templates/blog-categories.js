import React from "react";
import { graphql } from "gatsby";

import BlogsContainer from "../templates/blogs-container";
import Blogs from "../components/blogs/blogs-component";

const BlogCategories = ({ data, pageContext }) => {
  const posts = data.allFile.nodes;

  return (
    <BlogsContainer>
      <Blogs posts={posts} pageContext={pageContext} title={pageContext.eq} />
    </BlogsContainer>
  );
};

export default BlogCategories;

export const blogsCategoriesQuery = graphql`
  query ($skip: Int!, $limit: Int!, $eq: String = "") {
    allFile(
      filter: {
        sourceInstanceName: { eq: "blog" }
        extension: { eq: "md" }
        childMarkdownRemark: { frontmatter: { categories: { eq: $eq } } }
      }
      sort: { childMarkdownRemark: { frontmatter: { date: DESC } } }
      skip: $skip
      limit: $limit
    ) {
      nodes {
        childMarkdownRemark {
          id
          fields {
            slug
          }
          excerpt
          frontmatter {
            categories
            date(formatString: "MMMM D, YYYY")
            description
            tags
            title
          }
        }
      }
    }
  }
`;
