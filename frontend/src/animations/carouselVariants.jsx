export const carouselVariants = {
  hidden: (direction) => ({
    x: direction > 0 ? 200 : -200,
    opacity: 0,
  }),
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.4 },
  },
  exit: (direction) => ({
    x: direction > 0 ? -200 : 200,
    opacity: 0,
    transition: { duration: 0.4 },
  }),
};