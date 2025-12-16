"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { FreelanceRateForm, type FormData } from "@/components/freelance-rate-form";
import { ResultsCard } from "@/components/results-card";
import config from "@/lib/freelance-config.json";
import type { Tier, Benefit, ReferralCodes } from "@/lib/types";

export type CalculationResult = {
  tier: Tier;
  days: number;
  totalHours: number;
  totalCost: number;
  allBenefits: Benefit[];
  unbenefits: Benefit[];
  refId?: string;
  discountApplied?: number;
  dailyHours?: number;
};

const refCodeRegex = /^(JV(?:02|X05|C10))(?:-([1-8]))?$/i;

export default function Home() {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  // In a real library, this data would be fetched from your API
  const { tiers, allBenefits, referralCodes } = config as {
    tiers: Tier[];
    allBenefits: { [key: string]: Omit<Benefit, 'included'> };
    referralCodes: ReferralCodes;
  };

  const getTierBenefits = (tier: Tier): Benefit[] => {
    return tier.benefits.map(key => ({
      ...allBenefits[key],
      included: true
    })).sort((a, b) => {
      if (a.premium && !b.premium) return -1;
      if (!a.premium && b.premium) return 1;
      return a.text.localeCompare(b.text);
    });
  };
  const getTierUnbenefits = (tier: Tier): Benefit[] => {
    return tier.unbenefits.map(key => ({
      ...allBenefits[key],
      included: true
    })).sort((a, b) => {
      if (a.premium && !b.premium) return -1;
      if (!a.premium && b.premium) return 1;
      return a.text.localeCompare(b.text);
    });
  };

  const handleCalculate = (data: FormData) => {
    setIsCalculating(true);
    setResult(null); // Clear previous result
    const selectedTier = tiers.find((t) => t.id === data.tierId);
    if (!selectedTier) return;

    let hourlyRate = selectedTier.hourlyRate;
    let discountApplied: number | undefined = undefined;
    let dailyCustomHours: number | undefined = undefined;
    let finalDays = data.days;

    if (data.refId) {
      const match = data.refId.match(refCodeRegex);
      if (match) {
        const codePart = match[1].toUpperCase() as keyof ReferralCodes;
        const hoursPart = match[2];

        if (referralCodes[codePart]) {
          const discount = referralCodes[codePart];
          discountApplied = discount;
          hourlyRate = hourlyRate * (1 - discount / 100);
        }

        if (hoursPart) {
          dailyCustomHours = parseInt(hoursPart, 10);
          let roundedDays = Math.round(data.days / 30) * 30;
          if (roundedDays === 0) roundedDays = 30;
          finalDays = Math.max(selectedTier.minDays, Math.min(roundedDays, selectedTier.maxDays));
        }
      }
    }

    const dailyHours = dailyCustomHours || (selectedTier.dailyHours.min + selectedTier.dailyHours.max) / 2;
    const totalHours = finalDays * dailyHours;
    const totalCost = totalHours * hourlyRate;

    // Simulate calculation time
    setTimeout(() => {
      setResult({
        tier: selectedTier,
        days: finalDays,
        totalHours,
        totalCost,
        allBenefits: getTierBenefits(selectedTier),
        unbenefits: getTierUnbenefits(selectedTier),
        refId: data.refId,
        discountApplied,
        dailyHours: dailyCustomHours,
      });
      setIsCalculating(false);
    }, 500);
  };

  useEffect(() => {
    if (result && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [result]);

  return (
    <main className="container mx-auto max-w-4xl px-4 py-12 sm:py-20">
      <div className="flex flex-col items-center text-center">
        <div className="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm mb-4">
          <Sparkles className="h-4 w-4 mr-2 text-primary" />
          Powered by Smart Tiered Pricing
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
          FreelanceRate Calculator
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Select your desired project duration, enter the number of days, and instantly get a transparent cost estimate for my services.
        </p>
      </div>

      <div className="mt-12">
        <FreelanceRateForm 
          tiers={tiers}
          onCalculate={handleCalculate} 
          isCalculating={isCalculating} 
        />
      </div>

      <div className="mt-12" ref={resultsRef}>
        {isCalculating && <div className="h-96" />}
        {result && <ResultsCard result={result} />}
      </div>
    </main>
  );
}
