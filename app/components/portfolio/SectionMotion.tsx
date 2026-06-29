import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { sectionVariant } from "./styles";

type SectionMotionProps = {
  amount?: number;
  children: ReactNode;
};

export function SectionMotion({ amount = 0.1, children }: SectionMotionProps) {
  return (
    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount }} variants={sectionVariant}>
      {children}
    </motion.div>
  );
}
