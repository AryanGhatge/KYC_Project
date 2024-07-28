"use client";

import { useDispatch } from "react-redux";
import { setStep } from "@/app/store/slices/formSlice";
import { Button } from "@/components/ui/button";

export default function ApplicantDeclarationForm({
  handleStepChange,
  step,
  steps,
}) {
  const dispatch = useDispatch();

  const handleSubmitForm = async () => {
    alert("Form submitted successfully!");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 ">
      <div className="w-full max-w-4xl p-8 bg-white rounded-lg shadow-xl border-2">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Proof of Identity
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmitForm();
          }}
          className="space-y-6"
        >
          <p className="text-md text-gray-700 mb-1">
            Please read and agree to the declaration below *
          </p>
          <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg shadow-md">
            <ul className="list-disc pl-5 text-gray-700">
              <li className="mb-2">
                I hereby declare that the details furnished above are true and
                correct to the best of my knowledge/belief and I undertake to
                inform you of any changes therein, immediately. In case any of
                the above information is found to be false or untrue or
                misleading or misrepresenting, I am aware that I may be held
                liable for it.
              </li>
              <li className="mb-2">
                I hereby declare that I am not making this application for the
                purpose of contravention of any Act, Rules, Regulations or any
                statute of legislation or any notifications/directions issued by
                any governmental or statutory authority from time to time.
              </li>
              <li className="mb-2">
                I hereby consent to receiving information from Central KYC
                Registry through SMS/Email on the above registered number/email
                address and to download the information from CKYCR.
              </li>
              <li className="mb-2">
                I am providing the consent to MF/RTA/SEBI registered
                intermediary to share this KYC data / applicable Aadhaar XML
                data with KRA and share the data to other participating
                intermediaries as mandated by PMLA Act/Rules/SEBI guidelines.
              </li>
            </ul>
          </div>
          <div className="flex items-center space-x-2 mt-4">
            <input
              type="checkbox"
              id="agree"
              className="form-checkbox h-5 w-5 text-blue-600"
              required
            />
            <label htmlFor="agree" className="text-gray-700">
              I agree to the declaration
            </label>
          </div>
          <div className="flex justify-between mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleStepChange(step - 1)}
              disabled={step === 1}
            >
              Previous
            </Button>
            <Button
              type="submit"
              variant="default"
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Submit Form
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
