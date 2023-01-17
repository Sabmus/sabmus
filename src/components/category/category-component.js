import React from "react";
import { useStaticQuery, graphql, Link } from "gatsby";

import { CategoryElement } from "./category-styles";

const Category = () => {
  const categoriesObj = useStaticQuery(graphql`
    query {
      allFile(
        filter: { sourceInstanceName: { eq: "blog" }, extension: { eq: "md" } }
        sort: { childMarkdownRemark: { frontmatter: { date: DESC } } }
      ) {
        categories: group(
          field: {
            childMarkdownRemark: { frontmatter: { categories: SELECT } }
          }
        ) {
          name: fieldValue
          count: totalCount
        }
      }
    }
  `);

  const categories = categoriesObj.allFile.categories;
  categories.sort((a, b) => b.count - a.count);

  return (
    <>
      {categories.map(category => (
        <CategoryElement key={category.name}>
          <Link to={`/blog/${category.name}`}>{category.name}</Link>
          <span>{category.count}</span>
        </CategoryElement>
      ))}
    </>
  );
};

export default Category;
