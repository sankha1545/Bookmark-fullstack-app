import type { Variants } from "framer-motion"



/* =========================================
   SAFE EASING
========================================= */

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1]



/* =========================================
   FADE UP
========================================= */

export const fadeUp: Variants = {

  hidden: {

    opacity: 0,

    y: 24,

  },


  visible: {

    opacity: 1,

    y: 0,


    transition: {

      duration: 0.6,

      ease: EASE_OUT,


      /* REQUIRED FOR NEXT 16 */

      repeat: 0,

      repeatType: "loop",

    },

  },

}



/* =========================================
   STAGGER CONTAINER
========================================= */

export const staggerContainer: Variants = {

  hidden: {},


  visible: {

    transition: {

      staggerChildren: 0.08,

      delayChildren: 0,

      repeat: 0,

    },

  },

}
