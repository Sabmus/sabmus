import React from "react";
import Seo from "../../components/seo";
import Layout from "../../components/layout";
import { Link } from "gatsby";

const Hobbies = () => {
  return (
    <Layout>
      <div>this is the main Hobbies page</div>
      <Link to="/">Home</Link>
    </Layout>
  );
};

export default Hobbies;

export const Head = () => <Seo title="Hobbies" />;
