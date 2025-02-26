const sampleCountries = [
  { code: "IN", name: "India" },
  { code: "US", name: "United States" },
];

const sampleStates = {
  IN: [
    { code: "AP", name: "Andhra Pradesh" },
    { code: "MH", name: "Maharashtra" },
  ],
  US: [
    { code: "CA", name: "California" },
    { code: "NY", name: "New York" },
  ],
};

const sampleDistricts = {
  AP: ["Anantapur", "Chittoor", "Guntur"],
  MH: ["Mumbai", "Pune", "Nagpur"],
  CA: ["Los Angeles", "San Francisco"],
  NY: ["New York City", "Buffalo"],
};

const sampleCities = {
  Anantapur: ["Anantapur City"],
  Mumbai: ["Mumbai City"],
  Pune: ["Pune City"],
  "Los Angeles": ["Los Angeles City"],
  "New York City": ["New York City"],
};

export { sampleCities, sampleDistricts, sampleCountries, sampleStates };
