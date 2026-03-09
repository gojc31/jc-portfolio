import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  motion,
  AnimatePresence,
  useInView,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { ExternalLink, X, ArrowRight } from "lucide-react";
import TextReveal from "./TextReveal";

/* ─── Data types ──────────────────────────────────────────────── */

interface CaseResult {
  metric: string;
  value: number;
  suffix: string;
}

interface Project {
  title: string;
  category: string;
  description: string;
  image: string;
  tools: string[];
  result?: string;
  // Optional case study detail fields
  client?: string;
  problem?: string;
  solution?: string;
  caseResults?: CaseResult[];
}

/* ─── Unified project data ────────────────────────────────────── */

const projects: Project[] = [
  {
    title: "Advanced AI Voice Receptionist & Appointment Manager",
    category: "Voice AI",
    description:
      "A multi-step n8n workflow triggered by VAPI to handle inbound voice calls. Dynamically manages appointments (book/update/cancel) and logs all call data and recordings into Airtable.",
    image: "https://i.imgur.com/5aJ2xfc.png",
    tools: ["n8n", "VAPI", "Airtable", "Calendar APIs", "Webhooks"],
    result: "24/7 coverage, 80% cost cut",
    client: "HVAC Services Company",
    problem:
      "The client's manual call handling was restricted to business hours, resulting in missed opportunities and high overhead. No automated way to book, update, or cancel appointments from phone calls.",
    solution:
      "Engineered a fully autonomous inbound call system using VAPI triggers within n8n. The workflow dynamically manages calendar appointments (Book/Update/Cancel), integrates with Google/Outlook APIs, and logs all recordings to Airtable, achieving 100% data accuracy.",
    caseResults: [
      { metric: "Call Coverage", value: 24, suffix: "/7" },
      { metric: "Data Accuracy", value: 100, suffix: "%" },
      { metric: "Cost Reduction", value: 80, suffix: "%" },
    ],
  },
  {
    title: "Sales Lifecycle Execution Automation",
    category: "Sales Automation",
    description:
      "Sophisticated multi-path workflow triggered by Asana task statuses. Automatically sends customized emails, creates project folders in Google Drive, and initiates service-specific subtasks.",
    image: "https://i.imgur.com/dMQVsy1.png",
    tools: ["Zapier", "Asana", "Gmail", "Google Drive"],
    result: "40h saved per week",
    client: "Multi-Service Agency",
    problem:
      "The sales team needed strict adherence to processes for different lead stages and service lines, which was previously error-prone. Manual folder creation and email sending caused delays and inconsistency.",
    solution:
      "Designed a complex, multi-path routing architecture triggered by Asana task statuses. The system ensures process compliance by automatically generating client Google Drive folders, sending stage-specific emails, and assigning subtasks based on service type.",
    caseResults: [
      { metric: "Hours Saved Weekly", value: 40, suffix: "h" },
      { metric: "Process Compliance", value: 100, suffix: "%" },
      { metric: "Folder Creation Time", value: 3, suffix: "s" },
    ],
  },
  {
    title: "Instant Lead Capture & Multi-Channel Nurturing",
    category: "Lead Gen",
    description:
      "Implements instantaneous lead capture launching sequenced, multi-step campaigns across SMS, email, and automated call tasks with conditional wait steps based on engagement.",
    image: "https://i.imgur.com/XQMJN3U.png",
    tools: ["GoHighLevel", "SMS", "Email", "Call Automation"],
    result: "5 min speed-to-lead",
    client: "Coaching Business",
    problem:
      "The sales team struggled with consistent initial outreach. Leads went cold waiting for follow-up, and there was no systematic multi-channel nurturing in place.",
    solution:
      "Built a speed-to-lead system that triggers multi-channel nurturing (SMS/Email/Call) instantly upon capture (<5 min latency). Implemented 'Smart Tagging' logic to detect reply sentiment, automatically cleanse stale leads, and ensure 100% pipeline accuracy.",
    caseResults: [
      { metric: "Speed to Lead", value: 5, suffix: " min" },
      { metric: "Engagement Rate", value: 25, suffix: "% up" },
      { metric: "Response Rate", value: 15, suffix: "% up" },
    ],
  },
  {
    title: "Enterprise E-Commerce & Accounting Sync",
    category: "FinOps",
    description:
      "Complex Make.com scenario automating financial reporting for a high-volume wholesale distributor. Synchronizes orders, customers, and inventory between SellerCloud and QuickBooks Online.",
    image: "https://i.imgur.com/kDOF5CX.png",
    tools: ["Make", "QuickBooks Online", "SellerCloud API", "JSON", "DataStore"],
    result: "100% financial accuracy",
    client: "Wholesale Distributor",
    problem:
      "The client processed thousands of orders manually, leading to ledger errors and duplicate customer profiles. Manual data entry between e-commerce and accounting was unsustainable at scale.",
    solution:
      "Built a Make.com automation that 'watches' for shipped orders, applies smart logic to find or create customers and items, updates prices dynamically, and ensures 100% reconciliation without human intervention using DataStore for deduplication.",
    caseResults: [
      { metric: "Financial Accuracy", value: 100, suffix: "%" },
      { metric: "Manual Entry", value: 0, suffix: " hrs" },
      { metric: "Order Volume", value: 1000, suffix: "+/mo" },
    ],
  },
  {
    title: "Serverless Custom Helpdesk System",
    category: "Support Ops",
    description:
      "Custom-built support ticketing system replacing enterprise helpdesk software. Uses Google Sheets as a relational database and Make.com as the logic engine to manage thousands of tickets.",
    image: "https://i.imgur.com/GRc2Nnb.png",
    tools: ["Make", "Google Sheets", "Gmail API", "Regex"],
    result: "100% cost savings vs SaaS",
    client: "Digital Agency",
    problem:
      "The client was paying thousands per month for enterprise helpdesk software that was overly complex for their needs. Ticket routing was manual, response times were inconsistent, and there was no unified view of support metrics.",
    solution:
      "Engineered a fully custom helpdesk using Google Sheets as a relational database and Make.com as the automation engine. Incoming emails are parsed with Regex, auto-categorized, assigned to agents, and tracked through resolution. Automated SLA alerts and a live dashboard replaced the entire SaaS tool.",
    caseResults: [
      { metric: "SaaS Cost Savings", value: 100, suffix: "%" },
      { metric: "Tickets Managed", value: 5000, suffix: "+/mo" },
      { metric: "Avg Response Time", value: 15, suffix: " min" },
    ],
  },
  {
    title: "Instagram Lead Gen & Segmentation Engine",
    category: "Social Commerce",
    description:
      "Converts viral Instagram engagement into owned email leads. Uses anti-spam randomization and interactive branching to collect zero-party data before syncing to GoHighLevel.",
    image: "https://i.imgur.com/gIBNWrn.png",
    tools: ["ManyChat", "Instagram API", "GoHighLevel"],
    result: "24/7 auto lead capture",
    client: "E-Commerce Brand",
    problem:
      "The brand had high Instagram engagement but no system to convert comments and DMs into actionable leads. Manual responses were slow, inconsistent, and couldn't scale during viral moments.",
    solution:
      "Built a ManyChat automation with anti-spam randomization and interactive branching flows. Commenters receive personalized DMs that collect zero-party data (preferences, email, intent) before auto-syncing qualified leads into GoHighLevel for nurturing.",
    caseResults: [
      { metric: "Lead Capture Rate", value: 35, suffix: "%" },
      { metric: "Response Time", value: 3, suffix: "s" },
      { metric: "Monthly Leads", value: 2000, suffix: "+" },
    ],
  },
  {
    title: "AI Agent for Recruitment & Application",
    category: "AI Agent",
    description:
      "An autonomous AI agent on n8n that identifies job openings via Slack commands, scrapes listings, and uses LLMs to hyper-personalize resumes and cover letters in real-time.",
    image: "https://i.imgur.com/ZR8pafy.png",
    tools: ["n8n", "Slack API", "Gemini", "OpenRouter"],
    result: "< 30s asset generation",
    client: "Recruitment Consultancy",
    problem:
      "Consultants spent hours manually tailoring resumes and cover letters for each job listing. The process was slow, error-prone, and couldn't keep up with the volume of openings across multiple platforms.",
    solution:
      "Built an autonomous AI agent on n8n triggered by Slack commands. The agent scrapes live job listings, extracts key requirements, and uses LLMs (Gemini/OpenRouter) to hyper-personalize resumes and cover letters in under 30 seconds per application.",
    caseResults: [
      { metric: "Asset Generation", value: 30, suffix: "s" },
      { metric: "Applications/Day", value: 50, suffix: "+" },
      { metric: "Time Saved", value: 90, suffix: "%" },
    ],
  },
  {
    title: "Automated Real Estate Deal Analysis (TrueARV)",
    category: "Real Estate",
    description:
      "Automates admin setup and initial underwriting of property leads. Transforms a form submission into a fully organized, data-enriched deal package with live AVM data.",
    image: "https://i.imgur.com/jDhbg9x.png",
    tools: ["Make", "Google Drive API", "RapidAPI", "Sheets"],
    result: "< 1 min deal processing",
    client: "Real Estate Investment Firm",
    problem:
      "Analysts spent 30+ minutes per lead manually pulling property data, creating folders, and running initial underwriting. The process was too slow to compete in fast-moving deal flow.",
    solution:
      "Built a Make.com automation triggered by form submission that auto-creates organized Google Drive folders, pulls live AVM (Automated Valuation Model) data via RapidAPI, populates underwriting spreadsheets, and delivers a complete deal package in under 60 seconds.",
    caseResults: [
      { metric: "Deal Processing", value: 1, suffix: " min" },
      { metric: "Analyst Time Saved", value: 95, suffix: "%" },
      { metric: "Data Accuracy", value: 100, suffix: "%" },
    ],
  },
  {
    title: "CRM Pipeline & Revenue Recovery Automation",
    category: "Sales Ops",
    description:
      "GoHighLevel workflows that stop sales leaks by managing lead movement through the pipeline based on calendar events, ensuring no prospect falls through the cracks.",
    image: "https://i.imgur.com/XQMJN3U.png",
    tools: ["GoHighLevel", "Calendar", "Email/SMS"],
    result: "100% pipeline accuracy",
    client: "B2B Sales Organization",
    problem:
      "Leads were falling through the cracks between pipeline stages. Reps forgot follow-ups after no-shows, and there was no automated system to move deals based on calendar outcomes. Revenue was being lost to pipeline leakage.",
    solution:
      "Designed GoHighLevel workflows that automatically manage lead movement based on calendar events — attended, no-show, rescheduled, or cancelled. Each outcome triggers the correct next step (follow-up sequence, re-engagement, or escalation), ensuring zero pipeline leakage.",
    caseResults: [
      { metric: "Pipeline Accuracy", value: 100, suffix: "%" },
      { metric: "Revenue Recovered", value: 20, suffix: "%" },
      { metric: "Missed Follow-ups", value: 0, suffix: "" },
    ],
  },
  {
    title: "Automated Sales Cadence & Call Disposition",
    category: "Sales Ops",
    description:
      "Pipeline governance for high-volume sales teams. The system updates itself based on call outcomes (Answered, Busy, Voicemail), routing leads to the correct next step automatically.",
    image: "https://i.imgur.com/dMQVsy1.png",
    tools: ["GoHighLevel", "Call Triggers", "Logic Gates"],
    result: "100% cadence compliance",
    client: "Insurance Sales Team",
    problem:
      "Sales reps were inconsistent with follow-up cadences. After calls, leads were left in limbo — no systematic routing based on whether the call was answered, went to voicemail, or the line was busy.",
    solution:
      "Built an automated call disposition system in GoHighLevel. After each call, the system reads the outcome (Answered/Busy/Voicemail/No Answer) and routes the lead to the appropriate next step — schedule callback, send voicemail follow-up SMS, or advance to next cadence stage.",
    caseResults: [
      { metric: "Cadence Compliance", value: 100, suffix: "%" },
      { metric: "Contact Rate", value: 40, suffix: "% up" },
      { metric: "Rep Efficiency", value: 35, suffix: "% up" },
    ],
  },
  {
    title: "AI Content Repurposing & Multi-Platform Distribution",
    category: "Content Ops",
    description:
      "Ingests long-form content from Google Drive, uses AI to generate multiple versions, and distributes across LinkedIn, Facebook, and Instagram automatically.",
    image: "https://i.imgur.com/aIp9z68.png",
    tools: ["Zapier", "Google Drive", "AI", "Social APIs"],
    result: "300% content increase",
    client: "Marketing Agency",
    problem:
      "The team produced high-quality long-form content but lacked bandwidth to repurpose it across social channels. Content sat in Google Drive unused, while social accounts went quiet between major publications.",
    solution:
      "Created a Zapier automation that watches for new content in Google Drive, sends it to AI for multi-format repurposing (carousel posts, short-form captions, thread-style breakdowns), then auto-publishes across LinkedIn, Facebook, and Instagram with platform-optimized formatting.",
    caseResults: [
      { metric: "Content Output", value: 300, suffix: "% up" },
      { metric: "Manual Work", value: 0, suffix: " hrs" },
      { metric: "Social Engagement", value: 45, suffix: "% up" },
    ],
  },
  {
    title: "Advanced Leads Enrichment Pipeline",
    category: "Sales Ops",
    description:
      "Hybrid Zapier workflow that enriches leads via Apollo/Hunter.io, uses AI to segment into priority paths, and notifies sales via Slack for high-priority prospects.",
    image: "https://i.imgur.com/7MT7cOd.png",
    tools: ["Zapier", "Apollo", "Hunter.io", "AI", "Slack"],
    result: "+30% sales productivity",
    client: "SaaS Startup",
    problem:
      "Sales reps wasted hours researching leads manually. Without enrichment data, they couldn't prioritize effectively — treating a Fortune 500 VP the same as a freelancer, leading to poor conversion and wasted effort.",
    solution:
      "Built a hybrid Zapier pipeline that auto-enriches every incoming lead via Apollo and Hunter.io, then uses AI scoring to segment leads into priority tiers. High-value prospects trigger instant Slack alerts to senior reps, while lower-tier leads enter automated nurture sequences.",
    caseResults: [
      { metric: "Sales Productivity", value: 30, suffix: "% up" },
      { metric: "Lead Research Time", value: 0, suffix: " min" },
      { metric: "Conversion Rate", value: 22, suffix: "% up" },
    ],
  },
  {
    title: "AI ASMR Video Production & Publishing",
    category: "Content Gen",
    description:
      "Scheduled n8n workflow using Gemini AI for scripts, JWT-authenticated video API for rendering, and auto-publishing to YouTube Shorts and Facebook Reels.",
    image: "https://i.imgur.com/LK5MQoC.png",
    tools: ["n8n", "Gemini AI", "Video API", "YouTube"],
    result: "90% cost savings",
    client: "Content Creator",
    problem:
      "The creator wanted to scale ASMR content across platforms but couldn't afford a production team. Scripting, rendering, and publishing each video manually took hours and limited output to 2-3 videos per week.",
    solution:
      "Built a scheduled n8n workflow that uses Gemini AI to generate ASMR scripts, sends them to a JWT-authenticated video rendering API, and auto-publishes finished videos to YouTube Shorts and Facebook Reels — producing daily content with zero manual intervention.",
    caseResults: [
      { metric: "Production Cost", value: 90, suffix: "% down" },
      { metric: "Videos Per Week", value: 14, suffix: "+" },
      { metric: "Channel Growth", value: 200, suffix: "% up" },
    ],
  },
  {
    title: "Policy Feedback Loop via Apps Script & Slack",
    category: "Compliance",
    description:
      "Custom Google Apps Script routing policy questions to SMEs via Slack with interactive buttons, webhook callbacks, and guaranteed audit trail.",
    image: "https://i.imgur.com/B3QswUp.png",
    tools: ["Apps Script", "Google Forms", "Slack", "Gmail"],
    result: "< 1 hour review time",
    client: "Enterprise Organization",
    problem:
      "Policy questions from employees were sent via email and got lost in inboxes. SMEs took days to respond, there was no tracking or audit trail, and the same questions were answered repeatedly without a knowledge base.",
    solution:
      "Built a Google Apps Script system that routes policy questions (via Google Forms) directly to the relevant SME via Slack with interactive Approve/Reject/Clarify buttons. Webhook callbacks log every response with timestamps, creating a guaranteed audit trail and building a searchable knowledge base.",
    caseResults: [
      { metric: "Review Time", value: 1, suffix: " hr" },
      { metric: "Audit Compliance", value: 100, suffix: "%" },
      { metric: "Repeat Questions", value: 60, suffix: "% down" },
    ],
  },
];

/* ─── Tool-based filter map ──────────────────────────────────── */

const toolFilters: { label: string; match: (p: Project) => boolean }[] = [
  { label: "All", match: () => true },
  { label: "n8n", match: (p) => p.tools.some((t) => t.toLowerCase() === "n8n") },
  { label: "GHL", match: (p) => p.tools.some((t) => t.toLowerCase().includes("gohighlevel")) },
  { label: "Make.com", match: (p) => p.tools.some((t) => t.toLowerCase() === "make") },
  { label: "Zapier", match: (p) => p.tools.some((t) => t.toLowerCase() === "zapier") },
  { label: "Apps Script", match: (p) => p.tools.some((t) => t.toLowerCase().includes("apps script")) },
];

const filterLabels = toolFilters.map((f) => f.label);

function matchesFilter(filterLabel: string, project: Project): boolean {
  const f = toolFilters.find((tf) => tf.label === filterLabel);
  return f ? f.match(project) : true;
}

/* ─── Modal counter (spring-animated number) ──────────────────── */

function ModalCounter({
  value,
  suffix,
  delay,
}: {
  value: number;
  suffix: string;
  delay: number;
}) {
  const hasDecimal = String(value).includes(".");
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { stiffness: 120, damping: 20 });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    const timeout = setTimeout(() => motionValue.set(value), delay * 1000);
    return () => clearTimeout(timeout);
  }, [motionValue, value, delay]);

  useEffect(() => {
    const unsubscribe = spring.on("change", (v) => {
      setDisplay(hasDecimal ? v.toFixed(1) : Math.round(v).toString());
    });
    return unsubscribe;
  }, [spring, hasDecimal]);

  return (
    <span className="text-3xl md:text-4xl font-bold text-accent-400 font-space leading-none">
      {display}
      {suffix}
    </span>
  );
}

/* ─── Corner bracket accents for case study modal ─────────────── */

function CornerBrackets() {
  const color = "rgb(var(--accent-rgb))";
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const positions: { className: string; rotate: string }[] = [
    { className: "top-4 left-4", rotate: "" },
    { className: "top-4 right-4", rotate: "scale(-1,1)" },
    { className: "bottom-4 left-4", rotate: "scale(1,-1)" },
    { className: "bottom-4 right-4", rotate: "scale(-1,-1)" },
  ];

  return (
    <div
      ref={ref}
      className="transition-opacity duration-[250ms] ease-out"
      style={{ opacity: visible ? 1 : 0, transitionDelay: "100ms" }}
    >
      {positions.map((pos, i) => (
        <svg
          key={i}
          className={`absolute ${pos.className} pointer-events-none`}
          width="36"
          height="36"
          viewBox="0 0 36 36"
          fill="none"
          style={{ transform: pos.rotate }}
        >
          <path
            d="M2 34V8C2 4.686 4.686 2 8 2H34"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.6"
          />
          <rect
            x="1"
            y="1"
            width="4"
            height="4"
            transform="rotate(45 3 3)"
            fill={color}
            opacity="0.5"
          />
        </svg>
      ))}
    </div>
  );
}

/* ─── Snap particle overlay (modal only) ──────────────────────── */

function SnapOverlay({ mode, count = 20 }: { mode: "disintegrate" | "materialize"; count?: number }) {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const xPos = Math.random() * 100;
      const yPos = Math.random() * 100;
      const angle = (Math.random() * Math.PI * 0.8) - Math.PI * 0.4 + (Math.random() > 0.5 ? 0 : Math.PI * 0.1);
      const dist = 60 + Math.random() * 150;
      const waveDelay = ((100 - xPos) / 100) * 0.08;
      return {
        x: xPos,
        y: yPos,
        size: 4 + Math.random() * 10,
        dx: Math.cos(angle) * dist + 30,
        dy: Math.sin(angle) * dist - 20,
        delay: waveDelay + Math.random() * 0.04,
        dur: 0.18 + Math.random() * 0.12,
        rotation: (Math.random() - 0.5) * 180,
        colorIdx: i % 4,
      };
    });
  }, [count]);

  const colors = [
    "rgba(var(--accent-rgb), 0.9)",
    "rgba(var(--accent-rgb), 0.6)",
    "rgba(255,255,255,0.5)",
    "rgba(var(--accent-rgb), 0.75)",
  ];

  return (
    <div
      className="absolute inset-0 z-30 pointer-events-none"
      style={{ overflow: "visible" }}
    >
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: colors[p.colorIdx],
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
            boxShadow: p.colorIdx < 2 ? `0 0 ${p.size}px rgba(var(--accent-rgb), 0.4)` : "none",
          }}
          initial={
            mode === "disintegrate"
              ? { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 }
              : { opacity: 1, x: p.dx, y: p.dy, scale: 0.3, rotate: p.rotation }
          }
          animate={
            mode === "disintegrate"
              ? { opacity: [1, 0.8, 0], x: p.dx, y: p.dy, scale: [1, 0.8, 0], rotate: p.rotation }
              : { opacity: [1, 0.6, 0], x: 0, y: 0, scale: [0.3, 0.8, 0], rotate: 0 }
          }
          transition={{
            delay: p.delay,
            duration: p.dur,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

/* ─── Timeline phase for case study modal ─────────────────────── */

function TimelinePhase({
  label,
  children,
  delay,
  isLast,
}: {
  label: string;
  children: React.ReactNode;
  delay: number;
  isLast: boolean;
}) {
  return (
    <motion.div
      className="relative flex gap-6"
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.25, ease: "easeOut" }}
    >
      <div className="flex flex-col items-center flex-shrink-0">
        <motion.div
          className="w-3 h-3 rounded-full border-2 border-accent-500 bg-dark-900 z-10"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: delay + 0.05, type: "spring", stiffness: 200 }}
        />
        {!isLast && (
          <motion.div
            className="w-[2px] flex-1 bg-gradient-to-b from-accent-500/60 to-accent-500/10"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: delay + 0.1, duration: 0.3 }}
            style={{ transformOrigin: "top" }}
          />
        )}
      </div>
      <div className={`pb-8 ${isLast ? "pb-0" : ""}`}>
        <span className="text-[11px] font-space uppercase tracking-widest text-accent-400/80 mb-2 block">
          {label}
        </span>
        {children}
      </div>
    </motion.div>
  );
}

/* ─── Case Study Detail Modal ─────────────────────────────────── */

function CaseStudyModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    setTimeout(onClose, 250);
  }, [isClosing, onClose]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: isClosing ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-dark-950/90 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: isClosing ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        onClick={handleClose}
      />

      {/* Snap particles */}
      <div className="absolute inset-0 z-[310] pointer-events-none overflow-visible">
        {isClosing ? (
          <SnapOverlay mode="disintegrate" count={20} />
        ) : (
          <SnapOverlay mode="materialize" count={20} />
        )}
      </div>

      {/* Modal panel */}
      <motion.div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-dark-900/95 border border-dark-700/40 shadow-2xl will-change-[opacity,transform]"
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={
          isClosing
            ? { opacity: 0, scale: 0.95, y: 10, transition: { duration: 0.2, ease: "easeIn" } }
            : { opacity: 1, scale: 1, y: 0, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } }
        }
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        onClick={(e) => e.stopPropagation()}
      >
        <CornerBrackets />

        {/* Close button */}
        <motion.button
          className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full border border-dark-700/50 bg-dark-800/80 flex items-center justify-center text-dark-300 hover:text-accent-400 hover:border-accent-500/40 transition-colors duration-200"
          onClick={handleClose}
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M2 2L14 14M14 2L2 14" />
          </svg>
        </motion.button>

        {/* Image at top if available */}
        <div className="aspect-video bg-dark-800 flex items-center justify-center overflow-hidden rounded-t-2xl">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              const parent = e.currentTarget.parentElement;
              if (parent) {
                parent.innerHTML =
                  '<span class="text-dark-400 font-space text-sm">Screenshot coming soon</span>';
              }
            }}
          />
        </div>

        {/* Modal content */}
        <div className="p-8 md:p-12 pt-8 md:pt-10">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-1.5 h-1.5 rotate-45 bg-accent-500/70 shadow-[0_0_6px_rgba(var(--accent-rgb),0.4)]" />
              <span className="text-xs font-space uppercase tracking-widest text-accent-400/80">
                {project.category}
              </span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-dark-50 mb-2">
              {project.title}
            </h3>
            {project.client && (
              <p className="text-sm font-space text-dark-400">
                Client: {project.client}
              </p>
            )}
          </div>

          {/* Timeline: Problem → Solution → Results */}
          <div className="flex flex-col">
            <TimelinePhase label="Problem" delay={0.12} isLast={false}>
              <p className="text-dark-300 text-sm leading-relaxed max-w-xl">
                {project.problem}
              </p>
            </TimelinePhase>

            <TimelinePhase label="Solution" delay={0.19} isLast={false}>
              <p className="text-dark-300 text-sm leading-relaxed max-w-xl mb-4">
                {project.solution}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.tools.map((tool) => (
                  <span
                    key={tool}
                    className="text-[10px] font-space text-dark-400 uppercase tracking-wider px-3 py-1.5 rounded-lg border border-dark-700/40 bg-dark-800/60"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </TimelinePhase>

            <TimelinePhase label="Results" delay={0.26} isLast>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-1">
                {project.caseResults!.map((r, i) => (
                  <motion.div
                    key={r.metric}
                    className="relative px-5 py-4 rounded-xl bg-dark-800/50 border border-accent-500/15 text-center"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.28 + i * 0.06,
                      duration: 0.2,
                      ease: "easeOut",
                    }}
                  >
                    <div className="absolute -top-1 -left-1 w-2 h-2 rotate-45 border border-accent-500/30 bg-dark-900" />
                    <div className="absolute -top-1 -right-1 w-2 h-2 rotate-45 border border-accent-500/30 bg-dark-900" />
                    <div className="absolute -bottom-1 -left-1 w-2 h-2 rotate-45 border border-accent-500/30 bg-dark-900" />
                    <div className="absolute -bottom-1 -right-1 w-2 h-2 rotate-45 border border-accent-500/30 bg-dark-900" />

                    <ModalCounter
                      value={r.value}
                      suffix={r.suffix}
                      delay={0.3 + i * 0.06}
                    />
                    <span className="block text-[10px] font-space text-dark-400 uppercase tracking-wider mt-1.5">
                      {r.metric}
                    </span>
                  </motion.div>
                ))}
              </div>
            </TimelinePhase>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Simple Lightbox Modal (for projects without case study data) */

function LightboxModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    setTimeout(onClose, 250);
  }, [isClosing, onClose]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isClosing ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 z-[300] bg-dark-950/95 backdrop-blur-sm flex items-center justify-center p-6"
      onClick={handleClose}
    >
      {/* Snap particles */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-visible">
        {isClosing ? (
          <SnapOverlay mode="disintegrate" count={20} />
        ) : (
          <SnapOverlay mode="materialize" count={20} />
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={
          isClosing
            ? { opacity: 0, scale: 0.95, y: 10, transition: { duration: 0.2, ease: "easeIn" } }
            : { opacity: 1, scale: 1, y: 0, transition: { duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] } }
        }
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative max-w-3xl w-full bg-dark-900 rounded-2xl border border-dark-700/40 overflow-hidden will-change-[opacity,transform]"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Close button */}
        <motion.button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-dark-800/80 backdrop-blur-sm border border-accent-500/20 flex items-center justify-center text-dark-300 hover:text-accent-300 transition-colors cursor-pointer"
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
        >
          <X size={16} />
        </motion.button>

        {/* Image */}
        <div className="aspect-video bg-dark-800 flex items-center justify-center overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              const parent = e.currentTarget.parentElement;
              if (parent) {
                parent.innerHTML =
                  '<span class="text-dark-400 font-space text-sm">Screenshot coming soon</span>';
              }
            }}
          />
        </div>

        {/* Details */}
        <div className="p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="flex items-center gap-1.5 text-xs font-space uppercase tracking-widest text-accent-400/80 px-3 py-1 rounded-full border border-accent-500/20 bg-dark-800/50">
              <span className="w-1 h-1 rotate-45 bg-accent-500/70" />
              {project.category}
            </span>
            {project.result && (
              <span className="text-xs font-space text-accent-300 font-semibold bg-accent-500/[0.08] px-3 py-1 rounded-full border border-accent-500/15">
                {project.result}
              </span>
            )}
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-dark-50 mb-3">
            {project.title}
          </h3>
          <p className="text-dark-300 text-sm leading-relaxed mb-5">
            {project.description}
          </p>

          <div className="flex items-center gap-2 mb-5">
            <div className="h-px flex-1 bg-gradient-to-r from-accent-500/20 to-transparent" />
            <div className="w-1.5 h-1.5 rotate-45 bg-accent-500/40" />
            <div className="h-px flex-1 bg-gradient-to-l from-accent-500/20 to-transparent" />
          </div>

          <div className="flex flex-wrap gap-2">
            {project.tools.map((t) => (
              <span
                key={t}
                className="text-[10px] font-space text-dark-300 uppercase tracking-wider px-3 py-1 rounded-full border border-dark-700/40 bg-dark-800/40 hover:border-accent-500/20 transition-colors"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Project Card (pure CSS transitions for snap feel) ───────── */

function ProjectCard({
  project,
  index,
  onClick,
  phase,
}: {
  project: Project;
  index: number;
  onClick: () => void;
  phase: "idle" | "snapping" | "entering";
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-40px" });

  const hasCaseStudy = !!project.caseResults;

  // Staggered delay for entering cards (30ms per card, max 150ms)
  const staggerDelay = `${Math.min(index * 0.03, 0.15)}s`;

  // Determine CSS classes based on phase
  const phaseStyles =
    phase === "snapping"
      ? "opacity-0 scale-95"
      : phase === "entering"
      ? "opacity-100 scale-100"
      : isInView
      ? "opacity-100 scale-100"
      : "opacity-0 scale-[0.97]";

  return (
    <div
      ref={cardRef}
      style={{
        transitionDelay: phase === "entering" ? staggerDelay : "0s",
        transitionDuration: phase === "snapping" ? "150ms" : "200ms",
      }}
      className={`relative rounded-2xl overflow-hidden transition-[opacity,transform] ease-out will-change-[opacity,transform] ${phaseStyles} ${
        phase !== "snapping"
          ? "cursor-pointer hover:-translate-y-1.5 hover:scale-[1.015] active:scale-[0.97]"
          : ""
      }`}
      onClick={phase !== "snapping" ? onClick : undefined}
    >
      <div className="relative rounded-2xl bg-dark-900 overflow-hidden border border-dark-700/50 shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:border-accent-500/35 hover:shadow-[0_0_25px_rgba(var(--accent-rgb),0.12),0_20px_40px_rgba(0,0,0,0.4)] transition-[border-color,box-shadow] duration-200">
        <div className="group relative overflow-hidden">
        {/* Image */}
        <div className="relative aspect-video bg-dark-800 overflow-hidden rounded-t-2xl">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover opacity-80 scale-100 group-hover:opacity-100 group-hover:scale-[1.04] transition-[opacity,transform] duration-300 ease-out will-change-transform"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              const parent = e.currentTarget.parentElement;
              if (parent) {
                parent.classList.add("flex", "items-center", "justify-center");
              }
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/20 to-transparent opacity-70" />
          <div className="absolute top-3 left-3 flex items-center gap-1.5 text-[10px] font-space uppercase tracking-widest text-accent-300/90 px-2.5 py-1 rounded-full bg-dark-950/70 backdrop-blur-sm border border-accent-500/20 shadow-lg shadow-dark-950/40">
            <div className="w-1 h-1 rotate-45 bg-accent-500/70" />
            {project.category}
          </div>
          {hasCaseStudy && (
            <div className="absolute top-3 right-3 flex items-center gap-1 text-[9px] font-space uppercase tracking-widest text-accent-300/90 px-2 py-0.5 rounded-full bg-accent-500/10 backdrop-blur-sm border border-accent-500/25">
              Case Study
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="w-10 h-10 rounded-full bg-accent-500/10 backdrop-blur-sm flex items-center justify-center border border-accent-500/30">
              <ExternalLink size={16} className="text-accent-300" />
            </div>
          </div>
        </div>

        <div className="p-5">
          <h3 className="text-base font-semibold text-dark-50 mb-2 group-hover:text-white transition-colors duration-200">
            {project.title}
          </h3>
          <p className="text-dark-400 text-sm leading-relaxed mb-3 line-clamp-2">
            {project.description}
          </p>

          <div className="flex items-center gap-2 mb-3">
            <div className="h-px flex-1 bg-gradient-to-r from-accent-500/15 to-transparent" />
            <div className="w-1 h-1 rotate-45 bg-accent-500/30" />
            <div className="h-px flex-1 bg-gradient-to-l from-accent-500/15 to-transparent" />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-1.5">
              {project.tools.slice(0, 3).map((t) => (
                <span
                  key={t}
                  className="text-[9px] font-space text-dark-400 uppercase tracking-wider px-2 py-0.5 rounded border border-dark-700/40 bg-dark-800/40 group-hover:border-accent-500/15 group-hover:text-dark-300 transition-colors duration-200"
                >
                  {t}
                </span>
              ))}
              {project.tools.length > 3 && (
                <span className="text-[9px] font-space text-dark-400 px-1.5 py-0.5">
                  +{project.tools.length - 3}
                </span>
              )}
            </div>
            {project.result && (
              <span className="text-[10px] font-space font-semibold text-accent-300 bg-accent-500/[0.08] px-2 py-0.5 rounded-full border border-accent-500/15">
                {project.result}
              </span>
            )}
          </div>

          {/* View Project CTA */}
          <div className="overflow-hidden max-h-0 opacity-0 mt-0 group-hover:max-h-10 group-hover:opacity-100 group-hover:mt-3 transition-all duration-200 ease-out">
            <div className="flex items-center gap-2 text-accent-400 text-xs font-space uppercase tracking-wider">
              <span>{hasCaseStudy ? "View Case Study" : "View Project"}</span>
              <ArrowRight size={12} className="transition-transform duration-200 group-hover:translate-x-1" />
              <div className="h-px flex-1 bg-gradient-to-r from-accent-500/25 to-transparent" />
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

/* ─── Main Section ────────────────────────────────────────────── */

export default function Portfolio() {
  const [filter, setFilter] = useState("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [snappingTitles, setSnappingTitles] = useState<Set<string>>(new Set());
  const [enteringTitles, setEnteringTitles] = useState<Set<string>>(new Set());
  const [visibleFilter, setVisibleFilter] = useState("All");
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const enterTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const handleFilterChange = useCallback(
    (newFilter: string) => {
      if (newFilter === filter) return;

      // Clear any in-progress transitions
      clearTimeout(timerRef.current);
      clearTimeout(enterTimerRef.current);

      const currentSet = projects.filter((p) => matchesFilter(filter, p));
      const nextSet = projects.filter((p) => matchesFilter(newFilter, p));
      const leaving = currentSet.filter((p) => !nextSet.some((np) => np.title === p.title));
      const entering = nextSet.filter((p) => !currentSet.some((cp) => cp.title === p.title));

      setFilter(newFilter);

      if (leaving.length > 0) {
        // Phase 1: fade out leaving cards (150ms)
        setSnappingTitles(new Set(leaving.map((p) => p.title)));
        setEnteringTitles(new Set());

        timerRef.current = setTimeout(() => {
          // Phase 2: swap grid + stagger-fade new cards in
          setSnappingTitles(new Set());
          setVisibleFilter(newFilter);
          if (entering.length > 0) {
            requestAnimationFrame(() => {
              setEnteringTitles(new Set(entering.map((p) => p.title)));
              enterTimerRef.current = setTimeout(() => setEnteringTitles(new Set()), 250);
            });
          }
        }, 160);
      } else {
        setVisibleFilter(newFilter);
        setSnappingTitles(new Set());
        if (entering.length > 0) {
          requestAnimationFrame(() => {
            setEnteringTitles(new Set(entering.map((p) => p.title)));
            enterTimerRef.current = setTimeout(() => setEnteringTitles(new Set()), 250);
          });
        }
      }
    },
    [filter]
  );

  const handleCardClick = useCallback((project: Project) => {
    setSelectedProject(project);
  }, []);

  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current);
      clearTimeout(enterTimerRef.current);
    };
  }, []);

  // Scroll lock when modal is open
  useEffect(() => {
    if (!selectedProject) return;
    const scrollY = window.scrollY;
    const body = document.body;
    const html = document.documentElement;
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.overflow = "hidden";
    html.style.overflow = "hidden";
    return () => {
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      body.style.overflow = "";
      html.style.overflow = "";
      requestAnimationFrame(() => {
        window.scrollTo({ top: scrollY, behavior: "instant" });
      });
    };
  }, [selectedProject]);

  // Build visible list: current filter + any cards mid-snap
  const filtered = useMemo(() => {
    const base = projects.filter((p) => matchesFilter(visibleFilter, p));
    const snapping = projects.filter(
      (p) => snappingTitles.has(p.title) && !base.some((b) => b.title === p.title)
    );
    return [...base, ...snapping];
  }, [visibleFilter, snappingTitles]);

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative py-28 md:py-36"
    >
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2 h-2 rotate-45 bg-accent-500/60 shadow-[0_0_8px_rgba(var(--accent-rgb),0.3)]" />
            <span className="text-sm font-space text-accent-400/70 tracking-widest uppercase">
              Portfolio
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-accent-500/20 to-transparent" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-[-0.02em] mb-8">
            <TextReveal>Featured</TextReveal>{" "}
            <span className="text-accent-400">
              <TextReveal delay={0.2}>work.</TextReveal>
            </span>
          </h2>

          {/* Tool filters */}
          <div className="flex flex-wrap gap-2">
            {filterLabels.map((cat) => (
              <button
                key={cat}
                onClick={() => handleFilterChange(cat)}
                className={`px-4 py-1.5 text-xs font-space uppercase tracking-wider rounded-full border bg-transparent cursor-pointer transition-[border-color,color,box-shadow] duration-150 hover:scale-105 active:scale-95 ${
                  filter === cat
                    ? "border-accent-500/50 text-accent-300 shadow-[0_0_12px_rgba(var(--accent-rgb),0.12)]"
                    : "border-dark-700/50 text-dark-400 hover:border-accent-500/25 hover:text-dark-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Project grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((project, i) => (
            <ProjectCard
              key={project.title}
              project={project}
              index={i}
              onClick={() => handleCardClick(project)}
              phase={
                snappingTitles.has(project.title)
                  ? "snapping"
                  : enteringTitles.has(project.title)
                  ? "entering"
                  : "idle"
              }
            />
          ))}
        </div>
      </div>

      {/* Modal - case study or simple lightbox */}
      <AnimatePresence>
        {selectedProject &&
          (selectedProject.caseResults ? (
            <CaseStudyModal
              key="case-study-modal"
              project={selectedProject}
              onClose={() => setSelectedProject(null)}
            />
          ) : (
            <LightboxModal
              key="lightbox-modal"
              project={selectedProject}
              onClose={() => setSelectedProject(null)}
            />
          ))}
      </AnimatePresence>
    </section>
  );
}
