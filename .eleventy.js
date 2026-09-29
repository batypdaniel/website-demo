// ─────────────────────────────────────────────────────────────────────────────
// ELEVENTY CONFIGURATION
// This file configures how Eleventy builds your static site
// Documentation: https://www.11ty.dev/docs/config/
// ─────────────────────────────────────────────────────────────────────────────

// 📦 Plugin Imports
const pluginImages = require("@codestitchofficial/eleventy-plugin-sharp-images");
const pluginMinifier = require("@codestitchofficial/eleventy-plugin-minify");
const pluginSitemap = require("@quasibit/eleventy-plugin-sitemap");

// ⚙️ Configuration Files
const configSitemap = require("./src/config/plugins/sitemap");
const configImages = require("./src/config/plugins/images");

// 🔧 Processing Functions
const less = require("./src/config/processors/less");
const javascript = require("./src/config/processors/javascript");

// 🛠️ Utilities
const filterPostDate = require("./src/config/filters/postDate");
const filterIsoDate = require("./src/config/filters/isoDate");
const filterTitleCase = require("./src/config/filters/titleCase");
const isProduction = process.env.ELEVENTY_ENV === "PROD";
const isPreview = ["branch-deploy", "deploy-preview"].includes(process.env.CONTEXT); // Netlify preview builds

module.exports = function (eleventyConfig) {
	// ═════════════════════════════════════════════════════════════════════════
	// LANGUAGES
	// Using Eleventy's build events to process non-template languages
	// Learn more: https://www.11ty.dev/docs/events/
	// ═════════════════════════════════════════════════════════════════════════

	/*
	 * JavaScript & CSS Processing
	 * These processors handle bundling, transpiling, and minification
	 * - JavaScript: Compiled with esbuild for modern bundling
	 * - CSS/LESS: Processed and minified for production, including a PostCSS pipeline
	 */
	eleventyConfig.on("eleventy.after", javascript);
	eleventyConfig.on("eleventy.after", less);

	// ═════════════════════════════════════════════════════════════════════════
	// PLUGINS
	// Extend Eleventy with additional functionality
	// Learn more: https://www.11ty.dev/docs/plugins/
	// ═════════════════════════════════════════════════════════════════════════

	/*
	 * 🖼️ Image Optimization
	 * Resize and optimize images for better performance using {% getUrl %}
	 * Documentation: https://github.com/CodeStitchOfficial/eleventy-plugin-sharp-images
	 */
	eleventyConfig.addPlugin(pluginImages, configImages);

	/*
	 * 🗺️ Sitemap Generation
	 * Creates sitemap.xml automatically using domain from _data/client.json
	 * Documentation: https://github.com/quasibit/eleventy-plugin-sitemap
	 */
	eleventyConfig.addPlugin(pluginSitemap, configSitemap);

	/*
	 * 📦 Production Minification
	 * Minifies HTML, CSS, JSON, XML, XSL, and webmanifest files
	 * Only runs during production builds (npm run build)
	 * Documentation: https://github.com/CodeStitchOfficial/eleventy-plugin-minify
	 */
	if (isProduction) {
		eleventyConfig.addPlugin(pluginMinifier);
	}

	// ═════════════════════════════════════════════════════════════════════════
	// PASSTHROUGH COPIES
	// Copy files directly to output without processing
	// Learn more: https://www.11ty.dev/docs/copy/
	// ═════════════════════════════════════════════════════════════════════════

	eleventyConfig.addPassthroughCopy("./src/assets"); // Static assets
	eleventyConfig.addPassthroughCopy("./src/admin"); // CMS admin files
	eleventyConfig.addPassthroughCopy("./src/_redirects"); // Redirect rules

	// ═════════════════════════════════════════════════════════════════════════
	// FILTERS
	// Transform data in templates at build time
	// Learn more: https://www.11ty.dev/docs/filters/
	// ═════════════════════════════════════════════════════════════════════════

	// Custom filter to convert file slug to title case (e.g., about-us -> About Us)
	eleventyConfig.addFilter("titleCase", filterTitleCase);

	/*
	 * 📅 Human-Readable Date Formatting Filter
	 * Converts JavaScript dates to human-readable format
	 * Usage: {{ "2023-12-02" | postDate }}
	 * Powered by Luxon: https://moment.github.io/luxon/api-docs/
	 */
	eleventyConfig.addFilter("postDate", filterPostDate);

	/*
	 * 📅 ISO Date Formatting Filter
	 * Converts JavaScript dates to ISO 8601 format
	 * Usage: {{ "2023-12-02" | isoDate }}
	 * Powered by Luxon: https://moment.github.io/luxon/api-docs/
	 */
	eleventyConfig.addFilter("isoDate", filterIsoDate);

	// ═════════════════════════════════════════════════════════════════════════
	// COLLECTIONS
	// Learn more: https://www.11ty.dev/docs/collections/
	// ═════════════════════════════════════════════════════════════════════════

	/*
	 * 📝 Drafts
	 * Any Markdown file with "draft: true" is skipped in production builds (npm run build),
	 * but still shows up locally with npm start and on Netlify branch deploys / deploy previews.
	 */
	eleventyConfig.addPreprocessor("drafts", "md", (data) => {
		if (data.draft && isProduction && !isPreview) return false;
	});

	/*
	 * 🧪 Work / Demos (src/content/work/)
	 * workItems: every published demo, sorted by the "order" front matter field
	 * featuredWork: the first 3 with "featured: true", shown on the home page
	 */
	const byOrder = (a, b) => (a.data.order ?? 99) - (b.data.order ?? 99);
	eleventyConfig.addCollection("workItems", (api) => api.getFilteredByTag("work").sort(byOrder));
	eleventyConfig.addCollection("featuredWork", (api) =>
		api.getFilteredByTag("work").filter((item) => item.data.featured).sort(byOrder).slice(0, 3)
	);

	// Removes the current page from a collection (e.g. "More work" on a demo page)
	eleventyConfig.addFilter("withoutUrl", (items, url) => items.filter((item) => item.url !== url));
	// Work items that list a given service slug in their "relatedServices" front matter
	eleventyConfig.addFilter("relatedTo", (items, slug) => items.filter((item) => (item.data.relatedServices || []).includes(slug)));

	// ═════════════════════════════════════════════════════════════════════════
	// SHORTCODES
	// Generate dynamic content with JavaScript
	// Learn more: https://www.11ty.dev/docs/shortcodes/
	// ═════════════════════════════════════════════════════════════════════════

	/*
	 * 📆 Current Year Shortcode
	 * Outputs the current year (useful for copyright notices)
	 * Usage: {% year %}
	 * Updates automatically with each build
	 */
	eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

	// ═════════════════════════════════════════════════════════════════════════
	// BUILD CONFIGURATION
	// Define input/output directories and template engine
	// ═════════════════════════════════════════════════════════════════════════

	return {
		dir: {
			input: "src", // Source files directory
			output: "public", // Build output directory
			includes: "_includes", // Partial templates directory
			data: "_data", // Global data files directory
		},
		htmlTemplateEngine: "njk", // Nunjucks for HTML templates
	};
};
