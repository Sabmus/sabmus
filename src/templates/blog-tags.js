import React from "react";
import { graphql } from "gatsby";

import Layout from "../components/layout";

const BlogTags = ({ data }) => {
  return (
    <Layout>
      <div>blog tags</div>
    </Layout>
  );
};

export default BlogTags;

export const blogTagsQuery = graphql`
  query ($tag: String = "") {
    allMarkdownRemark(filter: { frontmatter: { tags: { eq: $tag } } }) {
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
