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
import { z } from "zod";
import { showToast } from "@/lib/showToast";
import { panService } from "@/lib/apiService/panService";

const PanDetailsForm = ({ onSubmit, initialData }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formMethods = useForm({
    resolver: zodResolver(panDetailsSchema),
    defaultValues: initialData || {
      panNumber: "",
      mobileNumber: "",
      dateOfBirth: new Date(),
      emailId: "",
      whoAreU: "Individual",
    },
  });

  useEffect(() => {
    if (initialData) {
      Object.entries(initialData).forEach(([key, value]) => {
        formMethods.setValue(key, value);
      });
    }
  }, [initialData, formMethods]);

  const handleSubmitForm = async (data) => {
    try {
      // const response = await panService.registerPan(data);
      console.log("PAN details submitted successfully:", data);
      showToast.success("Details submitted successfully!");
      onSubmit(data, 1);
    } catch (error) {
      console.error("Error submitting PAN details:", error);
      showToast.error(
        error.message || "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center lg:min-h-screen">
      <div className="w-full max-w-4xl p-4 bg-white rounded-lg shadow-lg border-2 flex-col justify-between h-full">
        <div>
          <h2 className="text-2xl font-bold mb-6 text-center">
            Personal Details
          </h2>
          <Form {...formMethods}>
            <form
              onSubmit={formMethods.handleSubmit(handleSubmitForm)}
              className="space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:space-x-4">
                {/* PAN Number */}
                <div className="flex-1">
                  <FormField
                    control={formMethods.control}
                    name="panNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>PAN Number *</FormLabel>
                        <FormControl>
                          <input
                            type="text"
                            placeholder="Enter PAN Number (ABCDE1234F)"
                            {...field}
                            className="w-full p-2 border border-gray-300 rounded"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Mobile Number */}
                <div className="flex-1">
                  <FormField
                    control={formMethods.control}
                    name="mobileNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mobile Number *</FormLabel>
                        <FormControl>
                          <input
                            type="text"
                            placeholder="Enter Mobile Number"
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

              <div className="flex flex-col sm:flex-row sm:space-x-4">
                {/* Date of Birth */}
                <div className="flex-1">
                  <FormField
                    control={formMethods.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth *</FormLabel>
                        <input
                          type="date"
                          {...field}
                          className="w-full p-2 border border-gray-300 rounded"
                        />
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
                        <FormLabel>Email ID *</FormLabel>
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
                      <FormLabel>I am a *</FormLabel>
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
              </div>

              <div className="flex justify-end mt-4">
                <Button type="submit" variant="default" disabled={isSubmitting}>
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
