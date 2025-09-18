export const DEMO_SUMMARY = `
SnapSummary helps you understand complex PDFs easily.

- This summary is based on a Next.js course PDF.
- It highlights key concepts like routing, SSR, and API routes.
- Learn fast without reading the entire document!
`;

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

export const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "tween" as const,
      duration: 0.3,
    },
  },
};
