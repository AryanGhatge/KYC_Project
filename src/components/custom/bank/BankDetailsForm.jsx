import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { IoMdSave } from "react-icons/io";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { IoAddCircleOutline } from "react-icons/io5";
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
import { useDispatch } from "react-redux";
import { setStep } from "@/app/store/slices/formSlice";
import bankDetailsArraySchema from "@/lib/schemas/e-kyc/bankDetailSchema";

export default function BankDetailsForm({ step, handleStepChange }) {
  const dispatch = useDispatch();

  const formMethods = useForm({
    resolver: zodResolver(bankDetailsArraySchema),
    defaultValues: {
      bankDetails: [
        {
          bankName: "",
          accountType: "Savings",
          bankAccountNumber: "",
          ifscCode: "",
          primary: true,
        },
      ],
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control: formMethods.control,
    name: "bankDetails",
  });

  const handleAddBankAccount = () => {
    append({
      bankName: "",
      accountType: "Savings",
      bankAccountNumber: "",
      ifscCode: "",
      primary: false,
    });
  };

  const handlePrimaryChange = (index) => {
    fields.forEach((_, i) => {
      if (i !== index) {
        update(i, { ...fields[i], primary: false });
      } else {
        update(i, {
          bankName: fields[i].bankName,
          accountType: fields[i].accountType,
          bankAccountNumber: fields[i].bankAccountNumber,
          ifscCode: fields[i].ifscCode,
          primary: true,
        });
      }
    });
  };

  const handleSave = (data) => {
    localStorage.setItem("userBankDetails", JSON.stringify(data.bankDetails));
  };

  const handleSubmitForm = (data) => {
    const { errors } = formMethods.formState;

    if (Object.keys(errors).length > 0) {
      console.error("Please fill in all required fields");
      return;
    }

    handleSave(data);

    dispatch(setStep(step + 1));
    handleStepChange(step + 1);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-14">
      <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-lg border">
        <h2 className="text-2xl font-bold mb-6 text-center">Bank Details</h2>
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
                      name={`bankDetails.${index}.bankName`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">
                            Bank Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Enter Bank Name"
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
                      name={`bankDetails.${index}.accountType`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">
                            Account Type
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            className="w-full"
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Account Type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Savings">Savings</SelectItem>
                              <SelectItem value="Current">Current</SelectItem>
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
                      name={`bankDetails.${index}.bankAccountNumber`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">
                            Bank Account Number
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Enter Bank Account Number"
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
                      name={`bankDetails.${index}.ifscCode`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">
                            IFSC Code
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Enter IFSC Code"
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

                <div className="flex items-center justify-between mt-4">
                  <FormField
                    control={formMethods.control}
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
                        <FormLabel className="ml-2 text-gray-700">
                          Set as Primary Account
                        </FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {fields.length > 1 && (
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        color="red"
                        onClick={() => handleSave(formMethods.getValues())}
                        className="flex items-center"
                      >
                        <IoMdSave className="mr-2 h-4 w-4 " />
                        Save
                      </Button>
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
                  )}
                </div>
              </div>
            ))}

            <Button
              type="button"
              onClick={handleAddBankAccount}
              variant="link"
              className="mt-4 gap-2"
            >
              <IoAddCircleOutline size={20} />
              Add Another Bank
            </Button>

            <div className="flex justify-between mt-4">
              <Button
                type="button"
                onClick={() => handleStepChange(step - 1)}
                variant="secondary"
              >
                Back
              </Button>
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
