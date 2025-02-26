"use client"; // This marks this component as client-side

import { useDispatch } from "react-redux";
import { setStep } from "@/app/store/slices/formSlice";
import { z } from "zod";
import { personalInformationSchema } from "@/lib/schemas/personalInfoSchema";
import { useForm, Controller } from "react-hook-form";
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
import { Input } from "@/components/ui/input";
import "@mantine/core/styles.css";
import citizenshipOptions from "@/lib/data/personalInformationData";

export default function PersonalDetailForm({ handleStepChange, step, steps }) {
  const dispatch = useDispatch();

  const formMethods = useForm({
    resolver: zodResolver(personalInformationSchema),
    defaultValues: {
      namePrefix: "Mr.",
      firstName: "",
      middleName: "",
      lastName: "",
      fatherPrefix: "Mr.",
      fatherFirstName: "",
      fatherMiddleName: "",
      fatherLastName: "",
      motherPrefix: "Mrs.",
      motherFirstName: "",
      motherMiddleName: "",
      motherLastName: "",
      dateOfBirth: new Date(),
      gender: "Male",
      maritalStatus: "Unmarried",
      citizenShip: "Indian", // Default value
      residentialStatus: "Individual",
    },
  });

  const handleNext = () => {
    dispatch(setStep(step + 1)); // Move to next step
    handleStepChange(step + 1);
  };

  const handleBack = () => {
    dispatch(setStep(step - 1)); // Move to previous step
    handleStepChange(step - 1);
  };

  const handleSave = (data) => {
    localStorage.setItem("userPersonalData", JSON.stringify(data));
  };

  const handleSubmitForm = async (data) => {
    // Check if there are validation errors
    const { errors } = formMethods.formState;

    if (Object.keys(errors).length > 0) {
      // Set error message if there are validation errors
      console.error("Please fill in all required fields");
      return;
    }

    console.log(data); // Handle form data here
    handleSave(data); // Save form data to localStorage
    handleNext(); // Proceed to next step
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-4xl p-8 bg-white rounded-lg shadow-lg border-2">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Personal Details
        </h2>
        <Form {...formMethods}>
          <form
            onSubmit={formMethods.handleSubmit(handleSubmitForm)}
            className="space-y-6"
          >
            {/* Applicant's Name */}
            <div>
              <div className="text-lg font-semibold text-start mb-4">
                Name * (Same as ID Proof)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name Prefix */}
                <FormField
                  control={formMethods.control}
                  name="namePrefix"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prefix *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        className="w-full"
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Prefix" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Mr.">Mr.</SelectItem>
                          <SelectItem value="Mrs.">Mrs.</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* First Name */}
                <FormField
                  control={formMethods.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter First Name"
                          {...field}
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Middle Name */}
                <FormField
                  control={formMethods.control}
                  name="middleName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Middle Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Middle Name"
                          {...field}
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Last Name */}
                <FormField
                  control={formMethods.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Last Name"
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

            {/* Father's Information */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">
                Father&apos;s Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Father's Name Prefix */}
                <FormField
                  control={formMethods.control}
                  name="fatherPrefix"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prefix *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        className="w-full"
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Prefix" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Mr.">Mr.</SelectItem>
                          <SelectItem value="Mrs.">Mrs.</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Father's First Name */}
                <FormField
                  control={formMethods.control}
                  name="fatherFirstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Father's First Name"
                          {...field}
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Father's Middle Name */}
                <FormField
                  control={formMethods.control}
                  name="fatherMiddleName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Middle Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Father's Middle Name"
                          {...field}
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Father's Last Name */}
                <FormField
                  control={formMethods.control}
                  name="fatherLastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Father's Last Name"
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

            {/* Mother's Information */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">
                Mother&apos;s Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Mother's Name Prefix */}
                <FormField
                  control={formMethods.control}
                  name="motherPrefix"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prefix *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        className="w-full"
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Prefix" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Mr.">Mr.</SelectItem>
                          <SelectItem value="Mrs.">Mrs.</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Mother's First Name */}
                <FormField
                  control={formMethods.control}
                  name="motherFirstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Mother's First Name"
                          {...field}
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Mother's Middle Name */}
                <FormField
                  control={formMethods.control}
                  name="motherMiddleName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Middle Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Mother's Middle Name"
                          {...field}
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Mother's Last Name */}
                <FormField
                  control={formMethods.control}
                  name="motherLastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Mother's Last Name"
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

            {/* Date of Birth */}
            <div className="mt-8">
              <FormField
                control={formMethods.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth *</FormLabel>
                    <FormControl>
                      {/* <DatePickerInput
                      {...field}
                      placeholder="Select Date"
                      className="w-full"
                    /> */}
                      <input
                        type="date"
                        {...field}
                        className="w-full border border-gray-200 rounded py-1 px-3"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Gender */}
            <div className="mt-8">
              <FormField
                control={formMethods.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender *</FormLabel>
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
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Marital Status */}
            <div className="mt-8">
              <FormField
                control={formMethods.control}
                name="maritalStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marital Status *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      className="w-full"
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Marital Status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Married">Married</SelectItem>
                        <SelectItem value="Unmarried">Unmarried</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Citizenship */}
            <div className="mt-8">
              <FormField
                control={formMethods.control}
                name="citizenShip"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Citizenship *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      className="w-full"
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Citizenship" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {citizenshipOptions.map((option) => (
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

            {/* Residential Status */}
            <div className="mt-8">
              <FormField
                control={formMethods.control}
                name="residentialStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Residential Status *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      className="w-full"
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Residential Status" />
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
                          Pe rson of Indian Origin
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mt-8 space-x-3 flex justify-end">
              <Button
                type="submit"
                onClick={() => {
                  formMethods.handleSubmit(handleSubmitForm)();
                }}
                variant="default"
              >
                Next
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
