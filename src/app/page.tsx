"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { FreelanceRateForm, type FormData } from "@/components/freelance-rate-form";
import { ResultsCard } from "@/components/results-card";
import { tiers, type Tier, type Benefit } from "@/lib/data";

export type CalculationResult = {
  tier: Tier;
  days: number;
  totalHours: number;
  totalCost: number;
  allBenefits: Benefit[];
};

export default function Home() {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleCalculate = (data: FormData) => {
    setIsCalculating(true);
    const selectedTier = tiers.find((t) => t.id === data.tierId);
    if (!selectedTier) return;

    const dailyHours = (selectedTier.dailyHours.min + selectedTier.dailyHours.max) / 2;
    const totalHours = data.days * dailyHours;
    const totalCost = totalHours * selectedTier.hourlyRate;

    // Simulate calculation time
    setTimeout(() => {
      setResult({
        tier: selectedTier,
        days: data.days,
        totalHours,
        totalCost,
        allBenefits: selectedTier.benefits,
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
        <FreelanceRateForm onCalculate={handleCalculate} isCalculating={isCalculating} />
      </div>

      <div className="mt-12" ref={resultsRef}>
        {result && <ResultsCard result={result} />}
      </div>
    </main>
  );
}
