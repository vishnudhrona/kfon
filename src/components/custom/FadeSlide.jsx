import { AnimatePresence, motion } from 'framer-motion';

const variants = {
  hidden: { opacity: 0, y: -6 },
  visible: { opacity: 1, y: 0 }
};

const FadeSlide = ({ show, animationKey, children }) => (
  <AnimatePresence mode='wait'>
    {show && (
      <motion.div
        key={animationKey}
        variants={variants}
        initial='hidden'
        animate='visible'
        exit='hidden'
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    )}
  </AnimatePresence>
);

export default FadeSlide;
