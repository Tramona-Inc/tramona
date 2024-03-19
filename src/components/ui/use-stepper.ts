import * as React from "react";

import { type StepperItemProps } from "./stepper";

interface useStepperProps {
  initialStep: number;
  steps: Pick<
    StepperItemProps,
    "label" | "description" | "optional" | "optionalLabel" | "icon"
  >[];
}

type UseStepperReturn = {
  activeStep: number;
  isDisabledStep: boolean;
  isLastStep: boolean;
  isOptionalStep: boolean | undefined;
  nextStep: () => void;
  prevStep: () => void;
  resetSteps: () => void;
  setStep: (step: number) => void;
};

function useStepper({ initialStep, steps }: useStepperProps): UseStepperReturn {
  const [activeStep, setActiveStep] = React.useState(initialStep);

  const isDisabledStep = React.useMemo(() => activeStep === 0, [activeStep]);

  const isLastStep = React.useMemo(
    () => activeStep === steps.length - 1,
    [activeStep, steps.length],
  );

  const isOptionalStep = React.useMemo(
    () => steps[activeStep]?.optional,
    [steps, activeStep],
  );

  const nextStep = () => {
    setActiveStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setActiveStep((prev) => prev - 1);
  };

  const resetSteps = () => {
    setActiveStep(initialStep);
  };

  const setStep = (step: number) => {
    setActiveStep(step);
  };

  return {
    activeStep,
    isDisabledStep,
    isLastStep,
    isOptionalStep,
    nextStep,
    prevStep,
    resetSteps,
    setStep,
  };
}

export { useStepper };
