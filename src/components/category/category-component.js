import React from "react";
import { useStaticQuery, graphql } from "gatsby";

import { CategoryElement } from "./category-styles";

const Category = () => {
  const categoriesObj = useStaticQuery(graphql`
    query {
      allMarkdownRemark {
        categories: group(field: { frontmatter: { categories: SELECT } }) {
          name: fieldValue
          count: totalCount
        }
      }
    }
  `);

  const categories = categoriesObj.allMarkdownRemark.categories;
  categories.sort((a, b) => b.count - a.count);

  return (
    <>
      {categories.map(category => (
        <CategoryElement key={category.name}>
          <span>{category.name}</span>
          <span>{category.count}</span>
        </CategoryElement>
      ))}
    </>
  );
};

export default Category;
