import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function Page3D({ children }: { children: ReactNode }) {
  return (
    <motion.div
      className="page"
      initial={{ opacity: 0, rotateX: 12, y: 28, z: -80 }}
      animate={{ opacity: 1, rotateX: 0, y: 0, z: 0 }}
      exit={{ opacity: 0, rotateY: -14, x: 40 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function TiltCard({
  children,
  className = "",
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <motion.article
      className={`card tilt ${className}`}
      whileHover={{ rotateY: 8, rotateX: -6, z: 24, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      {children}
    </motion.article>
  );
}
