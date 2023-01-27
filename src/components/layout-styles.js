import styled from "styled-components";

export const GlobalWrapper = styled.div`
  display: flex;
  justify-content: center;
  min-height: 100vh;
`;
export const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: var(--maxWidth-wrapper);
  padding: var(--spacing-1) var(--spacing-2);

  @media screen and (max-width: 1100px) {
    min-width: 800px;
  }

  @media screen and (max-width: 800px) {
    min-width: 500px;
  }

  @media screen and (max-width: 500px) {
    min-width: 280px;
  }
`;

export const Content = styled.main`
  flex: 1 1;
`;
