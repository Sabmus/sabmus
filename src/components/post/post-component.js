import React from "react";
import { Link } from "gatsby";

import { PostsWrapper, PostsHead } from "./post-styles";

const Post = ({ post }) => {
  return (
    <PostsWrapper>
      <PostsHead>
        <Link to={post.fields.slug}>
          <h4>{post.frontmatter.title || "No-title!"}</h4>
        </Link>
        <span>{post.frontmatter.date}</span>
      </PostsHead>
      <div>
        <p>
          <em>{post.frontmatter.description || post.excerpt}</em>
        </p>
      </div>
    </PostsWrapper>
  );
};

export default Post;
