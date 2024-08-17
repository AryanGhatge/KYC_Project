import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { setStep } from "@/app/store/slices/formSlice";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  sampleCities,
  sampleDistricts,
  sampleStates,
} from "@/lib/data/addressDetailsData";
import addressDetailSchema from "@/lib/schemas/e-kyc/addressDetailSchema";

export default function AddressForm({ handleStepChange, step, steps }) {
  const dispatch = useDispatch();

  const formMethods = useForm({
    resolver: zodResolver(addressDetailSchema),
    defaultValues: {
      permanentAddress: "",
      landmark: "",
      permanentCity: "",
      permanentDistrict: "",
      permanentPincode: "",
      permanentState: "",
      permanentCountry: "",
    },
  });

  const handleSave = (data) => {
    localStorage.setItem("userAddressData", JSON.stringify(data));
  };

  const handleSubmitForm = (data) => {
    const { errors } = formMethods.formState;

    if (Object.keys(errors).length > 0) {
      console.error("Please fill in all required fields");
      return;
    }

    console.log("Form Data:", data);
    handleSave(data);
    handleNext();
  };

  const handleNext = () => {
    dispatch(setStep(step + 1));
    handleStepChange(step + 1);
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
    </div>
  );
}
