import React from "react";
import { graphql } from "gatsby";

import Layout from "../components/layout";

const BlogCategories = ({ data }) => {
  return (
    <Layout>
      <div>blog categories</div>
    </Layout>
  );
};

export default BlogCategories;

export const blogCategoriesQuery = graphql`
  query ($category: String = "") {
    allMarkdownRemark(
      filter: { frontmatter: { categories: { eq: $category } } }
    ) {
      nodes {
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
`;
