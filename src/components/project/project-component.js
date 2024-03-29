import React from "react";
import { GatsbyImage, getImage } from "gatsby-plugin-image";

import { MainGrid, ProjectHeader, ProjectTags } from "./project-styles";

const Project = ({ project }) => {
  const { name, url, date, tags, imageFile } =
    project.node.childMarkdownRemark.frontmatter;
  const imageObj = getImage(imageFile);

  return (
    <MainGrid>
      <ProjectHeader>
        <a href={url} target="_blank" rel="noreferrer">
          <span>{name}</span>
        </a>{" "}
        <span className="date">{date}</span>
      </ProjectHeader>

      {/* <a href={url} target="_blank" rel="noreferrer"> */}
      <GatsbyImage
        image={imageObj}
        loading="eager"
        layout="constrained"
        style={{ maxHeight: "148px" }}
        alt="Screenshot"
        formats={["auto", "webp", "avif"]}
        quality={75}
        className="screenshot-container"
      />
      {/* </a> */}
      <ProjectTags>
        {tags.map(tag => (
          <span key={tag}>{tag}</span>
        ))}
      </ProjectTags>
      <div>
        <p
          dangerouslySetInnerHTML={{
            __html: project.node.childMarkdownRemark.html,
          }}
        />
      </div>
    </MainGrid>
  );
};

export default Project;
