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
import { IoAddCircleOutline, IoConstructOutline } from "react-icons/io5";
import { FaFilePdf, FaTrashAlt, FaFile } from "react-icons/fa";
import { dematSchema } from "@/lib/schemas/e-kyc/dematSchema";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import UploadImages from "../UploadImages";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const dematDetailsArraySchema = z.object({
  dematDetails: z.array(dematSchema),
});

const DematAccountForm= ({ onSubmit, initialData, step, handleStepChange }) => {
  const [uploadedUrls, setUploadedUrls] = useState([]);

  const form = useForm({
    resolver: zodResolver(dematDetailsArraySchema),
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
      const urls = initialData.dematDetails.map(detail => detail.clientMasterCopy);
      setUploadedUrls(urls);
    }
  }, [initialData]);

  const handleSubmit = (data) => {
    const submissionData = {
      ...data,
      dematDetails: data.dematDetails.map((detail, index) => ({
        ...detail,
        clientMasterCopy: uploadedUrls[index] || null,
      })),
    };

    // Store the uploaded URLs in localStorage
    localStorage.setItem(
      "dematDetailUploadedUrls",
      JSON.stringify(uploadedUrls)
    );

    onSubmit(submissionData, 5);
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
    setUploadedUrls(prevUrls => {
      const newUrls = [...prevUrls];
      newUrls[index] = secureUrl;
      // Save to localStorage immediately after update
      localStorage.setItem('dematDetailUploadedUrls', JSON.stringify(newUrls));
      return newUrls;
    });
    form.setValue(`dematDetails.${index}.clientMasterCopy`, secureUrl);
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
    const existingData = JSON.parse(localStorage.getItem('ekycFormData') || '{}');
    const updatedData = {
      ...existingData,
      [step]: currentFormData
    };
    localStorage.setItem('ekycFormData', JSON.stringify(updatedData));

    // Also save the uploaded URLs separately
    localStorage.setItem('dematDetailUploadedUrls', JSON.stringify(uploadedUrls));

    handleStepChange(step - 1);
  };

  return (
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
                        <FormLabel>Depository</FormLabel>
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
                        <FormLabel>DP ID</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter DP ID" {...field} />
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
                      <FormLabel>Client ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Client ID" {...field} />
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
                        <FormLabel>Client Master Copy</FormLabel>
                        <FormControl>
                          <UploadImages
                            text={"Upload Client Master Copy"}
                            onSuccess={(result) =>
                              handleUploadSuccess(result, index)
                            }
                          />
                        </FormControl>
                        {uploadedUrls[index] && (
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
                        )}
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
              <Button
                type="button"
                onClick={handleBack}
                variant="secondary"
              >
                Back
              </Button>
              <Button type="submit" variant="default">
                Next
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default DematAccountForm;
