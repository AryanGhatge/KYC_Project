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
import { Input } from "@/components/ui/input";
import occupationData from "@/lib/data/occupationData";
import annualSalaryData from "@/lib/data/annualSalaryData";
import profileDetailSchema from "@/lib/schemas/e-kyc/profileDetailSchema";

export default function ProfileDetailsForm({ handleStepChange, step, steps }) {
  const dispatch = useDispatch();

  const formMethods = useForm({
    resolver: zodResolver(profileDetailSchema),
    defaultValues: {
      gender: "Male",
      placeOfBirth: "",
      occupation: "",
      annualIncome: "",
      citizenship: false,
      informationConfirmation: false,
    },
  });

  const handleNext = () => {
    dispatch(setStep(step + 1));
    handleStepChange(step + 1);
  };

  const handleSave = (data) => {
    localStorage.setItem("userProfileData", JSON.stringify(data));
  };

  const handleSubmitForm = async (data) => {
    const { errors } = formMethods.formState;

    if (Object.keys(errors).length > 0) {
      console.error("Please fill in all required fields");
      return;
    }

    console.log(data);
    handleSave(data);
    handleNext();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
      <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-lg border ">
        <h2 className="text-2xl font-bold mb-6 text-center ">
          Profile Details
        </h2>
        <Form {...formMethods}>
          <form
            onSubmit={formMethods.handleSubmit(handleSubmitForm)}
            className="space-y-6"
          >
            <div className="grid gap-6 md:grid-cols-2">
              {/* Gender */}
              <div>
                <FormField
                  control={formMethods.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Gender *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        className="w-full"
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Others">Others</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Place of Birth */}
              <div>
                <FormField
                  control={formMethods.control}
                  name="placeOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="">Place of Birth *</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter Place of Birth"
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

            <div className="grid gap-6 md:grid-cols-2">
              {/* Occupation */}
              <div>
                <FormField
                  control={formMethods.control}
                  name="occupation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">
                        Occupation *
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        className="w-full"
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Occupation" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {occupationData.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Annual Income */}
              <div>
                <FormField
                  control={formMethods.control}
                  name="annualIncome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">
                        Annual Income (LPA) *
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        className="w-full"
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Annual Income" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {annualSalaryData.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Checkboxes */}
            <div className="space-y-4 mt-6">
              {/* Citizenship Checkbox */}
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="citizenship"
                  className="h-3 w-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  {...formMethods.register("citizenship", { required: true })}
                />
                <label
                  htmlFor="citizenship"
                  className="text-gray-700 leading-tight"
                >
                  <span className="block font-medium">
                    I am an Indian citizen and a tax resident of India and of no
                    other country. I do not have any political
                    exposure/affiliations.
                  </span>
                </label>
              </div>

              {/* Information Confirmation Checkbox */}
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="informationConfirmation"
                  className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  {...formMethods.register("informationConfirmation", {
                    required: true,
                  })}
                />
                <label
                  htmlFor="informationConfirmation"
                  className="text-gray-700 leading-tight"
                >
                  <span className="block font-medium">
                    I/We confirm that the information provided here is true &
                    accurate. In the event any of the above information is found
                    to be false/incorrect and/or the declaration is not
                    provided, then Inrbonds shall reserve the right to reject
                    the application. I/We shall keep Inrbonds forthwith informed
                    in writing about any changes/modification to the information
                    provided or any other additional information as may be
                    required by you from time to time.
                  </span>
                  <span className="block mt-1">
                    Towards compliance with tax information sharing laws, such
                    as FATCA and CRS: (a) Inrbonds may be required to seek
                    additional personal, tax and certain certifications and
                    documentation from investors. I/We ensure to advise you
                    within 30 days should there be any change in any information
                    provided; (b) In certain circumstances Inrbonds may be
                    obliged to share information on my account with relevant tax
                    authorities; (c) as may be required by domestic or overseas
                    regulators/tax authorities, Inrbonds may also be constrained
                    to close or suspend my account(s) and (d) I/We understand
                    that I am/we are required to contact my tax advisor for any
                    questions about my/our tax residency.
                  </span>
                </label>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <Button
                type="button"
                onClick={() => handleStepChange(step - 1)}
                variant="secondary"
              >
                Back
              </Button>
              <Button
                type="submit"
                onClick={() => {
                  formMethods.handleSubmit(handleSubmitForm)();
                }}
                variant="default"
              >
                Confirm & Proceed
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
