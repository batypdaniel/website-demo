//
//    Click-to-load live demos (used on /demos/<demo>/ pages)
//    The app is only loaded when someone asks for it, which keeps the page fast
//    and avoids waking a sleeping Streamlit/Hugging Face app on every page view.
//

document.querySelectorAll(".cs-demo[data-embed-src]").forEach((demo) => {
	const button = demo.querySelector(".cs-demo-launch");
	if (!button) return;

	button.addEventListener("click", () => {
		const iframe = document.createElement("iframe");
		iframe.src = demo.dataset.embedSrc;
		iframe.title = demo.dataset.embedTitle || "Live demo";
		iframe.className = "cs-demo-frame";
		iframe.setAttribute("allow", "clipboard-read; clipboard-write");
		iframe.setAttribute("loading", "eager");

		// Show the app in a browser-style window on top of the poster, so the page keeps its framed look
		const bar = document.createElement("div");
		bar.className = "cs-demo-bar";
		bar.setAttribute("aria-hidden", "true");
		bar.innerHTML = '<span class="cs-demo-dots"><i></i><i></i><i></i></span>';
		const label = document.createElement("span");
		label.className = "cs-demo-bar-title";
		label.textContent = iframe.title;
		bar.append(label);

		const win = document.createElement("div");
		win.className = "cs-demo-window";
		win.append(bar, iframe);

		demo.querySelector(".cs-demo-overlay")?.remove();
		demo.append(win);
		demo.classList.add("cs-demo-loaded");
		iframe.focus();
	});
});
