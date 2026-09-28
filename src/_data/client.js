// ─────────────────────────────────────────────────────────────────────────────
// BUSINESS DETAILS
// Everything site-wide (header logo, footer, contact page, page titles, SEO
// schema) reads from this file. Values marked TODO are placeholders.
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
    // TODO: working name - replace with your registered business name
    name: "Brightline Data Co.",
    // Short line used under the logo in the footer and in the home page meta description
    tagline: "Data, AI & software for local small businesses",
    // TODO: your name + title, used on the About page and as the default blog author
    founder: {
        name: "Your Name",
        title: "Founder & Principal Consultant",
    },
    email: "hello@example.com", // TODO
    phoneForTel: "555-555-0100", // TODO
    phoneFormatted: "(555) 555-0100", // TODO
    address: {
        // Leave lineOne/lineTwo empty ("") if you work from home and don't want to publish a street address
        lineOne: "",
        lineTwo: "",
        city: "Your City", // TODO
        state: "ST", // TODO
        zip: "",
        country: "US",
        mapLink: "",
    },
    // TODO: towns/neighborhoods you serve - shown on the home and contact pages
    serviceArea: ["Your City", "Nearby Town", "Another Town", "and the surrounding area"],
    // Remove any line you don't use and its icon disappears from the footer
    socials: {
        linkedin: "https://www.linkedin.com/",
        github: "https://github.com/",
    },
    // Link to a scheduling page (Calendly, Cal.com, Google Calendar booking...). Leave "" to hide the button.
    bookingLink: "",
    //! Make sure you include the file protocol (e.g. https://) and that NO TRAILING SLASH is included
    domain: "https://www.example.com", // TODO
    // Passing the isProduction variable for use in HTML templates
    isProduction: process.env.ELEVENTY_ENV === "PROD",
};
