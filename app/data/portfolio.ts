export type Experience = {
  company: string;
  location: string;
  role: string;
  period: string;
  bullets: string[];
};

export type Project = {
  title: string;
  eyebrow: string;
  summary: string;
  details: string[];
  href?: string;
};

export type LandingPage = {
  title: string;
  summary: string;
  href: string;
};

export type ContactLink = {
  label: "Email" | "Phone" | "LinkedIn" | "GitHub" | "Demo";
  value: string;
  href: string;
};

export type ProofMetric = {
  value: string;
  label: string;
};

export const navItems = [
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

export const profileSnapshot = [
  ["Location", "Davao City, Philippines"],
  ["Core stack", "Next.js, React, TypeScript, Django"],
  ["Production scope", "60,000+ registered users"],
  ["Current focus", "SaaS architecture, commerce workflows, storefront tooling"],
] as const;

export const proofMetrics: ProofMetric[] = [
  { value: "60K+", label: "registered users served" },
  { value: "38", label: "storefront builder blocks maintained" },
  { value: "V4", label: "Next.js platform modernization" },
];

export const skills = {
  Frontend: [
    "Next.js App Router",
    "React",
    "TypeScript",
    "JavaScript ES6+",
    "Material UI",
    "SWR",
    "Responsive Design",
  ],
  "Backend & APIs": [
    "Django",
    "Django REST Framework",
    "Django Ninja",
    "Python",
    "REST API Design",
    "PostgreSQL",
    "NextAuth",
  ],
  "Architecture & Systems": [
    "API Gateway Design",
    "Multi-Tenant SaaS",
    "Frontend State Management",
    "CSS Variable Theming",
    "E-Commerce Checkout",
  ],
  "DevOps & Integration": [
    "Docker",
    "NGINX",
    "Vercel",
    "Railway",
    "Git",
    "GitHub",
    "Puck Page Builder",
    "Xendit",
    "Webhooks",
  ],
};

export const projects: Project[] = [
  {
    eyebrow: "TWC Ako Platform",
    title: "Modern Next.js frontend integrated with a large Django API backend",
    summary:
      "Architected the V4 frontend for a large SaaS and e-commerce platform, while maintaining and extending the Django REST/Django Ninja APIs needed by dashboards, storefronts, checkout, authentication, and supplier customization.",
    details: [
      "Built shared context providers, typed API utilities, and role-aware UI foundations.",
      "Created and maintained frontend-facing API endpoints for user identity, shipping addresses, cart and checkout, orders, storefronts, supplier tools, logistics, and dashboard data.",
      "Modernized legacy Django flows into a scalable API-driven Next.js architecture without claiming full ownership of the existing backend.",
    ],
  },
  {
    eyebrow: "Legacy TWC E-Commerce",
    title: "Django e-commerce platform with checkout, referrals, and fulfillment tooling",
    summary:
      "Built and maintained the original TWC online store before the platform moved toward the current API-driven architecture, preserving a valuable production foundation even after the public site was retired.",
    details: [
      "Implemented storefront, product funnel, cart, checkout, account, dashboard, and address-management flows in Django.",
      "Integrated order creation with the TWC Ako dashboard APIs, referral-aware checkout, COD and Xendit payment paths.",
      "Supported operational workflows around courier booking, fulfillment status, seller dashboards, and Linux deployment with NGINX, Gunicorn, Supervisor, PostgreSQL, and Celery.",
    ],
  },
  {
    eyebrow: "Auth & API Architecture",
    title: "Centralized API gateway and normalized user identity system",
    summary:
      "Implemented a Next.js API route layer that standardizes authentication, error handling, request processing, and communication with the maintained Django backend.",
    details: [
      "Used NextAuth with JWT and cookie-based sessions for authenticated workflows.",
      "Normalized memberships, roles, dashboard routing, verification states, and active plan data through dedicated frontend user context and backend API payloads.",
      "Kept browser code calling local Next.js routes while the gateway coordinated with Django REST Framework and Django Ninja endpoints.",
    ],
  },
  {
    eyebrow: "Commerce Systems",
    title: "Checkout, cart, Xendit payments, and cross-device continuation",
    summary:
      "Delivered end-to-end checkout workflows with server-owned order state, address handling, payment confirmation, and webhook-backed processing.",
    details: [
      "Handled cart management, order lifecycle, platform fees, discounts, and payment steps.",
      "Designed checkout resume behavior around authenticated in-progress orders.",
      "Integrated Xendit payment creation and webhook confirmation flows.",
    ],
  },
  {
    eyebrow: "Storefront Builder",
    title: "Puck page builder and supplier-configurable theming",
    summary:
      "Optimized a 38-block drag-and-drop storefront builder with a dual-layer theming system and theme-compatible components.",
    details: [
      "Combined Material UI platform theming with storefront CSS variable palettes.",
      "Supported supplier themes, light/dark behavior, and WCAG-minded color decisions.",
      "Improved maintainability and template consistency across storefront experiences.",
    ],
  },
];

export const landingPages: LandingPage[] = [
  {
    title: "Cotabato Solar",
    summary: "A responsive solar services landing page with an interactive savings estimator and inquiry flow.",
    href: "/solar",
  },
];

export const experiences: Experience[] = [
  {
    company: "TWC IT Solutions",
    location: "Davao City",
    role: "Full Stack Web Developer",
    period: "Jan 2024 - Jun 2026",
    bullets: [
      "Architected and developed the platform's Next.js V4 frontend, modernizing a legacy Django platform serving 60,000+ registered users into a scalable, API-driven architecture.",
      "Established shared frontend infrastructure including reusable context providers, typed API utilities, and application-wide state management across dashboard, e-commerce, and storefront modules.",
      "Implemented a centralized API gateway layer using Next.js API routes to standardize authentication, error handling, request processing, and communication with maintained Django REST Framework and Django Ninja services.",
      "Built and maintained authentication and user-identity systems using NextAuth with JWT and cookie-based sessions, supporting multiple membership types, roles, and verification states.",
      "Maintained and extended the existing Django backend by creating frontend-facing APIs, serializers, schemas, and service integrations for e-commerce, user management, affiliate systems, storefront customization, logistics, and checkout workflows.",
      "Engineered a dual-layer theming architecture combining Material UI theme management with supplier-configurable storefront themes powered by CSS variables, light/dark support, and multi-tenant customization.",
      "Optimized and extended a 38-block drag-and-drop Puck page builder, improving maintainability, theme compatibility, and performance across storefront experiences.",
    ],
  },
  {
    company: "Vendics Enterprise",
    location: "Davao City",
    role: "Frontend Developer & Co-Founder",
    period: "2014 - 2019",
    bullets: [
      "Built business websites and customer landing pages for local clients as part of a small IT services partnership.",
      "Focused on frontend implementation, page layout, customer-facing content presentation, and basic website delivery workflows.",
    ],
  },
  {
    company: "GameBox",
    location: "Davao City",
    role: "Owner - Computer Rental & IT Services",
    period: "2016 - Present",
    bullets: [
      "Co-founded GameBox in 2016 with partners as a computer rental and computer services business.",
      "Became sole owner in 2020 after the partnership separated during the pandemic, continuing operations independently.",
      "Manage customer support, budgeting, system maintenance, rentals, repair coordination, and day-to-day service delivery.",
    ],
  },
  {
    company: "Datamarked ApS",
    location: "Hybrid",
    role: "Product Manager",
    period: "2012 - 2018",
    bullets: [
      "Managed product data operations including catalog structuring, lifecycle tracking, and dataset organization.",
      "Improved categorization, sorting, and duplicate-detection workflows to increase operational efficiency and data quality.",
    ],
  },
];

export const contactLinks: ContactLink[] = [
  { label: "Email", value: "noypangan5@gmail.com", href: "https://mail.google.com/mail/?view=cm&fs=1&to=noypangan5@gmail.com" },
  { label: "Phone", value: "0917-770-0256", href: "tel:+639177700256" },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/emmanuel-pangan-071502a7",
    href: "https://linkedin.com/in/emmanuel-pangan-071502a7",
  },
  { label: "GitHub", value: "github.com/Abadon45", href: "https://github.com/Abadon45" },
  {
    label: "Demo",
    value: "demo.twcako.com",
    href: "https://demo.twcako.com",
  },
];
