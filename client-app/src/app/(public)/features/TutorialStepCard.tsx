"use client"

import { motion, useMotionValue, useTransform } from "framer-motion"

const MotionDiv = motion.div as any

export default function TutorialStepCard({
  step,
  total,
  title,
  description,
  Icon,
}: any) {

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useTransform(mouseY, [-100, 100], [8, -8])
  const rotateY = useTransform(mouseX, [-100, 100], [-8, 8])

  function handleMouseMove(e: any) {

    const rect = e.currentTarget.getBoundingClientRect()

    const x = e.clientX - rect.left - rect.width / 2

    const y = e.clientY - rect.top - rect.height / 2

    mouseX.set(x)
    mouseY.set(y)

  }

  function resetMouse() {

    mouseX.set(0)
    mouseY.set(0)

  }

  const progress = ((step + 1) / total) * 100


  return (

    <MotionDiv

      key={step}

      initial={{ opacity: 0, y: 80, scale: 0.9 }}

      animate={{ opacity: 1, y: 0, scale: 1 }}

      exit={{ opacity: 0, y: -40 }}

      transition={{ duration: 0.6, type: "spring" }}

      style={{ rotateX, rotateY }}

      onMouseMove={handleMouseMove}

      onMouseLeave={resetMouse}

      className="relative bg-white/5 backdrop-blur-2xl border border-white/10 
      rounded-2xl p-8 shadow-[0_25px_80px_rgba(0,0,0,0.45)] 
      max-w-md overflow-hidden"

    >


      {/* Ambient Glow */}


      <MotionDiv

        animate={{ opacity: [0.3, 0.6, 0.3] }}

        transition={{

          duration: 4,

          repeat: Infinity,

          repeatType: "loop",

        }}

        className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary/10 blur-3xl"

      />


      {/* Floating Icon */}


      <MotionDiv

        animate={{ y: [0, -8, 0] }}

        transition={{

          duration: 3,

          repeat: Infinity,

          repeatType: "loop",

        }}

        className="relative z-10"

      >

        <Icon className="text-primary mb-6" size={42} />

      </MotionDiv>



      <h3 className="relative z-10 text-2xl font-semibold mb-3 text-white">

        {title}

      </h3>



      <p className="relative z-10 text-white/80">

        {description}

      </p>



      <div className="relative z-10 mt-8">


        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">


          <MotionDiv

            initial={{ width: 0 }}

            animate={{ width: `${progress}%` }}

            transition={{ duration: 0.6 }}

            className="h-full bg-gradient-to-r from-primary to-purple-500"

          />


        </div>



        <p className="text-xs text-white mt-3">

          Step {step + 1} of {total}

        </p>


      </div>


    </MotionDiv>

  )

}
