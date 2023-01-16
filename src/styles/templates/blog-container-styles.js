import styled from "styled-components";

export const CollapsibleDiv = styled.div`
  display: none;

  & .collapseCategories,
  .collapseTags {
    overflow: hidden;
    height: 0;
    will-change: height;
    transition: height 350ms ease-in-out 0s;
  }
`;

export const CollapsibleButton = styled.button`
  display: flex;
  justify-content: space-between;
  width: 100%;
  background-color: transparent;
  color: white;
  border: 1px solid var(--color-uranian-blue);
  border-radius: 5px;
  box-shadow: 0px 1px 2px var(--color-uranian-blue);

  & .down-arrow-container {
    transform: rotate(0deg);
    transition: transform 350ms ease-in-out 0s;
  }
`;

export const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: var(--spacing-12);
  margin-top: var(--spacing-8);

  @media screen and (max-width: 730px) {
    display: flex;
    flex-direction: column;
    margin-top: var(--spacing-2);
    gap: var(--spacing-2);

    & .categories {
      display: none;
    }

    ${CollapsibleDiv} {
      display: block;
      order: -1;
    }

    & .children-div {
      margin-top: var(--spacing-4);
    }
  }
`;
