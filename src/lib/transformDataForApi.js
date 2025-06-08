/**
 * Transforms localStorage formatted data to API format
 * @param {Object} localStorageData - The data from localStorage
 * @return {Object} Formatted data for API request
 */
function convertAnnualIncome(income) {
    const incomeMap = {
        "Less than 5 LPA": 250000,
        "1-5 LPA": 300000,
        "5-10 LPA": 750000,
        "10-25 LPA": 1750000,
        "15-25 LPA": 2000000,
      "Above 25 LPA": 2500000
    };
    return incomeMap[income] || 0;
  }

export function transformDataForAPI(localStorageData, name) {
    const apiData = {
      name: name,
      panDetails: {
        panNumber: localStorageData[1]?.panNumber || "",
        mobileNo: localStorageData[1]?.mobileNumber || "",
        dateOfBirth: localStorageData[1]?.dateOfBirth || "",
        email: localStorageData[1]?.emailId || "",
        iAm: localStorageData[1]?.whoAreU || ""
      },
      profileDetails: {
        gender: localStorageData[3]?.gender || "",
        placeOfBirth: localStorageData[3]?.placeOfBirth || "",
        occupation: localStorageData[3]?.occupation || "",
        annualIncome: convertAnnualIncome(localStorageData[3]?.annualIncome),
        citizenship: localStorageData[3]?.citizenship || false,
        informationConfirmation: localStorageData[3]?.informationConfirmation || false
      },
      addressDetails: {
        permanentAddress: localStorageData[2]?.permanentAddress || "",
        landmark: "", // Not in your localStorage data but required in API
        permanentCity: localStorageData[2]?.permanentCity || "",
        permanentPincode: localStorageData[2]?.permanentPincode || "",
        permanentState: localStorageData[2]?.permanentState || "",
        permanentCountry: localStorageData[2]?.permanentCountry || ""
      },
      bankDetails: localStorageData[4]?.bankDetails || [],
      dematDetails: localStorageData[5]?.dematDetails?.map(demat => {
        return {
          ...demat,
        };
      }) || []
    };
  
    return apiData;
  }
