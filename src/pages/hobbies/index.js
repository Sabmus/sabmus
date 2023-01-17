import React from "react";
import Seo from "../../components/seo";
import Layout from "../../components/layout";
import { StaticImage } from "gatsby-plugin-image";

import { ImageWrapper } from "../../styles/pages/hobbies/hobbies-styles";

const Hobbies = () => {
  return (
    <Layout>
      <ImageWrapper>
        <h3>Under Construction</h3>
        <StaticImage
          loading="eager"
          layout="constrained"
          formats={["auto", "webp", "avif"]}
          src="../../images/underConstruction2.png"
          alt="Under Construction"
        />
      </ImageWrapper>
    </Layout>
  );
};

export default Hobbies;

export const Head = () => <Seo title="Hobbies" />;
