import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { saveAs } from "file-saver";
import { generatePDF } from "@/lib/generatePDF";

const ESignForm = ({ handleStepChange, step, steps }) => {
  const [userData, setUserData] = useState(null);
  const [mergedPdfUrl, setMergedPdfUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const savedData = localStorage.getItem("ekycFormData");
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          setUserData(parsedData);
          const pdfUrl = await generatePDF(parsedData);
          setMergedPdfUrl(pdfUrl);
        }
      } catch (error) {
        console.error("Error:", error);
        setError("Failed to load user data");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    return () => {
      if (mergedPdfUrl) {
        URL.revokeObjectURL(mergedPdfUrl);
      }
    };
  }, []);

  const reloadPdf = async () => {
    if (userData) {
      setIsLoading(true);
      setError(null);
      try {
        const pdfUrl = await generatePDF(userData);
        setMergedPdfUrl(pdfUrl);
      } catch (error) {
        setError("Failed to generate PDF. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen pt-14">
      <div className="w-full max-w-2xl p-8 bg-white rounded-lg shadow-lg border border-gray-200">
        <h2 className="text-3xl font-semibold mb-8 text-center text-gray-800">
          E-Sign Documents
        </h2>

        {userData && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">User Information</h3>
            <p>
              <strong>PAN:</strong> {userData["1"]?.panNumber || "Not available"}
            </p>
            <p>
              <strong>Mobile:</strong> {userData["1"]?.mobileNumber || "Not available"}
            </p>
            <p>
              <strong>Bank Account:</strong>{" "}
              {userData["4"]?.bankDetails?.find((bank) => bank.primary)
                ?.bankAccountNumber || "Not available"}
            </p>
            <p>
              <strong>Demat Account:</strong>{" "}
              {userData["5"]?.dematDetails?.find((demat) => demat.primary)
                ?.clientID || "Not available"}
            </p>
            <p>
              <strong>In-Person Verification:</strong>{" "}
              {userData["6"]?.location ? "Completed" : "Not completed"}
            </p>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center p-10">
            <p>Generating PDF...</p>
          </div>
        ) : error ? (
          <div className="mb-8 text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={reloadPdf} className="w-full">
              Try Again
            </Button>
          </div>
        ) : mergedPdfUrl ? (
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Your KYC Documents</h3>
            <div className="border rounded mb-4 overflow-hidden" style={{ height: "500px" }}>
              <object
                data={mergedPdfUrl}
                type="application/pdf"
                width="100%"
                height="100%"
                className="block"
              >
                <embed src={mergedPdfUrl} type="application/pdf" width="100%" height="100%" />
                <p className="p-4 text-center">
                  Your browser doesn't support PDF embedding. 
                  <a href={mergedPdfUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 ml-2">
                    Click here to view the PDF
                  </a>
                </p>
              </object>
            </div>
            <Button onClick={handleDownload} className="w-full mb-4">
              Download PDF
            </Button>
          </div>
        ) : (
          <div className="flex justify-center items-center p-10">
            <p>No documents available</p>
          </div>
        )}

        <Button onClick={handleSubmit} className="w-full">
          E-Sign and Submit
        </Button>
      </div>
    </div>
  );
};

export default ESignForm;