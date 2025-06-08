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
import { FaLocationDot, FaCheck, FaSpinner } from "react-icons/fa6";
import UploadImages from "../UploadImages";
import { toast, Toaster } from "sonner";
import { verifyLiveliness } from "@/lib/apiService/livelinessService";
import { AiOutlineInfoCircle } from "react-icons/ai";

const InPersonVerificationForm = ({
  onSubmit,
  initialData,
  step,
  handleStepChange,
}) => {
  const [locationAllowed, setLocationAllowed] = useState(false);
  const [location, setLocation] = useState("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [currentCheck, setCurrentCheck] = useState("");
  const [checkProgress, setCheckProgress] = useState(0);
  const [livenessChecks, setLivenessChecks] = useState([]);
  const [checkComplete, setCheckComplete] = useState(false);

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
    // Check for stored location permission first
    const storedLocationAllowed = localStorage.getItem("locationAllowed");
    const storedLocation = localStorage.getItem("locationString");
    if (storedLocationAllowed === "true" && storedLocation) {
      setLocationAllowed(true);
      setLocation(storedLocation);
      setValue("location", storedLocation);
    }

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
        // Store location permission in localStorage
        localStorage.setItem("locationAllowed", "true");
        localStorage.setItem("locationString", locationString);
        toast.success("Location access granted!");
      },
      (error) => {
        console.error(error);
        setLocationAllowed(false);
        localStorage.removeItem("locationAllowed");
        localStorage.removeItem("locationString");
        toast.error("Error accessing location. Please try again.");
      }
    );
  };
  const handleUploadSuccess = (result) => {
    try {
      const secureUrl = result.info.secure_url;

      // Validate that we got a valid URL back
      if (!secureUrl || typeof secureUrl !== "string") {
        throw new Error("Invalid image URL received");
      }

      setUploadedImageUrl(secureUrl);
      setValue("image", secureUrl);
      clearErrors("image"); // Clear any existing errors

      // Store the uploaded URL in localStorage
      localStorage.setItem("inPersonVerificationImageUrl", secureUrl);
      toast.success(
        "Image uploaded successfully! Please proceed with verification."
      );
    } catch (error) {
      console.error("Upload success handler error:", error);
      toast.error(
        "There was a problem processing your image. Please try again."
      );
      setError("image", {
        type: "manual",
        message: "Failed to process the uploaded image. Please try again.",
      });
    }
  };  const handleFormSubmit = async (data) => {
    try {
      console.log("Form submission started");
      // Clear any existing errors first
      clearErrors();

      // Double check location access from both state and localStorage
      const storedLocationAllowed = localStorage.getItem("locationAllowed");
      const storedLocation = localStorage.getItem("locationString");
      
      if (!locationAllowed && storedLocationAllowed !== "true") {
        console.log("Location access not allowed");
        setError("location", {
          type: "manual",
          message: "Please allow location access to proceed.",
        });
        toast.error("Please allow location access to proceed");
        return;
      }

      // If we have stored location but state doesn't reflect it, update state
      if (storedLocationAllowed === "true" && storedLocation && !locationAllowed) {
        setLocationAllowed(true);
        setLocation(storedLocation);
        setValue("location", storedLocation);
      }

      // Validate image upload
      if (!uploadedImageUrl) {
        console.log("No image URL found");
        setError("image", {
          type: "manual",
          message: "Please take or upload a verification photo to proceed.",
        });
        toast.error("Please take or upload a verification photo");
        return;
      }

      console.log("Starting verification with image:", uploadedImageUrl);
      // Save current data
      const currentFormData = {
        image: uploadedImageUrl,
        location: location,
      };

      // Store in localStorage
      const existingData = JSON.parse(
        localStorage.getItem("ekycFormData") || "{}"
      );
      localStorage.setItem(
        "ekycFormData",
        JSON.stringify({
          ...existingData,
          [step]: currentFormData,
        })
      );

      // Start verification process
      handleVerification();
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };
  const startVerification = () => {
    setAnalyzing(true);
    setLivenessChecks([]);
    setCurrentCheck("Initializing verification system");
    setCheckProgress(0);

    const checks = [
      "Initializing verification system",
      "Analyzing facial features",
      "Performing liveness detection",
      "Checking face orientation",
      "Detecting eye movement",
      "Checking for spoofing attempts",
      "Verifying OTP in image",
      "Checking image quality",
      "Completing verification process",
    ];

    let currentCheckIndex = 0;
    const runChecks = () => {
      const check = checks[currentCheckIndex];
      if (check) {
        setCurrentCheck(check);
        setLivenessChecks((prev) => [...prev, check]);
        setCheckProgress(((currentCheckIndex + 1) / checks.length) * 100);
        currentCheckIndex++;
        setTimeout(runChecks, 3000);
      } else {
        setCheckComplete(true);
      }
    };

    runChecks();

    // Return cleanup function
    return () => {
      clearInterval(checkInterval);
    };
  };
  const handleVerification = async () => {
    if (!uploadedImageUrl) {
      toast.error("Please upload an image first");
      return;
    }

    try {
      setIsLoading(true);
      setAnalyzing(true);

      // Start verification animation
      startVerification();

      // Make the API call
      const result = await verifyLiveliness({
        image: uploadedImageUrl,
      });

      // Short delay to ensure UI updates are visible
      await new Promise((resolve) => setTimeout(resolve, 30000));

      if (result?.success) {
        // Store verification data
        const currentFormData = {
          image: uploadedImageUrl,
          location: location,
          verificationStatus: "success",
          verifiedAt: new Date().toISOString(),
        };

        // Update localStorage
        const existingData = JSON.parse(
          localStorage.getItem("ekycFormData") || "{}"
        );
        localStorage.setItem(
          "ekycFormData",
          JSON.stringify({
            ...existingData,
            [step]: currentFormData,
          })
        );

        toast.success("Verification successful!");

        // Proceed to next step
        setTimeout(() => {
          setAnalyzing(false);
          handleStepChange(step + 1);
        }, 1000);
      } else {
        setAnalyzing(false);
        toast.error(
          result?.message || "Verification failed. Please try again."
        );
      }
    } catch (error) {
      console.error("Verification error:", error);
      setAnalyzing(false);
      toast.error("Error during verification. Please try again.");
    } finally {
      setIsLoading(false);
      setCheckComplete(false);
      setCheckProgress(0);
      setLivenessChecks([]);
    }
  };

  const handleBack = () => {
    // Save current form data before going back
    const currentFormData = {
      image: uploadedImageUrl,
      location: location,
    };

    // Store in localStorage
    const existingData = JSON.parse(
      localStorage.getItem("ekycFormData") || "{}"
    );
    const updatedData = {
      ...existingData,
      [step]: currentFormData,
    };
    localStorage.setItem("ekycFormData", JSON.stringify(updatedData));

    // Navigate to previous step
    handleStepChange(step - 1);
  };

  const renderVerificationLoader = () => {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
          <div className="text-center">
            <div className="mb-4">
              <FaSpinner className="animate-spin text-4xl text-black mx-auto" />
            </div>
            <h3 className="text-xl font-semibold mb-4">{currentCheck}</h3>

            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
              <div
                className="bg-black h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${checkProgress}%` }}
              ></div>
            </div>

            {/* Completed checks */}
            <div className="space-y-2 text-left">
              {livenessChecks.map((check, index) => (
                <div key={index} className="flex items-center text-green-600">
                  <FaCheck className="mr-2" />
                  <span>{check}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {analyzing && renderVerificationLoader()}
      <div className="flex flex-col items-center justify-center lg:min-h-[calc(100%-100px)] py-10">
        <div className="w-full max-w-2xl p-8 bg-white rounded-lg shadow-lg border border-gray-200">
          <h2 className="text-3xl font-semibold mb-8 text-center text-gray-800">
            In-Person Verification
          </h2>

          <Form {...formMethods}>
            <form
              onSubmit={handleSubmit(handleFormSubmit)}
              className="space-y-8"
            >
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
                  name={`image`}
                  render={({ field }) => (
                    <FormItem>
                      {" "}
                      <FormLabel className="flex items-center gap-2">
                        Upload Image
                        <span className="text-red-500">*</span>
                        <span className="tooltip-container">
                          <AiOutlineInfoCircle className="text-gray-500 cursor-help" />
                          <span className="tooltip-text">
                            Upload a clear live image of yourself holding the
                            OTP written on a piece of paper. Ensure your face is
                            clearly visible
                          </span>
                        </span>
                      </FormLabel>
                      <FormControl>
                        <UploadImages
                          text="Upload In-Person Verification Photo"
                          onSuccess={handleUploadSuccess}
                          inPerson={true}
                        />
                      </FormControl>{" "}
                      {/*  <div>
                        {uploadedImageUrl ? (
                          <div className="mt-4">
                            <Image
                              src={uploadedImageUrl}
                              alt={`In-Person Verification Image}`}
                              width={300}
                              height={200}
                              style={{ width: "100%", height: "auto" }}
                            />
                            <p className="text-sm text-green-600 mt-2">
                              Image uploaded successfully
                            </p>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500 mt-2">
                            Please upload an image for In-Person Verification.
                          </p>
                        )}
                      </div> */}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* <FormField
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
                /> */}
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
                <Button
                  onClick={handleBack}
                  variant="outline"
                  className="w-1/2"
                >
                  Back
                </Button>

                <Button
                  type="submit"
                  variant="default"
                  className="w-full py-3 text-lg transition"
                  isLoading={isLoading}
                >
                  Confirm & Proceed
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
};

export default InPersonVerificationForm;
