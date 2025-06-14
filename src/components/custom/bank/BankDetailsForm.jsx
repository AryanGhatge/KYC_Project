import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
import { IoAddCircleOutline } from "react-icons/io5";
import { FaTrashAlt } from "react-icons/fa";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { bankDetailSchema } from "@/lib/schemas/e-kyc/bankDetailSchema";
import UploadImages from "../UploadImages";
import Image from "next/image";
import { toast } from "sonner";

const bankDetailsArraySchema = z.object({
  bankDetails: z.array(bankDetailSchema),
});

const BankDetailsForm = ({ onSubmit, initialData, step, handleStepChange }) => {
  const [uploadedUrls, setUploadedUrls] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(bankDetailsArraySchema),
    mode: "onChange",
    defaultValues: initialData || {
      bankDetails: [
        {
          bankName: "",
          accountType: "Saving",
          bankAccountNumber: "",
          ifscCode: "",
          primary: true,
          uploadCancelledCheque: null,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "bankDetails",
  });

  const {
    formState: { errors },
    watch,
  } = form;

  // Update the useEffect that handles initial data loading
  useEffect(() => {
    const savedUrls = localStorage.getItem("bankDetailUploadedUrls");
    if (savedUrls) {
      const parsedUrls = JSON.parse(savedUrls);
      setUploadedUrls(parsedUrls);
    }

    // Fix: Use uploadCancelledCheque instead of cancelledCheque
    if (initialData?.bankDetails) {
      const urls = initialData.bankDetails.map(
        (detail) => detail.uploadCancelledCheque
      );
      setUploadedUrls(urls.filter((url) => url !== null));
    }
  }, [initialData]);

  // Update handleBack function
  const handleBack = () => {
    const currentFormData = {
      bankDetails: form.getValues().bankDetails.map((detail, index) => ({
        ...detail,
        uploadCancelledCheque: uploadedUrls[index] || null, // Fix: Use uploadCancelledCheque
      })),
    };

    const existingData = JSON.parse(
      localStorage.getItem("ekycFormData") || "{}"
    );
    const updatedData = {
      ...existingData,
      [step]: currentFormData,
    };
    localStorage.setItem("ekycFormData", JSON.stringify(updatedData));
    localStorage.setItem(
      "bankDetailUploadedUrls",
      JSON.stringify(uploadedUrls)
    );

    handleStepChange(step - 1);
  };

  // Update handleUploadSuccess function
  const handleUploadSuccess = (result, index) => {
    const secureUrl = result.info.secure_url;
    setUploadedUrls((prevUrls) => {
      const newUrls = [...prevUrls];
      newUrls[index] = secureUrl;
      localStorage.setItem("bankDetailUploadedUrls", JSON.stringify(newUrls));
      return newUrls;
    });
    // Fix: Use uploadCancelledCheque instead of cancelledCheque
    form.setValue(`bankDetails.${index}.uploadCancelledCheque`, secureUrl);
    toast.success("Image uploaded successfully");
  };

  // Update handleSubmit function
  const handleSubmit = (data) => {
    setIsSubmitting(true);
    const submissionData = {
      ...data,
      bankDetails: data.bankDetails.map((detail, index) => ({
        ...detail,
        uploadCancelledCheque: uploadedUrls[index] || null,
      })),
    };

    localStorage.setItem(
      "bankDetailUploadedUrls",
      JSON.stringify(uploadedUrls)
    );
    toast.success("Bank Details submitted successfully");
    onSubmit(submissionData, 4);
  };

  const handlePrimaryChange = (index) => {
    const updatedFields = fields.map((field, i) => ({
      ...field,
      primary: i === index,
    }));
    updatedFields.forEach((field, i) => {
      form.setValue(`bankDetails.${i}.primary`, i === index);
    });
  };

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  const handleAddBankAccount = () => {
    append({
      bankName: "",
      accountType: "Saving",
      bankAccountNumber: "",
      ifscCode: "",
      primary: false,
      uploadCancelledCheque: null,
    });
  };

  const areAllFieldsFilled = () => {
    const formValues = form.getValues();
    const formState = form.getFieldState("bankDetails");

    // Check if form has any validation errors
    if (Object.keys(form.formState.errors).length > 0) {
      return false;
    }

    // Validate each bank detail entry
    return formValues.bankDetails.every((detail, index) => {
      return (
        detail.bankName?.trim() !== "" &&
        detail.accountType?.trim() !== "" &&
        detail.bankAccountNumber?.trim() !== "" &&
        detail.ifscCode?.trim() !== "" &&
        (detail.uploadCancelledCheque || uploadedUrls[index])
      );
    });
  };
  return (
    <>
      <div className="flex flex-col items-center justify-center lg:my-8 lg:min-h-[calc(100%-100px)] py-5">
        <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-lg border">
          <h2 className="text-2xl font-bold mb-6 text-center">Bank Details</h2>
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
                  <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name={`bankDetails.${index}.bankName`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            Bank Name
                            <span className="text-red-500">*</span>
                            <span className="tooltip-container">
                              <AiOutlineInfoCircle className="text-gray-500 cursor-help" />
                              <span className="tooltip-text">Enter the full name of your bank (e.g., HDFC Bank, State Bank of India)</span>
                            </span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Enter Bank Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`bankDetails.${index}.accountType`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            Account Type
                            <span className="text-red-500">*</span>
                            <span className="tooltip-container">
                              <AiOutlineInfoCircle className="text-gray-500 cursor-help" />
                              <span className="tooltip-text">Select your bank account type. Choose 'Saving' for personal accounts or 'Current' for business accounts.</span>
                            </span>
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Account Type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Saving">Saving</SelectItem>
                              <SelectItem value="Current">Current</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                          {/* <p className="text-sm text-gray-500">Required</p> */}
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`bankDetails.${index}.bankAccountNumber`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            Bank Account Number
                            <span className="text-red-500">*</span>
                            <span className="tooltip-container">
                              <AiOutlineInfoCircle className="text-gray-500 cursor-help" />
                              <span className="tooltip-text">Must be 9-18 digits, numbers only</span>
                            </span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Enter Bank Account Number"
                              {...field}
                              maxLength={18}
                            />
                          </FormControl>
                          <FormMessage />
                          {/* <p className="text-sm text-gray-500">
                            Must be 9-18 digits, numbers only
                          </p> */}
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`bankDetails.${index}.ifscCode`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            IFSC Code
                            <span className="text-red-500">*</span>
                            <span className="tooltip-container">
                              <AiOutlineInfoCircle className="text-gray-500 cursor-help" />
                              <span className="tooltip-text">11-character code (e.g., HDFC0123456). First 4 letters are bank code, followed by 0, then 6 characters for branch code.</span>
                            </span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Enter IFSC Code"
                              {...field}
                              style={{ textTransform: 'uppercase' }}
                              maxLength={11}
                            />
                          </FormControl>
                          <FormMessage />
                          {/* <p className="text-sm text-gray-500">
                            11 characters: 4 letters + 0 + 6 alphanumeric (e.g., HDFC0123456)
                          </p> */}
                        </FormItem>
                      )}
                    />
                  </div>
                  {/* <div className="flex items-center justify-center mt-4">
                    <p className="">Verify my account by adding ₹1 (Pennydrop)</p>
                    <p className="mx-2 text-gray-500">(OR)</p>
                    <div className="flex items-center gap-2">
                      Upload Cancelled Cheque
                      <span className="text-red-500">*</span>
                      <span className="tooltip-container">
                        <AiOutlineInfoCircle className="text-gray-500 cursor-help" />
                        <span className="tooltip-text">Upload a clear image of a cancelled cheque leaf from your bank account. This helps verify your bank account details.</span>
                      </span>
                    </div>
                  </div> */}

                  <div className="mt-4">
                    <FormField
                      control={form.control}
                      name={`bankDetails.${index}.uploadCancelledCheque`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <UploadImages
                              text={"Upload Cancelled Cheque"}
                              onSuccess={(result) =>
                                handleUploadSuccess(result, index)
                              }
                              inPerson={false}
                            />
                          </FormControl>
                          {uploadedUrls[index] ? (
                            <div className="mt-4">
                              <Image
                                src={uploadedUrls[index]}
                                alt={`Uploaded cheque for account ${index + 1}`}
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
                              Please upload a cancelled cheque for verification
                            </p>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <FormField
                      control={form.control}
                      name={`bankDetails.${index}.primary`}
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
                          <FormLabel className="ml-2 pb-2 text-gray-700">
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
                onClick={handleAddBankAccount}
                variant="outline"
                className="mt-4"
              >
                <IoAddCircleOutline className="mr-2" />
                Add Another Bank Account
              </Button>

              <div className="flex justify-between mt-6">
                <Button type="button" onClick={handleBack} variant="secondary">
                  Back
                </Button>
                <Button 
                  type="submit" 
                  variant="default" 
                  isLoading={isSubmitting}
                  disabled={isSubmitting || !areAllFieldsFilled()}
                  title={!areAllFieldsFilled() ? "Please fill all required fields and upload cancelled cheque for each bank account" : "Proceed to next step"}
                >
                  {isSubmitting ? "Submitting..." : "Next"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
};

export default BankDetailsForm;
