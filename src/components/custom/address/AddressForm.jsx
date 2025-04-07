import React, { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { addressDetailSchema } from "@/lib/schemas/e-kyc/addressDetailSchema";
import {
  sampleCities,
  sampleDistricts,
  sampleStates,
} from "@/lib/data/addressDetailsData";
import { showToast } from "@/lib/showToast";
import { addressService } from "@/lib/apiService/addressService";

const AddressForm = ({ onSubmit, initialData }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formMethods = useForm({
    resolver: zodResolver(addressDetailSchema),
    defaultValues: initialData || {
      permanentAddress: "",
      landmark: "",
      permanentCity: "",
      permanentDistrict: "",
      permanentPincode: "",
      permanentState: "",
      permanentCountry: "",
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
    setIsSubmitting(true);
    try {
      const response = await addressService.registerAddress(data);
      console.log("Address details submitted successfully:", response);
      // showToast.success("Details submitted successfully!");
      onSubmit(data, 2);
    } catch (error) {
      console.error("Error submitting address details:", error);
      showToast.error(
        error.message || "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-4xl p-4 bg-white rounded-lg shadow-lg border-2 flex flex-col justify-between h-full">
        <div>
          <h2 className="text-2xl font-bold mb-6 text-center">
            Address Details
          </h2>
          <Form {...formMethods}>
            <form
              onSubmit={formMethods.handleSubmit(handleSubmitForm)}
              className="space-y-4"
            >
              {/* Permanent Address */}
              <FormField
                control={formMethods.control}
                name="permanentAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Permanent Address *</FormLabel>
                    <FormControl>
                      <input
                        type="text"
                        placeholder="Enter Permanent Address"
                        {...field}
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Landmark */}
              <FormField
                control={formMethods.control}
                name="landmark"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Landmark (optional)</FormLabel>
                    <FormControl>
                      <input
                        type="text"
                        placeholder="Enter Landmark"
                        {...field}
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col sm:flex-row sm:space-x-4">
                {/* City */}
                <div className="flex-1">
                  <FormField
                    control={formMethods.control}
                    name="permanentCity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          className="w-full"
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select City" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(sampleCities).flatMap(
                              ([district, cities]) =>
                                cities.map((city) => (
                                  <SelectItem key={city} value={city}>
                                    {city}
                                  </SelectItem>
                                ))
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* District */}
                <div className="flex-1">
                  <FormField
                    control={formMethods.control}
                    name="permanentDistrict"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>District *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          className="w-full"
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select District" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(sampleDistricts).flatMap(
                              ([state, districts]) =>
                                districts.map((district) => (
                                  <SelectItem key={district} value={district}>
                                    {district}
                                  </SelectItem>
                                ))
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:space-x-4">
                {/* Pincode */}
                <div className="flex-1">
                  <FormField
                    control={formMethods.control}
                    name="permanentPincode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pincode *</FormLabel>
                        <FormControl>
                          <input
                            type="text"
                            placeholder="Enter Pincode"
                            {...field}
                            className="w-full p-2 border border-gray-300 rounded"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* State */}
                <div className="flex-1">
                  <FormField
                    control={formMethods.control}
                    name="permanentState"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          className="w-full"
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select State" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(sampleStates).flatMap(
                              ([country, states]) =>
                                states.map((state) => (
                                  <SelectItem
                                    key={state.code}
                                    value={state.code}
                                  >
                                    {state.name}
                                  </SelectItem>
                                ))
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Country */}
              <FormField
                control={formMethods.control}
                name="permanentCountry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country *</FormLabel>
                    <FormControl>
                      <input
                        type="text"
                        placeholder="Enter Country"
                        {...field}
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-between mt-4">
                <Button
                  type="button"
                  onClick={() => onSubmit(formMethods.getValues(), 1)}
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
    </div>
  );
};

export default AddressForm;
