import styled from "styled-components"

export const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: var(--maxHeight-sm);
  padding: var(--spacing-1) var(--spacing-2);

  & div {
    & a {
      color: var(--color-uranian-blue);

      &:hover {
        text-shadow: 0 0 5px var(--color-uranian-blue);
      }
    }
  }
`
