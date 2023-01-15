import React from "react";
import { Link, graphql } from "gatsby";

import Layout from "../components/layout";
import Post from "../components/post/post-component";
import Categories from "../components/categories/categories-component";
import Pager from "../components/pager/pager-component";

import {
  ContentWrapper,
  BlogWrapper,
  SideWrapper,
} from "../styles/templates/blog-styles";

const Blog = ({ data, pageContext }) => {
  console.log(data);
  const posts = data.allMarkdownRemark.nodes;
  const tags = data.allMarkdownRemark.tags;

  return (
    <Layout>
      <Link to="/">Home</Link>

      <ContentWrapper>
        <BlogWrapper>
          {posts.map(post => (
            <Post key={post.id} post={post} />
          ))}
        </BlogWrapper>
        <SideWrapper>
          <Categories />
        </SideWrapper>
      </ContentWrapper>

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
      tags: distinct(field: { frontmatter: { tags: SELECT } })
    }
  }
`;
