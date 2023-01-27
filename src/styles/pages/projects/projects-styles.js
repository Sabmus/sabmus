import styled from "styled-components";

export const ProjectWrapper = styled.div`
  padding: var(--spacing-1) var(--spacing-2);
  p {
    margin: 0;
    margin-bottom: var(--spacing-8);
  }
`;

export const ProjectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-3);
`;
