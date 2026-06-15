import { BarChart3, Shield, Zap, Activity, TrendingUp, Lock, Settings } from "lucide-react"

export const faqs = [
    {
        q: "How does the tenant configuration work?",
        a: "Tenant configuration allows you to define custom rules, select operational products, and deploy instant versions side-by-side without downtime.",
    },
    {
        q: "Can I define custom claim logic?",
        a: "Yes, you can configure complex sequential claims flows using our interactive visual rules builder panel.",
    },
    {
        q: "Is the platform SOC 2 compliant?",
        a: "Yes, our infrastructure is SOC 2 Type II certified with bank-grade encryption and strict access controls.",
    },
]

export const features = [
    {
        title: "Automated Underwriting",
        desc: "Accelerate policy decisions with our AI-driven underwriting engine. Reduce manual reviews by up to 70% while maintaining compliance and risk thresholds.",
        icon: Activity,
        wide: true,
    },
    {
        title: "Real-time Analytics",
        desc: "Gain instant visibility into agency performance with customizable dashboards and reports.",
        icon: TrendingUp,
        wide: false,
    },
    {
        title: "Enterprise Security",
        desc: "Bank-grade encryption and strict access controls ensure your sensitive client data remains protected.",
        icon: Lock,
        wide: false,
    },
    {
        title: "Seamless Integrations",
        desc: "Connect with your favorite tools. We offer native integrations for popular CRM, accounting, and marketing platforms.",
        icon: Settings,
        wide: true,
    },
]

export const heroSlides = [
    { icon: BarChart3, title: "Real-Time Dashboard", subtitle: "Live claims processing & analytics" },
    { icon: Shield, title: "Enterprise Security", subtitle: "SOC 2 Type II certified infrastructure" },
    { icon: Zap, title: "Instant Deployments", subtitle: "Zero-downtime tenant configuration rollout" },
]

export const trustedCompanies = [
    { name: "Fidelity Life", style: "font-heading font-bold" },
    { name: "AMERICO", style: "font-bold tracking-wider italic" },
    { name: "Corebridge", style: "font-extrabold" },
    { name: "SAMMONS", style: "font-heading font-bold" },
    { name: "Nationwide", style: "font-semibold tracking-wide" },
    { name: "Progressive", style: "font-bold italic" },
]

export const steps = [
    { num: "01", title: "Configure", desc: "Set up your tenant rules, claim types, and approval workflows." },
    { num: "02", title: "Deploy", desc: "Push configurations live with zero downtime." },
    { num: "03", title: "Scale", desc: "Grow your operations with enterprise-grade infrastructure." },
]