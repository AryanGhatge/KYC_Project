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
import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
  // const step = 5;
  const router = useRouter();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({});
  const [currentStep, setCurrentStep] = useState(step);
  const userData = useSelector((state) => state.auth);
  const name = userData?.user?.name;
  // console.log("User Data - ", userData);
  // console.log("Name - ", name);

  useEffect(() => {
    // Load all form data from localStorage on component mount
    const savedData = localStorage.getItem("ekycFormData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setFormData(parsedData);
    }
  }, []);

  const sendDataToServer = async (formData) => {
    try {
      const response = await dataService.updateData(formData);
      // console.log("Data sent successfully:", response);
      return response;
    } catch (error) {
      console.error("Error sending data:", error);
      throw error;
    }
  };

  const handleStepChange = (newStep) => {
    setCurrentStep(newStep);
    dispatch(setStep(newStep));
  };

  const handleFormSubmit = async (stepData, currentStep) => {
    const updatedFormData = { ...formData, [currentStep]: stepData };
    console.log("Updated Form Data - ", updatedFormData);
    setFormData(updatedFormData);
    localStorage.setItem("ekycFormData", JSON.stringify(updatedFormData));

    // If step 5 (Demat Details) is completed, send all data to server
    if (currentStep === 5) {
      try {
        // Validate demat details before transformation
        const dematDetails = updatedFormData[5]?.dematDetails;
        if (dematDetails?.length > 0) {
          const primaryAccount = dematDetails.find((acc) => acc.primary);
          if (
            primaryAccount &&
            (!primaryAccount.clientMasterCopy ||
              primaryAccount.clientMasterCopy.trim() === "")
          ) {
            toast.error(
              "Please upload client master copy for the primary demat account"
            );
            return;
          }
        }

        // Transform data to API format
        const apiRequestData = transformDataForAPI(updatedFormData, name);
        console.log("Transformed Data for API - ", apiRequestData);

        // Add more detailed logging
        // console.log("Sending request to server...");

        try {
          const response = await sendDataToServer(apiRequestData);
          // console.log("Raw server response:", response);

          if (!response) {
            throw new Error("No response received from server");
          }

          if (!response.success) {
            throw new Error(response.message || "Server returned an error");
          }

          // console.log("Data submitted successfully to the server.", response);
          toast.success("Data updated successfully");
          // Proceed to next step
          handleStepChange(currentStep + 1);
        } catch (apiError) {
          console.error("API Error:", apiError);
          toast.error(
            apiError.message || "Failed to update data. Please try again."
          );
          return;
        }


        // If successful, proceed to next step
        handleStepChange(currentStep + 1);
      } catch (error) {
        console.error("Failed to submit data:", error);
        console.error("Error details:", error.response?.data || error.message);
        toast.error(
          "Failed to submit data: " +
            (error.response?.data?.message || error.message)
        );
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
            step={currentStep}
            handleStepChange={handleStepChange}
          />
        );
      case 2:
        return (
          <AddressForm
            onSubmit={handleFormSubmit}
            initialData={formData[2]}
            step={currentStep}
            handleStepChange={handleStepChange}
          />
        );
      case 3:
        return (
          <ProfileDetailsForm
            onSubmit={handleFormSubmit}
            initialData={formData[3]}
            step={currentStep}
            handleStepChange={handleStepChange}
          />
        );
      case 4:
        return (
          <BankDetailsForm
            onSubmit={handleFormSubmit}
            initialData={formData[4]}
            step={currentStep}
            handleStepChange={handleStepChange}
          />
        );
      case 5:
        return (
          <DematForm
            onSubmit={handleFormSubmit}
            initialData={formData[5]}
            step={currentStep}
            handleStepChange={handleStepChange}
          />
        );
      case 6:
        return (
          <InPersonVerificationForm
            onSubmit={handleFormSubmit}
            initialData={formData[6]}
            step={currentStep}
            handleStepChange={handleStepChange}
          />
        );
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
    <div className="relative flex flex-col min-h-screen w-full px-4 md:px-8 lg:px-16">
      <div className="hidden lg:block w-full h-full">
        <div className="max-w-screen mx-auto mt-10 w-full h-full">
          <Stepper
            active={step - 1}
            onStepClick={(clickedStep) => handleStepChange(clickedStep + 1)}
            allowNextStepsSelect={false}
            color="black"
            completedIcon={<span>✓</span>}
            size="sm"
            classNames={{
              // root: "w-full",
              // step: "text-sm",
              // stepIcon: "border-[1px] border-blue-500",
              // stepCompletedIcon: "bg-blue-500 text-white",
              // separator: "bg-gray-200",
              // separatorActive: "bg-blue-50s0",
              // content: "w-full",
            }}
          >
            {steps.map((form) => (
              <Stepper.Step
                key={form.id}
                label={form.label}
                // description={form.description}
              >
                {step === form.id && renderStepContent()}
              </Stepper.Step>
            ))}
            <Stepper.Completed className="">
              <div className="flex flex-col w-full h-[600px] justify-center text-lg font-semibold text-gray-700 items-center space-y-4">
                <p>Completed! Click back to go to previous steps.</p>
                <Button
                  onClick={() => router.push("/")}
                  className="flex items-center space-x-2"
                >
                  <span>Go to Homepage</span>
                  <ArrowRight size={24} />
                </Button>
              </div>
            </Stepper.Completed>
          </Stepper>
        </div>
      </div>

      <div className="lg:hidden flex flex-col w-full mt-10">{renderStepContent()}</div>
    </div>
  );
};

export default FormSteps;
