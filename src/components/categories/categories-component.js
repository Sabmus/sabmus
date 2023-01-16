import React from "react";

import Category from "../../components/category/category-component";
import Tag from "../../components/tag/tag-component";

import { CategoriesWrapper, CategoryWrapper } from "./categories-styles";

const Categories = () => {
  return (
    <CategoriesWrapper>
      <div className="dimension">
        <h4>Categories</h4>
        <CategoryWrapper>
          <Category />
        </CategoryWrapper>
      </div>
      <div className="dimension">
        <h4>Tags</h4>
        <CategoryWrapper>
          <Tag />
        </CategoryWrapper>
      </div>
    </CategoriesWrapper>
  );
};

export default Categories;
