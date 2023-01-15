import React from "react";
import { useStaticQuery, graphql } from "gatsby";

import { CategoriesWrapper, CategoryWrapper } from "./categories-styles";

const Categories = () => {
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
    <CategoriesWrapper>
      <h4>Categories</h4>
      {categories.map(category => (
        <CategoryWrapper key={category.name}>
          <span>{category.name}</span>
          <span>{category.count}</span>
        </CategoryWrapper>
      ))}
    </CategoriesWrapper>
  );
};

export default Categories;
