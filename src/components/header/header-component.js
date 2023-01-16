import React from "react";
import { Link } from "gatsby";
import { StaticImage } from "gatsby-plugin-image";

import { HeaderWrapper } from "./header-styles";

const Header = () => {
  return (
    <HeaderWrapper>
      <div>
        <Link to="/">Sabmus</Link>
      </div>
      <div>
        <StaticImage
          loading="eager"
          layout="fixed"
          formats={["auto", "webp", "avif"]}
          src="../../images/moon.png"
          width={24}
          height={24}
          quality={95}
          alt="dark theme"
          className="moon-container"
        />
      </div>
    </HeaderWrapper>
  );
};

export default Header;
