import React, { useState } from "react";
import { graphql } from "gatsby";

import Layout from "../components/layout";
import Post from "../components/post/post-component";
import Categories from "../components/categories/categories-component";
import Category from "../components/category/category-component";
import Pager from "../components/pager/pager-component";

import {
  ContentWrapper,
  CollapsibleCategories,
  CollapsibleButton,
} from "../styles/templates/blog-styles";

const Blog = ({ data, pageContext }) => {
  const [show, setShow] = useState(false);

  const posts = data.allMarkdownRemark.nodes;

  const onClickCollapseHandle = () => {
    setShow(!show);
  };

  return (
    <Layout>
      <ContentWrapper>
        <div className="blogs">
          {posts.map(post => (
            <Post key={post.id} post={post} />
          ))}
        </div>
        <div className="categories">
          <Categories />
        </div>
        <CollapsibleCategories>
          <CollapsibleButton type="button" onClick={onClickCollapseHandle}>
            Categories
          </CollapsibleButton>

          <div
            className="collapseCategories"
            style={{
              height: show
                ? `${
                    document.querySelector(".collapseCategories").scrollHeight
                  }px`
                : null,
            }}
          >
            <Category />
          </div>
        </CollapsibleCategories>
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
