// ─────────────────────────────────────────────────────────────────────────────
// BUSINESS DETAILS
// Everything site-wide (header logo, footer, contact page, page titles, SEO
// schema) reads from this file. Values marked TODO are placeholders.
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
    // Business name - shown in the logo, page titles, footer and SEO data
    name: "Downstream Data Co.",
    // Short line used under the logo in the footer and in the home page meta description
    tagline: "Data, AI & software for local small businesses",
    // TODO: your name + title, used on the About page and as the default blog author
    founder: {
        name: "Baty Daniel",
        title: "Founder & Principal Consultant",
    },
    email: "batypdaniel@gmail.com", // TODO
    phoneForTel: "901-378-4278", // TODO
    phoneFormatted: "(901) 378-4278", // TODO
    address: {
        // Leave lineOne/lineTwo empty ("") if you work from home and don't want to publish a street address
        lineOne: "",
        lineTwo: "",
        city: "Memphis",
        state: "TN",
        zip: "",
        country: "US",
        mapLink: "",
    },
    // TODO: towns/neighborhoods you serve - shown on the home and contact pages
    serviceArea: ["Memphis", "Germantown", "Collierville", "Cordova", "Bartlett", "Southaven", "Olive Branch", "Jackson, TN"],
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
