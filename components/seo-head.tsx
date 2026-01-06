import Head from "expo-router/head";
import { Platform } from "react-native";

interface SEOHeadProps {
  title: string;
  description: string;
  canonicalPath?: string;
  ogImage?: string;
  noindex?: boolean;
  keywords?: string;
  type?: "website" | "article" | "product";
}

const BASE_URL = "https://nysmassageexam.com";
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.png`;
const SITE_NAME = "NYS Massage Exam";

export function SEOHead({
  title,
  description,
  canonicalPath = "/",
  ogImage = DEFAULT_OG_IMAGE,
  noindex = false,
  keywords,
  type = "website",
}: SEOHeadProps) {
  // Only render on web
  if (Platform.OS !== "web") {
    return null;
  }

  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const canonicalUrl = `${BASE_URL}${canonicalPath}`;

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow"} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Head>
  );
}

// Pre-configured SEO heads for common pages
export const SEO_CONFIG = {
  home: {
    title: "NYS Massage Exam Prep | Pass the New York State Massage Therapy Exam",
    description: "The only study guide built specifically for the NYS Massage Therapy Licensing Exam. 287 questions with mnemonics. 90% pass rate. $37 lifetime access.",
    keywords: "NYS massage exam, New York massage therapy license, massage therapy exam prep, NYS massage test, Eastern medicine massage",
  },
  landing: {
    title: "NYS Massage Exam Prep | Pass the New York State Massage Therapy Exam",
    description: "Stop wasting time on generic MBLEx prep. The NYS exam has 20% Eastern Medicine content that other study guides don't cover. 287 questions, memory mnemonics, 90% pass rate.",
    keywords: "NYS massage exam, New York massage therapy license, MBLEx alternative, Eastern medicine massage exam, NYS licensing exam",
  },
  quiz: {
    title: "Practice Quiz | NYS Massage Exam Prep",
    description: "Test your knowledge with 287 NYS-specific massage therapy exam questions. Includes Eastern Medicine, Anatomy, Physiology, Kinesiology, and Pathology.",
    keywords: "NYS massage practice test, massage therapy quiz, NYS exam practice questions",
  },
  study: {
    title: "Study Materials | NYS Massage Exam Prep",
    description: "Master all 287 NYS massage therapy exam questions with memory mnemonics and spaced repetition. Category-by-category learning for maximum retention.",
    keywords: "NYS massage study guide, massage therapy flashcards, NYS exam study materials",
  },
  progress: {
    title: "Track Your Progress | NYS Massage Exam Prep",
    description: "Monitor your exam readiness with detailed progress tracking. See which categories need more work and track your path to passing.",
    keywords: "NYS massage exam progress, exam readiness tracker, massage therapy study progress",
  },
  upgrade: {
    title: "Get Full Access - $37 Lifetime | NYS Massage Exam Prep",
    description: "Unlock all 287 NYS-specific exam questions, memory mnemonics, and spaced repetition for just $37. Lifetime access with 30-day money-back guarantee.",
    keywords: "NYS massage exam buy, massage exam study guide price, NYS exam prep cost",
  },
  examInfo: {
    title: "NYS Massage Therapy Exam Information | Dates, Requirements, Tips",
    description: "Everything you need to know about the New York State Massage Therapy Licensing Exam. Exam dates, application deadlines, content breakdown, and test-taking strategies.",
    keywords: "NYS massage exam dates, New York massage license requirements, NYS exam information, massage therapy certification NY",
  },
  guarantee: {
    title: "30-Day Money-Back Guarantee | NYS Massage Exam Prep",
    description: "We're confident you'll pass with our study guide. If you're not satisfied within 30 days, get a full refund - no questions asked.",
    keywords: "NYS massage exam guarantee, money back guarantee, massage exam refund policy",
  },
} as const;
