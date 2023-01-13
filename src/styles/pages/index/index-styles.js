import styled from "styled-components"

export const LastPostWrapper = styled.div`
  & h2 {
    text-align: center;
    margin-top: var(--spacing-8);
  }
`

export const PostsWrapper = styled.div`
  padding: var(--spacing-1) var(--spacing-2);
  border: 2px solid transparent;
  border-left: none;
  border-right: none;
  border-bottom-color: var(--color-honey-yellow);
  margin-top: var(--spacing-5);
`

export const PostsHead = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
