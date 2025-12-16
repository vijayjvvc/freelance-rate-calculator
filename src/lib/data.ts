export type Benefit = {
  text: string;
  included: boolean;
  description?: string;
};

export type Tier = {
  id: string;
  label: string;
  minDays: number;
  maxDays: number;
  hourlyRate: number; // in INR
  dailyHours: {
    min: number;
    max: number;
  };
  benefits: Benefit[];
};

const allBenefits = {
  RAPID_PROTOTYPING: {
    text: "Rapid Prototyping",
    description: "Quick turnaround on initial concepts and interactive prototypes.",
  },
  AGILE_SPRINTS: {
    text: "Agile Development Sprints",
    description: "The project will be developed in short, iterative cycles for faster feedback.",
  },
  UI_UPDATES_LIMITED: { 
    text: "Limited UI/Design Updates", 
    description: "Minor tweaks and updates to the user interface are included.",
  },
  UI_UPDATES_LARGE: { 
    text: "Large UI/Design Changes",
    description: "Significant changes and redesigns of components are allowed.",
  },
  WEEKEND_MEETINGS: {
    text: "Weekend Meeting Availability",
    description: "Meetings on Saturday/Sunday can be scheduled for urgent matters.",
  },
  SHORT_NOTICE_MEETINGS: {
    text: "Short-Notice Meetings",
    description: "Meetings can be confirmed with more flexibility and less advance notice.",
  },
  PRIORITY_SUPPORT: {
    text: "Priority Support",
    description: "Your requests and queries will be handled with higher priority.",
  },
  DETAILED_REPORTS: {
    text: "Detailed Progress Reports",
    description: "You'll receive detailed weekly reports on progress and milestones.",
  },
};

const getBenefits = (includedBenefits: (keyof typeof allBenefits)[]) => {
  return Object.entries(allBenefits).map(([key, value]) => ({
    ...value,
    included: includedBenefits.includes(key as keyof typeof allBenefits),
  }));
};

export const tiers: Tier[] = [
  {
    id: "tier-1",
    label: "Under 1 Week",
    minDays: 1,
    maxDays: 6,
    hourlyRate: 1500,
    dailyHours: { min: 5, max: 8 },
    benefits: getBenefits(["RAPID_PROTOTYPING", "AGILE_SPRINTS"]),
  },
  {
    id: "tier-2",
    label: "1 to 2 Weeks",
    minDays: 7,
    maxDays: 14,
    hourlyRate: 1200,
    dailyHours: { min: 5, max: 8 },
    benefits: getBenefits(["WEEKEND_MEETINGS"]),
  },
  {
    id: "tier-3",
    label: "2 Weeks to 1 Month",
    minDays: 15,
    maxDays: 30,
    hourlyRate: 1000,
    dailyHours: { min: 6, max: 8 },
    benefits: getBenefits(["WEEKEND_MEETINGS", "UI_UPDATES_LIMITED"]),
  },
  {
    id: "tier-4",
    label: "1 to 4 Months",
    minDays: 31,
    maxDays: 120,
    hourlyRate: 800,
    dailyHours: { min: 6, max: 8 },
    benefits: getBenefits(["WEEKEND_MEETINGS", "UI_UPDATES_LARGE", "SHORT_NOTICE_MEETINGS"]),
  },
  {
    id: "tier-5",
    label: "4 to 6 Months",
    minDays: 121,
    maxDays: 180,
    hourlyRate: 700,
    dailyHours: { min: 6, max: 8 },
    benefits: getBenefits(["WEEKEND_MEETINGS", "UI_UPDATES_LARGE", "SHORT_NOTICE_MEETINGS", "PRIORITY_SUPPORT"]),
  },
  {
    id: "tier-6",
    label: "6 to 12 Months",
    minDays: 181,
    maxDays: 365,
    hourlyRate: 600,
    dailyHours: { min: 6, max: 8 },
    benefits: getBenefits(["WEEKEND_MEETINGS", "UI_UPDATES_LARGE", "SHORT_NOTICE_MEETINGS", "PRIORITY_SUPPORT", "DETAILED_REPORTS"]),
  },
];
