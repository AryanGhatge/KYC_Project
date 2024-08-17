import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import InPersonPhoto from "@/../public/inpersonphoto.png";
import { FaLocationDot } from "react-icons/fa6";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export default function InPersonVerificationForm({
  handleStepChange,
  step,
  steps,
}) {
  const [locationAllowed, setLocationAllowed] = useState(false);
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);

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
    formState: { errors },
  } = formMethods;

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file.size > MAX_FILE_SIZE) {
        setError("image", {
          type: "manual",
          message: "File size must be less than 5 MB.",
        });
      } else {
        clearErrors("image");
        setImage(file);
      }
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    },
  });

  const handleLocationAccess = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationAllowed(true);
        setLocation(
          `${position.coords.latitude}, ${position.coords.longitude}`
        );
      },
      (error) => {
        console.error(error);
        // Handle error or notify the user
      }
    );
  };

  const onSubmit = (data) => {
    if (!locationAllowed) {
      setError("location", {
        type: "manual",
        message: "Please allow location access.",
      });
      return;
    }

    console.log("Form data:", data);
    console.log("Image file:", image);
    // Proceed with form submission
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen pt-14">
      <div className="w-full max-w-2xl p-8 bg-white rounded-lg shadow-lg border border-gray-200">
        <h2 className="text-3xl font-semibold mb-8 text-center text-gray-800">
          In-Person Verification
        </h2>

        <Form {...formMethods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {!locationAllowed && (
              <Button
                type="button"
                onClick={handleLocationAccess}
                variant="secondary"
                className="w-full mb-6 py-3 text-lg flex items-center justify-center space-x-2 transition"
              >
                <FaLocationDot />
                <span>Allow Location Access</span>
              </Button>
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
                      <div
                        {...getRootProps({ className: "dropzone" })}
                        className="border-2 border-dashed border-gray-300 p-8 rounded-lg text-center cursor-pointer hover:border-indigo-600 transition"
                      >
                        <input {...getInputProps()} />
                        <p className="text-gray-500">
                          Drag & drop your image here, or click to select file
                        </p>
                      </div>
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

            <Button
              type="submit"
              variant="default"
              className="w-full py-3 text-lg transition"
            >
              Confirm & Proceed
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
