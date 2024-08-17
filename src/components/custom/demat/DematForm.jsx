import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FaTrashAlt } from "react-icons/fa";
import { IoAddCircleOutline } from "react-icons/io5";
import dematArraySchema from "@/lib/schemas/e-kyc/dematSchema";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export default function DematAccountForm({ handleStepChange, step, steps }) {
  const [showForm, setShowForm] = useState(true);
  const formMethods = useForm({
    resolver: zodResolver(dematArraySchema),
    defaultValues: {
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

  const { fields, append, remove, update } = useFieldArray({
    control: formMethods.control,
    name: "dematDetails",
  });

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
    fields.forEach((_, i) => {
      update(i, { ...fields[i], primary: i === index });
    });
  };

  const handleFileChange = (e, index) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        formMethods.setError(`dematDetails.${index}.clientMasterCopy`, {
          type: "manual",
          message: "File size must be less than 5 MB.",
        });
      } else {
        formMethods.clearErrors(`dematDetails.${index}.clientMasterCopy`);
        update(index, { ...fields[index], clientMasterCopy: file });
      }
    }
  };

  const handleSubmitForm = (data) => {
    console.log(data);
    setShowForm(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-14">
      <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-lg border">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Demat Account Details
        </h2>
        <Form {...formMethods}>
          <form
            onSubmit={formMethods.handleSubmit(handleSubmitForm)}
            className="space-y-6"
          >
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="border border-gray-300 rounded-lg p-6 mb-4 bg-gray-50 shadow-md relative"
              >
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <FormField
                      control={formMethods.control}
                      name={`dematDetails.${index}.depository`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">
                            Depository
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            className="w-full"
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Depository" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="NSDL">NSDL</SelectItem>
                              <SelectItem value="CDSL">CDSL</SelectItem>
                              <SelectItem value="Others">Others</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div>
                    <FormField
                      control={formMethods.control}
                      name={`dematDetails.${index}.dpID`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">DP ID</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Enter DP ID"
                              {...field}
                              className="w-full"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div>
                    <FormField
                      control={formMethods.control}
                      name={`dematDetails.${index}.clientID`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">
                            Client ID
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Enter Client ID"
                              {...field}
                              className="w-full"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="grid gap-6 mt-4">
                  <div>
                    <FormField
                      control={formMethods.control}
                      name={`dematDetails.${index}.clientMasterCopy`}
                      render={() => (
                        <FormItem>
                          <FormLabel className="text-gray-700">
                            Upload Client Master Copy
                          </FormLabel>
                          <FormControl>
                            <input
                              type="file"
                              accept=".pdf, .jpg, .jpeg, .png"
                              onChange={(e) => handleFileChange(e, index)}
                              className="w-full"
                            />
                          </FormControl>
                          <FormMessage>
                            {formMethods.formState.errors[
                              `dematDetails.${index}.clientMasterCopy`
                            ]?.message && (
                              <span className="text-red-500">
                                {
                                  formMethods.formState.errors[
                                    `dematDetails.${index}.clientMasterCopy`
                                  ]?.message
                                }
                              </span>
                            )}
                          </FormMessage>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <FormField
                    control={formMethods.control}
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
                        <FormLabel className="ml-2">Primary Account</FormLabel>
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    color="red"
                    onClick={() => remove(index)}
                    className="flex items-center"
                  >
                    <FaTrashAlt className="mr-2" />
                    Remove
                  </Button>
                </div>
              </div>
            ))}
            <Button
              type="button"
              onClick={handleAddDematAccount}
              variant="link"
              className="mt-4 gap-2"
            >
              <IoAddCircleOutline size={20} />
              Add Another Account
            </Button>

            <div className="flex justify-end mt-6">
              <Button type="submit" variant="default">
                Confirm & Proceed
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
