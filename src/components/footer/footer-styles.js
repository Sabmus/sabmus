import styled from "styled-components";

export const FooterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: var(--spacing-4);

  & .footer {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-2);
  }
`;

export const LinkWrapper = styled.div`
  display: flex;
  gap: var(--spacing-4);
`;
