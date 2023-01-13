import React from "react"
import Layout from "../../components/layout"
import { Link } from "gatsby"

const Blog = () => {
  return (
    <Layout>
      <div>this is the main blog page</div>
      <Link to="/">Home</Link>
    </Layout>
  )
}

export default Blog
