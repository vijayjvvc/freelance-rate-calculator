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
  dailyHours: {
    min: number;
    max: number;
  };
  benefits: string[]; // Array of benefit keys
  unbenefits: string[]; // Array of unbenefit keys
};

export type ReferralCodes = {
  [key: string]: number;
};

export type Country = {
  label: string;
  currency: string;
  currencySymbol: string;
  rates: number[];
}

export type Countries = {
  [key: string]: Country;
}
