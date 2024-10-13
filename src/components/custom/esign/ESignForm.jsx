import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";

const ESignForm = ({ handleStepChange, step, steps }) => {
  const [userData, setUserData] = useState(null);
  const [mergedPdfUrl, setMergedPdfUrl] = useState(null);

  useEffect(() => {
    // Load user data from localStorage
    const savedData = localStorage.getItem("ekycFormData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setUserData(parsedData);
      mergePDFs(parsedData);
    }
  }, []);

  const fetchFile = async (path) => {
    try {
      const response = await fetch(path);
      return await response.arrayBuffer();
    } catch (error) {
      console.error(`Error fetching file: ${path}`, error);
      return null;
    }
  };

  const mergePDFs = async (data) => {
    const pdfDoc = await PDFDocument.create();

    const documentsToBeMerged = [
      data[4]?.bankDetails?.find((bank) => bank.primary)?.uploadCancelledCheque,
      data[5]?.dematDetails?.find((demat) => demat.primary)?.clientMasterCopy,
      data[6]?.image,
    ].filter(Boolean);

    for (const doc of documentsToBeMerged) {
      if (doc && doc.path) {
        const docBytes = await fetchFile(doc.path);
        if (docBytes) {
          try {
            const loadedPdf = await PDFDocument.load(docBytes);
            const copiedPages = await pdfDoc.copyPages(
              loadedPdf,
              loadedPdf.getPageIndices()
            );
            copiedPages.forEach((page) => pdfDoc.addPage(page));
          } catch (error) {
            console.error(`Error loading PDF: ${doc.path}`, error);
            // If it's not a PDF, assume it's an image and embed it
            const page = pdfDoc.addPage();
            const image = await pdfDoc.embedPng(docBytes);
            const { width, height } = image.scale(0.5);
            page.drawImage(image, {
              x: page.getWidth() / 2 - width / 2,
              y: page.getHeight() / 2 - height / 2,
              width,
              height,
            });
          }
        }
      }
    }

    const pdfBytes = await pdfDoc.save();
    const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });
    setMergedPdfUrl(URL.createObjectURL(pdfBlob));
  };

  const handleDownload = () => {
    if (mergedPdfUrl) {
      saveAs(mergedPdfUrl, "merged_documents.pdf");
    }
  };

  const handleSubmit = () => {
    // Implement e-sign logic here
    console.log("E-sign submitted");
    handleStepChange((step || 0) + 1);
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
              <strong>Bank Account:</strong>{" "}
              {userData[4]?.bankDetails?.find((bank) => bank.primary)
                ?.bankAccountNumber || "Not available"}
            </p>
            <p>
              <strong>Demat Account:</strong>{" "}
              {userData[5]?.dematDetails?.find((demat) => demat.primary)
                ?.clientID || "Not available"}
            </p>
            <p>
              <strong>In-Person Verification:</strong>{" "}
              {userData[6]?.location ? "Completed" : "Not completed"}
            </p>
          </div>
        )}

        {/* // TODO: Should create a PDF in which all the files/document of the user that have been uploaded should be merged in one PDF and make it availabe for user to download */}
        {mergedPdfUrl && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Merged Documents</h3>
            <iframe
              src={mergedPdfUrl}
              width="100%"
              height="500px"
              className="mb-4"
            />
            <Button onClick={handleDownload} className="w-full mb-4">
              Download Merged PDF
            </Button>
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
