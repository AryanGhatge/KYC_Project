import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Input } from "@/components/ui/input";
import { profileDetailSchema } from "@/lib/schemas/e-kyc/profileDetailSchema";
import { profileService } from "@/lib/apiService/profileService";
import { toast } from "sonner";
import { AiOutlineInfoCircle } from "react-icons/ai";

const occupationData = [
  "Employed",
  "Self-Employed",
  "Business Owner",
  "Student",
  "Retired",
  "Unemployed",
];

const annualSalaryData = [
  "Less than 5 LPA",
  "5-10 LPA",
  "10-15 LPA",
  "15-25 LPA",
  "More than 25 LPA",
];

const ProfileDetailsForm = ({
  onSubmit,
  initialData,
  step,
  handleStepChange,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm({
    resolver: zodResolver(profileDetailSchema),
    defaultValues: initialData || {
      gender: "",
      placeOfBirth: "",
      occupation: "",
      annualIncome: "",
      citizenship: false,
      informationConfirmation: false,
    },
    mode: "onChange",
  });

  const {
    formState: { errors },
    watch,
  } = form;
  const allValues = watch();

  // Function to check if all required fields are filled
  const areAllFieldsFilled = () => {
    return (
      allValues.gender &&
      allValues.placeOfBirth &&
      allValues.occupation &&
      allValues.annualIncome &&
      allValues.citizenship &&
      allValues.informationConfirmation &&
      Object.keys(errors).length === 0
    );
  };

  useEffect(() => {
    if (initialData) {
      Object.entries(initialData).forEach(([key, value]) => {
        form.setValue(key, value);
      });
    }
  }, [initialData, form]);

  const handleSubmit = async (data) => {
    try {
      // const response = await profileService.createProfile(data);
      console.log("Profile details submitted successfully:", data);
      toast.success("Details submitted successfully!");
      onSubmit(data, 3);
    } catch (error) {
      toast.error(error.message || "Something went wrong. Please try again.");
      console.error("Error submitting profile details:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Example for BankDetailsForm
  const handleBack = () => {
    // onSubmit(form.getValues(), step - 1);
    handleStepChange(step - 1);
  };

  return (    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4">
      <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-lg border my-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Profile Details</h2>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    {" "}
                    <FormLabel className="flex items-center gap-2">
                      Gender
                      <span className="text-red-500">*</span>
                      <span className="tooltip-container">
                        <AiOutlineInfoCircle className="text-gray-500 cursor-help" />
                        <span className="tooltip-text">
                          Select your gender as per official documents
                        </span>
                      </span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Others">Others</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />{" "}
              <FormField
                control={form.control}
                name="placeOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      Place of Birth
                      <span className="text-red-500">*</span>
                      <span className="tooltip-container">
                        <AiOutlineInfoCircle className="text-gray-500 cursor-help" />
                        <span className="tooltip-text">
                          Enter the city/town (minimum 3 characters) where you
                          were born as per your birth certificate
                        </span>
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Place of Birth (min. 3 characters)"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          if (e.target.value.length < 3) {
                            form.setError("placeOfBirth", {
                              type: "manual",
                              message:
                                "Place of birth must be at least 3 characters",
                            });
                          } else {
                            form.clearErrors("placeOfBirth");
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {/* Occupation */}
              <div>
                <FormField
                  control={form.control}
                  name="occupation"
                  render={({ field }) => (
                    <FormItem>
                      {" "}
                      <FormLabel className="flex items-center gap-2 text-gray-700">
                        Occupation
                        <span className="text-red-500">*</span>
                        <span className="tooltip-container">
                          <AiOutlineInfoCircle className="text-gray-500 cursor-help" />
                          <span className="tooltip-text">
                            Select your current employment status or primary
                            occupation
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
                            <SelectValue placeholder="Select Occupation" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {occupationData.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Annual Income */}
              <div>
                <FormField
                  control={form.control}
                  name="annualIncome"
                  render={({ field }) => (
                    <FormItem>
                      {" "}
                      <FormLabel className="flex items-center gap-2 text-gray-700">
                        Annual Income (LPA)
                        <span className="text-red-500">*</span>
                        <span className="tooltip-container">
                          <AiOutlineInfoCircle className="text-gray-500 cursor-help" />
                          <span className="tooltip-text">
                            Select your annual income range in Lakhs Per Annum
                            (LPA). This helps determine your investment capacity
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
                            <SelectValue placeholder="Select Annual Income" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {annualSalaryData.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            {/* Checkboxes */}
            <div className="space-y-4 mt-6">
              {/* Citizenship Checkbox */}
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="citizenship"
                  className="h-3 w-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  {...form.register("citizenship", { required: true })}
                />
                <label
                  htmlFor="citizenship"
                  className="text-gray-700 leading-tight"
                >
                  <span className="block font-medium">
                    I am an Indian citizen and a tax resident of India and of no
                    other country. I do not have any political
                    exposure/affiliations.
                  </span>
                </label>
              </div>

              {/* Information Confirmation Checkbox */}
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="informationConfirmation"
                  className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  {...form.register("informationConfirmation", {
                    required: true,
                  })}
                />
                <label
                  htmlFor="informationConfirmation"
                  className="text-gray-700 leading-tight"
                >
                  <span className="block font-medium">
                    I/We confirm that the information provided here is true &
                    accurate. In the event any of the above information is found
                    to be false/incorrect and/or the declaration is not
                    provided, then Inrbonds shall reserve the right to reject
                    the application. I/We shall keep Inrbonds forthwith informed
                    in writing about any changes/modification to the information
                    provided or any other additional information as may be
                    required by you from time to time.
                  </span>
                  <span className="block mt-1">
                    Towards compliance with tax information sharing laws, such
                    as FATCA and CRS: (a) Inrbonds may be required to seek
                    additional personal, tax and certain certifications and
                    documentation from investors. I/We ensure to advise you
                    within 30 days should there be any change in any information
                    provided; (b) In certain circumstances Inrbonds may be
                    obliged to share information on my account with relevant tax
                    authorities; (c) as may be required by domestic or overseas
                    regulators/tax authorities, Inrbonds may also be constrained
                    to close or suspend my account(s) and (d) I/We understand
                    that I am/we are required to contact my tax advisor for any
                    questions about my/our tax residency.
                  </span>
                </label>
              </div>
            </div>{" "}
            <div className="flex justify-between mt-6">
              <Button type="button" onClick={handleBack} variant="secondary">
                Back
              </Button>
              <Button
                type="submit"
                variant="default"
                title={
                  !areAllFieldsFilled()
                    ? "Please fill all required fields and accept the terms and conditions"
                    : "Move to next step"
                }
                disabled={isSubmitting || !areAllFieldsFilled()}
              >
                {isSubmitting ? "Submitting..." : "Next"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ProfileDetailsForm;
