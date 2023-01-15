import styled from "styled-components";

export const PagerWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: var(--spacing-3);
  margin-top: var(--spacing-4);

  & .disabled {
    pointer-events: none;
    color: var(--color-text-light);
  }
`;
