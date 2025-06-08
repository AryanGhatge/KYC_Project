"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { panDetailsSchema } from "@/lib/schemas/e-kyc/panDetailsSchema";
import { toast } from "sonner";
import { AiOutlineInfoCircle } from "react-icons/ai";

const PanDetailsForm = ({ onSubmit, initialData, step, handleStepChange }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formMethods = useForm({
    resolver: zodResolver(panDetailsSchema),
    defaultValues: initialData || {
      panNumber: "",
      mobileNumber: "",
      dateOfBirth: "",
      emailId: "",
      whoAreU: "Individual",
    },
    mode: "onChange",
  });

  const {
    formState: { isValid, errors },
    watch,
  } = formMethods;
  const allValues = watch();

  // Function to check if all required fields are filled
  const areAllFieldsFilled = () => {
    return (
      allValues.panNumber &&
      allValues.mobileNumber &&
      allValues.dateOfBirth &&
      allValues.emailId &&
      allValues.whoAreU &&
      Object.keys(errors).length === 0
    );
  };

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("ekycFormData") || "{}");
    const panData = savedData[0]; // step 1 data
    console.log("panData", panData);
    if (panData) {
      Object.entries(panData).forEach(([key, value]) => {
        // Handle date conversion for dateOfBirth
        if (key === "dateOfBirth") {
          formMethods.setValue(key, new Date(value));
        } else {
          formMethods.setValue(key, value);
        }
      });
    }
  }, []);

  useEffect(() => {
    if (initialData) {
      Object.entries(initialData).forEach(([key, value]) => {
        formMethods.setValue(key, value);
      });
    }
  }, [initialData, formMethods]);

  const handleSubmitForm = async (data) => {
    try {
      setIsSubmitting(true);

      // Additional validation
      const today = new Date();
      const dob = new Date(data.dateOfBirth);

      if (!data.dateOfBirth) {
        toast.error("Please select your date of birth");
        return;
      }

      if (dob > today) {
        toast.error("Date of birth cannot be in the future");
        return;
      }

      // Calculate age
      const age = today.getFullYear() - dob.getFullYear();
      if (age < 18) {
        toast.error("You must be at least 18 years old");
        return;
      }

      // PAN validation
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      if (!panRegex.test(data.panNumber)) {
        toast.error("Invalid PAN format. Must be in format ABCDE1234F");
        return;
      }

      // Mobile validation
      const mobileRegex = /^[6-9]\d{9}$/;
      if (!mobileRegex.test(data.mobileNumber)) {
        toast.error(
          "Invalid mobile number. Must be 10 digits starting with 6-9"
        );
        return;
      }

      // Save form data to localStorage
      const existingData = JSON.parse(
        localStorage.getItem("ekycFormData") || "{}"
      );
      const updatedData = {
        ...existingData,
        [1]: data, // Save step 1 data
      };
      localStorage.setItem("ekycFormData", JSON.stringify(updatedData));

      console.log("PAN details submitted successfully:", data);
      toast.success("Details submitted successfully!");
      onSubmit(data, 1);
    } catch (error) {
      console.error("Error submitting PAN details:", error);
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add handleDateChange for date validation
  const handleDateChange = (e, field) => {
    const value = e.target.value;
    field.onChange(value);

    if (!value) {
      formMethods.setError("dateOfBirth", {
        type: "manual",
        message: "Date of birth is required",
      });
      return;
    }

    const dob = new Date(value);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    const month = today.getMonth() - dob.getMonth();

    if (dob > today) {
      formMethods.setError("dateOfBirth", {
        type: "manual",
        message: "Date of birth cannot be in the future",
      });
    } else if (age < 18 || (age === 18 && month < 0)) {
      formMethods.setError("dateOfBirth", {
        type: "manual",
        message: "You must be at least 18 years old",
      });
    } else {
      formMethods.clearErrors("dateOfBirth");
    }
  };

  // Add real-time validation feedback
  const handlePanChange = (e, field) => {
    const value = e.target.value.toUpperCase();
    field.onChange(value);

    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (value && !panRegex.test(value)) {
      formMethods.setError("panNumber", {
        type: "manual",
        message: "Invalid PAN format. Must be in format ABCDE1234F",
      });
    } else {
      formMethods.clearErrors("panNumber");
    }
  };

  const handleMobileChange = (e, field) => {
    const value = e.target.value;
    field.onChange(value);

    const mobileRegex = /^[6-9]\d{9}$/;
    if (value && !mobileRegex.test(value)) {
      formMethods.setError("mobileNumber", {
        type: "manual",
        message: "Invalid mobile number. Must be 10 digits starting with 6-9",
      });
    } else {
      formMethods.clearErrors("mobileNumber");
    }
  };

  return (
    <div className="w-full py-6">
      <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg border-2">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-center">Pan Details</h2>
          <Form {...formMethods}>
            <form
              onSubmit={formMethods.handleSubmit(handleSubmitForm)}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:space-x-4">
                {/* PAN Number */}
                <div className="flex-1">
                  <FormField
                    control={formMethods.control}
                    name="panNumber"
                    render={({ field }) => (
                      <FormItem>
                        {" "}
                        <FormLabel className="flex items-center gap-2">
                          PAN Number
                          <span className="text-red-500">*</span>
                          <span className="tooltip-container">
                            <AiOutlineInfoCircle className="text-gray-500 cursor-help" />
                            <span className="tooltip-text">
                              Enter your 10-character Permanent Account Number
                              (Format: ABCDE1234F)
                            </span>
                          </span>
                        </FormLabel>
                        <FormControl>
                          <input
                            type="text"
                            placeholder="Enter PAN Number (ABCDE1234F)"
                            {...field}
                            onChange={(e) => handlePanChange(e, field)}
                            className="w-full p-2 border border-gray-300 rounded"
                            maxLength={10}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex-1">
                  <FormField
                    control={formMethods.control}
                    name="mobileNumber"
                    render={({ field }) => (
                      <FormItem>
                        {" "}
                        <FormLabel className="flex items-center gap-2">
                          Mobile Number
                          <span className="text-red-500">*</span>
                          <span className="tooltip-container">
                            <AiOutlineInfoCircle className="text-gray-500 cursor-help" />
                            <span className="tooltip-text">
                              Enter your 10-digit mobile number starting with
                              6-9
                            </span>
                          </span>
                        </FormLabel>
                        <FormControl>
                          <input
                            type="text"
                            placeholder="Enter Mobile Number"
                            {...field}
                            onChange={(e) => handleMobileChange(e, field)}
                            className="w-full p-2 border border-gray-300 rounded"
                            maxLength={10}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:space-x-4">
                {/* Date of Birth */}
                <div className="flex-1">
                  <FormField
                    control={formMethods.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        {" "}
                        <FormLabel className="flex items-center gap-2">
                          Date of Birth
                          <span className="text-red-500">*</span>
                          <span className="tooltip-container">
                            <AiOutlineInfoCircle className="text-gray-500 cursor-help" />
                            <span className="tooltip-text">
                              You must be at least 18 years old to proceed
                            </span>
                          </span>
                        </FormLabel>
                        <FormControl>
                          <input
                            type="date"
                            {...field}
                            onChange={(e) => handleDateChange(e, field)}
                            className="w-full p-2 border border-gray-300 rounded"
                            max={new Date().toISOString().split("T")[0]} // Prevent future dates
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Email ID */}
                <div className="flex-1">
                  <FormField
                    control={formMethods.control}
                    name="emailId"
                    render={({ field }) => (
                      <FormItem>
                        {" "}
                        <FormLabel className="flex items-center gap-2">
                          Email ID
                          <span className="text-red-500">*</span>
                          <span className="tooltip-container">
                            <AiOutlineInfoCircle className="text-gray-500 cursor-help" />
                            <span className="tooltip-text">
                              Enter a valid email address. This will be used for
                              important communications
                            </span>
                          </span>
                        </FormLabel>
                        <FormControl>
                          <input
                            type="email"
                            placeholder="Enter Email ID"
                            {...field}
                            className="w-full p-2 border border-gray-300 rounded"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              {/* Who Are You */}
              <div>
                <FormField
                  control={formMethods.control}
                  name="whoAreU"
                  render={({ field }) => (
                    <FormItem>
                      {" "}
                      <FormLabel className="flex items-center gap-2">
                        I am a<span className="text-red-500">*</span>
                        <span className="tooltip-container">
                          <AiOutlineInfoCircle className="text-gray-500 cursor-help" />
                          <span className="tooltip-text">
                            Select your residency status. This affects the KYC
                            requirements and documentation needed
                          </span>
                        </span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        className="w-full"
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Individual">Individual</SelectItem>
                          <SelectItem value="Non Resident Indian">
                            Non Resident Indian
                          </SelectItem>
                          <SelectItem value="Foreign National">
                            Foreign National
                          </SelectItem>
                          <SelectItem value="Person of Indian Origin">
                            Person of Indian Origin
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>{" "}
              <div className="flex justify-end mt-4">
                <Button
                  type="submit"
                  variant="default"
                  disabled={isSubmitting || !areAllFieldsFilled()}
                  title={
                    !areAllFieldsFilled()
                      ? "Please fill all required fields correctly"
                      : "Proceed to next step"
                  }
                >
                  {isSubmitting ? "Submitting..." : "Next"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default PanDetailsForm;
