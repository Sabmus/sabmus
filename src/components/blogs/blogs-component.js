import React from "react";

import Post from "../post/post-component";
import Pager from "../pager/pager-component";

import { BlogsWrapper } from "./blogs-styles";

const Blogs = ({ posts, pageContext, title }) => {
  return (
    <BlogsWrapper>
      <h3>{title ? title : ""}</h3>
      {posts.map(post => (
        <Post
          key={post.childMarkdownRemark.id}
          post={post.childMarkdownRemark}
        />
      ))}
      <Pager pages={pageContext} />
    </BlogsWrapper>
  );
};

export default Blogs;
