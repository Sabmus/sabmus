import styled from "styled-components";

export const ImageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: var(--spacing-2);
  border-radius: 5px;
  padding: var(--spacing-1) var(--spacing-2);

  h3 {
    margin-bottom: var(--spacing-4);
  }

  @media screen and (max-width: 400px) {
    h3 {
      font-size: var(--fontSize-3);
    }
  }
`;
