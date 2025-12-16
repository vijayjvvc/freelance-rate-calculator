"use client";

import type { CalculationResult } from "@/app/page.tsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Info, Gift } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { WhatsAppIcon } from "./icons/whatsapp-icon";
import { Confetti } from "./confetti";

interface ResultsCardProps {
  result: CalculationResult;
}

export function ResultsCard({ result }: ResultsCardProps) {
  const { tier, days, totalHours, totalCost, allBenefits, discountApplied, dailyHours } = result;

  const formattedCost = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(totalCost);

  const handleShare = () => {
    const message = `Hi! I'm interested in hiring you for a project. I've selected the '${tier.label}' plan for ${days} days. The estimated cost is ${formattedCost}. Let's discuss this further.`;
    const whatsappUrl = `https://wa.me/+917015954990?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Card className="relative overflow-hidden rounded-2xl border border-primary/20 bg-card/10 p-4 sm:p-8 shadow-2xl shadow-primary/10 backdrop-blur-lg animate-in fade-in-50 zoom-in-95 duration-500">
      <Confetti />
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-background to-foreground">
          Your Estimated Plan
        </CardTitle>
        <CardDescription className="text-lg">
          Based on the <span className="font-bold text-accent">{tier.label}</span> tier for <span className="font-bold text-accent">{days}</span> days.
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-6">
        {discountApplied && (
            <div className="flex items-center justify-center gap-2 text-primary bg-primary/10 rounded-md p-2 text-center mb-4 text-sm">
                <Gift className="h-5 w-5"/>
                <p> <span className="font-bold">{discountApplied}% referral discount</span> applied!</p>
            </div>
        )}
        <div className="text-center mb-8">
          <p className="text-muted-foreground text-sm">Estimated Total Cost</p>
          <p className="text-5xl font-bold text-primary my-2">{formattedCost}</p>
          <p className="text-muted-foreground">
            {dailyHours ? 'Total' : 'Approx.'} {totalHours.toLocaleString()} hours @ ₹{tier.hourlyRate.toFixed(2)}/hr
            {dailyHours && ` (${dailyHours} hrs/day)`}
          </p>
        </div>

        <Separator className="my-8 bg-border/50" />
        
        <h3 className="text-xl font-bold text-center mb-6">What's Included?</h3>
        
        <TooltipProvider>
            <ul className="space-y-4">
              {allBenefits.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 mr-3 mt-0.5 text-primary flex-shrink-0" />
                  <div className="flex-grow">
                    <span className="font-medium text-foreground">
                      {benefit.text}
                    </span>
                  </div>
                  {benefit.description && (
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger asChild>
                         <button className="ml-2 flex-shrink-0">
                           <Info className="h-4 w-4 text-muted-foreground hover:text-accent" />
                         </button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs">
                        <p>{benefit.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </li>
              ))}
            </ul>
        </TooltipProvider>

        <Separator className="my-8 bg-border/50" />

        <Button onClick={handleShare} className="w-full text-lg py-6 gap-2" size="lg" variant="secondary">
          <WhatsAppIcon className="h-6 w-6" />
          Discuss this Plan on WhatsApp
        </Button>
      </CardContent>
    </Card>
  );
}
