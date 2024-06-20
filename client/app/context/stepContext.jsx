'use client';
import {createContext, useState} from 'react';

const StepContext = createContext({
  currentStep: 0
});

export function StepProvider({children}) {

  const [currentStep, setCurrentStep] = useState(1);

  function goToNextStep() {
    setCurrentStep((prevStep) => prevStep >= 5 ? 1 : prevStep + 1);
  }

  function goToPreviousStep() {
    setCurrentStep((prevStep) => prevStep <= 1 ? 1 : prevStep - 1);
  }

  function resetStep() {
    setCurrentStep(prev => 1);
  }

  const context = {
    currentStep,
    goToNextStep,
    resetStep,
    goToPreviousStep
  }

  return (
    <StepContext.Provider value={context}>
      {children}
    </StepContext.Provider>
  );
}

export default StepContext;