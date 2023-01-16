import React, { useState } from "react";
import { StaticImage } from "gatsby-plugin-image";

import Layout from "../components/layout";
import Categories from "../components/categories/categories-component";
import Category from "../components/category/category-component";
import Tag from "../components/tag/tag-component";

import {
  ContentWrapper,
  CollapsibleDiv,
  CollapsibleButton,
} from "../styles/templates/blog-container-styles";

const BlogsContainer = ({ children }) => {
  const [showCategories, setShowCategories] = useState(false);
  const [showTags, setShowTags] = useState(false);

  const onClickCollapseCategoriesHandle = () => {
    setShowCategories(!showCategories);
    if (showTags) {
      setShowTags(!showTags);
    }
  };

  const onClickCollapseTagsHandle = () => {
    setShowTags(!showTags);
    if (showCategories) {
      setShowCategories(!showCategories);
    }
  };

  return (
    <Layout>
      <ContentWrapper>
        <div className="children-div">{children}</div>

        <div className="categories">
          <Categories />
        </div>
        <CollapsibleDiv>
          <CollapsibleButton
            type="button"
            onClick={onClickCollapseCategoriesHandle}
          >
            Categories
            <StaticImage
              loading="lazy"
              layout="fixed"
              formats={["auto", "webp", "avif"]}
              src="../images/down-arrow-2.png"
              width={24}
              height={24}
              quality={95}
              alt="down arrow"
              className="down-arrow-container"
              style={{ transform: showCategories ? "rotate(-180deg)" : "" }}
            />
          </CollapsibleButton>

          <div
            className="collapseCategories"
            style={{
              height: showCategories
                ? `${
                    document.querySelector(".collapseCategories").scrollHeight
                  }px`
                : null,
            }}
          >
            <Category />
          </div>
        </CollapsibleDiv>

        <CollapsibleDiv>
          <CollapsibleButton type="button" onClick={onClickCollapseTagsHandle}>
            Tags
            <StaticImage
              loading="lazy"
              layout="fixed"
              formats={["auto", "webp", "avif"]}
              src="../images/down-arrow-2.png"
              width={24}
              height={24}
              quality={95}
              alt="down arrow"
              className="down-arrow-container"
              style={{ transform: showTags ? "rotate(-180deg)" : "" }}
            />
          </CollapsibleButton>

          <div
            className="collapseTags"
            style={{
              height: showTags
                ? `${document.querySelector(".collapseTags").scrollHeight}px`
                : null,
            }}
          >
            <Tag />
          </div>
        </CollapsibleDiv>
      </ContentWrapper>
    </Layout>
  );
};

export default BlogsContainer;
