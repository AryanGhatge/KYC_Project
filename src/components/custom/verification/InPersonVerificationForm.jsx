import React, { useState, useEffect } from "react";
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
import Image from "next/image";
import InPersonPhoto from "@/../public/inpersonphoto.png";
import { FaLocationDot, FaCheck } from "react-icons/fa6";
import UploadImages from "../UploadImages";
const InPersonVerificationForm = ({ onSubmit, initialData, step, handleStepChange }) => {
  const [locationAllowed, setLocationAllowed] = useState(false);
  const [location, setLocation] = useState("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);

  const formMethods = useForm({
    defaultValues: {
      image: null,
      location: "",
    },
  });

  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    setValue,
    formState: { errors },
  } = formMethods;

  useEffect(() => {
    if (initialData) {
      if (initialData.image) {
        setUploadedImageUrl(initialData.image);
        setValue("image", initialData.image);
      }
      if (initialData.location) {
        setLocation(initialData.location);
        setValue("location", initialData.location);
        setLocationAllowed(true);
      }
    }

    // Load image URL from localStorage if available
    const storedImageUrl = localStorage.getItem("inPersonVerificationImageUrl");
    if (storedImageUrl) {
      setUploadedImageUrl(storedImageUrl);
      setValue("image", storedImageUrl);
    }
  }, [initialData, setValue]);

  const handleLocationAccess = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const locationString = `${position.coords.latitude}, ${position.coords.longitude}`;
        setLocationAllowed(true);
        setLocation(locationString);
        setValue("location", locationString);
      },
      (error) => {
        console.error(error);
        // Handle error or notify the user
      }
    );
  };

  const handleUploadSuccess = (result) => {
    const secureUrl = result.info.secure_url;
    setUploadedImageUrl(secureUrl);
    setValue("image", secureUrl);

    // Store the uploaded URL in localStorage
    localStorage.setItem("inPersonVerificationImageUrl", secureUrl);
  };

  const handleFormSubmit = (data) => {
    if (!locationAllowed) {
      setError("location", {
        type: "manual",
        message: "Please allow location access.",
      });
      return;
    }

    if (!data.image) {
      setError("image", {
        type: "manual",
        message: "Please upload an image.",
      });
      return;
    }

    onSubmit(data, 6);
  };

  const handleBack = () => {
    // Save current form data before going back
    const currentFormData = {
      image: uploadedImageUrl,
      location: location
    };

    // Store in localStorage
    const existingData = JSON.parse(localStorage.getItem('ekycFormData') || '{}');
    const updatedData = {
      ...existingData,
      [step]: currentFormData
    };
    localStorage.setItem('ekycFormData', JSON.stringify(updatedData));

    // Navigate to previous step
    handleStepChange(step - 1);
  };

  return (
    <div className="flex flex-col items-center justify-center lg:min-h-[calc(100%-100px)] py-10">
      <div className="w-full max-w-2xl p-8 bg-white rounded-lg shadow-lg border border-gray-200">
        <h2 className="text-3xl font-semibold mb-8 text-center text-gray-800">
          In-Person Verification
        </h2>

        <Form {...formMethods}>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
            {!locationAllowed ? (
              <Button
                type="button"
                onClick={handleLocationAccess}
                variant="secondary"
                className="w-full mb-6 py-3 text-lg flex items-center justify-center space-x-2 transition"
              >
                <FaLocationDot />
                <span>Allow Location Access</span>
              </Button>
            ) : (
              <div className="flex items-center justify-center mb-6 py-3 text-lg text-green-600 bg-green-100 rounded-md">
                <FaCheck className="mr-2" />
                <span>Location Access Granted</span>
              </div>
            )}
            <div className="mb-6 text-center">
              <p className="mb-4 text-lg text-gray-700">
                Your OTP for the IPV is{" "}
                <strong className="text-indigo-600">4023</strong>
              </p>
              <ol className="list-decimal list-inside space-y-2 text-gray-600">
                <li>Write the OTP on a clean piece of paper.</li>
                <li>
                  Hold the paper, then take a clear photo showing your face.
                </li>
                <li>Upload the photo using the button below.</li>
              </ol>
            </div>

            <div className="flex justify-center mb-6">
              <Image
                src={InPersonPhoto}
                alt="In-Person Verification Example"
                className="rounded-lg"
              />
            </div>

            <div className="mb-8">
              <FormField
                control={control}
                name="image"
                render={() => (
                  <FormItem>
                    <FormLabel className="text-lg text-gray-700">
                      Upload Image
                    </FormLabel>
                    <FormControl>
                      <UploadImages
                        text="Upload In-Person Verification Photo"
                        onSuccess={handleUploadSuccess}
                        inPerson={true}
                      />
                    </FormControl>
                    <FormMessage>
                      {errors.image && (
                        <span className="text-red-500">
                          {errors.image.message}
                        </span>
                      )}
                    </FormMessage>
                  </FormItem>
                )}
              />
            </div>

            {uploadedImageUrl && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-2">Image Preview:</h3>
                <div className="flex justify-center">
                  <Image
                    src={uploadedImageUrl}
                    alt="Uploaded Image Preview"
                    width={300}
                    height={300}
                    style={{ width: "100%", height: "auto" }}
                    className="rounded-lg"
                  />
                </div>
              </div>
            )}
            <div className="flex gap-4 ">
              <Button onClick={handleBack} variant="outline" className="w-1/2">
                Back
              </Button>

              <Button
                type="submit"
                variant="default"
                className="w-full py-3 text-lg transition"
              >
                Confirm & Proceed
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default InPersonVerificationForm;
