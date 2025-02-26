import React, { useEffect } from "react";
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
import { FaFilePdf, FaTrashAlt, FaFile } from "react-icons/fa";
import { dematSchema } from "@/lib/schemas/e-kyc/dematSchema";
import { useDropzone } from "react-dropzone";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const dematDetailsArraySchema = z.object({
  dematDetails: z.array(dematSchema),
});

const DematAccountForm = ({ onSubmit, initialData }) => {
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

  const handleSubmit = (data) => {
    // Convert File objects to file names before submitting
    const submissionData = {
      ...data,
      dematDetails: data.dematDetails.map((detail) => ({
        ...detail,
        clientMasterCopy: detail.clientMasterCopy
          ? detail.clientMasterCopy.name
          : null,
      })),
    };
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

  // TODO: Image link should be set in localStorage but null is getting set
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12">
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
                    render={({ field: { onChange, value } }) => {
                      const { getRootProps, getInputProps, isDragActive } =
                        useDropzone({
                          accept: {
                            "image/*": [],
                            "application/pdf": [],
                          },
                          maxSize: MAX_FILE_SIZE,
                          onDrop: (acceptedFiles) => {
                            onChange(acceptedFiles[0]);
                          },
                        });

                      return (
                        <FormItem>
                          <FormLabel>Upload Client Master Copy</FormLabel>
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
                                  Drag and drop to upload Client Master Copy
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
                onClick={() => onSubmit(form.getValues(), 4)}
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
