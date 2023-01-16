/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-node/
 */

const path = require(`path`);
const { createFilePath } = require(`gatsby-source-filesystem`);
const { paginate } = require(`gatsby-awesome-pagination`);

const blogPost = path.resolve(`./src/templates/blog-post.js`);
const BlogsAll = path.resolve(`./src/templates/blogs-all.js`);
const blogCategories = path.resolve("./src/templates/blog-categories.js");
const blogTags = path.resolve("./src/templates/blog-tags.js");

const postPerPage = 2;

/**
 * @type {import('gatsby').GatsbyNode['createPages']}
 */
exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions;

  // Get all markdown blog posts sorted by date
  const result = await graphql(`
    {
      allMarkdownRemark(sort: { frontmatter: { date: ASC } }, limit: 1000) {
        nodes {
          id
          fields {
            slug
          }
        }
        groupByCategory: group(field: { frontmatter: { categories: SELECT } }) {
          name: fieldValue
          nodes {
            id
          }
        }
        groupByTag: group(field: { frontmatter: { tags: SELECT } }) {
          name: fieldValue
          nodes {
            id
          }
        }
      }
    }
  `);

  if (result.errors) {
    reporter.panicOnBuild(
      `There was an error loading your blog posts`,
      result.errors
    );
    return;
  }

  const posts = result.data.allMarkdownRemark.nodes;
  const categories = result.data.allMarkdownRemark.groupByCategory;
  const tags = result.data.allMarkdownRemark.groupByTag;

  // for pagination blog pages
  paginate({
    createPage,
    items: posts,
    itemsPerPage: postPerPage,
    pathPrefix: "/blog",
    component: BlogsAll,
  });

  // Create blog posts pages
  // But only if there's at least one markdown file found at "content/blog" (defined in gatsby-config.js)
  // `context` is available in the template as a prop and as a variable in GraphQL
  if (posts.length > 0) {
    posts.forEach((post, index) => {
      const previousPostId = index === 0 ? null : posts[index - 1].id;
      const nextPostId =
        index === posts.length - 1 ? null : posts[index + 1].id;

      createPage({
        path: post.fields.slug,
        component: blogPost,
        context: {
          id: post.id,
          previousPostId,
          nextPostId,
        },
      });
    });
  }

  // create pages for every category
  if (categories.length > 0) {
    categories.forEach(category => {
      paginate({
        createPage,
        items: category.nodes,
        itemsPerPage: postPerPage,
        pathPrefix: "/blog/" + category.name,
        component: blogCategories,
        context: {
          //in: category.nodes.map(obj => obj.id),
          eq: category.name,
        },
      });
    });
  }

  // create pages for every tag
  if (tags.length > 0) {
    tags.forEach(tag => {
      paginate({
        createPage,
        items: tag.nodes,
        itemsPerPage: postPerPage,
        pathPrefix: "/blog/" + tag.name,
        component: blogTags,
        context: {
          //in: tag.nodes.map(obj => obj.id),
          eq: tag.name,
        },
      });
    });
  }
};

/**
 * @type {import('gatsby').GatsbyNode['onCreateNode']}
 */
exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode });

    createNodeField({
      name: `slug`,
      node,
      value: "/blog" + value,
    });
  }
};

/**
 * @type {import('gatsby').GatsbyNode['createSchemaCustomization']}
 */
exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;

  // Explicitly define the siteMetadata {} object
  // This way those will always be defined even if removed from gatsby-config.js

  // Also explicitly define the Markdown frontmatter
  // This way the "MarkdownRemark" queries will return `null` even when no
  // blog posts are stored inside "content/blog" instead of returning an error
  createTypes(`
    type SiteSiteMetadata {
      author: Author
      siteUrl: String
      social: Social
    }

    type Author {
      name: String
      summary: String
    }

    type Social {
      twitter: String
    }

    type MarkdownRemark implements Node {
      frontmatter: Frontmatter
      fields: Fields
    }

    type Frontmatter {
      title: String
      description: String
      date: Date @dateformat
    }

    type Fields {
      slug: String
    }
  `);
};
