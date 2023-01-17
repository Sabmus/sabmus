import React from "react";
import Seo from "../components/seo";
import { graphql } from "gatsby";

import BlogsContainer from "./blogs-container";
import Blogs from "../components/blogs/blogs-component";

const BlogsAll = ({ data, pageContext }) => {
  const posts = data.allFile.nodes;
  console.log(posts);

  return (
    <BlogsContainer>
      <Blogs posts={posts} pageContext={pageContext} title={"All Posts"} />
    </BlogsContainer>
  );
};

export default BlogsAll;

export const Head = () => <Seo title="All Blogs" />;

export const allBlogsQuery = graphql`
  query ($skip: Int!, $limit: Int!) {
    allFile(
      filter: { sourceInstanceName: { eq: "blog" }, extension: { eq: "md" } }
      sort: { childMarkdownRemark: { frontmatter: { date: DESC } } }
      skip: $skip
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
