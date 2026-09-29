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
	data.documents.forEach((doc) => doc.chunks.forEach((c) => (chunks[c.id] = { ...c, docTitle: doc.title })));
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
	const metaEl = root.querySelector(".cs-rag-meta");
	const docsPanel = root.querySelector(".cs-rag-docs");
	const chunkEls = root.querySelectorAll(".cs-rag-chunk");

	root.querySelector(".cs-rag-count").textContent = chunkEls.length;

	const wait = (ms) => new Promise((r) => setTimeout(r, reduceMotion ? 0 : ms));
	let runId = 0; // cancels an in-progress animation when another question is picked

	function el(tag, className, text) {
		const node = document.createElement(tag);
		if (className) node.className = className;
		if (text !== undefined) node.textContent = text;
		return node;
	}

	function resetChunks() {
		chunkEls.forEach((c) => {
			c.classList.remove("is-retrieved", "is-cited", "is-weak", "is-flash");
			const score = c.querySelector(".cs-rag-chunk-score");
			score.hidden = true;
			score.textContent = "";
		});
	}

	function chunkEl(id) {
		return root.querySelector(`.cs-rag-chunk[data-chunk="${CSS.escape(id)}"]`);
	}

	// Scroll to a passage and flash it. On desktop the documents panel scrolls on its own;
	// on mobile the page only scrolls when the visitor clicked (userAction), never automatically.
	function showChunk(id, userAction = true) {
		const target = chunkEl(id);
		if (!target) return;
		const behavior = reduceMotion ? "auto" : "smooth";
		const panelScrolls = docsPanel.scrollHeight > docsPanel.clientHeight + 1;
		if (panelScrolls) {
			docsPanel.scrollTo({ top: target.offsetTop - docsPanel.offsetTop - 16, behavior });
		} else if (userAction) {
			target.scrollIntoView({ block: "center", behavior });
		}
		target.classList.remove("is-flash");
		void target.offsetWidth; // restart animation
		target.classList.add("is-flash");
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
		resetChunks();
		questionText.textContent = q.question;
		retrievedList.replaceChildren();
		answerEl.replaceChildren();
		metaEl.replaceChildren();
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
			btn.append(el("span", "cs-rag-hit-doc", c.docTitle), el("span", "cs-rag-hit-id", r.chunk_id));
			const bar = el("span", "cs-rag-bar");
			const fill = el("span", "cs-rag-bar-fill");
			fill.style.width = `${Math.round(r.score * 100)}%`;
			bar.appendChild(fill);
			btn.append(bar, el("span", "cs-rag-hit-score", r.score.toFixed(2)));
			if (weak) btn.append(el("span", "cs-rag-hit-flag", "below threshold"));
			btn.addEventListener("click", () => showChunk(r.chunk_id));
			item.appendChild(btn);
			retrievedList.appendChild(item);

			const ce = chunkEl(r.chunk_id);
			if (ce) {
				ce.classList.add(weak ? "is-weak" : "is-retrieved");
				const s = ce.querySelector(".cs-rag-chunk-score");
				s.textContent = `score ${r.score.toFixed(2)}`;
				s.hidden = false;
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

		citeNumbers.forEach((_, cid) => chunkEl(cid)?.classList.add("is-cited"));

		const m = q.meta || {};
		const metaItems = [];
		if (m.latency_ms != null) metaItems.push(`${(m.latency_ms / 1000).toFixed(1)}s response`);
		if (m.input_tokens != null && m.output_tokens != null) metaItems.push(`${m.input_tokens + m.output_tokens} tokens`);
		if (m.cost_usd != null) metaItems.push(`$${m.cost_usd.toFixed(4)} per answer`);
		metaItems.push(citeNumbers.size ? `${citeNumbers.size} source${citeNumbers.size > 1 ? "s" : ""} cited` : "handed off to a person");
		metaItems.forEach((t) => metaEl.appendChild(el("li", "", t)));
		answerStep.classList.add("is-done");
	}

	buttons.forEach((b) => b.addEventListener("click", () => run(b.dataset.q)));
})();
