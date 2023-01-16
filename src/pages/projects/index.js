import React from "react";
import Layout from "../../components/layout";
import { useStaticQuery, graphql } from "gatsby";

import Project from "../../components/project/project-component";

import {
  ProjectWrapper,
  ProjectGrid,
} from "../../styles/pages/projects/projects-styles";

const Projects = () => {
  const projectData = useStaticQuery(graphql`
    {
      allFile(
        filter: {
          sourceInstanceName: { eq: "projects" }
          extension: { eq: "md" }
        }
        sort: { childMarkdownRemark: { frontmatter: { date: DESC } } }
      ) {
        edges {
          node {
            id
            childMarkdownRemark {
              frontmatter {
                name
                url
                date(formatString: "MMMM D, YYYY")
                tags
                imageFile {
                  childImageSharp {
                    gatsbyImageData
                  }
                }
              }
              html
            }
          }
        }
      }
    }
  `);

  return (
    <Layout>
      <ProjectWrapper>
        <p>
          Welcome to my portfolio of projects. This page contains all projects
          that I've done, or currently working on.
        </p>
        <ProjectGrid>
          {projectData.allFile.edges.map(project => (
            <Project key={project.node.id} project={project} />
          ))}
        </ProjectGrid>
      </ProjectWrapper>
    </Layout>
  );
};

export default Projects;
