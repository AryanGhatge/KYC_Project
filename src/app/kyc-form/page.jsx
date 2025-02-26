"use client";

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setStep } from "@/app/store/slices/formSlice";
import { Stepper } from "@mantine/core";
import PersonalDetailForm from "./personalDetails/page";
import AddressDetailsForm from "./addressDetails/page";
import ProofOfIdentityForm from "./proofOfIdentity/page";
import ContactDetailsForm from "./contactDetails/page";
import ApplicantDeclarationForm from "./applicantDeclaration/page";

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

export default function KYCFormPage() {
  const { step } = useSelector((state) => state.form);
  // const step = 4;
  const dispatch = useDispatch();

  // Handle step changes
  const handleStepChange = (newStep) => {
    dispatch(setStep(newStep));
  };

  return (
    <div className="my-10 px-20">
      {/* Stepper for larger screens */}
      <div className="hidden lg:block">
        <Stepper
          active={step - 1}
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
      </div>

      {/* Forms for mobile screens */}
      <div className="lg:hidden">
        {steps.map((form) => (
          <React.Fragment key={form.id}>
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
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
