// ─────────────────────────────────────────────────────────────────────────────
// RAG DEMO DOCUMENTS
// Converts the Word files in src/_data/rag-docs/ to HTML at build time for the
// AI Customer Service Assistant demo's document viewer. The .docx files are only
// read here - they are not published.
//
// Each file name (without .docx) must match a document "id" in ragDemo.json.
// Word heading styles become headings. Documents with no styles at all are
// tidied up instead: the first paragraph becomes the title and short numbered
// paragraphs like "2. Frame Warranty Terms" become section headings.
// ─────────────────────────────────────────────────────────────────────────────

const fs = require("fs");
const path = require("path");
const mammoth = require("mammoth");

const DOCS_DIR = path.join(__dirname, "rag-docs");

// Word styles -> HTML. The document title is shown as an h3 and sections as h4
// so they sit below the page's own headings.
const styleMap = ["p[style-name='Title'] => h3:fresh", "p[style-name='Heading 1'] => h4:fresh", "p[style-name='Heading 2'] => h5:fresh", "p[style-name='Heading 3'] => h6:fresh"];

const SECTION_HEADING = /^<p>(\d+(\.\d+)*\.?\s[^<]{1,90})<\/p>$/;

function promoteHeadings(html) {
	// Only infer headings when the document has none of its own
	if (/<h[1-6][ >]/.test(html)) return html;
	const blocks = html.split(/(?=<(?:p|ul|ol|table|h\d)[ >])/);
	return blocks
		.map((block, i) => {
			if (i === 0 && /^<p>[^<]{1,120}<\/p>$/.test(block)) return block.replace(/^<p>(.*)<\/p>$/, "<h3>$1</h3>");
			const match = block.match(SECTION_HEADING);
			return match ? `<h4>${match[1]}</h4>` : block;
		})
		.join("");
}

module.exports = async function () {
	const docs = {};
	if (!fs.existsSync(DOCS_DIR)) return docs;

	for (const file of fs.readdirSync(DOCS_DIR)) {
		if (path.extname(file).toLowerCase() !== ".docx" || file.startsWith("~$")) continue;
		const id = path.basename(file, path.extname(file));
		const result = await mammoth.convertToHtml({ path: path.join(DOCS_DIR, file) }, { styleMap });
		result.messages.filter((m) => m.type === "error").forEach((m) => console.warn(`[ragDocuments] ${file}: ${m.message}`));
		docs[id] = promoteHeadings(result.value);
	}
	return docs;
};
