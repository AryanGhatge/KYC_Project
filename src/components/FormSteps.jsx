"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setStep } from "@/app/store/slices/formSlice";
import { Stepper } from "@mantine/core";
import PanDetailsForm from "@/components/custom/pan/PanDetailsForm";
import AddressForm from "@/components/custom/address/AddressForm";
import ProfileDetailsForm from "@/components/custom/profile/ProfileDetailsForm";
import BankDetailsForm from "@/components/custom/bank/BankDetailsForm";
import DematForm from "@/components/custom/demat/DematForm";
import InPersonVerificationForm from "@/components/custom/verification/InPersonVerificationForm";
import ESignForm from "@/components/custom/esign/ESignForm";
import dataService from "@/lib/apiService/dataService";
import { transformDataForAPI } from "@/lib/transformDataForApi";

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
  { id: 4, label: "Bank Details", description: "Provide your Bank Details" },
  { id: 5, label: "Demat Details", description: "Provide your Demat Details" },
  {
    id: 6,
    label: "In Person Verification",
    description: "Do In Person Verification",
  },
  { id: 7, label: "E-Sign", description: "E-sign Verification" },
];

const FormSteps = () => {
  const { step } = useSelector((state) => state.form);
  // const step = 4;
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({});

  useEffect(() => {
    // Load all form data from localStorage on component mount
    const savedData = localStorage.getItem("ekycFormData");
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  const sendDataToServer = async (formData) => {
    try {
      const response = await dataService.updateData(formData);
      return response;
    } catch (error) {
      console.error('Error sending data:', error);
      throw error;
    }
  };

  const handleStepChange = (newStep) => {
    dispatch(setStep(newStep));
  };

  const handleFormSubmit = async (stepData, currentStep) => {
    const updatedFormData = { ...formData, [currentStep]: stepData };
    setFormData(updatedFormData);
    localStorage.setItem("ekycFormData", JSON.stringify(updatedFormData));

    // If step 5 (Demat Details) is completed, send all data to server
    if (currentStep === 5) {
      try {
        // Transform data to API format
        const apiRequestData = transformDataForAPI(updatedFormData);
      
        // Output the transformed data
        // console.log("Converted Data for API - ", JSON.stringify(apiRequestData, null, 2));
        await sendDataToServer(apiRequestData);
        // If successful, proceed to next step
        handleStepChange(currentStep + 1);
      } catch (error) {
        // Handle error - you might want to show an error message to the user
        console.error('Failed to submit data:', error);
      }
    } else {
      handleStepChange(currentStep + 1);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <PanDetailsForm
            onSubmit={handleFormSubmit}
            initialData={formData[1]}
          />
        );
      case 2:
        return (
          <AddressForm onSubmit={handleFormSubmit} initialData={formData[2]} />
        );
      case 3:
        return (
          <ProfileDetailsForm
            onSubmit={handleFormSubmit}
            initialData={formData[3]}
          />
        );
      case 4:
        return (
          <BankDetailsForm
            onSubmit={handleFormSubmit}
            initialData={formData[4]}
          />
        );
      case 5:
        return (
          <DematForm onSubmit={handleFormSubmit} initialData={formData[5]} />
        );
      case 6:
        return (
          <InPersonVerificationForm
            onSubmit={handleFormSubmit}
            initialData={formData[6]}
          />
        );
      case 7:
      case 7:
        return (
          <ESignForm
            handleStepChange={handleStepChange}
            step={step}
            steps={steps}
            onSubmit={handleFormSubmit}
            initialData={formData[7]}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative flex flex-col h-screen px-4 md:px-8 lg:px-16">
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
              <Stepper.Step key={form.id} label={form.label}>
                {step === form.id && renderStepContent()}
              </Stepper.Step>
            ))}
            <Stepper.Completed>
              Completed! Click back to go to previous steps.
            </Stepper.Completed>
          </Stepper>
        </div>
      </div>

      <div className="lg:hidden flex flex-col w-full mt-10">
        {renderStepContent()}
      </div>
    </div>
  );
};

export default FormSteps;
