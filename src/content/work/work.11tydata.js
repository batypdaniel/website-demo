// ─────────────────────────────────────────────────────────────────────────────
// WORK / DEMOS - shared settings for every file in src/content/work/
// Each Markdown file becomes a page at /demos/<url>/ and a card on /demos/,
// the home page and every related /services/<slug>/ page.
//
// Set `draft: true` in a file's front matter to hide it from production builds
// (npm run build / Netlify). Drafts still show up locally with `npm start`.
// ─────────────────────────────────────────────────────────────────────────────

// (Drafts are skipped by the "drafts" preprocessor in .eleventy.js.)

module.exports = {
    layout: "layouts/work.html",
    tags: "work",
    eleventyComputed: {
        permalink: (data) => `/demos/${data.url}/index.html`,
    },
};
