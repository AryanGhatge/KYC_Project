"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

const ESignForm = (handleStepChange, step, steps, onsubmit, initialData) => {
  const [formData, setFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const userData = useSelector((state) => state.auth);
  const fullName = userData?.user?.name;

  useEffect(() => {
    // Load form data from localStorage
    const savedData = localStorage.getItem("ekycFormData");
    if (savedData) {
      setFormData(JSON.parse(savedData));
    } else {
      console.error("No form data found in localStorage");
    }
  }, []);

  const downloadPDF = async () => {
    setIsLoading(true);
    try {
      // Hide all non-print elements
      const nonPrintElements = document.querySelectorAll(".no-print");
      nonPrintElements.forEach((el) => {
        el.style.display = "none";
      });

      // Add comprehensive print styles
      const printStyles = document.createElement("style");
      printStyles.innerHTML = `
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            box-sizing: border-box !important;
          }
          
          @page {
            margin: 0.5in !important;
            size: A4 !important;
          }
          
          body {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            font-family: Arial, sans-serif !important;
            font-size: 11px !important;
            line-height: 1.3 !important;
            width: 100% !important;
          }
          
          .bg-gray-50, .bg-gray-100 {
            background: white !important;
          }
          
          .shadow-2xl, .shadow-lg {
            box-shadow: none !important;
          }
          
          .border-black\\/30 {
            border: 2px solid black !important;
          }
          
          .page-break {
            page-break-before: always !important;
            page-break-inside: avoid !important;
          }
          
          .page-break:first-child {
            page-break-before: auto !important;
          }
          
          .max-w-4xl {
            max-width: none !important;
            width: 100% !important;
          }
          
          .mx-auto {
            margin: 0 !important;
          }
          
          .container {
            width: 100% !important;
            max-width: none !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          
          .space-y-10 > * + * {
            margin-top: 0 !important;
          }
          
          .mt-6, .mt-16 {
            margin-top: 0 !important;
          }
          
          .p-8 {
            padding: 0.75rem !important;
          }
          
          .py-4 {
            padding-top: 0.25rem !important;
            padding-bottom: 0.25rem !important;
          }
          
          .mb-6 {
            margin-bottom: 0.75rem !important;
          }
          
          .mb-4 {
            margin-bottom: 0.5rem !important;
          }
          
          .mb-3 {
            margin-bottom: 0.375rem !important;
          }
          
          .mb-2 {
            margin-bottom: 0.25rem !important;
          }
          
          .border {
            border: 1px solid black !important;
          }
          
          .border-2 {
            border: 2px solid black !important;
          }
          
          .border-b {
            border-bottom: 1px solid black !important;
          }
          
          .underline {
            text-decoration: underline !important;
          }
          
          .font-bold {
            font-weight: bold !important;
          }
          
          .text-center {
            text-align: center !important;
          }
          
          .text-justify {
            text-align: justify !important;
          }
          
          .flex {
            display: flex !important;
          }
          
          .justify-between {
            justify-content: space-between !important;
          }
          
          .items-center {
            align-items: center !important;
          }
          
          .items-end {
            align-items: flex-end !important;
          }
          
          .flex-wrap {
            flex-wrap: wrap !important;
          }
          
          .gap-4 {
            gap: 0.5rem !important;
          }
          
          .gap-2 {
            gap: 0.25rem !important;
          }
          
          .absolute {
            position: absolute !important;
          }
          
          .relative {
            position: relative !important;
          }
          
          .grid {
            display: grid !important;
          }
          
          .grid-cols-2 {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
          
          .gap-6 {
            gap: 0.75rem !important;
          }
          
          .space-y-2 > * + * {
            margin-top: 0.25rem !important;
          }
          
          /* Photo positioning */
          .absolute.top-8.right-8 {
            top: 0.5rem !important;
            right: 0.5rem !important;
            width: 7rem !important;
            height: 8.5rem !important;
          }
          
          /* Ensure proper text sizing */
          .text-lg {
            font-size: 14px !important;
          }
          
          .text-sm {
            font-size: 11px !important;
          }
          
          .text-xs {
            font-size: 10px !important;
          }
          
          .text-xl {
            font-size: 16px !important;
          }
          
          /* Ensure proper spacing for form fields */
          .min-w-96 {
            min-width: 15rem !important;
          }
          
          .min-w-64 {
            min-width: 10rem !important;
          }
          
          .min-w-48 {
            min-width: 8rem !important;
          }
          
          .min-w-32 {
            min-width: 6rem !important;
          }
          
          .min-w-24 {
            min-width: 4rem !important;
          }
          
          .min-w-20 {
            min-width: 3rem !important;
          }
          
          .w-48 {
            width: 8rem !important;
          }
          
          .w-32 {
            width: 6rem !important;
          }
          
          .w-24 {
            width: 4rem !important;
          }
          
          .w-20 {
            width: 3rem !important;
          }
          
          /* Image sizing for documents */
          .max-h-96 {
            max-height: 20rem !important;
          }
          
          /* Ensure proper line height for form content */
          .leading-relaxed {
            line-height: 1.4 !important;
          }
          
          /* Signature area */
          .h-16 {
            height: 3rem !important;
          }
          
          .h-6 {
            height: 1rem !important;
          }
          
          .h-4 {
            height: 0.75rem !important;
          }
          
          /* Ensure proper padding for bordered sections */
          .p-4 {
            padding: 0.5rem !important;
          }
          
          /* Color adjustments */
          .text-blue-600 {
            color: #000 !important;
            font-weight: bold !important;
          }
          
          .text-gray-600 {
            color: #000 !important;
          }
          
          .border-gray-300 {
            border-color: #000 !important;
          }
          
          .border-gray-200 {
            border-color: #000 !important;
          }
          
          .bg-gray-100 {
            background-color: #f5f5f5 !important;
          }
        }
      `;
      document.head.appendChild(printStyles);

      // Small delay to ensure styles are applied
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Trigger print dialog
      window.print();

      // Clean up after print
      setTimeout(() => {
        nonPrintElements.forEach((el) => {
          el.style.display = "";
        });
        if (document.head.contains(printStyles)) {
          document.head.removeChild(printStyles);
        }
      }, 1000);
    } catch (error) {
      console.error("Error downloading PDF:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!formData) {
    return <div className="p-8">Loading form data...</div>;
  }

  // Determine if user is individual or non-individual
  const isIndividual = formData?.["1"]?.whoAreU === "Individual";

  const primaryBank =
    formData["4"]?.bankDetails?.find((bank) => bank.primary) ||
    formData["4"]?.bankDetails?.[0];
  const primaryDemat =
    formData["5"]?.dematDetails?.find((demat) => demat.primary) ||
    formData["5"]?.dematDetails?.[0];

  // Format date of birth (assuming it's in DD/MM/YYYY format)
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [day, month, year] = dateStr.split("-");
    return `${year}/${month}/${day}`;
  };

  const dateOfBirth = formatDate(formData["1"]?.dateOfBirth);

  const handleSubmit = () => {
    toast.success("E-sign submitted successfully!");
    router.push("/");
  };

  const handleBack = () => {
    handleStepChange(currentStep - 1);
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Sticky header with download buttons */}
      <div className="sticky top-0 z-50 bg-white py-4 no-print">
        <div className="text-center space-x-4">
          <Button
            onClick={downloadPDF}
            disabled={isLoading}
            className="text-white px-6 py-2 rounded shadow"
          >
            {isLoading ? "Preparing..." : "Print/Download as PDF"}
          </Button>
        </div>
      </div>

      {/* Scrollable content area */}
      <div className="flex-1 bg-gray-50 mb-24">
        <div className="container mx-auto py-4 space-y-10">
          {/* KYC Form Page */}
          <div className="max-w-4xl mx-auto bg-white p-8 shadow-2xl mt-6 relative page-break">
            {/* Photo Box */}
            <div className="absolute top-8 right-8 w-32 h-40 border-2 border-black flex flex-col items-center justify-center text-xs text-center bg-gray-50">
              {formData["6"]?.image ? (
                <img
                  src={formData["6"].image}
                  alt="Applicant Photo"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "block";
                  }}
                />
              ) : null}
              <div
                className="p-2"
                style={{ display: formData["6"]?.image ? "none" : "block" }}
              >
                <div className="font-bold mb-1">PHOTOGRAPH</div>
                <div>
                  Please affix your recent passport size photograph and sign
                  across it
                </div>
              </div>
            </div>

            {/* Form Header */}
            <div className="text-center mb-6">
              <h1 className="text-lg font-bold uppercase mb-1">
                KNOW YOUR CLIENT (KYC) APPLICATION FORM
              </h1>
              <h2 className="text-sm mb-4">
                For {isIndividual ? "Individuals" : "Non-Individuals"}
              </h2>
              <p className="text-xs italic">
                Please fill this form in ENGLISH and in BLOCK LETTERS.
              </p>
            </div>

            {/* Individual Form */}
            <>
              {/* Section A: Identity Details */}
              <div className="mb-6">
                <h3 className="font-bold text-sm underline mb-4">
                  A. IDENTITY DETAILS
                </h3>

                <div className="mb-3">
                  <span className="text-xs">1. Name of the Applicant: </span>
                  <span className="border-b border-black inline-block min-w-96 pb-1 text-xs ml-2 font-semibold">
                    {fullName}
                  </span>
                </div>

                {/* <div className="mb-3">
                  <span className="text-xs">2. Father's/ Spouse Name: </span>
                  <span className="border-b border-black inline-block min-w-96 pb-1 text-xs ml-2 font-semibold">
                    {formData["3"]?.fatherName || "RAJESH DOE"}
                  </span>
                </div> */}

                <div className="mb-3 flex flex-wrap items-center gap-4">
                  <div>
                    <span className="text-xs">3. a. Gender: </span>
                    <span className="text-xs font-semibold">
                      {formData["3"]?.gender}
                    </span>
                    {/* <span className="text-xs"> / Male/ Female</span> */}
                  </div>
                  <div>
                    <span className="text-xs">b. Marital status: </span>
                    <span className="text-xs font-semibold">
                      {formData["3"]?.maritalStatus || "Single"}
                    </span>
                    {/* <span className="text-xs"> / Single/ Married</span> */}
                  </div>
                  <div>
                    <span className="text-xs">c. Date of birth: </span>
                    <span className="border-b border-black inline-block min-w-24 pb-1 text-xs font-semibold">
                      {dateOfBirth}
                    </span>
                    <span className="text-xs"> (dd/mm/yyyy)</span>
                  </div>
                </div>

                <div className="mb-3 flex flex-wrap items-center gap-4">
                  <div>
                    <span className="text-xs">4. a. Nationality: </span>
                    <span className="border-b border-black inline-block min-w-32 pb-1 text-xs font-semibold">
                      {formData["2"]?.permanentCountry || "India"}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs">b. Status: </span>
                    <span className="text-xs font-semibold">{formData?.["1"]?.whoAreU}</span>
                    {/* <span className="text-xs font-semibold">
                      Resident Individual
                    </span>
                    <span className="text-xs">
                      {" "}
                      / Non Resident/ Foreign National
                    </span> */}
                  </div>
                </div>

                <div className="mb-3 flex flex-wrap items-center gap-4">
                  <div>
                    <span className="text-xs">5. a. PAN: </span>
                    <span className="border-b border-black inline-block min-w-32 pb-1 text-xs font-semibold">
                      {formData["1"]?.panNumber || "ABCDE1234F"}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs">b. Aadhaar Number, if any: </span>
                    <span className="border-b border-black inline-block min-w-48 pb-1 text-xs font-semibold">
                      {formData["1"]?.aadhaarNumber || "1234 5678 9012"}
                    </span>
                  </div>
                </div>

                <div className="mb-3">
                  <span className="text-xs">
                    6. Specify the proof of Identity submitted:{" "}
                  </span>
                  <span className="border-b border-black inline-block min-w-96 pb-1 text-xs font-semibold">
                    PAN Card, Aadhaar Card
                  </span>
                </div>
              </div>

              {/* Section B: Address Details */}
              <div className="mb-6">
                <h3 className="font-bold text-sm underline mb-4">
                  B. ADDRESS DETAILS
                </h3>

                <div className="mb-3">
                  <span className="text-xs">1. Residence Address: </span>
                  <span className="border-b border-black inline-block min-w-96 pb-1 text-xs font-semibold">
                    {formData["2"]?.permanentAddress ||
                      "Kamal Colony, Near Main Market"}
                  </span>
                </div>

                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="text-xs">City/town/village: </span>
                  <span className="border-b border-black inline-block min-w-24 pb-1 text-xs font-semibold">
                    {formData["2"]?.permanentCity || "Pune"}
                  </span>
                  <span className="text-xs ml-4">Pin Code: </span>
                  <span className="border-b border-black inline-block min-w-20 pb-1 text-xs font-semibold">
                    {formData["2"]?.permanentPincode || "411001"}
                  </span>
                  <span className="text-xs ml-4">State: </span>
                  <span className="border-b border-black inline-block min-w-24 pb-1 text-xs font-semibold">
                    {formData["2"]?.permanentState || "Maharashtra"}
                  </span>
                  <span className="text-xs ml-4">Country: </span>
                  <span className="border-b border-black inline-block min-w-24 pb-1 text-xs font-semibold">
                    {formData["2"]?.permanentCountry || "India"}
                  </span>
                </div>

                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="text-xs">
                    2. Contact Details: Tel. (Off.){" "}
                  </span>
                  <span className="border-b border-black inline-block min-w-20 pb-1 text-xs"></span>
                  <span className="text-xs ml-2">Tel. (Res.) </span>
                  <span className="border-b border-black inline-block min-w-20 pb-1 text-xs"></span>
                  <span className="text-xs ml-2">Mobile No.: </span>
                  <span className="border-b border-black inline-block min-w-24 pb-1 text-xs font-semibold">
                    {formData["1"]?.mobileNumber || "9876543210"}
                  </span>
                  <span className="text-xs ml-2">Fax: </span>
                  <span className="border-b border-black inline-block min-w-20 pb-1 text-xs"></span>
                  <span className="text-xs ml-2">Email id: </span>
                  <span className="border-b border-black inline-block min-w-32 pb-1 text-xs font-semibold">
                    {formData["1"]?.emailId || "john.doe@gmail.com"}
                  </span>
                </div>

                <div className="mb-3">
                  <span className="text-xs">
                    3. Specify the proof of address submitted for residence
                    address:{" "}
                  </span>
                  <span className="border-b border-black inline-block min-w-64 pb-1 text-xs font-semibold">
                    Utility Bill / Bank Statement / Aadhaar Card
                  </span>
                </div>

                <div className="mb-3">
                  <span className="text-xs">
                    4. Permanent Address (if different from above or overseas
                    address, mandatory for Non-Resident Applicant):{" "}
                  </span>
                  <span className="border-b font-bold border-black inline-block min-w-96 pb-1 text-xs">
                    Same as above
                  </span>
                </div>

                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="text-xs">City/town/village: </span>
                  <span className="border-b border-black inline-block min-w-24 pb-1 text-xs font-semibold">
                    {formData["2"]?.permanentCity || "Pune"}
                  </span>
                  <span className="text-xs ml-4">Pin Code: </span>
                  <span className="border-b border-black inline-block min-w-20 pb-1 text-xs font-semibold">
                    {formData["2"]?.permanentPincode || "411001"}
                  </span>
                  <span className="text-xs ml-4">State: </span>
                  <span className="border-b border-black inline-block min-w-24 pb-1 text-xs font-semibold">
                    {formData["2"]?.permanentState || "Maharashtra"}
                  </span>
                  <span className="text-xs ml-4">Country: </span>
                  <span className="border-b border-black inline-block min-w-24 pb-1 text-xs font-semibold">
                    {formData["2"]?.permanentCountry || "India"}
                  </span>
                </div>
              </div>

              {/* Section C: Other Details */}
              <div className="mb-6">
                <h3 className="font-bold text-sm underline mb-4">
                  C. OTHER DETAILS
                </h3>

                <div className="mb-3 flex flex-wrap items-center gap-4">
                  <div>
                    <span className="text-xs">1. Occupation: </span>
                    <span className="border-b border-black inline-block min-w-32 pb-1 text-xs font-semibold">
                      {formData["3"]?.occupation || "Software Engineer"}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs">Annual Income: </span>
                    <span className="border-b border-black inline-block min-w-32 pb-1 text-xs font-semibold">
                      {formData["3"]?.annualIncome || "5-10 LPA"}
                    </span>
                  </div>
                </div>

                <div className="mb-3">
                  <span className="text-xs">2. Net-worth as on: </span>
                  <span className="border-b border-black inline-block min-w-24 pb-1 text-xs"></span>
                  <span className="text-xs ml-2">(Date): Rs. </span>
                  <span className="border-b border-black inline-block min-w-32 pb-1 text-xs"></span>
                </div>
              </div>
            </>

            {/* Declaration */}
            <div className="mb-6">
              <h3 className="font-bold text-sm underline mb-4">DECLARATION</h3>
              <p className="text-xs leading-relaxed text-justify mb-6">
                I hereby declare that the details furnished above are true and
                correct to the best of my knowledge and belief and I undertake
                to inform you of any changes therein, immediately. In case any
                of the above information is found to be false or untrue or
                misleading or misrepresenting, I am aware that I may be held
                liable for it.
              </p>

              <div className="flex justify-between items-end">
                <div>
                  <div className="border-b border-black w-48 pb-1 mb-2 h-16"></div>
                  <span className="text-xs">Signature of the Applicant</span>
                </div>
                <div>
                  <span className="text-xs">Date: </span>
                  <span className="border-b border-black inline-block w-32 pb-1 text-xs font-semibold">
                    {new Date().toLocaleDateString("en-GB")}
                  </span>
                  <span className="text-xs"> (dd/mm/yyyy)</span>
                </div>
              </div>
            </div>

            {/* Office Use Only */}
            <div className="border-2 border-black p-4">
              <h3 className="font-bold text-sm mb-4">FOR OFFICE USE ONLY</h3>
              <p className="text-xs mb-4">
                Originals verified and Self-Attested Document copies received
              </p>
              <div className="mb-4">
                <span className="text-xs">(</span>
                <span className="border-b border-black inline-block w-64 pb-1 text-xs h-6"></span>
                <span className="text-xs">)</span>
              </div>
              <p className="text-xs mb-2">
                Name & Signature of the Authorised Signatory
              </p>
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-xs">Date </span>
                  <span className="border-b border-black inline-block w-24 pb-1 text-xs h-4"></span>
                </div>
                <span className="text-xs">Seal/Stamp of the intermediary</span>
              </div>
            </div>
          </div>

          {/* Bank Documents Page */}
          {primaryBank?.uploadCancelledCheque && (
            <div className="max-w-4xl mx-auto bg-white mt-16 p-8 shadow-2xl page-break">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold">Bank Account Documents</h2>
                <p className="text-sm text-gray-600">
                  Bank: {primaryBank.bankName} | Account Type:{" "}
                  {primaryBank.accountType}
                </p>
                <p className="text-sm text-gray-600">
                  Account Number: {primaryBank.bankAccountNumber} | IFSC:{" "}
                  {primaryBank.ifscCode}
                </p>
              </div>

              <div className="border-2 border-gray-300 p-4 text-center">
                <h3 className="text-lg font-semibold mb-4">Cancelled Cheque</h3>
                <div className="flex justify-center">
                  <img
                    src={primaryBank.uploadCancelledCheque}
                    alt="Cancelled Cheque"
                    className="max-w-full max-h-96 object-contain border border-gray-200"
                    onError={(e) => {
                      e.target.alt = "Cancelled Cheque - Image not available";
                      e.target.className += " bg-gray-100 p-4";
                      e.target.style.minHeight = "200px";
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Demat Documents Page */}
          {primaryDemat?.clientMasterCopy && (
            <div className="max-w-4xl mx-auto bg-white p-8 shadow-2xl page-break">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold">Demat Account Documents</h2>
                <p className="text-sm text-gray-600">
                  Depository: {primaryDemat.depository} | DP ID:{" "}
                  {primaryDemat.dpID}
                </p>
                <p className="text-sm text-gray-600">
                  Client ID: {primaryDemat.clientID}
                </p>
              </div>

              <div className="border-2 border-gray-300 p-4 text-center">
                <h3 className="text-lg font-semibold mb-4">
                  Client Master Copy
                </h3>
                <div className="flex justify-center">
                  <img
                    src={primaryDemat.clientMasterCopy}
                    alt="Client Master Copy"
                    className="max-w-full max-h-96 object-contain border border-gray-200"
                    onError={(e) => {
                      e.target.alt = "Client Master Copy - Image not available";
                      e.target.className += " bg-gray-100 p-4";
                      e.target.style.minHeight = "200px";
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Summary Page */}
          <div className="max-w-4xl mx-auto bg-white p-8 shadow-2xl page-break">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold">KYC Application Summary</h2>
            </div>

            <div className="grid grid-cols-2 gap-6 text-sm">
              <div>
                <h3 className="font-bold mb-3 text-blue-600">
                  Personal Information
                </h3>
                <div className="space-y-2">
                  <div>
                    <strong>Name:</strong>{" "}
                    {fullName}
                  </div>
                  {/* <div>
                    <strong>Father's Name:</strong>{" "}
                    {formData["3"]?.fatherName || "RAJESH DOE"}
                  </div> */}
                  <div>
                    <strong>PAN:</strong> {formData["1"]?.panNumber}
                  </div>
                  {/* <div>
                    <strong>Aadhaar:</strong> {formData["1"]?.aadhaarNumber}
                  </div> */}
                  <div>
                    <strong>Mobile:</strong> {formData["1"]?.mobileNumber}
                  </div>
                  <div>
                    <strong>Email:</strong> {formData["1"]?.emailId}
                  </div>
                  <div>
                    <strong>Date of Birth:</strong> {formData["1"]?.dateOfBirth}
                  </div>
                  <div>
                    <strong>Gender:</strong> {formData["3"]?.gender}
                  </div>
                  <div>
                    <strong>Occupation:</strong> {formData["3"]?.occupation}
                  </div>
                  <div>
                    <strong>Annual Income:</strong>{" "}
                    {formData["3"]?.annualIncome}
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-bold mb-3 text-blue-600">
                  Address & Banking
                </h3>
                <div className="space-y-2">
                  <div>
                    <strong>Address:</strong> {formData["2"]?.permanentAddress}
                  </div>
                  <div>
                    <strong>City:</strong> {formData["2"]?.permanentCity}
                  </div>
                  <div>
                    <strong>State:</strong> {formData["2"]?.permanentState}
                  </div>
                  <div>
                    <strong>Pincode:</strong> {formData["2"]?.permanentPincode}
                  </div>
                  <div>
                    <strong>Country:</strong> {formData["2"]?.permanentCountry}
                  </div>
                  <div>
                    <strong>Bank:</strong> {primaryBank?.bankName}
                  </div>
                  <div>
                    <strong>Account Type:</strong> {primaryBank?.accountType}
                  </div>
                  <div>
                    <strong>Account Number:</strong>{" "}
                    {primaryBank?.bankAccountNumber}
                  </div>
                  <div>
                    <strong>IFSC Code:</strong> {primaryBank?.ifscCode}
                  </div>
                  <div>
                    <strong>Depository:</strong> {primaryDemat?.depository}
                  </div>
                  <div>
                    <strong>DP ID:</strong> {primaryDemat?.dpID}
                  </div>
                  <div>
                    <strong>Client ID:</strong> {primaryDemat?.clientID}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed footer with action buttons */}
      <div className="sticky bottom-0 bg-white py-4 px-4 no-print border-t">
        <div className="max-w-4xl mx-auto flex gap-4">
          <Button onClick={handleBack} variant="outline" className="w-1/3">
            Back
          </Button>
          <Button onClick={handleSubmit} className="w-2/3 ">
            E-Sign and Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ESignForm;
