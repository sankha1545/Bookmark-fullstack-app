"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { tutorialSteps } from "./tutorialData"
import TutorialStepCard from "./TutorialStepCard"
import Spotlight from "./Spotlight"
import { Button } from "@/components/ui/button"

const MotionDiv = motion.div as any

export default function TutorialOverlay({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {

  const [step, setStep] = useState(0)

  const next = () => {

    if (step < tutorialSteps.length - 1) {

      setStep(step + 1)

    } else {

      onClose()
      setStep(0)

    }

  }

  const prev = () => {

    if (step > 0) setStep(step - 1)

  }

  return (

    <AnimatePresence>

      {open && (

        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        >

          <Spotlight step={step} />

          <div className="relative z-10 space-y-6">

            <AnimatePresence mode="wait">

              <TutorialStepCard
                key={step}
                step={step}
                total={tutorialSteps.length}
                {...tutorialSteps[step]}
                Icon={tutorialSteps[step].icon}
              />

            </AnimatePresence>

            <div className="flex justify-center gap-4">

              <Button variant="ghost" onClick={onClose}>
                Skip
              </Button>

              <Button
                variant="outline"
                onClick={prev}
                disabled={step === 0}
              >
                Previous
              </Button>

              <Button onClick={next}>
                {step === tutorialSteps.length - 1
                  ? "Finish"
                  : "Next"}
              </Button>

            </div>

          </div>

        </MotionDiv>

      )}

    </AnimatePresence>

  )

}
