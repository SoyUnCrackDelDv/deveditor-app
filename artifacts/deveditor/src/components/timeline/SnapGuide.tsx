import { motion, AnimatePresence } from 'framer-motion';

interface SnapGuideProps {
  x: number | null;
  visible: boolean;
}

export function SnapGuide({ x, visible }: SnapGuideProps) {
  return (
    <AnimatePresence>
      {visible && x !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute top-0 bottom-0 w-px bg-yellow-400 z-[31] pointer-events-none shadow-[0_0_8px_rgba(250,204,21,0.8)]"
          style={{ left: x }}
          data-testid="snap-guide"
        />
      )}
    </AnimatePresence>
  );
}
