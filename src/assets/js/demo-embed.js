//
//    Click-to-load live demos (used on /work/<demo>/ pages)
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

		demo.replaceChildren(iframe);
		demo.classList.add("cs-demo-loaded");
		iframe.focus();
	});
});
