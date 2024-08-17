"use client";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setStep } from "../store/slices/formSlice";
import { Stepper } from "@mantine/core";
import PanDetailsForm from "@/components/custom/pan/PanDetailsForm";
import AddressForm from "@/components/custom/address/AddressForm";
import ProfileDetailsForm from "@/components/custom/profile/ProfileDetailsForm";
import BankDetailsForm from "@/components/custom/bank/BankDetailsForm";
import InPersonVerificationForm from "@/components/custom/verification/InPersonVerificationForm";
import ESignForm from "@/components/custom/esign/ESignForm";
import DematAccountForm from "@/components/custom/demat/DematForm";

const steps = [
  { id: 1, label: "Pan Details", description: "Enter your Pan Card details" },
  {
    id: 2,
    label: "Address Details",
    description: "Enter your address details",
  },
  {
    id: 3,
    label: "Profile Details",
    description: "Enter your Profile Details",
  },
  {
    id: 4,
    label: "Bank Details",
    description: "Provide your Bank Details",
  },
  { id: 5, label: "Demat Details", description: "Provide your Demat Details" },
  {
    id: 6,
    label: "In Person Verification",
    description: "Do In Person Verification",
  },
  { id: 7, label: "E-Sign", description: "E-sign Verification" },
];

const EKYCFormPage = (props) => {
  const { step } = useSelector((state) => state.form);
  // const step = 7;
  const dispatch = useDispatch();

  const handleStepChange = (newStep) => {
    dispatch(setStep(newStep));
  };

  return (
    <div className="relative flex flex-col h-screen px-4 md:px-8 lg:px-16">
      {/* Stepper for larger screens */}
      <div className="hidden lg:block">
        <div className="max-w-screen mx-auto mt-10">
          <Stepper
            active={step - 1}
            onStepClick={handleStepChange}
            allowNextStepsSelect={false}
            size="sm"
            classNames={{ step: "text-sm" }}
          >
            {steps.map((form) => (
              <Stepper.Step
                key={form.id}
                label={form.label}
                // description={form.description}
              >
                {step === form.id && (
                  <>
                    {form.id === 1 && (
                      <PanDetailsForm
                        step={step}
                        handleStepChange={handleStepChange}
                        steps={steps}
                      />
                    )}
                    {form.id === 2 && (
                      <AddressForm
                        step={step}
                        handleStepChange={handleStepChange}
                        steps={steps}
                      />
                    )}
                    {form.id === 3 && (
                      <ProfileDetailsForm
                        step={step}
                        handleStepChange={handleStepChange}
                        steps={steps}
                      />
                    )}
                    {form.id === 4 && (
                      <BankDetailsForm
                        step={step}
                        handleStepChange={handleStepChange}
                        steps={steps}
                      />
                    )}
                    {form.id === 5 && (
                      <DematAccountForm
                        step={step}
                        handleStepChange={handleStepChange}
                        steps={steps}
                      />
                    )}
                    {form.id === 6 && (
                      <InPersonVerificationForm
                        step={step}
                        handleStepChange={handleStepChange}
                        steps={steps}
                      />
                    )}
                    {form.id === 7 && (
                      <ESignForm
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
      </div>

      {/* Forms for mobile screens */}
      <div className="lg:hidden flex flex-col w-full mt-10">
        {steps.map((form) => (
          <React.Fragment key={form.id}>
            {step === form.id && (
              <>
                {form.id === 1 && (
                  <PanDetailsForm
                    step={step}
                    handleStepChange={handleStepChange}
                    steps={steps}
                  />
                )}
                {form.id === 2 && (
                  <AddressForm
                    step={step}
                    handleStepChange={handleStepChange}
                    steps={steps}
                  />
                )}
                {form.id === 3 && (
                  <ProfileDetailsForm
                    step={step}
                    handleStepChange={handleStepChange}
                    steps={steps}
                  />
                )}
                {form.id === 4 && (
                  <BankDetailsForm
                    step={step}
                    handleStepChange={handleStepChange}
                    steps={steps}
                  />
                )}
                {form.id === 5 && (
                  <DematAccountForm
                    step={step}
                    handleStepChange={handleStepChange}
                    steps={steps}
                  />
                )}
                {form.id === 6 && (
                  <InPersonVerificationForm
                    step={step}
                    handleStepChange={handleStepChange}
                    steps={steps}
                  />
                )}
                {form.id === 7 && (
                  <ESignForm
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
};

export default EKYCFormPage;
