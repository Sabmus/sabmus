import styled from "styled-components";

export const BaseFlexDiv = styled.div`
  display: flex;
`;

export const MainGrid = styled(BaseFlexDiv)`
  flex-direction: column;
  border: 1px solid var(--color-uranian-blue);
  border-radius: 5px;
  padding: var(--spacing-1) var(--spacing-2);
`;

export const ProjectHeader = styled(BaseFlexDiv)`
  justify-content: space-between;
  align-items: center;

  & .date {
    font-size: var(--fontSize-0);
  }
`;

export const ProjectTags = styled(BaseFlexDiv)`
  justify-content: space-evenly;
`;
