//
//    Interactive RAG demo (replay of pre-recorded pipeline outputs)
//    Data: <script id="rag-data"> rendered from src/_data/ragDemo.json
//

(() => {
	const root = document.getElementById("rag-demo");
	const dataEl = document.getElementById("rag-data");
	if (!root || !dataEl) return;

	const data = JSON.parse(dataEl.textContent);
	const threshold = data.config.threshold;
	const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

	// Lookups
	const chunks = {};
	data.documents.forEach((doc) => doc.chunks.forEach((c) => (chunks[c.id] = { ...c, docId: doc.id, docTitle: doc.title })));
	const questions = Object.fromEntries(data.questions.map((q) => [q.id, q]));

	// Elements
	const buttons = root.querySelectorAll(".cs-rag-q");
	const empty = root.querySelector(".cs-rag-empty");
	const steps = root.querySelector(".cs-rag-steps");
	const questionText = root.querySelector(".cs-rag-question-text");
	const retrieveStep = root.querySelector('[data-step="retrieve"]');
	const answerStep = root.querySelector('[data-step="answer"]');
	const retrievedList = root.querySelector(".cs-rag-retrieved");
	const answerEl = root.querySelector(".cs-rag-answer");
	const docsPanel = root.querySelector(".cs-rag-docs");
	const docScroll = root.querySelector(".cs-rag-doc-scroll");
	const docNote = root.querySelector(".cs-rag-docs-note");
	const tabList = root.querySelector(".cs-rag-tabs");
	const tabs = Array.from(tabList.querySelectorAll(".cs-rag-tab"));
	const docEls = Object.fromEntries(Array.from(root.querySelectorAll(".cs-rag-doc")).map((d) => [d.dataset.doc, d]));

	root.querySelector(".cs-rag-count").textContent = Object.keys(chunks).length;

	const wait = (ms) => new Promise((r) => setTimeout(r, reduceMotion ? 0 : ms));
	let runId = 0; // cancels an in-progress animation when another question is picked

	function el(tag, className, text) {
		const node = document.createElement(tag);
		if (className) node.className = className;
		if (text !== undefined) node.textContent = text;
		return node;
	}

	// ── Document viewer ──────────────────────────────────────────────────────

	function selectDoc(docId, focus = false) {
		tabs.forEach((t) => {
			const on = t.dataset.doc === docId;
			t.setAttribute("aria-selected", String(on));
			t.tabIndex = on ? 0 : -1;
			if (on && focus) t.focus({ preventScroll: true });
			// On small screens the tabs are a single swipeable row; bring the selected one into view
			if (on && tabList.scrollWidth > tabList.clientWidth) {
				const left = t.offsetLeft - tabList.offsetLeft - (tabList.clientWidth - t.offsetWidth) / 2;
				tabList.scrollTo({ left: Math.max(0, left), behavior: reduceMotion ? "auto" : "smooth" });
			}
		});
		Object.entries(docEls).forEach(([id, d]) => (d.hidden = id !== docId));
	}

	tabs.forEach((tab, i) => {
		tab.addEventListener("click", () => selectDoc(tab.dataset.doc));
		tab.addEventListener("keydown", (e) => {
			const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
			if (!step) return;
			e.preventDefault();
			selectDoc(tabs[(i + step + tabs.length) % tabs.length].dataset.doc, true);
		});
	});

	// Passages are found by their text, so they can be highlighted inside the formatted document even
	// when they span a heading and several paragraphs. Whitespace is ignored and quotes/dashes are
	// normalized, so line breaks or curly quotes that differ between the export and the .docx still match.
	const normChar = (ch) => ({ "‘": "'", "’": "'", "“": '"', "”": '"', "–": "-", "—": "-" })[ch] || ch.toLowerCase();
	const normText = (text) => Array.from(text.replace(/\s+/g, "")).map(normChar).join("");

	function findPassage(docEl, text) {
		const map = []; // normalized character index -> [text node, offset]
		let hay = "";
		const walker = document.createTreeWalker(docEl, NodeFilter.SHOW_TEXT, {
			acceptNode: (n) => (n.parentElement.closest(".cs-rag-mark-tag") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
		});
		for (let node = walker.nextNode(); node; node = walker.nextNode()) {
			const s = node.data;
			for (let i = 0; i < s.length; i++) {
				if (/\s/.test(s[i])) continue;
				hay += normChar(s[i]);
				map.push([node, i]);
			}
		}
		const needle = normText(text);
		const at = needle ? hay.indexOf(needle) : -1;
		if (at < 0) return null;
		return { start: map[at], end: map[at + needle.length - 1] };
	}

	// Wrap the matched text in <mark>s - one per text node, since a passage can cross element boundaries
	function markPassage(id, className, label) {
		const c = chunks[id];
		const docEl = c && docEls[c.docId];
		const found = docEl && findPassage(docEl, c.text);
		if (!found) {
			console.warn(`[rag-demo] Passage "${id}" was not found in document "${c?.docId}". Check that its text matches the .docx.`);
			return false;
		}
		const [startNode, startOffset] = found.start;
		const [endNode, endOffset] = found.end;
		const walker = document.createTreeWalker(docEl, NodeFilter.SHOW_TEXT);
		walker.currentNode = startNode;
		const nodes = [];
		for (let node = startNode; node; node = walker.nextNode()) {
			nodes.push(node);
			if (node === endNode) break;
		}
		const marks = [];
		nodes.forEach((node) => {
			if (node.parentElement.closest(".cs-rag-mark-tag")) return; // overlapping passages: skip another passage's label
			const from = node === startNode ? startOffset : 0;
			const to = node === endNode ? endOffset + 1 : node.data.length;
			if (!node.data.slice(from, to).trim()) return;
			const range = document.createRange();
			range.setStart(node, from);
			range.setEnd(node, to);
			const mark = el("mark", `cs-rag-mark ${className}`);
			mark.dataset.chunk = id;
			range.surroundContents(mark);
			marks.push(mark);
		});
		if (marks.length && label) {
			const tag = el("span", "cs-rag-mark-tag", label);
			tag.setAttribute("aria-hidden", "true");
			marks[0].prepend(tag);
		}
		return true;
	}

	function marksFor(id) {
		return root.querySelectorAll(`.cs-rag-mark[data-chunk="${CSS.escape(id)}"]`);
	}

	function clearMarks() {
		root.querySelectorAll(".cs-rag-mark-tag").forEach((t) => t.remove());
		root.querySelectorAll(".cs-rag-mark").forEach((m) => m.replaceWith(...m.childNodes));
		Object.values(docEls).forEach((d) => d.normalize());
		tabs.forEach((t) => {
			t.classList.remove("has-hits");
			const count = t.querySelector(".cs-rag-tab-count");
			count.hidden = true;
			count.textContent = "";
		});
		docNote.hidden = true;
	}

	// Open a passage's document, scroll it into view and flash it. The document panel scrolls on its own;
	// the page itself only scrolls when the visitor clicked (userAction), never automatically.
	function showChunk(id, userAction = true) {
		const c = chunks[id];
		if (!c) return;
		selectDoc(c.docId);
		root.querySelectorAll(".cs-rag-mark.is-active").forEach((m) => m.classList.remove("is-active"));
		root.querySelectorAll(".cs-rag-hit-btn").forEach((b) => b.setAttribute("aria-current", String(b.dataset.chunk === id)));

		const marks = marksFor(id);
		docNote.hidden = marks.length > 0;
		if (!marks.length) {
			docNote.textContent = `Passage ${id} couldn't be located in this document. The document may have changed since the passages were indexed.`;
			return;
		}

		// Line the passage's first block (heading or paragraph) up with the top of the viewer
		const behavior = reduceMotion ? "auto" : "smooth";
		const block = marks[0].closest("p, li, td, th, h1, h2, h3, h4, h5, h6") || marks[0];
		const top = block.getBoundingClientRect().top - docScroll.getBoundingClientRect().top + docScroll.scrollTop;
		docScroll.scrollTo({ top: Math.max(0, top - 12), behavior });
		if (userAction) {
			const r = docsPanel.getBoundingClientRect();
			if (r.top < 0 || r.bottom > window.innerHeight) docsPanel.scrollIntoView({ block: "nearest", behavior });
		}
		marks.forEach((m) => {
			m.classList.add("is-active");
			m.classList.remove("is-flash");
			void m.offsetWidth; // restart animation
			m.classList.add("is-flash");
		});
	}

	// Split "text [chunk-id] more text" into text + numbered citation buttons
	function renderAnswer(answer, citeNumbers) {
		const frag = document.createDocumentFragment();
		const parts = answer.split(/\[([\w-]+)\]/g);
		parts.forEach((part, i) => {
			if (i % 2 === 0) {
				if (part) frag.appendChild(document.createTextNode(part));
				return;
			}
			if (!chunks[part]) return frag.appendChild(document.createTextNode(`[${part}]`));
			if (!citeNumbers.has(part)) citeNumbers.set(part, citeNumbers.size + 1);
			const cite = el("button", "cs-rag-cite", String(citeNumbers.get(part)));
			cite.type = "button";
			cite.title = `Source: ${chunks[part].docTitle} (${part})`;
			cite.setAttribute("aria-label", `Show source ${citeNumbers.get(part)}: ${chunks[part].docTitle}`);
			cite.addEventListener("click", () => showChunk(part));
			frag.appendChild(cite);
		});
		return frag;
	}

	async function typeInto(target, fragment, id) {
		const nodes = Array.from(fragment.childNodes);
		target.textContent = "";
		for (const node of nodes) {
			if (node.nodeType !== Node.TEXT_NODE || reduceMotion) {
				target.appendChild(node);
				continue;
			}
			const words = node.textContent.split(/(\s+)/);
			const textNode = document.createTextNode("");
			target.appendChild(textNode);
			for (const w of words) {
				if (id !== runId) return;
				textNode.textContent += w;
				if (w.trim()) await wait(28);
			}
		}
	}

	async function run(qid) {
		const id = ++runId;
		const q = questions[qid];

		buttons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.q === qid)));
		empty.hidden = true;
		steps.hidden = false;
		clearMarks();
		questionText.textContent = q.question;
		retrievedList.replaceChildren();
		answerEl.replaceChildren();
		answerStep.classList.remove("is-done", "is-handoff");
		retrieveStep.classList.remove("is-done");

		// Step 2 - retrieval
		const retrieveStatus = retrieveStep.querySelector(".cs-rag-status");
		retrieveStatus.textContent = "Searching the knowledge base…";
		retrieveStatus.hidden = false;
		await wait(650);
		if (id !== runId) return;
		retrieveStatus.hidden = true;

		const used = q.retrieved.filter((r) => r.score >= threshold);
		q.retrieved.forEach((r) => {
			const c = chunks[r.chunk_id];
			if (!c) return;
			const weak = r.score < threshold;
			const item = el("li", "cs-rag-hit" + (weak ? " is-weak" : ""));
			const btn = el("button", "cs-rag-hit-btn");
			btn.type = "button";
			btn.dataset.chunk = r.chunk_id;
			btn.setAttribute("aria-label", `Show ${c.docTitle} passage ${r.chunk_id} in the document, relevance ${r.score.toFixed(2)}`);
			btn.append(el("span", "cs-rag-hit-doc", c.docTitle), el("span", "cs-rag-hit-id", r.chunk_id));
			const bar = el("span", "cs-rag-bar");
			const fill = el("span", "cs-rag-bar-fill");
			fill.style.width = `${Math.round(r.score * 100)}%`;
			bar.appendChild(fill);
			btn.append(bar, el("span", "cs-rag-hit-score", r.score.toFixed(2)));
			btn.addEventListener("click", () => showChunk(r.chunk_id));
			item.appendChild(btn);
			retrievedList.appendChild(item);

			if (markPassage(r.chunk_id, weak ? "is-weak" : "is-retrieved", `${r.chunk_id} · ${r.score.toFixed(2)}`)) {
				const tab = tabs.find((t) => t.dataset.doc === c.docId);
				const count = tab.querySelector(".cs-rag-tab-count");
				count.textContent = String(Number(count.textContent || 0) + 1);
				count.hidden = false;
				tab.classList.add("has-hits");
			}
		});
		retrieveStep.classList.add("is-done");
		if (q.retrieved[0]) showChunk(q.retrieved[0].chunk_id, false);

		// Step 3 - answer
		const answerStatus = answerStep.querySelector(".cs-rag-status");
		answerStatus.textContent = used.length ? `Generating an answer from ${used.length} passage${used.length > 1 ? "s" : ""}…` : "No passages met the relevance threshold - handing off instead of guessing…";
		answerStatus.hidden = false;
		await wait(700);
		if (id !== runId) return;
		answerStatus.hidden = true;
		if (!used.length) answerStep.classList.add("is-handoff");

		const citeNumbers = new Map();
		await typeInto(answerEl, renderAnswer(q.answer, citeNumbers), id);
		if (id !== runId) return;

		citeNumbers.forEach((_, cid) => marksFor(cid).forEach((m) => m.classList.add("is-cited")));

		answerStep.classList.add("is-done");
	}

	buttons.forEach((b) => b.addEventListener("click", () => run(b.dataset.q)));
})();
