"use client";

import { useSelector, useDispatch } from "react-redux";
import { setStep } from "@/app/store/slices/formSlice";
import { Stepper, Button, Group } from "@mantine/core";
import React from "react";
import PersonalDetailForm from "@/app/kyc-form/personalDetails/page";
import AddressDetailsForm from "@/app/kyc-form/addressDetails/page";
import ProofOfIdentityForm from "@/app/kyc-form/proofOfIdentity/page";
import ContactDetailsForm from "@/app/kyc-form/contactDetails/page";
import ApplicantDeclarationForm from "@/app/kyc-form/applicantDeclaration/page";

const steps = [
  {
    id: 1,
    label: "Personal Details",
    description: "Enter your personal details",
  },
  {
    id: 2,
    label: "Address Details",
    description: "Enter your address details",
  },
  {
    id: 3,
    label: "Proof Of Identity",
    description: "Upload your identity proof",
  },
  {
    id: 4,
    label: "Contact Details",
    description: "Provide your contact information",
  },
  { id: 5, label: "Applicant Declaration", description: "Review and declare" },
];

export default function RenderSteps() {
  const { step } = useSelector((state) => state.form);
  const dispatch = useDispatch();

  // Handle step changes
  const handleStepChange = (newStep) => {
    dispatch(setStep(newStep));
  };

  return (
    <div>
      <Stepper
        active={step}
        onStepClick={handleStepChange}
        allowNextStepsSelect={false}
      >
        {steps.map((form) => (
          <Stepper.Step
            key={form.id}
            label={form.label}
            description={form.description}
          >
            {step === form.id && (
              <>
                {form.id === 1 && (
                  <PersonalDetailForm
                    step={step}
                    handleStepChange={handleStepChange}
                    steps={steps}
                  />
                )}
                {form.id === 2 && (
                  <AddressDetailsForm
                    step={step}
                    handleStepChange={handleStepChange}
                    steps={steps}
                  />
                )}
                {form.id === 3 && (
                  <ProofOfIdentityForm
                    step={step}
                    handleStepChange={handleStepChange}
                    steps={steps}
                  />
                )}
                {form.id === 4 && (
                  <ContactDetailsForm
                    step={step}
                    handleStepChange={handleStepChange}
                    steps={steps}
                  />
                )}
                {form.id === 5 && (
                  <ApplicantDeclarationForm
                    step={step}
                    handleStepChange={handleStepChange}
                    steps={steps}
                  />
                )}
              </>
            )}
          </Stepper.Step>
        ))}
        <Stepper.Completed>
          Completed! Click back to go to previous steps.
        </Stepper.Completed>
      </Stepper>

      <Button
        variant="default"
        onClick={() => handleStepChange(step - 1)}
        disabled={step === 1}
      >
        Back
      </Button>
      <Button
        onClick={() => handleStepChange(step + 1)}
        disabled={step === steps.length}
      >
        Next step
      </Button>
    </div>
  );
}
