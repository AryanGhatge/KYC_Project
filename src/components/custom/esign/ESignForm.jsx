import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { saveAs } from "file-saver";

const ESignForm = ({ handleStepChange, step, steps }) => {
  const [userData, setUserData] = useState(null);
  const [mergedPdfUrl, setMergedPdfUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load user data from localStorage
    const savedData = localStorage.getItem("ekycFormData");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setUserData(parsedData);
        generatePDF(parsedData);
      } catch (error) {
        console.error("Error parsing user data:", error);
        setError("Failed to load user data");
      }
    }

    // Clean up URL object when component unmounts
    return () => {
      if (mergedPdfUrl) {
        URL.revokeObjectURL(mergedPdfUrl);
      }
    };
  }, []);

  const fetchFile = async (path) => {
    try {
      // For local images, we need to handle them differently than external URLs
      if (path.startsWith('http')) {
        const response = await fetch(path);
        if (!response.ok) {
          throw new Error(`Failed to fetch file: ${response.status}`);
        }
        return await response.arrayBuffer();
      } else {
        // For relative paths or file names, we need to construct the URL properly
        // This assumes the images are in the public folder
        const fullPath = path.startsWith('/') ? path : `/${path}`;
        const response = await fetch(fullPath);
        if (!response.ok) {
          throw new Error(`Failed to fetch file: ${response.status}`);
        }
        return await response.arrayBuffer();
      }
    } catch (error) {
      console.error(`Error fetching file: ${path}`, error);
      return null;
    }
  };

  const generateCoverPage = async (pdfDoc, data) => {
    // Load a standard font
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    const page = pdfDoc.addPage([595, 842]); // A4 size
    const { width, height } = page.getSize();
    
    // Header with title
    page.drawText("KYC Registration Details", {
      x: 50,
      y: height - 50,
      size: 24,
      font: boldFont,
      color: rgb(0, 0, 0),
    });

    // Date of generation
    page.drawText(`Generated on: ${new Date().toLocaleDateString()}`, {
      x: 50,
      y: height - 80,
      size: 10,
      font: font,
      color: rgb(0.5, 0.5, 0.5),
    });

    // Section: Personal Information
    page.drawText("Personal Information", {
      x: 50,
      y: height - 120,
      size: 16,
      font: boldFont,
      color: rgb(0, 0, 0),
    });

    const personalInfo = data["1"];
    let yPos = 150;
    
    page.drawText(`PAN: ${personalInfo.panNumber || "N/A"}`, {
      x: 50, y: height - yPos, size: 12, font
    });
    yPos += 20;
    
    page.drawText(`Mobile: ${personalInfo.mobileNumber || "N/A"}`, {
      x: 50, y: height - yPos, size: 12, font
    });
    yPos += 20;
    
    page.drawText(`Email: ${personalInfo.emailId || "N/A"}`, {
      x: 50, y: height - yPos, size: 12, font
    });
    yPos += 20;
    
    const dob = personalInfo.dateOfBirth ? 
      new Date(personalInfo.dateOfBirth).toLocaleDateString() : "N/A";
    page.drawText(`Date of Birth: ${dob}`, {
      x: 50, y: height - yPos, size: 12, font
    });
    yPos += 20;
    
    page.drawText(`Category: ${personalInfo.whoAreU || "N/A"}`, {
      x: 50, y: height - yPos, size: 12, font
    });
    yPos += 40;

    // Section: Address Details
    page.drawText("Address Details", {
      x: 50, y: height - yPos, size: 16, font: boldFont
    });
    yPos += 30;

    const addressInfo = data["2"];
    page.drawText(`Address: ${addressInfo.permanentAddress || "N/A"}`, {
      x: 50, y: height - yPos, size: 12, font
    });
    yPos += 20;
    
    if (addressInfo.landmark) {
      page.drawText(`Landmark: ${addressInfo.landmark}`, {
        x: 50, y: height - yPos, size: 12, font
      });
      yPos += 20;
    }
    
    const cityStateZip = `${addressInfo.permanentCity || ""}, ${addressInfo.permanentState || ""} - ${addressInfo.permanentPincode || ""}`;
    page.drawText(`City/State/PIN: ${cityStateZip}`, {
      x: 50, y: height - yPos, size: 12, font
    });
    yPos += 20;
    
    page.drawText(`Country: ${addressInfo.permanentCountry || "N/A"}`, {
      x: 50, y: height - yPos, size: 12, font
    });
    yPos += 40;

    // Section: Other Details
    page.drawText("Other Details", {
      x: 50, y: height - yPos, size: 16, font: boldFont
    });
    yPos += 30;

    const otherInfo = data["3"];
    page.drawText(`Gender: ${otherInfo.gender || "N/A"}`, {
      x: 50, y: height - yPos, size: 12, font
    });
    yPos += 20;
    
    page.drawText(`Place of Birth: ${otherInfo.placeOfBirth || "N/A"}`, {
      x: 50, y: height - yPos, size: 12, font
    });
    yPos += 20;
    
    page.drawText(`Occupation: ${otherInfo.occupation || "N/A"}`, {
      x: 50, y: height - yPos, size: 12, font
    });
    yPos += 20;
    
    page.drawText(`Annual Income: ${otherInfo.annualIncome || "N/A"}`, {
      x: 50, y: height - yPos, size: 12, font
    });
    yPos += 40;

    // Section: Bank Details
    page.drawText("Bank Details", {
      x: 50, y: height - yPos, size: 16, font: boldFont
    });
    yPos += 30;

    const bankDetails = data["4"]?.bankDetails?.find(bank => bank.primary) || {};
    page.drawText(`Bank Name: ${bankDetails.bankName || "N/A"}`, {
      x: 50, y: height - yPos, size: 12, font
    });
    yPos += 20;
    
    page.drawText(`Account Type: ${bankDetails.accountType || "N/A"}`, {
      x: 50, y: height - yPos, size: 12, font
    });
    yPos += 20;
    
    page.drawText(`Account Number: ${bankDetails.bankAccountNumber || "N/A"}`, {
      x: 50, y: height - yPos, size: 12, font
    });
    yPos += 20;
    
    page.drawText(`IFSC Code: ${bankDetails.ifscCode || "N/A"}`, {
      x: 50, y: height - yPos, size: 12, font
    });
    yPos += 40;

    // Section: Demat Details
    page.drawText("Demat Details", {
      x: 50, y: height - yPos, size: 16, font: boldFont
    });
    yPos += 30;

    const dematDetails = data["5"]?.dematDetails?.find(demat => demat.primary) || {};
    page.drawText(`Depository: ${dematDetails.depository || "N/A"}`, {
      x: 50, y: height - yPos, size: 12, font
    });
    yPos += 20;
    
    page.drawText(`DP ID: ${dematDetails.dpID || "N/A"}`, {
      x: 50, y: height - yPos, size: 12, font
    });
    yPos += 20;
    
    page.drawText(`Client ID: ${dematDetails.clientID || "N/A"}`, {
      x: 50, y: height - yPos, size: 12, font
    });
    yPos += 40;

    // Location verification
    if (data["6"]?.location) {
      page.drawText("Location Verification", {
        x: 50, y: height - yPos, size: 16, font: boldFont
      });
      yPos += 30;
      
      page.drawText(`GPS Coordinates: ${data["6"].location}`, {
        x: 50, y: height - yPos, size: 12, font
      });
    }

    // Footer
    page.drawText("This is an electronically generated document.", {
      x: width / 2 - 100,
      y: 30,
      size: 10,
      font,
      color: rgb(0.5, 0.5, 0.5),
    });
  };

  // This function adds a document to the PDF with a title
  const addDocumentWithTitle = async (pdfDoc, title, imagePath) => {
    if (!imagePath) return;
    
    try {
      const imageBytes = await fetchFile(imagePath);
      if (!imageBytes) return;
      
      const page = pdfDoc.addPage([595, 842]); // A4 size
      const { width: pageWidth, height: pageHeight } = page.getSize();
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      
      // Add title to the page
      page.drawText(title, {
        x: 50,
        y: pageHeight - 50,
        size: 16,
        font: font,
      });
      
      try {
        // Try as PNG first
        const image = await pdfDoc.embedPng(imageBytes);
        const dimensions = image.scale(0.7); // Scale to 70% to fit nicely
        
        page.drawImage(image, {
          x: (pageWidth - dimensions.width) / 2,
          y: pageHeight - 100 - dimensions.height,
          width: dimensions.width,
          height: dimensions.height,
        });
      } catch (pngError) {
        try {
          // Try as JPEG if PNG fails
          const image = await pdfDoc.embedJpg(imageBytes);
          const dimensions = image.scale(0.7);
          
          page.drawImage(image, {
            x: (pageWidth - dimensions.width) / 2,
            y: pageHeight - 100 - dimensions.height,
            width: dimensions.width,
            height: dimensions.height,
          });
        } catch (jpgError) {
          // If both fail, add error text
          const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
          page.drawText(`Could not load image: ${imagePath.split('/').pop()}`, {
            x: 50,
            y: pageHeight - 100,
            size: 12,
            font: regularFont,
          });
        }
      }
    } catch (error) {
      console.error(`Error adding document with title ${title}:`, error);
    }
  };

  const generatePDF = async (data) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Create a new PDF document
      const pdfDoc = await PDFDocument.create();
      
      // Generate the cover page with user data
      await generateCoverPage(pdfDoc, data);

      // Add bank document if available
      const bankDetails = data["4"]?.bankDetails?.find(bank => bank.primary);
      if (bankDetails?.uploadCancelledCheque?.path) {
        await addDocumentWithTitle(
          pdfDoc, 
          "Bank Account - Cancelled Cheque", 
          bankDetails.uploadCancelledCheque.path
        );
      }

      // Add demat document if available
      const dematDetails = data["5"]?.dematDetails?.find(demat => demat.primary);
      if (dematDetails?.clientMasterCopy?.path) {
        await addDocumentWithTitle(
          pdfDoc, 
          "Demat Account - Client Master Copy", 
          dematDetails.clientMasterCopy.path
        );
      }

      // Add user photo if available
      if (data["6"]?.image?.path) {
        await addDocumentWithTitle(
          pdfDoc, 
          "User Photo", 
          data["6"].image.path
        );
      }

      // Save the PDF document
      const pdfBytes = await pdfDoc.save();
      const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      
      setMergedPdfUrl(pdfUrl);
      setIsLoading(false);
    } catch (error) {
      console.error("Error generating PDF:", error);
      setIsLoading(false);
      setError("Failed to generate PDF. Please try again.");
    }
  };

  const handleDownload = () => {
    if (mergedPdfUrl) {
      saveAs(mergedPdfUrl, `KYC_Documents_${new Date().toISOString().split('T')[0]}.pdf`);
    }
  };

  const handleSubmit = () => {
    // Implement e-sign logic here
    console.log("E-sign submitted");
    handleStepChange((step || 0) + 1);
  };

  const reloadPdf = () => {
    if (userData) {
      setIsLoading(true);
      setError(null);
      generatePDF(userData);
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