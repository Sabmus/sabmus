import styled from "styled-components"

export const WelcomeWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: var(--spacing-1) var(--spacing-2);
  gap: var(--spacing-4);
  text-align: center;

  & :last-child {
    flex: 1 1;
    padding: var(--spacing-1) var(--spacing-0);

    p {
      margin: 0;
    }
  }

  & .hero-container {
    border-radius: 50%;

    & .hero-img {
      padding: var(--spacing-0) var(--spacing-0);
    }
  }

  @media screen and (max-width: 730px) {
    flex-direction: column;
    align-items: center;
    text-align: justify;
  }
`
