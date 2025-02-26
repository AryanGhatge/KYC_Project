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
import { useForm } from "react-hook-form";
import { proofOfIdentitySchema } from "@/lib/schemas/proofOfIdentitySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import Modal from "react-modal";
import { useState, useEffect, useRef } from "react";
import { RxCross2 } from "react-icons/rx";

export default function ProofOfIdentityForm({ handleStepChange, step, steps }) {
  const dispatch = useDispatch();
  const [photo, setPhoto] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stream, setStream] = useState(null);
  const [isCameraLoading, setIsCameraLoading] = useState(false);

  const videoRef = useRef(null);

  const formMethods = useForm({
    resolver: zodResolver(proofOfIdentitySchema),
    defaultValues: {
      userPhoto: "",
      passportNumber: "",
      passportExpiry: new Date(),
      voterIdCard: "",
      drivingLicense: "",
      drivingLicenseExpiry: new Date(),
      nregaJobCard: "",
      nationalPopRegLetter: "",
      proofOfPossAadhaar: "",
      KYCAuthecation: "",
      offlineVerificationAadhar: "",
    },
  });

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  const handleNext = async () => {
    // Trigger validation
    const isValid = await formMethods.trigger();

    if (isValid) {
      formMethods.handleSubmit(handleSubmitForm)();
      dispatch(setStep(3));
      handleStepChange(step + 1);
    }
  };

  const handleSave = async (data) => {
    // Convert string dates to Date objects if necessary
    data.passportExpiry = new Date(data.passportExpiry);
    data.drivingLicenseExpiry = new Date(data.drivingLicenseExpiry);

    const personalInfo = await localStorage.getItem("userDataWithAddress");
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
    localStorage.setItem("proofOfIdentity", JSON.stringify(updatedUserData));
  };

  const handleSubmitForm = async (data) => {
    // Clear existing errors
    formMethods.clearErrors();

    // Check if there are any validation errors
    const { errors } = formMethods.formState;

    if (Object.keys(errors).length > 0) {
      console.error("Please fill in all required fields");
      return; // Exit early if there are validation errors
    }

    // Save data if no errors
    await handleSave(data);

    // Proceed to the next step
    dispatch(setStep(3));
    handleStepChange(step + 1);
  };

  const handleCapturePhoto = () => {
    setIsModalOpen(true);
  };

  const handlePhotoCapture = async () => {
    const video = document.getElementById("video");
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (video && context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const photoDataUrl = canvas.toDataURL("image/png");
      setPhoto(photoDataUrl);

      // Set the photo URL to userPhoto in form
      formMethods.setValue("userPhoto", photoDataUrl);
    } else {
      console.error("Video or context not available");
    }

    setIsCameraLoading(true);

    setTimeout(() => {
      setIsModalOpen(false);
      setIsCameraLoading(false);
    }, 2000); // Adjust the delay as needed
  };

  function startCamera() {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        const video = document.getElementById("video");
        if (video) {
          video.srcObject = stream;
          video.onloadedmetadata = () => {
            video.play();
          };
          setStream(stream);
        }
      })
      .catch((error) => {
        console.error("Error accessing camera:", error);
      });
  }

  useEffect(() => {
    if (isModalOpen) {
      startCamera();
    } else {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
    }
  }, [isModalOpen]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-4xl p-8 bg-white rounded-lg shadow-xl border-2">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Proof of Identity
        </h2>

        <Form {...formMethods}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleNext();
            }}
            className="space-y-6"
          >
            {/* Passport Number */}
            <FormField
              control={formMethods.control}
              name="passportNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Passport Number *</FormLabel>
                  <FormControl>
                    <input
                      type="text"
                      {...field}
                      placeholder="Enter your passport number"
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Passport Expiry */}
            <FormField
              control={formMethods.control}
              name="passportExpiry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Passport Expiry Date *</FormLabel>
                  <FormControl>
                    <input
                      type="date"
                      {...field}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Voter ID Card */}
            <FormField
              control={formMethods.control}
              name="voterIdCard"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Voter ID Card Number *</FormLabel>
                  <FormControl>
                    <input
                      type="text"
                      {...field}
                      placeholder="Enter your voter ID card number"
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Driving License */}
            <FormField
              control={formMethods.control}
              name="drivingLicense"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Driving License Number *</FormLabel>
                  <FormControl>
                    <input
                      type="text"
                      {...field}
                      placeholder="Enter your driving license number"
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Driving License Expiry */}
            <FormField
              control={formMethods.control}
              name="drivingLicenseExpiry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Driving License Expiry Date *</FormLabel>
                  <FormControl>
                    <input
                      type="date"
                      {...field}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* NREGA Job Card */}
            <FormField
              control={formMethods.control}
              name="nregaJobCard"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NREGA Job Card Number</FormLabel>
                  <FormControl>
                    <input
                      type="text"
                      {...field}
                      placeholder="Enter NREGA job card number"
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* National Population Register Letter */}
            <FormField
              control={formMethods.control}
              name="nationalPopRegLetter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>National Population Register Letter</FormLabel>
                  <FormControl>
                    <input
                      type="text"
                      {...field}
                      placeholder="Enter NPR letter details"
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Proof of Aadhaar */}
            <FormField
              control={formMethods.control}
              name="proofOfPossAadhaar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Aadhaar Card Number * </FormLabel>
                  <FormControl>
                    <input
                      type="text"
                      {...field}
                      placeholder="Enter Aadhaar proof details"
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* KYC Authentication */}
            <FormField
              control={formMethods.control}
              name="KYCAuthecation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>KYC Authentication * </FormLabel>
                  <FormControl>
                    <input
                      type="text"
                      {...field}
                      placeholder="Enter KYC authentication details"
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Offline Verification Aadhaar */}
            <FormField
              control={formMethods.control}
              name="offlineVerificationAadhar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Offline Verification Aadhaar * </FormLabel>
                  <FormControl>
                    <input
                      type="text"
                      {...field}
                      placeholder="Enter offline verification Aadhaar details"
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={formMethods.control}
              name="userPhoto"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Button
                      onClick={handleCapturePhoto}
                      variant="secondary"
                      className="mb-4"
                    >
                      Capture Photo for KYC Verification
                    </Button>
                  </FormControl>
                  {photo && (
                    <div className="mb-4 relative">
                      <img
                        src={photo}
                        alt="Selfie"
                        className="w-28 h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  {!photo && <FormMessage />}
                </FormItem>
              )}
            />

            {/* Submit Button */}
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

      {/* Camera Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Capture Photo"
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        ariaHideApp={false}
      >
        <div className="bg-white relative p-4 rounded-lg shadow-lg">
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-3 right-3 p-2 text-gray-500 hover:text-gray-800"
          >
            <RxCross2 size={24} />
          </button>
          <h2 className="text-xl font-bold mb-4">Capture Your Photo</h2>
          {isCameraLoading && (
            <span className="flex absolute top-0 bottom-0 left-0 right-0 items-center justify-center bg-black bg-opacity-50 rounded-lg space-x-2 dark:invert">
              <div className="h-5 w-5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="h-5 w-5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="h-5 w-5 bg-white rounded-full animate-bounce"></div>
            </span>
          )}
          <video
            id="video"
            autoPlay
            className="w-full h-auto mb-4 border border-gray-300 rounded"
          ></video>
          <button
            onClick={handlePhotoCapture}
            className="w-full p-2 bg-blue-500 text-white rounded shadow-lg hover:bg-blue-600"
          >
            {isCameraLoading ? (
              <span className="animate-spin">⏳</span>
            ) : (
              "Capture"
            )}
          </button>
        </div>
      </Modal>
    </div>
  );
}
