import { AnimatePresence, motion } from "framer-motion";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Fab } from "@mui/material";

type ScrollTopButtonProps = {
  onScrollToTop: () => void;
  show: boolean;
};

export function ScrollTopButton({ onScrollToTop, show }: ScrollTopButtonProps) {
  return (
    <AnimatePresence>
      {show && (
        <Fab
          aria-label="Scroll back to top"
          color="primary"
          component={motion.button}
          exit={{ opacity: 0, scale: 0.86, y: 10 }}
          initial={{ opacity: 0, scale: 0.86, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          onClick={onScrollToTop}
          size="medium"
          transition={{ duration: 0.22, ease: "easeOut" }}
          whileHover={{ scale: 1.07, y: -2 }}
          whileTap={{ scale: 0.96 }}
          sx={{
            bottom: { xs: 18, md: 28 },
            position: "fixed",
            right: { xs: 18, md: 28 },
            zIndex: (theme) => theme.zIndex.tooltip,
          }}
        >
          <KeyboardArrowUpIcon />
        </Fab>
      )}
    </AnimatePresence>
  );
}
