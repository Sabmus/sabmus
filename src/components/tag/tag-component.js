import React from "react";
import { useStaticQuery, graphql, Link } from "gatsby";

import { TagElement } from "./tag-styles";

const Tag = () => {
  const tagsObj = useStaticQuery(graphql`
    query {
      allMarkdownRemark {
        tags: group(field: { frontmatter: { tags: SELECT } }) {
          name: fieldValue
          count: totalCount
        }
      }
    }
  `);

  const tags = tagsObj.allMarkdownRemark.tags;
  tags.sort((a, b) => b.count - a.count);

  return (
    <>
      {tags.map(tag => (
        <TagElement key={tag.name}>
          <Link to={`/blog/${tag.name}`}>{tag.name}</Link>
          <span>{tag.count}</span>
        </TagElement>
      ))}
    </>
  );
};

export default Tag;
