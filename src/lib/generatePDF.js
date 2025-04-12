  export const generateCoverPage = async (pdfDoc, data) => {
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
    export const addDocumentWithTitle = async (pdfDoc, title, imageUrl) => {
      if (!imageUrl) return;
      
      try {
        const imageBytes = await fetchFile(imageUrl);
        if (!imageBytes) {
          throw new Error('Failed to fetch image');
        }
        
        // Create the page first
        const page = pdfDoc.addPage([595, 842]); // A4 size
        const { width: pageWidth, height: pageHeight } = page.getSize();
        const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        
        // Add title
        page.drawText(title, {
          x: 50,
          y: pageHeight - 50,
          size: 16,
          font: font,
        });
    
        // Handle different image formats
        let embeddedImage = null;
        
        try {
          // Try PNG first
          embeddedImage = await pdfDoc.embedPng(imageBytes);
        } catch (pngError) {
          try {
            // If PNG fails, try JPG
            embeddedImage = await pdfDoc.embedJpg(imageBytes);
          } catch (jpgError) {
            console.error('Failed to embed image as PNG or JPG:', pngError, jpgError);
            throw new Error('Unsupported image format');
          }
        }
    
        if (embeddedImage) {
          // Calculate dimensions to fit within page
          const maxWidth = pageWidth - 100; // 50px margin on each side
          const maxHeight = pageHeight - 200; // Space for title and margins
          
          const imgWidth = embeddedImage.width;
          const imgHeight = embeddedImage.height;
          
          // Calculate scale to fit within bounds
          const scale = Math.min(
            maxWidth / imgWidth,
            maxHeight / imgHeight,
            1 // Don't enlarge images
          );
          
          const finalWidth = imgWidth * scale;
          const finalHeight = imgHeight * scale;
          
          // Center the image
          const x = (pageWidth - finalWidth) / 2;
          const y = pageHeight - 100 - finalHeight; // 100px from top for title
          
          page.drawImage(embeddedImage, {
            x,
            y,
            width: finalWidth,
            height: finalHeight,
          });
        }
      } catch (error) {
        console.error(`Error adding document with title ${title}:`, error);
        
        // Create an error page
        const page = pdfDoc.addPage([595, 842]);
        const { height: pageHeight } = page.getSize();
        const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
        
        page.drawText(title, {
          x: 50,
          y: pageHeight - 50,
          size: 16,
          font: regularFont,
        });
        
        page.drawText(`Error: Could not load image - ${error.message}`, {
          x: 50,
          y: pageHeight - 100,
          size: 12,
          font: regularFont,
          color: rgb(1, 0, 0), // Red color for error
        });
      }
    };
    

    export const generatePDF = async (userData) => {
      try {
        const pdfDoc = await PDFDocument.create();
        
        // Generate the cover page with user data
        await generateCoverPage(pdfDoc, userData);
    
        // Add bank documents
        if (userData["4"]?.bankDetails) {
          for (const bank of userData["4"].bankDetails) {
            if (bank.uploadCancelledCheque) {
              await addDocumentWithTitle(
                pdfDoc, 
                `Bank Account - ${bank.bankName} Cancelled Cheque`, 
                bank.uploadCancelledCheque
              );
            }
          }
        }
    
        // Add demat documents
        if (userData["5"]?.dematDetails) {
          for (const demat of userData["5"].dematDetails) {
            if (demat.clientMasterCopy) {
              await addDocumentWithTitle(
                pdfDoc, 
                `Demat Account - ${demat.depository} Client Master Copy`, 
                demat.clientMasterCopy
              );
            }
          }
        }
    
        const pdfBytes = await pdfDoc.save();
        const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });
        return URL.createObjectURL(pdfBlob);
      } catch (error) {
        console.error("Error generating PDF:", error);
        throw error;
      }
    };

      const fetchFile = async (url) => {
        try {
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Accept': 'image/*',
            },
          });
          
          if (!response.ok) {
            throw new Error(`Failed to fetch file: ${response.status}`);
          }
          
          return await response.arrayBuffer();
        } catch (error) {
          console.error(`Error fetching file: ${url}`, error);
          return null;
        }
      };  