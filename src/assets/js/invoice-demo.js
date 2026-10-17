//
//    Interactive invoice extraction demo (replay of pre-recorded pipeline outputs)
//    Data: <script id="invoice-data"> rendered from src/_data/invoiceDemo.json
//
//    Every row (fields, line items, checks) is already on the page; a run only fills in and clears values,
//    so the panel keeps the same height and nothing below it moves.
//

(() => {
	const root = document.getElementById("invoice-demo");
	const dataEl = document.getElementById("invoice-data");
	if (!root || !dataEl) return;

	const data = JSON.parse(dataEl.textContent);
	const threshold = data.config.review_threshold;
	const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	const invoices = Object.fromEntries(data.invoices.map((inv) => [inv.id, inv]));
	const fieldDefs = Object.fromEntries(data.fields.map((f) => [f.key, f]));

	// Elements
	const buttons = root.querySelectorAll(".cs-inv-pick");
	const readStep = root.querySelector('[data-step="read"]');
	const extractStep = root.querySelector('[data-step="extract"]');
	const checkStep = root.querySelector('[data-step="check"]');
	const readName = root.querySelector(".cs-inv-read-name");
	const readDetail = root.querySelector(".cs-inv-read-detail");
	const fieldList = root.querySelector(".cs-inv-fields");
	const fieldRows = Array.from(root.querySelectorAll(".cs-inv-field"));
	const lineList = root.querySelector(".cs-inv-table tbody");
	const lineRows = Array.from(root.querySelectorAll(".cs-inv-line"));
	const checkList = root.querySelector(".cs-inv-checks");
	const checkRows = Object.fromEntries(Array.from(root.querySelectorAll(".cs-inv-check")).map((c) => [c.dataset.check, c]));
	const result = root.querySelector(".cs-inv-result");
	const viewer = root.querySelector(".cs-inv-viewer");
	const scroll = root.querySelector(".cs-inv-scroll");
	const viewerName = root.querySelector(".cs-inv-viewer-name");
	const viewerEmpty = root.querySelector(".cs-inv-viewer-empty");
	const docEls = Object.fromEntries(Array.from(root.querySelectorAll(".cs-inv-doc")).map((d) => [d.dataset.inv, d]));
	const pdfLinks = root.querySelectorAll(".cs-inv-pdf");

	const wait = (ms) => new Promise((r) => setTimeout(r, reduceMotion ? 0 : ms));
	let runId = 0; // cancels an in-progress animation when another invoice is picked

	function el(tag, className, text) {
		const node = document.createElement(tag);
		if (className) node.className = className;
		if (text !== undefined) node.textContent = text;
		return node;
	}

	// ── Formatting ───────────────────────────────────────────────────────────

	const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
	const cents = (n) => Math.round((n || 0) * 100);

	function formatValue(value, type) {
		if (value === null || value === undefined || value === "") return null;
		if (type === "money") return usd.format(value);
		return String(value); // dates stay in the ISO format the pipeline normalizes them to
	}

	const isWeak = (confidence) => confidence !== null && confidence !== undefined && confidence < threshold;

	// ── Invoice viewer ───────────────────────────────────────────────────────

	// Show the picked invoice; resolves once its page images are decoded, so boxes never land on a half-drawn page
	function selectInvoice(id) {
		viewerEmpty.hidden = true;
		Object.entries(docEls).forEach(([docId, d]) => (d.hidden = docId !== id));
		pdfLinks.forEach((a) => (a.hidden = a.dataset.inv !== id));
		viewerName.textContent = ` · ${invoices[id].label}`;
		viewerName.hidden = false;
		scroll.scrollTop = 0;
		const imgs = Array.from(docEls[id].querySelectorAll("img"));
		return Promise.all(imgs.map((img) => img.decode().catch(() => {})));
	}

	function clearBoxes() {
		root.querySelectorAll(".cs-inv-box").forEach((b) => b.remove());
	}

	// Box an extracted value on its page. box = [x, y, width, height] as fractions of the page image.
	function addBox(invId, target, item, label) {
		if (!item.box) return;
		const layer = docEls[invId].querySelector(`.cs-inv-page[data-page="${item.page || 1}"] .cs-inv-boxes`);
		if (!layer) return;
		const [x, y, w, h] = item.box;
		const box = el("span", "cs-inv-box" + (isWeak(item.confidence) ? " is-weak" : ""));
		box.dataset.target = target;
		box.style.left = `${x * 100}%`;
		box.style.top = `${y * 100}%`;
		box.style.width = `${w * 100}%`;
		box.style.height = `${h * 100}%`;
		const tag = el("span", "cs-inv-box-tag", label);
		tag.setAttribute("aria-hidden", "true");
		box.appendChild(tag);
		layer.appendChild(box);
	}

	// Scroll the page image to a value and flash its box. The viewer scrolls on its own;
	// the page itself only scrolls when the visitor clicked (userAction), never automatically.
	function showBox(target, userAction = true) {
		root.querySelectorAll(".cs-inv-box.is-active").forEach((b) => b.classList.remove("is-active"));
		root.querySelectorAll("[data-show]").forEach((b) => b.setAttribute("aria-current", String(b.dataset.show === target)));
		const box = root.querySelector(`.cs-inv-box[data-target="${CSS.escape(target)}"]`);
		if (!box) return;

		const behavior = reduceMotion ? "auto" : "smooth";
		const top = box.getBoundingClientRect().top - scroll.getBoundingClientRect().top + scroll.scrollTop;
		scroll.scrollTo({ top: Math.max(0, top - scroll.clientHeight / 3), behavior });
		if (userAction) {
			const r = viewer.getBoundingClientRect();
			if (r.top < 0 || r.bottom > window.innerHeight) viewer.scrollIntoView({ block: "nearest", behavior });
		}
		box.classList.add("is-active");
		box.classList.remove("is-flash");
		void box.offsetWidth; // restart animation
		box.classList.add("is-flash");
	}

	// Clicks are wired once; each button's data-show says which box it points at for the current invoice
	root.querySelectorAll(".cs-inv-field-btn, .cs-inv-line-btn").forEach((b) => b.addEventListener("click", () => b.dataset.show && showBox(b.dataset.show)));

	// ── Pipeline rows ────────────────────────────────────────────────────────

	function resetButton(btn) {
		btn.disabled = true;
		delete btn.dataset.show;
		btn.removeAttribute("aria-current");
		btn.removeAttribute("aria-label");
		btn.removeAttribute("title");
	}

	function enableButton(btn, target, label) {
		btn.disabled = false;
		btn.dataset.show = target;
		btn.setAttribute("aria-label", `${label}. Show on the invoice`);
	}

	function resetRows() {
		fieldRows.forEach((li) => {
			li.className = "cs-inv-field";
			const btn = li.querySelector(".cs-inv-field-btn");
			resetButton(btn);
			li.querySelector(".cs-inv-field-value").textContent = "";
			li.querySelector(".cs-inv-field-score").textContent = "";
			li.querySelector(".cs-inv-bar-fill").style.width = "0";
		});
		lineRows.forEach((tr) => {
			tr.className = "cs-inv-line";
			resetButton(tr.querySelector(".cs-inv-line-btn"));
			tr.querySelectorAll("td").forEach((td) => (td.firstElementChild || td).replaceChildren());
		});
		Object.values(checkRows).forEach((li) => {
			li.className = "cs-inv-check";
			li.removeAttribute("aria-label");
			li.querySelector(".cs-inv-check-icon").textContent = "";
			li.querySelector(".cs-inv-check-detail").textContent = "";
		});
		result.className = "cs-inv-result";
		result.textContent = "The outcome appears here once the checks run.";
	}

	function fillField(invId, li, item) {
		const field = fieldDefs[li.dataset.field];
		const btn = li.querySelector(".cs-inv-field-btn");
		const value = formatValue(item.value, field.type);
		const valueEl = li.querySelector(".cs-inv-field-value");
		const score = li.querySelector(".cs-inv-field-score");
		li.classList.add("is-filled");

		if (value === null) {
			li.classList.add("is-missing");
			if (field.required) li.classList.add("is-weak");
			valueEl.textContent = "Not found";
			score.textContent = field.required ? "Req." : "-";
			return;
		}
		if (isWeak(item.confidence)) li.classList.add("is-weak");
		valueEl.textContent = value;
		btn.title = value; // the full value when it's cut off with "…"
		li.querySelector(".cs-inv-bar-fill").style.width = `${Math.round(item.confidence * 100)}%`;
		score.textContent = item.confidence.toFixed(2);
		if (item.box) {
			const target = `field:${field.key}`;
			enableButton(btn, target, `${field.label}: ${value}, confidence ${item.confidence.toFixed(2)}`);
			addBox(invId, target, item, field.label);
		}
	}

	function fillLine(invId, tr, line, i) {
		const [desc, qty, unit, amount, conf] = tr.querySelectorAll("td");
		const btn = desc.querySelector(".cs-inv-line-btn");
		tr.classList.add("is-filled");
		if (isWeak(line.confidence)) tr.classList.add("is-weak");
		btn.textContent = line.description;
		btn.title = line.description;
		qty.textContent = String(line.quantity);
		unit.textContent = usd.format(line.unit_price);
		amount.textContent = usd.format(line.amount);
		conf.textContent = line.confidence.toFixed(2);
		if (line.box) {
			const target = `line:${i}`;
			enableButton(btn, target, `Line ${i + 1}: ${line.description}`);
			addBox(invId, target, line, `Line ${i + 1}`);
		}
	}

	// The same arithmetic an accounts-payable clerk would do before entering the bill.
	// Returns a result for each check row; pass: null means the check doesn't apply to this invoice.
	function runChecks(inv) {
		const f = inv.fields;
		const val = (key) => (f[key] ? f[key].value : null);
		const lines = inv.line_items || [];
		const required = data.fields.filter((d) => d.required);
		const checks = {};

		const missing = required.filter((d) => formatValue(val(d.key), d.type) === null);
		checks.required = {
			pass: !missing.length,
			detail: missing.length ? `Missing: ${missing.map((d) => d.label.toLowerCase()).join(", ")}` : `${required.length} of ${required.length}`,
		};

		if (lines.length && val("subtotal") !== null) {
			const sum = lines.reduce((s, l) => s + cents(l.amount), 0);
			const ok = sum === cents(val("subtotal"));
			checks["lines-sum"] = { pass: ok, detail: `${usd.format(sum / 100)} ${ok ? "=" : "≠"} ${usd.format(val("subtotal"))}` };
		} else {
			checks["lines-sum"] = { pass: null, detail: "Not applicable" };
		}

		if (lines.length) {
			const bad = lines.filter((l) => Math.abs(cents(l.quantity * l.unit_price) - cents(l.amount)) > 1);
			checks["line-math"] = { pass: !bad.length, detail: bad.length ? `${bad.length} line${bad.length > 1 ? "s" : ""} off` : `All ${lines.length} lines` };
		} else {
			checks["line-math"] = { pass: null, detail: "Not applicable" };
		}

		if (val("subtotal") !== null && val("total") !== null) {
			const expected = cents(val("subtotal")) + cents(val("tax")) + cents(val("shipping"));
			const ok = expected === cents(val("total"));
			checks["total-math"] = { pass: ok, detail: `${usd.format(expected / 100)} ${ok ? "=" : "≠"} ${usd.format(val("total"))}` };
		} else {
			checks["total-math"] = { pass: null, detail: "Not applicable" };
		}

		const weak = data.fields.filter((d) => f[d.key] && isWeak(f[d.key].confidence)).length + lines.filter((l) => isWeak(l.confidence)).length;
		checks.confidence = { pass: !weak, detail: weak ? `${weak} below` : "All clear" };
		return checks;
	}

	async function run(invId) {
		const id = ++runId;
		const inv = invoices[invId];
		const pages = inv.pages.length;

		buttons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.inv === invId)));
		const pageReady = selectInvoice(invId);
		clearBoxes();
		resetRows();
		[readStep, extractStep, checkStep].forEach((s) => s.classList.remove("is-done"));

		// Step 1 - read the page images
		readName.textContent = inv.label;
		readDetail.textContent = `Reading ${pages} page${pages > 1 ? "s" : ""}…`;
		readDetail.classList.add("is-busy");
		await Promise.all([wait(600), pageReady]);
		if (id !== runId) return;
		readDetail.classList.remove("is-busy");
		readDetail.textContent = `${pages} page${pages > 1 ? "s" : ""}${inv.note ? ` · ${inv.note}` : ""}`;
		readStep.classList.add("is-done");

		// Step 2 - fields, then line items (the empty rows shimmer while the model works)
		fieldList.classList.add("is-busy");
		lineList.classList.add("is-busy");
		await wait(750);
		if (id !== runId) return;
		fieldList.classList.remove("is-busy");

		for (const li of fieldRows) {
			fillField(invId, li, inv.fields[li.dataset.field] || { value: null, confidence: null });
			await wait(70);
			if (id !== runId) return;
		}
		lineList.classList.remove("is-busy");
		const lines = inv.line_items || [];
		lineRows.slice(lines.length).forEach((tr) => tr.classList.add("is-unused")); // invoices with fewer lines than the longest one
		for (const [i, line] of lines.entries()) {
			if (!lineRows[i]) break;
			fillLine(invId, lineRows[i], line, i);
			await wait(70);
			if (id !== runId) return;
		}
		extractStep.classList.add("is-done");

		// Step 3 - checks and the outcome
		checkList.classList.add("is-busy");
		await wait(550);
		if (id !== runId) return;
		checkList.classList.remove("is-busy");

		const checks = runChecks(inv);
		for (const [key, c] of Object.entries(checks)) {
			const li = checkRows[key];
			if (!li) continue;
			const label = li.querySelector(".cs-inv-check-label").textContent;
			li.classList.add(c.pass === null ? "is-skip" : c.pass ? "is-pass" : "is-fail");
			li.querySelector(".cs-inv-check-icon").textContent = c.pass === null ? "-" : c.pass ? "✓" : "!";
			li.querySelector(".cs-inv-check-detail").textContent = c.detail;
			li.setAttribute("aria-label", `${c.pass === null ? "Skipped" : c.pass ? "Passed" : "Needs review"}: ${label}. ${c.detail}`);
			await wait(160);
			if (id !== runId) return;
		}

		const failed = Object.values(checks).filter((c) => c.pass === false).length;
		if (failed) {
			result.classList.add("is-review");
			result.textContent = `Sent to a person for review: ${failed} check${failed > 1 ? "s" : ""} didn't pass.`;
		} else {
			result.classList.add("is-ready");
			result.textContent = "Ready to enter as a bill: every check passed.";
		}
		checkStep.classList.add("is-done");

		// Point at the most important thing to look at: the first doubtful value, otherwise the total
		const firstWeak = root.querySelector(".cs-inv-box.is-weak");
		showBox(firstWeak ? firstWeak.dataset.target : "field:total", false);
	}

	buttons.forEach((b) => b.addEventListener("click", () => run(b.dataset.inv)));
})();
