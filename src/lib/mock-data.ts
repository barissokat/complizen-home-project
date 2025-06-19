/**
 * Mock FDA Device Data
 *
 * Realistic mock data for FDA 510(k) medical devices
 * Includes logical predicate relationships and device hierarchy
 * Based on real FDA device categories and manufacturers
 */

import type { FDADevice } from "@/types/fda";

/**
 * Mock FDA Device Dataset
 *
 * 30 devices across multiple medical categories with realistic predicate chains
 * Structure: Root devices → 2nd generation → 3rd generation → 4th generation
 */
export const mockDevices: FDADevice[] = [
  // ================================
  // ROOT DEVICES (No predicates)
  // ================================

  {
    kNumber: "K861712",
    deviceName: "CardioFlow Balloon Catheter System",
    manufacturer: "Boston Scientific Corporation",
    clearanceDate: "1986-08-15",
    productClass: "II",
    productCode: "DTK",
    predicateDevices: [],
    intendedUse:
      "Percutaneous transluminal coronary angioplasty for treatment of coronary artery disease",
    panelType: "Cardiovascular",
    regulationNumber: "870.5200",
  },

  {
    kNumber: "K851234",
    deviceName: "OrthoMax Hip Prosthesis",
    manufacturer: "Zimmer Biomet Holdings Inc.",
    clearanceDate: "1985-06-20",
    productClass: "II",
    productCode: "HWC",
    predicateDevices: [],
    intendedUse:
      "Total hip replacement for patients with severe hip joint disease",
    panelType: "Orthopedic",
    regulationNumber: "888.3300",
  },

  {
    kNumber: "K843567",
    deviceName: "NeuroStim Deep Brain Stimulator",
    manufacturer: "Medtronic Inc.",
    clearanceDate: "1984-11-10",
    productClass: "III",
    productCode: "GZF",
    predicateDevices: [],
    intendedUse:
      "Deep brain stimulation for treatment of Parkinson's disease tremor",
    panelType: "Neurology",
    regulationNumber: "882.5800",
  },

  {
    kNumber: "K871445",
    deviceName: "OptiView Contact Lens",
    manufacturer: "Johnson & Johnson Vision Care",
    clearanceDate: "1987-03-25",
    productClass: "II",
    productCode: "MHW",
    predicateDevices: [],
    intendedUse: "Vision correction for myopia and hyperopia",
    panelType: "Ophthalmic",
    regulationNumber: "886.5916",
  },

  {
    kNumber: "K882234",
    deviceName: "UltraSound Diagnostic System",
    manufacturer: "GE HealthCare Technologies Inc.",
    clearanceDate: "1988-09-12",
    productClass: "II",
    productCode: "IYO",
    predicateDevices: [],
    intendedUse: "Real-time ultrasonic imaging for diagnostic purposes",
    panelType: "Radiology",
    regulationNumber: "892.1550",
  },

  {
    kNumber: "K863445",
    deviceName: "SurgiClamp Hemostatic Device",
    manufacturer: "Ethicon Inc.",
    clearanceDate: "1986-12-08",
    productClass: "I",
    productCode: "GAG",
    predicateDevices: [],
    intendedUse: "Control of bleeding during surgical procedures",
    panelType: "General Surgery",
    regulationNumber: "878.4400",
  },

  // ================================
  // 2ND GENERATION (Based on root devices)
  // ================================

  {
    kNumber: "K921156",
    deviceName: "CardioFlow Plus Balloon Catheter",
    manufacturer: "Boston Scientific Corporation",
    clearanceDate: "1992-04-18",
    productClass: "II",
    productCode: "DTK",
    predicateDevices: ["K861712"],
    intendedUse:
      "Enhanced percutaneous transluminal coronary angioplasty with improved balloon technology",
    panelType: "Cardiovascular",
    regulationNumber: "870.5200",
  },

  {
    kNumber: "K933567",
    deviceName: "OrthoMax Pro Hip System",
    manufacturer: "Zimmer Biomet Holdings Inc.",
    clearanceDate: "1993-07-22",
    productClass: "II",
    productCode: "HWC",
    predicateDevices: ["K851234"],
    intendedUse:
      "Advanced total hip replacement with improved bearing surfaces",
    panelType: "Orthopedic",
    regulationNumber: "888.3300",
  },

  {
    kNumber: "K914423",
    deviceName: "NeuroStim Advanced DBS System",
    manufacturer: "Medtronic Inc.",
    clearanceDate: "1991-10-15",
    productClass: "III",
    productCode: "GZF",
    predicateDevices: ["K843567"],
    intendedUse: "Advanced deep brain stimulation with programmable parameters",
    panelType: "Neurology",
    regulationNumber: "882.5800",
  },

  {
    kNumber: "K945678",
    deviceName: "OptiView Toric Contact Lens",
    manufacturer: "Johnson & Johnson Vision Care",
    clearanceDate: "1994-05-30",
    productClass: "II",
    productCode: "MHW",
    predicateDevices: ["K871445"],
    intendedUse: "Vision correction for astigmatism with toric design",
    panelType: "Ophthalmic",
    regulationNumber: "886.5916",
  },

  {
    kNumber: "K952234",
    deviceName: "UltraSound Pro Imaging System",
    manufacturer: "GE HealthCare Technologies Inc.",
    clearanceDate: "1995-08-14",
    productClass: "II",
    productCode: "IYO",
    predicateDevices: ["K882234"],
    intendedUse: "Enhanced ultrasonic imaging with digital processing",
    panelType: "Radiology",
    regulationNumber: "892.1550",
  },

  {
    kNumber: "K934456",
    deviceName: "SurgiClamp Advanced Hemostatic System",
    manufacturer: "Ethicon Inc.",
    clearanceDate: "1993-11-20",
    productClass: "II",
    productCode: "GAG",
    predicateDevices: ["K863445"],
    intendedUse: "Advanced hemostatic control with bipolar technology",
    panelType: "General Surgery",
    regulationNumber: "878.4400",
  },

  // ================================
  // 3RD GENERATION (Multiple predicates)
  // ================================

  {
    kNumber: "K021234",
    deviceName: "CardioFlow Elite Drug-Eluting Stent",
    manufacturer: "Abbott Laboratories",
    clearanceDate: "2002-03-12",
    productClass: "III",
    productCode: "NIR",
    predicateDevices: ["K921156", "K861712"],
    intendedUse: "Drug-eluting coronary stent for prevention of restenosis",
    panelType: "Cardiovascular",
    regulationNumber: "870.5300",
  },

  {
    kNumber: "K015567",
    deviceName: "OrthoMax Ceramic Hip System",
    manufacturer: "DePuy Synthes",
    clearanceDate: "2001-09-25",
    productClass: "II",
    productCode: "HWC",
    predicateDevices: ["K933567", "K851234"],
    intendedUse: "Ceramic-on-ceramic hip replacement for younger patients",
    panelType: "Orthopedic",
    regulationNumber: "888.3300",
  },

  {
    kNumber: "K033445",
    deviceName: "NeuroStim MRI-Compatible DBS",
    manufacturer: "Abbott Neuromodulation",
    clearanceDate: "2003-12-08",
    productClass: "III",
    productCode: "GZF",
    predicateDevices: ["K914423"],
    intendedUse: "MRI-compatible deep brain stimulation system",
    panelType: "Neurology",
    regulationNumber: "882.5800",
  },

  {
    kNumber: "K041156",
    deviceName: "OptiView Daily Disposable Lens",
    manufacturer: "Alcon Inc.",
    clearanceDate: "2004-06-15",
    productClass: "II",
    productCode: "MHW",
    predicateDevices: ["K945678", "K871445"],
    intendedUse: "Daily disposable contact lens for convenience and hygiene",
    panelType: "Ophthalmic",
    regulationNumber: "886.5916",
  },

  {
    kNumber: "K053322",
    deviceName: "UltraSound 4D Imaging System",
    manufacturer: "Philips Healthcare",
    clearanceDate: "2005-04-20",
    productClass: "II",
    productCode: "IYO",
    predicateDevices: ["K952234"],
    intendedUse:
      "Four-dimensional ultrasonic imaging for obstetric applications",
    panelType: "Radiology",
    regulationNumber: "892.1550",
  },

  // ================================
  // 4TH GENERATION (Latest innovations)
  // ================================

  {
    kNumber: "K123456",
    deviceName: "CardioFlow Smart Stent System",
    manufacturer: "Boston Scientific Corporation",
    clearanceDate: "2012-08-30",
    productClass: "III",
    productCode: "NIR",
    predicateDevices: ["K021234", "K921156"],
    intendedUse: "Smart drug-eluting stent with bioresorbable polymer",
    panelType: "Cardiovascular",
    regulationNumber: "870.5300",
  },

  {
    kNumber: "K134567",
    deviceName: "OrthoMax Smart Hip Implant",
    manufacturer: "Stryker Corporation",
    clearanceDate: "2013-11-18",
    productClass: "II",
    productCode: "HWC",
    predicateDevices: ["K015567", "K933567"],
    intendedUse: "Smart hip implant with wear-resistant coating",
    panelType: "Orthopedic",
    regulationNumber: "888.3300",
  },

  {
    kNumber: "K145678",
    deviceName: "NeuroStim Closed-Loop DBS",
    manufacturer: "Medtronic Inc.",
    clearanceDate: "2014-07-22",
    productClass: "III",
    productCode: "GZF",
    predicateDevices: ["K033445", "K914423"],
    intendedUse: "Closed-loop deep brain stimulation with adaptive algorithms",
    panelType: "Neurology",
    regulationNumber: "882.5800",
  },

  {
    kNumber: "K156789",
    deviceName: "OptiView Smart Contact Lens",
    manufacturer: "Google LLC",
    clearanceDate: "2015-12-10",
    productClass: "II",
    productCode: "MHW",
    predicateDevices: ["K041156", "K945678"],
    intendedUse: "Smart contact lens with glucose monitoring capability",
    panelType: "Ophthalmic",
    regulationNumber: "886.5916",
  },

  // ================================
  // ADDITIONAL DEVICES (Different categories)
  // ================================

  {
    kNumber: "K172234",
    deviceName: "HeartWatch Cardiac Monitor",
    manufacturer: "Apple Inc.",
    clearanceDate: "2017-09-12",
    productClass: "II",
    productCode: "MNI",
    predicateDevices: [],
    intendedUse:
      "Continuous cardiac rhythm monitoring for atrial fibrillation detection",
    panelType: "Cardiovascular",
    regulationNumber: "870.2300",
  },

  {
    kNumber: "K183445",
    deviceName: "SkinSense Dermatology Scanner",
    manufacturer: "3M Company",
    clearanceDate: "2018-05-25",
    productClass: "II",
    productCode: "ONA",
    predicateDevices: [],
    intendedUse: "Non-invasive skin lesion analysis and documentation",
    panelType: "Dermatology",
    regulationNumber: "892.2050",
  },

  {
    kNumber: "K191156",
    deviceName: "BreatheEasy CPAP System",
    manufacturer: "ResMed Inc.",
    clearanceDate: "2019-03-15",
    productClass: "II",
    productCode: "BZH",
    predicateDevices: [],
    intendedUse: "Continuous positive airway pressure therapy for sleep apnea",
    panelType: "Anesthesiology",
    regulationNumber: "868.5905",
  },

  {
    kNumber: "K201234",
    deviceName: "BreatheEasy Auto CPAP",
    manufacturer: "ResMed Inc.",
    clearanceDate: "2020-07-20",
    productClass: "II",
    productCode: "BZH",
    predicateDevices: ["K191156"],
    intendedUse: "Auto-adjusting CPAP therapy with smart pressure algorithms",
    panelType: "Anesthesiology",
    regulationNumber: "868.5905",
  },

  {
    kNumber: "K212345",
    deviceName: "HeartWatch Pro Cardiac Monitor",
    manufacturer: "Apple Inc.",
    clearanceDate: "2021-10-08",
    productClass: "II",
    productCode: "MNI",
    predicateDevices: ["K172234"],
    intendedUse: "Advanced cardiac monitoring with ECG and blood oxygen",
    panelType: "Cardiovascular",
    regulationNumber: "870.2300",
  },

  {
    kNumber: "K223456",
    deviceName: "SkinSense AI Dermatology Assistant",
    manufacturer: "3M Company",
    clearanceDate: "2022-04-14",
    productClass: "II",
    productCode: "ONA",
    predicateDevices: ["K183445"],
    intendedUse:
      "AI-powered skin lesion analysis with diagnostic recommendations",
    panelType: "Dermatology",
    regulationNumber: "892.2050",
  },

  {
    kNumber: "K234567",
    deviceName: "DiabetesGuard Continuous Monitor",
    manufacturer: "Dexcom Inc.",
    clearanceDate: "2023-01-30",
    productClass: "II",
    productCode: "NBW",
    predicateDevices: [],
    intendedUse: "Continuous glucose monitoring for diabetes management",
    panelType: "Clinical Chemistry",
    regulationNumber: "862.1355",
  },

  {
    kNumber: "K245678",
    deviceName: "DiabetesGuard Pro CGM System",
    manufacturer: "Dexcom Inc.",
    clearanceDate: "2024-06-18",
    productClass: "II",
    productCode: "NBW",
    predicateDevices: ["K234567"],
    intendedUse:
      "Advanced continuous glucose monitoring with smartphone integration",
    panelType: "Clinical Chemistry",
    regulationNumber: "862.1355",
  },

  {
    kNumber: "K231189",
    deviceName: "RoboSurg Laparoscopic System",
    manufacturer: "Intuitive Surgical Inc.",
    clearanceDate: "2023-08-22",
    productClass: "II",
    productCode: "IQP",
    predicateDevices: [],
    intendedUse:
      "Robotic-assisted laparoscopic surgery for minimally invasive procedures",
    panelType: "General Surgery",
    regulationNumber: "878.4800",
  },

  {
    kNumber: "K241190",
    deviceName: "RoboSurg AI Laparoscopic Platform",
    manufacturer: "Intuitive Surgical Inc.",
    clearanceDate: "2024-11-15",
    productClass: "II",
    productCode: "IQP",
    predicateDevices: ["K231189", "K934456"],
    intendedUse: "AI-enhanced robotic surgery with automated guidance systems",
    panelType: "General Surgery",
    regulationNumber: "878.4800",
  },
];

/**
 * Get devices by product class
 */
export const getDevicesByClass = (productClass: "I" | "II" | "III") => {
  return mockDevices.filter((device) => device.productClass === productClass);
};

/**
 * Get root devices (no predicates)
 */
export const getRootDevices = () => {
  return mockDevices.filter((device) => device.predicateDevices.length === 0);
};

/**
 * Get devices that reference a specific device as predicate
 */
export const getChildDevices = (kNumber: string) => {
  return mockDevices.filter((device) =>
    device.predicateDevices.includes(kNumber),
  );
};

/**
 * Calculate hierarchy depth for a device
 */
export const getDeviceDepth = (device: FDADevice): number => {
  if (device.predicateDevices.length === 0) return 0;

  const predicateDepths = device.predicateDevices.map((predicateKNumber) => {
    const predicateDevice = mockDevices.find(
      (d) => d.kNumber === predicateKNumber,
    );
    return predicateDevice ? getDeviceDepth(predicateDevice) : 0;
  });

  return Math.max(...predicateDepths) + 1;
};

/**
 * Get mock data statistics
 */
export const getMockDataStats = () => {
  const totalDevices = mockDevices.length;
  const rootDevices = getRootDevices().length;
  const classI = getDevicesByClass("I").length;
  const classII = getDevicesByClass("II").length;
  const classIII = getDevicesByClass("III").length;

  const totalPredicates = mockDevices.reduce(
    (sum, device) => sum + device.predicateDevices.length,
    0,
  );

  return {
    totalDevices,
    rootDevices,
    classDistribution: { classI, classII, classIII },
    totalPredicateRelationships: totalPredicates,
    avgPredicatesPerDevice: (totalPredicates / totalDevices).toFixed(2),
    uniqueManufacturers: new Set(mockDevices.map((d) => d.manufacturer)).size,
    dateRange: {
      earliest: "1984-11-10",
      latest: "2024-11-15",
    },
  };
};
