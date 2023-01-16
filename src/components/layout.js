import React from "react";

import Header from "../components/header/header-component";
import Navigation from "./navigation/navigation-component";
import Footer from "../components/footer/footer-component";

import { GlobalWrapper, MainWrapper, Content } from "./layout-styles";

const Layout = ({ title, children }) => {
  return (
    <GlobalWrapper>
      <MainWrapper>
        <Header />
        <Navigation />
        <Content>{children}</Content>
        <Footer />
      </MainWrapper>
    </GlobalWrapper>
  );
};

export default Layout;
