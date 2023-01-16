import styled from "styled-components";

export const CategoriesWrapper = styled.div`
  text-align: center;

  & .dimension {
    margin-bottom: var(--spacing-4);
  }

  & h4 {
    margin-bottom: var(--spacing-2);
    color: var(--color-uranian-blue);
  }
`;

export const CategoryWrapper = styled.div`
  padding: var(--spacing-1) var(--spacing-2);
  border: 1px solid var(--color-border-bottom);
  border-radius: 5px;

  @media screen and (max-width: 730px) {
    display: block;
  }
`;
