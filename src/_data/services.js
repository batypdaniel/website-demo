// ─────────────────────────────────────────────────────────────────────────────
// SERVICES
// Single source of truth for every service. The home page cards, the /services/
// overview, the nav dropdown, the footer and each /services/<slug>/ detail page
// are all generated from this list - edit here and every page updates.
//
// icon: file name (without .svg) in src/_includes/icons/
// ─────────────────────────────────────────────────────────────────────────────

module.exports = [
    {
        slug: "data-analytics",
        name: "Data Analytics & Reporting",
        navName: "Data Analytics",
        icon: "analytics",
        summary: "Turn scattered spreadsheets and app exports into clear dashboards that show how your business is really doing.",
        headline: "See your whole business on one screen",
        intro: "Most small businesses already have the data they need - it's just spread across a POS system, QuickBooks, a CRM, and a dozen spreadsheets. We pull it together, clean it up, and build dashboards and reports your team will actually use.",
        painPoints: [
            "Monthly reporting means hours of copy-pasting between spreadsheets",
            "Different people quote different numbers for the same metric",
            "You find out about problems weeks after they start",
            "You're not sure which products, services or customers are actually profitable",
        ],
        offerings: [
            {
                title: "KPI Dashboards",
                text: "Live dashboards for sales, operations, marketing or finance, built around the handful of numbers that matter to you.",
            },
            {
                title: "Data Consolidation",
                text: "Connect and combine data from tools like QuickBooks, Square, Shopify, HubSpot and Google Sheets into one reliable source.",
            },
            {
                title: "Automated Reports",
                text: "Weekly or monthly reports that build and send themselves, so nobody spends Friday afternoon in Excel.",
            },
            {
                title: "One-Time Deep Dives",
                text: "A focused analysis to answer a specific question: pricing, profitability by customer, staffing levels, marketing ROI.",
            },
        ],
        examples: [
            "A retail shop sees daily sales, margin and inventory by location in a single dashboard",
            "A service company tracks job profitability by technician and job type",
            "A clinic monitors appointment no-show rates and revenue per provider",
        ],
        tools: ["Power BI", "Looker Studio", "Tableau", "Excel", "SQL", "Python"],
    },
    {
        slug: "data-science",
        name: "Data Science & Forecasting",
        navName: "Data Science",
        icon: "science",
        summary: "Use your historical data to forecast demand, understand customers and make decisions with more confidence.",
        headline: "Stop guessing. Start predicting.",
        intro: "Once you know what happened, the next question is what will happen - and what to do about it. We build practical statistical and machine learning models sized for a small or mid-sized business: no data science team required.",
        painPoints: [
            "Ordering and staffing decisions are based on gut feel",
            "You're regularly over- or under-stocked",
            "You don't know which customers are at risk of leaving",
            "Marketing spend is hard to tie back to results",
        ],
        offerings: [
            {
                title: "Sales Forecasting & Inventory Planning",
                text: "Forecast sales, inventory needs or call volume so you can plan purchasing and staffing ahead of time.",
            },
            {
                title: "Customer Insights",
                text: "Segment customers, estimate lifetime value and flag customers likely to churn so you can act early.",
            },
            {
                title: "Pricing & Experiment Analysis",
                text: "Measure what actually moved the needle - a promotion, a price change, a new marketing channel.",
            },
            {
                title: "Custom Models",
                text: "Purpose-built predictive models, delivered with clear documentation and handed off in a way you can keep running.",
            },
        ],
        examples: [
            "A restaurant forecasts covers by day to plan prep and scheduling",
            "A subscription business identifies at-risk customers before they cancel",
            "A distributor predicts reorder points for its top SKUs",
        ],
        tools: ["Python", "scikit-learn", "PyTorch", "pandas", "SQL", "Jupyter"],
    },
    {
        slug: "ai-solutions",
        name: "AI Solutions",
        navName: "AI Solutions",
        icon: "ai",
        summary: "Put modern AI to work on real problems - answering questions, processing documents and saving your team time.",
        headline: "Practical AI, without the hype",
        intro: "AI tools have become genuinely useful for small businesses, but it's hard to know where to start or what's safe. We help you find the right use cases, build solutions around your own documents and data, and roll them out responsibly.",
        painPoints: [
            "Your team answers the same customer questions over and over",
            "Staff spend hours reading, sorting or re-typing documents",
            "You know AI could help but don't know where to start",
            "You're worried about data privacy and accuracy with AI tools",
        ],
        offerings: [
            {
                title: "AI Assistants & Data Retrieval Tools",
                text: "Assistants that answer questions using your own policies, product info or knowledge base - on your website or internally.",
            },
            {
                title: "Document Processing",
                text: "Automatically extract information from invoices, forms, contracts and emails into your systems.",
            },
            {
                title: "AI Strategy & Readiness",
                text: "A practical assessment of where AI will (and won't) pay off for your business, plus guidelines for using it safely.",
            },
            {
                title: "Team Training",
                text: "Hands-on workshops that show your staff how to use AI tools effectively in their day-to-day work.",
            },
        ],
        examples: [
            "An internal assistant answers employee questions from the company handbook",
            "Incoming vendor invoices are read and entered into accounting automatically",
            "Customer emails are summarized and routed to the right person",
        ],
        tools: ["Claude", "OpenAI", "LangChain", "Python", "Vector databases", "Azure / AWS"],
    },
    {
        slug: "automation",
        name: "Workflow Automation",
        navName: "Automation",
        icon: "automation",
        summary: "Connect the apps you already use and eliminate the repetitive data entry that eats up your team's week.",
        headline: "Give your team their time back",
        intro: "If someone on your team spends hours each week copying information from one system to another, that's a job for automation. We map how work flows through your business, then connect your tools so the busywork happens on its own - reliably.",
        painPoints: [
            "The same information gets typed into multiple systems",
            "Things fall through the cracks when someone is out",
            "Manual processes cause errors that are hard to track down",
            "Now that your business has grown, your processes can't keep up",
        ],
        offerings: [
            {
                title: "App Integrations",
                text: "Connect your CRM, accounting, scheduling, e-commerce and email tools so data moves between them automatically.",
            },
            {
                title: "Process Automation",
                text: "Automate onboarding, quoting, invoicing, follow-ups and approvals from start to finish.",
            },
            {
                title: "Data Pipelines",
                text: "Scheduled jobs that collect, clean and load data so reports and dashboards are always up to date.",
            },
            {
                title: "Process Review",
                text: "A walkthrough of how work gets done today, with a prioritized list of what's worth automating first.",
            },
        ],
        examples: [
            "New web leads are added to the CRM, assigned and followed up automatically",
            "Completed jobs generate invoices in QuickBooks without re-typing",
            "Timesheets are collected, checked and sent to payroll every week",
        ],
        tools: ["Zapier", "Make", "n8n", "Power Automate", "Python", "REST APIs"],
    },
    {
        slug: "software-development",
        name: "Custom Software Development",
        navName: "Software Development",
        icon: "software",
        summary: "Internal tools, web apps and integrations built around the way your business works - not the other way around.",
        headline: "Software that fits your business",
        intro: "Off-the-shelf software gets you most of the way, but sometimes you need something that fits exactly. We design and build web applications, internal tools and integrations - and we keep them simple, maintainable and fully owned by you.",
        painPoints: [
            "A critical process runs on a fragile, overgrown spreadsheet",
            "Your tools don't talk to each other and there's no integration available",
            "Customers or staff need a simple portal that doesn't exist off the shelf",
            "An old system is holding you back but replacing it feels risky",
        ],
        offerings: [
            {
                title: "Internal Tools",
                text: "Replace spreadsheets and paper forms with purpose-built tools for scheduling, tracking, quoting and more.",
            },
            {
                title: "Web Applications & Portals",
                text: "Customer portals, booking systems and web apps that are secure, fast and easy to use.",
            },
            {
                title: "Integrations & APIs",
                text: "Custom connections between systems when an off-the-shelf integration doesn't exist or isn't enough.",
            },
            {
                title: "Model & Data Applications",
                text: "Simple interfaces that put forecasts, models and data in the hands of the people who need them.",
            },
        ],
        examples: [
            "A quoting spreadsheet becomes a web app with saved quotes and PDF output",
            "A customer portal lets clients check order status and download documents",
            "A forecasting model is packaged into an app the operations team uses daily",
        ],
        tools: ["Python", "JavaScript / TypeScript", "React", "FastAPI", "PostgreSQL", "Cloud hosting"],
    },
];
