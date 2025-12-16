export type Benefit = {
  text: string;
  description?: string;
  included: boolean;
  premium?: boolean;
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
  benefits: string[]; // Array of benefit keys
};

export type ReferralCodes = {
  [key: string]: number;
};
