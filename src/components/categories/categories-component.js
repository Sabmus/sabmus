import React from "react";

import Category from "../../components/category/category-component";

import { CategoriesWrapper, CategoryWrapper } from "./categories-styles";

const Categories = () => {
  return (
    <CategoriesWrapper>
      <div>
        <h4>Categories</h4>
        <CategoryWrapper>
          <Category />
        </CategoryWrapper>
      </div>
    </CategoriesWrapper>
  );
};

export default Categories;
