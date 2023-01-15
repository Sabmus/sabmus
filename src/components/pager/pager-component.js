import React from "react";
import { Link } from "gatsby";

import { PagerWrapper } from "./pager-styles";

const Pager = ({ pages }) => {
  const { previousPagePath, nextPagePath, humanPageNumber, numberOfPages } =
    pages;

  return (
    <PagerWrapper>
      <span>
        <Link
          to={previousPagePath}
          className={previousPagePath ? "" : "disabled"}
        >
          Previous
        </Link>
      </span>
      <span>{`${humanPageNumber} of ${numberOfPages}`}</span>
      <span>
        <Link to={nextPagePath} className={nextPagePath ? "" : "disabled"}>
          Next
        </Link>
      </span>
    </PagerWrapper>
  );
};

export default Pager;
