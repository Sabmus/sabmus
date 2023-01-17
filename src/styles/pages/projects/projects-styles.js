import styled from "styled-components";

export const ProjectWrapper = styled.div`
  p {
    margin: 0;
    margin-bottom: var(--spacing-8);
  }
`;

export const ProjectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: var(--spacing-3);
`;