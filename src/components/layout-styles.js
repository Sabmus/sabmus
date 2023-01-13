import styled from "styled-components"

export const GlobalWrapper = styled.div`
  display: flex;
  justify-content: center;
  min-height: 100vh;
`
export const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: var(--maxWidth-wrapper);
  padding: var(--spacing-1) var(--spacing-2);

  @media screen and (max-width: 600px) {
    min-width: 280px;
  }
`

export const Content = styled.main`
  flex: 1 1;
`
