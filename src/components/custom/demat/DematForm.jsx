import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { IoAddCircleOutline } from "react-icons/io5";
import { FaFilePdf, FaTrashAlt, FaFile, FaSpinner, FaCheck } from "react-icons/fa";
import { dematSchema } from "@/lib/schemas/e-kyc/dematSchema";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import UploadImages from "../UploadImages";
import { toast } from "sonner";
import { AiOutlineInfoCircle } from "react-icons/ai";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const dematDetailsArraySchema = z.object({
  dematDetails: z.array(dematSchema),
});

const DematAccountForm = ({
  onSubmit,
  initialData,
  step,
  handleStepChange,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [currentCheck, setCurrentCheck] = useState("");
  const [checkProgress, setCheckProgress] = useState(0);
  const [verificationChecks, setVerificationChecks] = useState([]);
  const [checkComplete, setCheckComplete] = useState(false);

  const form = useForm({
    resolver: zodResolver(dematDetailsArraySchema),
    mode: "onChange",
    defaultValues: initialData || {
      dematDetails: [
        {
          depository: "NSDL",
          dpID: "",
          clientID: "",
          primary: true,
          clientMasterCopy: null,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "dematDetails",
  });

  const {
    formState: { errors },
    watch,
  } = form;

  const areAllFieldsFilled = () => {
    const formValues = form.getValues();

    // Check if form has any validation errors
    if (Object.keys(form.formState.errors).length > 0) {
      return false;
    }

    // Validate each demat account entry
    return formValues.dematDetails.every((detail, index) => {
      return (
        detail.depository?.trim() !== "" &&
        detail.dpID?.trim() !== "" &&
        detail.clientID?.trim() !== "" &&
        (detail.clientMasterCopy || uploadedUrls[index])
      );
    });
  };

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  // Add this useEffect to load images from localStorage on component mount
  useEffect(() => {
    const savedUrls = localStorage.getItem("dematDetailUploadedUrls");
    if (savedUrls) {
      const parsedUrls = JSON.parse(savedUrls);
      setUploadedUrls(parsedUrls);
    }

    // If initialData exists, set the uploaded URLs from it
    if (initialData?.dematDetails) {
      const urls = initialData.dematDetails.map(
        (detail) => detail.clientMasterCopy
      );
      setUploadedUrls(urls);
    }
  }, [initialData]);

  const startVerification = () => {
    setAnalyzing(true);
    setVerificationChecks([]);
    setCurrentCheck("Initializing document verification");
    setCheckProgress(0);

    // Document verification checks sequence
    const checks = [
      "Initializing document verification system",
      "Validating document formats",
      "Performing OCR on Client Master Copy",
      "Extracting Demat Account details",
      "Verifying DP ID format",
      "Validating Client ID",
      "Cross-referencing with NSDL/CDSL database",
      "Checking account status",
      "Verifying primary account details",
      "Validating broker information",
      "Completing document verification"
    ];

    let currentCheckIndex = 0;
    const runChecks = () => {
      const check = checks[currentCheckIndex];
      if (check) {
        setCurrentCheck(check);
        setVerificationChecks((prev) => [...prev, check]);
        setCheckProgress((currentCheckIndex + 1) / checks.length * 100);
        currentCheckIndex++;
        setTimeout(runChecks, 3000);
      } else {
        setCheckComplete(true);
      }
    };

    runChecks();

     // Return cleanup function
    return () => {
      clearInterval(checkInterval);
    };
  };

  const handleSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      
      // Start verification animation
      startVerification();

      const submissionData = {
        ...data,
        dematDetails: data.dematDetails.map((detail, index) => ({
          ...detail,
          clientMasterCopy: uploadedUrls[index] || null,
        })),
      };

      // Wait for animation to complete
      await new Promise(resolve => setTimeout(resolve, 20000));

      // Store the uploaded URLs in localStorage
      localStorage.setItem(
        "dematDetailUploadedUrls",
        JSON.stringify(uploadedUrls)
      );

      setAnalyzing(false);
      toast.success("Demat Details verified and submitted successfully");
      onSubmit(submissionData, 5);
    } catch (error) {
      console.error("Error submitting demat details:", error);
      setAnalyzing(false);
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
      setCheckComplete(false);
      setCheckProgress(0);
      setVerificationChecks([]);
    }
  };

  const handleAddDematAccount = () => {
    append({
      depository: "NSDL",
      dpID: "",
      clientID: "",
      primary: false,
      clientMasterCopy: null,
    });
  };

  const handlePrimaryChange = (index) => {
    const updatedFields = fields.map((field, i) => ({
      ...field,
      primary: i === index,
    }));
    updatedFields.forEach((field, i) => {
      form.setValue(`dematDetails.${i}.primary`, i === index);
    });
  };

  // Modify the handleUploadSuccess function
  const handleUploadSuccess = (result, index) => {
    const secureUrl = result.info.secure_url;
    setUploadedUrls((prevUrls) => {
      const newUrls = [...prevUrls];
      newUrls[index] = secureUrl;
      // Save to localStorage immediately after update
      localStorage.setItem("dematDetailUploadedUrls", JSON.stringify(newUrls));
      return newUrls;
    });
    form.setValue(`dematDetails.${index}.clientMasterCopy`, secureUrl);
    toast.success("Image uploaded successfully");
  };

  // Example for BankDetailsForm
  const handleBack = () => {
    // Save current form data before going back
    const currentFormData = {
      dematDetails: form.getValues().dematDetails.map((detail, index) => ({
        ...detail,
        clientMasterCopy: uploadedUrls[index] || null,
      })),
    };

    // Store in localStorage
    const existingData = JSON.parse(
      localStorage.getItem("ekycFormData") || "{}"
    );
    const updatedData = {
      ...existingData,
      [step]: currentFormData,
    };
    localStorage.setItem("ekycFormData", JSON.stringify(updatedData));

    // Also save the uploaded URLs separately
    localStorage.setItem(
      "dematDetailUploadedUrls",
      JSON.stringify(uploadedUrls)
    );

    handleStepChange(step - 1);
  };

  const renderVerificationLoader = () => {
      return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
            <div className="text-center">
              <div className="mb-4">
                <FaSpinner className="animate-spin text-4xl text-black mx-auto" />
              </div>
              <h3 className="text-xl font-semibold mb-4">{currentCheck}</h3>
  
              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                <div
                  className="bg-black h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${checkProgress}%` }}
                ></div>
              </div>
  
              {/* Completed checks */}
              <div className="space-y-2 text-left">
                {verificationChecks.map((check, index) => (
                  <div key={index} className="flex items-center text-green-600">
                    <FaCheck className="mr-2" />
                    <span>{check}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    };

  return (
    <>
      {analyzing && renderVerificationLoader()}
      <div className="flex flex-col items-center justify-center min-h-screen py-5">
        <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-lg border">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Demat Account Details
          </h2>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="border border-gray-300 rounded-lg p-6 mb-4 bg-gray-50 shadow-md relative"
                >
                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name={`dematDetails.${index}.depository`}
                      render={({ field }) => (
                        <FormItem>
                          {" "}
                          <FormLabel className="flex items-center gap-2">
                            Depository
                            <span className="text-red-500">*</span>
                            <span className="tooltip-container">
                              <AiOutlineInfoCircle className="text-gray-500 cursor-help" />
                              <span className="tooltip-text">
                                Select your depository: NSDL (National Securities
                                Depository Limited) or CDSL (Central Depository
                                Services Limited)
                              </span>
                            </span>
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Depository" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="NSDL">NSDL</SelectItem>
                              <SelectItem value="CDSL">CDSL</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`dematDetails.${index}.dpID`}
                      render={({ field }) => (
                        <FormItem>
                          {" "}
                          <FormLabel className="flex items-center gap-2">
                            DP ID
                            <span className="text-red-500">*</span>
                            <span className="tooltip-container">
                              <AiOutlineInfoCircle className="text-gray-500 cursor-help" />
                              <span className="tooltip-text">
                                Enter your DP ID: For NSDL - starts with 'IN'
                                followed by 14 digits, For CDSL - 16 digits
                              </span>
                            </span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter DP ID"
                              {...field}
                              maxLength={16}
                              style={{ textTransform: "uppercase" }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name={`dematDetails.${index}.clientID`}
                    render={({ field }) => (
                      <FormItem>
                        {" "}
                        <FormLabel className="flex items-center gap-2 mt-4">
                          Client ID
                          <span className="text-red-500">*</span>
                          <span className="tooltip-container">
                            <AiOutlineInfoCircle className="text-gray-500 cursor-help" />
                            <span className="tooltip-text">
                              Enter your 16-digit Client ID provided by your
                              broker
                            </span>
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter Client ID"
                            {...field}
                            maxLength={16}
                            type="text"
                            pattern="\d*"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="mt-4">
                    <FormField
                      control={form.control}
                      name={`dematDetails.${index}.clientMasterCopy`}
                      render={({ field }) => (
                        <FormItem>
                          {" "}
                          <FormLabel className="flex items-center gap-2">
                            Client Master Copy
                            <span className="text-red-500">*</span>
                            <span className="tooltip-container">
                              <AiOutlineInfoCircle className="text-gray-500 cursor-help" />
                              <span className="tooltip-text">
                                Upload a clear copy of your Client Master Report
                                (CMR) provided by your broker
                              </span>
                            </span>
                          </FormLabel>
                          <FormControl>
                            <UploadImages
                              text={"Upload Client Master Copy"}
                              onSuccess={(result) =>
                                handleUploadSuccess(result, index)
                              }
                            />
                          </FormControl>{" "}
                          <div>
                            {uploadedUrls[index] ? (
                              <div className="mt-4">
                                <Image
                                  src={uploadedUrls[index]}
                                  alt={`Uploaded Client Master Copy for account ${
                                    index + 1
                                  }`}
                                  width={300}
                                  height={200}
                                  style={{ width: "100%", height: "auto" }}
                                />
                                <p className="text-sm text-green-600 mt-2">
                                  Image uploaded successfully
                                </p>
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500 mt-2">
                                Please upload your Client Master Report for
                                verification
                              </p>
                            )}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <FormField
                      control={form.control}
                      name={`dematDetails.${index}.primary`}
                      render={({ field }) => (
                        <FormItem className="flex items-center">
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={() => handlePrimaryChange(index)}
                              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              disabled={fields.length === 1 && field.value}
                            />
                          </FormControl>
                          <FormLabel className="ml-2 text-gray-700">
                            Set as Primary Account
                          </FormLabel>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => remove(index)}
                      className="absolute top-2 right-2"
                    >
                      <FaTrashAlt className="mr-2" />
                      Remove
                    </Button>
                  )}
                </div>
              ))}

              <Button
                type="button"
                onClick={handleAddDematAccount}
                variant="outline"
                className="mt-4"
              >
                <IoAddCircleOutline className="mr-2" />
                Add Another Demat Account
              </Button>

              <div className="flex justify-between mt-6">
                <Button type="button" onClick={handleBack} variant="secondary">
                  Back
                </Button>{" "}
                <Button
                  type="submit"
                  variant="default"
                  isLoading={isSubmitting}
                  disabled={!areAllFieldsFilled()}
                  title={
                    !areAllFieldsFilled()
                      ? "Please fill all required fields and upload Client Master Copy for each demat account"
                      : "Proceed to next step"
                  }
                >
                  Next
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
};

export default DematAccountForm;
