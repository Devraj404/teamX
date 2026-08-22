import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function Page3D({ children }: { children: ReactNode }) {
  return <div className="page">{children}</div>;
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
