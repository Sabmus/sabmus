import styled from "styled-components"

export const NavContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: var(--spacing-2) var(--spacing-2) var(--spacing-4) var(--spacing-2);
`

export const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: var(--maxWidth-lg);
  padding-bottom: var(--spacing-2);
  margin-bottom: var(--spacing-2);
  border: 1px solid transparent;
  border-left: none;
  border-right: none;
  border-bottom-color: var(--color-border-bottom);

  & div {
    & a {
      font-size: var(--fontSize-1);
      color: var(--color-honey-yellow);

      &:hover {
        color: var(--color-honey-yellow-bright);
        text-shadow: 0 0 5px var(--color-honey-yellow-bright);
      }

      &.active {
        color: var(--color-honey-yellow-bright);
        text-shadow: 0 0 5px var(--color-honey-yellow-bright);
      }
    }
  }
`
