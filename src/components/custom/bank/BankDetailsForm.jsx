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
import { FaFile, FaFilePdf, FaTrashAlt } from "react-icons/fa";
import { bankDetailSchema } from "@/lib/schemas/e-kyc/bankDetailSchema";
import { useDropzone } from "react-dropzone";
import { bankService } from "@/lib/apiService/bankService";
import { showToast } from "@/lib/showToast";

const bankDetailsArraySchema = z.object({
  bankDetails: z.array(bankDetailSchema),
});

// Default empty bank detail entry
const emptyBankDetail = {
  bankName: "",
  accountType: "",
  bankAccountNumber: "",
  ifscCode: "",
  primary: true,
  uploadCancelledCheque: null,
};

const BankDetailsForm = ({ onSubmit, initialData }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Ensure we initialize with at least one empty bank detail form
  const defaultValues = {
    bankDetails: initialData?.bankDetails?.length > 0 
      ? initialData.bankDetails 
      : [emptyBankDetail]
  };

  const form = useForm({
    resolver: zodResolver(bankDetailsArraySchema),
    defaultValues: defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "bankDetails",
  });

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData && initialData.bankDetails && initialData.bankDetails.length > 0) {
      form.reset(initialData);
    } else {
      form.reset({ bankDetails: [emptyBankDetail] });
    }
  }, [initialData, form]);

  const handlePrimaryChange = (index) => {
    const updatedFields = fields.map((field, i) => ({
      ...field,
      primary: i === index,
    }));
    updatedFields.forEach((field, i) => {
      form.setValue(`bankDetails.${i}.primary`, i === index);
    });
  };

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // const response = await bankService.registerBank(data);
      console.log("Bank details registered:", data);
      showToast.success("Details submitted successfully!");
      onSubmit(data, 4);
    } catch (error) {
      console.error("Error registering bank details:", error);
      showToast.error(
        error.message || "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddBankAccount = () => {
    append({
      ...emptyBankDetail,
      primary: false, // Only the first bank account is primary by default
    });
  };

  const renderFilePreview = (file) => {
    if (!file) return null;

    if (typeof file === "string") {
      // If file is a string (filename), render a generic file icon
      return (
        <div className="flex items-center">
          <FaFile className="mr-2" />
          <span>{file}</span>
        </div>
      );
    }

    if (file.type.startsWith("image/")) {
      return (
        <img
          src={URL.createObjectURL(file)}
          alt="Preview"
          className="max-w-full h-auto max-h-40 mt-2"
        />
      );
    } else if (file.type === "application/pdf") {
      return (
        <Button
          onClick={() => window.open(URL.createObjectURL(file), "_blank")}
          className="flex items-center"
        >
          <FaFilePdf className="mr-2" />
          View PDF
        </Button>
      );
    }
    return null;
  };

  // Ensure we have at least one form field
  useEffect(() => {
    if (fields.length === 0) {
      append(emptyBankDetail);
    }
  }, [fields, append]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12">
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
                        <FormLabel>Bank Name</FormLabel>
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
                        <FormLabel>Account Type</FormLabel>
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
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`bankDetails.${index}.bankAccountNumber`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bank Account Number</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter Bank Account Number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`bankDetails.${index}.ifscCode`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>IFSC Code</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter IFSC Code"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex items-center justify-center mt-4">
                  <p className="">Verify my account by adding ₹1 (Pennydrop)</p>
                  <p className="mx-2 text-gray-500">(OR)</p>
                  <div className="">Upload Cancelled Cheque</div>
                </div>

                {/* Drag and Drop File Upload */}
                <div className="mt-2">
                  <FormField
                    control={form.control}
                    name={`bankDetails.${index}.cancelledCheque`}
                    render={({ field: { onChange, value } }) => {
                      const { getRootProps, getInputProps, isDragActive } =
                        useDropzone({
                          accept: {
                            "image/*": [],
                            "application/pdf": [],
                          },
                          maxSize: 5 * 1024 * 1024, // 5 MB max size
                          onDrop: (acceptedFiles) => {
                            onChange(acceptedFiles[0]);
                          },
                        });

                      return (
                        <FormItem>
                          <FormLabel>Upload Cancelled Cheque</FormLabel>
                          <FormControl>
                            <div
                              {...getRootProps()}
                              className={`border-2 border-dashed rounded-lg p-4 cursor-pointer ${
                                isDragActive
                                  ? "border-blue-500"
                                  : "border-gray-300"
                              }`}
                            >
                              <input {...getInputProps()} />
                              {value ? (
                                <div className="flex justify-between">
                                  <p className="text-sm">
                                    {typeof value === "string"
                                      ? value
                                      : value.name}
                                    {typeof value !== "string" && (
                                      <p className="text-xs text-gray-500">
                                        {(value.size / 1024 / 1024).toFixed(2)}{" "}
                                        MB
                                      </p>
                                    )}
                                  </p>

                                  {renderFilePreview(value)}
                                </div>
                              ) : (
                                <p className="text-center text-gray-500">
                                  Drag and drop to upload a cancelled cheque
                                  (Image/PDF)
                                </p>
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
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
              <Button
                type="button"
                onClick={() => onSubmit(form.getValues(), 3)}
                variant="secondary"
              >
                Back
              </Button>
              <Button type="submit" variant="default" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Next"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default BankDetailsForm;