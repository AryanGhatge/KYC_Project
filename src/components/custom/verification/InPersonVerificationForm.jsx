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
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import InPersonPhoto from "@/../public/inpersonphoto.png";
import { FaLocationDot, FaCheck } from "react-icons/fa6";

const InPersonVerificationForm = ({ onSubmit, initialData }) => {
  const [locationAllowed, setLocationAllowed] = useState(false);
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

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
        setImage(initialData.image);
        setValue("image", initialData.image);
        setPreviewUrl(URL.createObjectURL(initialData.image));
      }
      if (initialData.location) {
        setLocation(initialData.location);
        setValue("location", initialData.location);
        setLocationAllowed(true);
      }
    }
  }, [initialData, setValue]);

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
        setValue("image", file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        console.log("Preview URL:", url); // Check the URL here
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

  const handleFormSubmit = (data) => {
    if (!locationAllowed) {
      setError("location", {
        type: "manual",
        message: "Please allow location access.",
      });
      return;
    }

    onSubmit(data, 6);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen pt-14">
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
                      <div
                        {...getRootProps({ className: "dropzone" })}
                        className="border-2 border-dashed border-gray-300 p-8 rounded-lg text-center cursor-pointer hover:border-indigo-600 transition"
                      >
                        <input {...getInputProps()} />
                        <p className="text-gray-500">
                          {image
                            ? `File selected: ${image.name}`
                            : "Drag & drop your image here, or click to select file"}
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

            {previewUrl && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-2">Image Preview:</h3>
                <div className="flex justify-center">
                  <Image
                    src={previewUrl}
                    alt="Uploaded Image Preview"
                    width={300}
                    height={300}
                    objectFit="contain"
                    className="rounded-lg"
                  />
                </div>
              </div>
            )}

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
};

export default InPersonVerificationForm;
