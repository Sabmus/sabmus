import React from "react";
import { useStaticQuery, graphql, Link } from "gatsby";

import { TagElement } from "./tag-styles";

const Tag = () => {
  const tagsObj = useStaticQuery(graphql`
    query {
      allFile(
        filter: { sourceInstanceName: { eq: "blog" }, extension: { eq: "md" } }
        sort: { childMarkdownRemark: { frontmatter: { date: DESC } } }
      ) {
        tags: group(
          field: { childMarkdownRemark: { frontmatter: { tags: SELECT } } }
        ) {
          name: fieldValue
          count: totalCount
        }
      }
    }
  `);

  const tags = tagsObj.allFile.tags;
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
