"use client";

import { useDispatch } from "react-redux";
import { setStep } from "@/app/store/slices/formSlice";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { addressSchema } from "@/lib/schemas/addressSchema";
import { useState, useEffect } from "react";
import {
  sampleCities,
  sampleCountries,
  sampleDistricts,
  sampleStates,
} from "@/lib/data/addressDetailsData";

export default function AddressDetailsForm({ handleStepChange, step, steps }) {
  const dispatch = useDispatch();
  const [sameAddress, setSameAddress] = useState(false);

  const formMethods = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      currentAddress: "",
      currentCity: "",
      currentDistrict: "",
      currentPincode: "",
      currentState: "",
      currentCountry: "",
      permanentAddress: "",
      permanentCity: "",
      permanentDistrict: "",
      permanentPincode: "",
      permanentState: "",
      permanentCountry: "",
    },
  });

  // Track current address values
  const [
    currentAddress,
    currentCity,
    currentDistrict,
    currentPincode,
    currentState,
    currentCountry,
  ] = formMethods.watch([
    "currentAddress",
    "currentCity",
    "currentDistrict",
    "currentPincode",
    "currentState",
    "currentCountry",
  ]);

  useEffect(() => {
    if (sameAddress) {
      // Set permanent address values to current address values
      formMethods.setValue("permanentAddress", currentAddress);
      formMethods.setValue("permanentCity", currentCity);
      formMethods.setValue("permanentDistrict", currentDistrict);
      formMethods.setValue("permanentPincode", currentPincode);
      formMethods.setValue("permanentState", currentState);
      formMethods.setValue("permanentCountry", currentCountry);
    } else {
      // Clear permanent address values if not the same
      formMethods.setValue("permanentAddress", "");
      formMethods.setValue("permanentCity", "");
      formMethods.setValue("permanentDistrict", "");
      formMethods.setValue("permanentPincode", "");
      formMethods.setValue("permanentState", "");
      formMethods.setValue("permanentCountry", "");
    }
  }, [
    formMethods,
    sameAddress,
    currentAddress,
    currentCity,
    currentDistrict,
    currentPincode,
    currentState,
    currentCountry,
  ]);

  const handleNext = async () => {
    // Trigger validation
    const isValid = await formMethods.trigger();

    if (isValid) {
      dispatch(setStep(3));
      handleStepChange(step + 1);
    }
  };

  const handleSave = async (data) => {
    // Retrieve and parse personal info from localStorage
    const personalInfo = await localStorage.getItem("userPersonalData");
    let personalData = {};

    if (personalInfo) {
      try {
        personalData = JSON.parse(personalInfo);
        if (typeof personalData !== "object" || personalData === null) {
          throw new Error("Parsed data is not an object");
        }
      } catch (error) {
        console.error("Error parsing personal data from localStorage", error);
        personalData = {}; // Default to empty object on error
      }
    }

    // Merge the form data with personal info
    const updatedUserData = { ...personalData, ...data };

    // Save the merged data in localStorage
    localStorage.setItem(
      "userDataWithAddress",
      JSON.stringify(updatedUserData)
    );
  };

  const handleSubmitForm = async (data) => {
    // Handle form validation and submission
    const { errors } = formMethods.formState;

    if (Object.keys(errors).length > 0) {
      console.error("Please fill in all required fields");
      return;
    }

    console.log(data);

    await handleSave(data);

    // Proceed to the next step
    handleNext();
  };

  const handleCheckboxChange = (event) => {
    setSameAddress(event.target.checked);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-4xl p-8 bg-white rounded-lg shadow-xl border-2">
        <h2 className="text-2xl font-bold mb-6 text-center">Address Details</h2>
        <Form {...formMethods}>
          <form
            onSubmit={formMethods.handleSubmit(handleSubmitForm)}
            className="space-y-6"
          >
            {/* Current Address Section */}
            <div className="border p-4 rounded-lg mb-6">
              <h3 className="text-xl font-semibold mb-4">Current Address</h3>

              {/* Street Address */}
              <FormField
                control={formMethods.control}
                name="currentAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street Address *</FormLabel>
                    <FormControl>
                      <input
                        type="text"
                        {...field}
                        placeholder="123 Manjri Bk."
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Apartment/Suite/Unit */}
              <FormField
                control={formMethods.control}
                name="currentLandmark"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apartment/Suite/Unit</FormLabel>
                    <FormControl>
                      <input
                        type="text"
                        {...field}
                        placeholder="Flat No. 403, Laxmi Dreams"
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* City */}
              <FormField
                control={formMethods.control}
                name="currentCity"
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

              {/* District */}
              <FormField
                control={formMethods.control}
                name="currentDistrict"
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

              {/* Pincode */}
              <FormField
                control={formMethods.control}
                name="currentPincode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postal/ZIP Code *</FormLabel>
                    <FormControl>
                      <input
                        type="text"
                        {...field}
                        placeholder="10001"
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* State */}
              <FormField
                control={formMethods.control}
                name="currentState"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State/Province/Region *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      className="w-full"
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select State/Province/Region" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(sampleStates).flatMap(
                          ([country, states]) =>
                            states.map((state) => (
                              <SelectItem key={state.code} value={state.code}>
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

              {/* Country */}
              <FormField
                control={formMethods.control}
                name="currentCountry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      className="w-full"
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Country" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sampleCountries.map((country) => (
                          <SelectItem key={country.code} value={country.code}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Permanent Address Section */}
            <div className="border p-4 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Permanent Address</h3>

              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="sameAddress"
                  checked={sameAddress}
                  onChange={handleCheckboxChange}
                  className="mr-2"
                />
                <label htmlFor="sameAddress">
                  Same as above mentioned address
                </label>
              </div>

              {!sameAddress && (
                <>
                  {/* Street Address */}
                  <FormField
                    control={formMethods.control}
                    name="permanentAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address *</FormLabel>
                        <FormControl>
                          <input
                            type="text"
                            {...field}
                            placeholder="123 Manjri Bk."
                            className="w-full p-2 border border-gray-300 rounded"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Apartment/Suite/Unit */}
                  <FormField
                    control={formMethods.control}
                    name="permanentLandmark"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Apartment/Suite/Unit</FormLabel>
                        <FormControl>
                          <input
                            type="text"
                            {...field}
                            placeholder="Flat No. 403, Laxmi Dreams"
                            className="w-full p-2 border border-gray-300 rounded"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* City */}
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

                  {/* District */}
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

                  {/* Pincode */}
                  <FormField
                    control={formMethods.control}
                    name="permanentPincode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postal/ZIP Code *</FormLabel>
                        <FormControl>
                          <input
                            type="text"
                            {...field}
                            placeholder="10001"
                            className="w-full p-2 border border-gray-300 rounded"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* State */}
                  <FormField
                    control={formMethods.control}
                    name="permanentState"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State/Province/Region *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          className="w-full"
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select State/Province/Region" />
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

                  {/* Country */}
                  <FormField
                    control={formMethods.control}
                    name="permanentCountry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          className="w-full"
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Country" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {sampleCountries.map((country) => (
                              <SelectItem
                                key={country.code}
                                value={country.code}
                              >
                                {country.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </div>

            <div className="flex justify-between">
              <Button
                type="button"
                onClick={() => handleStepChange(step - 1)}
                variant="outline"
              >
                Previous
              </Button>
              <div className="space-x-3">
                <Button type="submit" variant="default">
                  Next
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
