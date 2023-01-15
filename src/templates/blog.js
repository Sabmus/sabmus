import React from "react";
import { Link, graphql } from "gatsby";

import Layout from "../components/layout";
import Post from "../components/post/post-component";
import Pager from "../components/pager/pager-component";

const Blog = ({ data, pageContext }) => {
  const posts = data.allMarkdownRemark.nodes;
  console.log(pageContext);

  return (
    <Layout>
      <Link to="/">Home</Link>

      {posts.map(post => (
        <Post key={post.id} post={post} />
      ))}

      <Pager pages={pageContext} />
    </Layout>
  );
};

export default Blog;

export const query = graphql`
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
