// Single source of truth for site content. Edit here, not in components.

export const profile = {
  name: "Eric Zhou",
  headline: "CS + Math @ Northwestern",
  blurb:
    "",
  location: "Troy, MI · Evanston, IL",
  email: "erichyzhou@u.northwestern.edu",
  phone: "248-250-0040",
  site: "https://erichyzhou.vercel.app",
  github: "https://github.com/ericzhou12",
  linkedin: "https://www.linkedin.com/in/erichyzhou/",
  lastfm: "https://www.last.fm/user/erichyzhou",
  resume: "/eric-zhou-resume.pdf",
  status: "SDE Intern @ Tyler Technologies",
};

export const facts: { label: string; value: string }[] = [
  { label: "University", value: "Northwestern University" },
  { label: "Focus", value: "Machine Learning; Distributed Systems" },
  { label: "Based", value: "Troy, MI / Evanston, IL" },
];

/** Light/dark pair so node tints can swap via CSS alone, with no theme read. */
export type NodeColor = { light: string; dark: string };

/** month is 1-12; the pair sorts as year * 12 + month inside a graph layer. */
export type TimePoint = { year: number; month: number };

export type Job = {
  id: string;
  role: string;
  /** Graph-node caption; the full role rarely fits under a 48px node. */
  shortRole?: string;
  org: string;
  orgUrl?: string;
  period: string;
  start: TimePoint;
  end: TimePoint | "present";
  color: NodeColor;
  /** Optional path under /public, e.g. "/logos/tyler.svg". Falls back to initials. */
  logo?: string;
  /** Set for solid-background marks: the logo bleeds to the node edge, cropped. */
  logoFill?: boolean;
  location: string;
  kind: string;
  summary: string;
  points: string[];
  metrics?: { value: string; label: string }[];
  stack: string[];
  /** primary marks the headline artifact (paper, live site) for extra emphasis. */
  links?: { label: string; href: string; primary?: boolean }[];
};

export const experience: Job[] = [
  {
    id: "tyler",
    role: "Software Development Engineer Intern",
    shortRole: "SDE Intern",
    org: "Tyler Technologies",
    orgUrl: "https://www.tylertech.com",
    logo: "/logos/tylertech.png",
    period: "May 2026 — Present",
    start: { year: 2026, month: 5 },
    end: "present",
    color: { light: "#415390", dark: "#415390" },
    location: "Troy, MI · On-site",
    kind: "Internship",
    summary:
      "Built an internal police report writing platform end to end on AWS — SPA at the edge, serverless APIs, and CDK-provisioned multi-tenant infrastructure.",
    points: [
      "Built the comprehensive, end-to-end internal police report writing support platform — an SPA served from S3 behind CloudFront, calling REST APIs backed by stateless, serverless Lambda endpoints.",
      "Formed a secure entry gateway with Cognito OIDC, parsing and validating user JWT claims server-side to act as a strict authorization firewall enforcing granular RBAC across multi-tenant report infrastructures.",
      "Consolidated API endpoints into feature Lambdas to maximize warm starts, cutting latency during bursts of 1000+ tenant reports from the main client; deployed a flat DynamoDB key-value store to match Lambda's stateless model.",
      "Authored modular AWS CDK (TypeScript) infrastructure stacks automating environment provisioning across Commercial and GovCloud partitions, isolating CJIS-regulated data while keeping frontend and backend at parity.",
      "Automated CI/CD with GitHub Actions — CDK audits, unit tests, and security linting on every pull request, including multi-tenant RBAC business logic confirmation in tests.",
    ],
    metrics: [
      { value: "1000+", label: "tenant reports per burst" },
      { value: "2", label: "AWS partitions (Commercial + GovCloud)" },
      { value: "CJIS", label: "regulated data isolation" },
    ],
    stack: [
      "TypeScript",
      "Angular",
      "AWS CDK",
      "Lambda",
      "DynamoDB",
      "Cognito / OIDC",
      "S3",
      "CloudFront",
      "GitHub Actions",
    ],
  },
  {
    id: "simons",
    role: "Simons Research Fellow in Computer Science",
    shortRole: "Research Fellow",
    org: "Stony Brook University",
    orgUrl: "https://www.stonybrook.edu",
    logo: "/logos/stonybrook.jpg",
    logoFill: true,
    period: "Jun 2025 — Jun 2026",
    start: { year: 2025, month: 6 },
    end: { year: 2026, month: 6 },
    color: { light: "#990100", dark: "#990100" },
    location: "Stony Brook, NY",
    kind: "Research · PI: Dr. Mohammad Javad Amiri",
    summary:
      "Tuned DAG-based Byzantine fault-tolerant consensus with reinforcement learning, halving end-to-end latency of the Autobahn protocol. Submitted to VLDB 2026.",
    points: [
      "Selected as 1 of 53 fellows from 1,380 applicants (~3.8%) to the Simons Summer Research Program.",
      "Leveraged reinforcement learning for parameter-space optimization and communication in DAG-based Byzantine fault-tolerant consensus protocols, reducing end-to-end latency of the Autobahn protocol by 49.8% vs. default and 73.3% vs. random parameter configuration across 6 scenarios with varied adversarial and normal behavior.",
      "Designed an RL algorithm using CMAB and Thompson sampling that operates within safety and liveness constraints; tested on Google Cloud Platform with VMs as nodes across geographic regions.",
      "Collaborated with professors at Stony Brook, the University of Pennsylvania, and City University of Hong Kong; submitted to VLDB 2026. Presented a poster and awarded a $500 stipend.",
    ],
    metrics: [
      { value: "49.8%", label: "latency reduction vs. default" },
      { value: "73.3%", label: "vs. random configuration" },
      { value: "3.8%", label: "fellowship acceptance rate" },
    ],
    stack: [
      "Python",
      "Rust",
      "Reinforcement Learning",
      "CMAB",
      "Thompson Sampling",
      "GCP",
      "Distributed Systems",
    ],
    links: [
      {
        label: "arXiv:2606.09120",
        href: "https://arxiv.org/abs/2606.09120",
        primary: true,
      },
    ],
  },
  {
    id: "morgan-stanley",
    role: "Finance Academy Participant",
    shortRole: "Finance Academy",
    org: "Morgan Stanley",
    orgUrl: "https://www.morganstanley.com",
    logo: "/logos/morganstanley.png",
    logoFill: true,
    period: "Oct 2025 — Mar 2026",
    start: { year: 2025, month: 10 },
    end: { year: 2026, month: 3 },
    color: { light: "#012c51", dark: "#012c51" },
    location: "Remote",
    kind: "Program",
    summary:
      "One of 150 participants nationwide, taught by Institutional Securities Group analysts.",
    points: [
      "Selected as 1 of 150 participants nationwide and instructed by Institutional Securities Group analysts.",
      "Applied analytical and problem-solving skills through assignments, case studies, and team-based finance projects.",
    ],
    metrics: [{ value: "150", label: "participants nationwide" }],
    stack: ["Valuation", "Case Studies", "Financial Modeling"],
  },
  {
    id: "wayne",
    role: "Blockchain Research Assistant",
    shortRole: "Research Asst.",
    org: "Wayne State University",
    orgUrl: "https://wayne.edu",
    logo: "/logos/waynestate.svg",
    period: "May 2024 — Oct 2025",
    start: { year: 2024, month: 5 },
    end: { year: 2025, month: 10 },
    color: { light: "#35746b", dark: "#35746b" },
    location: "Troy, MI · Hybrid",
    kind: "Research · PI: Dr. Shiyong Lu",
    summary:
      "Audited 10,000+ lines of Solidity on the Sepolia testnet and helped write Longevity AI, a health-focused AI agent.",
    points: [
      "Programmed and tested smart contracts in Solidity deployed to the Sepolia testnet; audited over 10,000 lines of code.",
      "Managed communication between graduate-level courses CSC 8710 and CSC 4996 under Professor Shiyong Lu.",
      "Assisted in writing and ideating Longevity AI, an AI agent centered on health.",
    ],
    metrics: [{ value: "10,000+", label: "lines of contract code audited" }],
    stack: ["Solidity", "Ethereum", "Sepolia Testnet", "AI Agents"],
  },
  {
    id: "boardx",
    role: "Software Engineer & QA Intern",
    shortRole: "SWE / QA Intern",
    org: "BoardX",
    logo: "/logos/boardx.jpg",
    logoFill: true,
    period: "Apr 2022 — Aug 2022",
    start: { year: 2022, month: 4 },
    end: { year: 2022, month: 8 },
    color: { light: "#f25579", dark: "#f25579" },
    location: "Troy, MI · Remote",
    kind: "Internship",
    summary:
      "First engineering internship — feature work and QA on a collaborative online whiteboard product.",
    points: [
      "Contributed to feature development and quality assurance for a collaborative online whiteboard platform.",
      "Wrote and executed test plans, reporting and triaging defects alongside the engineering team.",
    ],
    stack: ["JavaScript", "QA", "Manual Testing"],
  },
];

export type Project = {
  id: string;
  title: string;
  tagline: string;
  year: string;
  start: TimePoint;
  end: TimePoint | "present";
  color: NodeColor;
  logo?: string;
  logoFill?: boolean;
  description: string;
  highlights: string[];
  tags: string[];
  links: { label: string; href: string; primary?: boolean }[];
};

export const projects: Project[] = [
  {
    id: "new-page",
    title: "The New Page Project",
    tagline: "Nonprofit platform for global book donation logistics",
    year: "2025",
    start: { year: 2025, month: 1 },
    end: { year: 2025, month: 12 },
    color: { light: "#c2620a", dark: "#e0913c" },
    description:
      "Solo-built and deployed the React site for a literacy nonprofit, handling outreach, SEO, and donation logistics.",
    highlights: [
      "Powers logistics for 20,000+ book donations reaching 680+ students worldwide",
      "Solo-built, deployed, and maintained; iterated on real user feedback",
    ],
    tags: ["React", "Next.js", "Tailwind CSS", "Framer Motion", "SEO"],
    links: [{ label: "thenewpageproject.com", href: "https://www.thenewpageproject.com" }],
  },
  {
    id: "aquanet",
    title: "AquaNet",
    tagline: "Neural network for lake water quality assessment",
    year: "2025",
    start: { year: 2025, month: 1 },
    end: { year: 2025, month: 12 },
    color: { light: "#0e7490", dark: "#38b6d8" },
    description:
      "An artificial neural network predicting water quality indicators in lakes from EPA environmental data.",
    highlights: [
      "Average RMSE of 0.3396 over 100 epochs across 3 factors on 100 trials",
      "Preprocessing pipeline cleaning and normalizing 110,000+ environmental data points",
      "NOAA Taking the Pulse of the Planet Award; presented at SEFMD and MSEF",
    ],
    tags: ["Python", "PyTorch", "pandas", "NumPy", "Matplotlib"],
    links: [
      {
        label: "GitHub",
        href: "https://github.com/ericzhou12/GreatLakesWaterQualityANN",
      },
    ],
  },
  {
    id: "black-litterman",
    title: "Modified Black-Litterman Model",
    tagline: "Sector-level allocation with SLSQP Sharpe optimization",
    year: "2025",
    start: { year: 2025, month: 1 },
    end: { year: 2025, month: 12 },
    color: { light: "#8a6d10", dark: "#c9a52c" },
    description:
      "A modified Black-Litterman stock allocation model distributing capital by sector, optimizing the Sharpe ratio via SLSQP.",
    highlights: [
      "Wharton Global High School Investment Competition semifinalist — top 50 of 5,000+ teams",
      "Sector-level allocation with sequential least-squares constrained optimization",
    ],
    tags: ["Python", "SciPy", "pandas", "Matplotlib", "Jupyter"],
    links: [{ label: "GitHub", href: "https://github.com/ericzhou12/WGHSIC" }],
  },
];

export const honors: { title: string; detail: string; year: string }[] = [
  {
    title: "Regeneron Science Talent Search Scholar",
    detail: "Top 300 nationally · Regeneron",
    year: "2026",
  },
  {
    title: "National Merit Scholar",
    detail: "1580 SAT, 800 Math",
    year: "2026",
  },
  {
    title: "American Junior Academies of Science Fellow",
    detail: "Gordon & Betty Moore Scholarship recipient",
    year: "2025",
  },
  {
    title: "Wharton Global Investment Competition Semifinalist",
    detail: "Top 50 of 5,000+ teams · University of Pennsylvania",
    year: "2025",
  },
  {
    title: "NOAA Taking the Pulse of the Planet Award",
    detail: "2nd place, Science and Engineering Fair of Metro Detroit",
    year: "2025",
  },
  {
    title: "Michigan D1 All-State Swimming — Team Captain",
    detail: "Four consecutive years",
    year: "2023—26",
  },
];

export const skills: { group: string; items: string[] }[] = [
  {
    group: "Languages",
    items: ["C++", "Python", "TypeScript", "Rust", "Solidity", "SQL"],
  },
  {
    group: "Frontend",
    items: ["React", "Next.js", "Angular", "Tailwind CSS"],
  },
  {
    group: "Cloud & Infra",
    items: [
      "AWS",
      "AWS CDK",
      "CloudFormation",
      "Lambda",
      "DynamoDB",
      "S3",
      "CloudFront",
      "Cognito / OIDC",
      "IAM",
      "GCP",
    ],
  },
  {
    group: "AI / ML",
    items: ["PyTorch", "pandas", "NumPy", "Matplotlib", "Reinforcement Learning"],
  },
  {
    group: "Tools & Practice",
    items: ["Git", "GitHub Actions", "Docker", "Linux (WSL)", "CI/CD", "Agile"],
  },
];

export const education = [
  {
    school: "Northwestern University",
    detail: "B.S. Computer Science & Mathematics",
    period: "Expected 2029",
    location: "Evanston, IL",
  },
  {
    school: "Lawrence Technological University",
    detail:
      "Dual enrollment · 4.0 GPA — Multivariable Calculus, Linear Algebra, Functional Programming, Computer Science 2",
    period: "2026",
    location: "Southfield, MI",
  },
  {
    school: "Troy High School",
    detail: "All-State Swim Team Captain · Computer Club President",
    period: "2022 — 2026",
    location: "Troy, MI",
  },
];

export const certifications= [
  { title: "Options 101", org: "Akuna Capital", year: "2026" },
  {
    title: "YC Startup School",
    org: "Y Combinator",
    year: "2026",
  },
];

export const navigation = [
  { href: "/", label: "Home" },
  { href: "/experience", label: "Experience" },
  { href: "/background", label: "Background" },
];
