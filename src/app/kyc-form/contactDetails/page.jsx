"use client";

import { useDispatch } from "react-redux";
import { setStep } from "@/app/store/slices/formSlice";
import { contactSchema } from "@/lib/schemas/contactSchema";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import countryPhoneCode from "@/lib/data/contactDetailData";
import { Button } from "@/components/ui/button";

export default function ContactDetailsForm({ handleStepChange, step, steps }) {
  const dispatch = useDispatch();

  const formMethods = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      telephoneOffice: "",
      telephoneRes: "",
      phoneCountryCode: "",
      phoneNumber: "",
      emailId: "",
      alternativePhoneNumber: "",
      alternativeEmail: "",
    },
  });

  const handleNext = () => {
    formMethods.handleSubmit(handleSubmitForm)(); // Trigger validation
  };

  const handleSave = async (data) => {
    const personalInfo = await localStorage.getItem("proofOfIdentity");
    let personalData = {};

    if (personalInfo) {
      try {
        personalData = JSON.parse(personalInfo);
        if (typeof personalData !== "object" || personalData === null) {
          throw new Error("Parsed data is not an object");
        }
      } catch (error) {
        console.error("Error parsing personal data from localStorage", error);
        personalData = {};
      }
    }

    const updatedUserData = { ...personalData, ...data };
    localStorage.setItem(
      "userDataWithContactDetail",
      JSON.stringify(updatedUserData)
    );
  };

  const handleSubmitForm = async (data) => {
    const { errors } = formMethods.formState;

    if (Object.keys(errors).length > 0) {
      console.error("Please fill in all required fields");
      return;
    }

    await handleSave(data);
    dispatch(setStep(3));
    handleStepChange(step + 1);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-4xl p-8 bg-white rounded-lg shadow-xl border-2">
        <h2 className="text-2xl font-bold mb-6 text-center">Contact Details</h2>
        <Form {...formMethods}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleNext();
            }}
            className="space-y-6"
          >
            {/* Telephone Office */}
            <FormField
              control={formMethods.control}
              name="telephoneOffice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telephone Office </FormLabel>
                  <FormControl>
                    <input
                      type="text"
                      {...field}
                      placeholder="Enter office telephone number"
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Telephone Residence */}
            <FormField
              control={formMethods.control}
              name="telephoneRes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telephone Residence </FormLabel>
                  <FormControl>
                    <input
                      type="text"
                      {...field}
                      placeholder="Enter residence telephone number"
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone Country Code and Number */}
            <div className="flex space-x-4">
              {/* Phone Country Code */}
              <div className="w-[30%] h-full">
                <FormField
                  control={formMethods.control}
                  name="phoneCountryCode"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Phone Country Code *</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          className="w-full"
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select country code" />
                          </SelectTrigger>
                          <SelectContent>
                            {countryPhoneCode.map(({ code, country }) => (
                              <SelectItem key={code} value={code}>
                                {`${country} (${code})`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Phone Number */}
              <div className="w-[70%]">
                <FormField
                  control={formMethods.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Phone Number *</FormLabel>
                      <FormControl>
                        <input
                          type="text"
                          {...field}
                          placeholder="Enter your phone number"
                          className="w-full p-2 border border-gray-300 rounded"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Email ID */}
            <FormField
              control={formMethods.control}
              name="emailId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email ID *</FormLabel>
                  <FormControl>
                    <input
                      type="email"
                      {...field}
                      placeholder="Enter your email address"
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Alternative Phone Number */}
            <FormField
              control={formMethods.control}
              name="alternativePhoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alternative Phone Number</FormLabel>
                  <FormControl>
                    <input
                      type="text"
                      {...field}
                      placeholder="Enter an alternative phone number"
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Alternative Email */}
            <FormField
              control={formMethods.control}
              name="alternativeEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alternative Email</FormLabel>
                  <FormControl>
                    <input
                      type="email"
                      {...field}
                      placeholder="Enter an alternative email address"
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between">
              <Button
                type="button"
                onClick={() => handleStepChange(step - 1)}
                variant="outline"
              >
                Previous
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
}
