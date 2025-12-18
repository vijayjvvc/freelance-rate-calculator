"use client";

import type { CalculationResult } from "@/app/page.tsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, CircleX,Info, Gift } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { WhatsAppIcon } from "./icons/whatsapp-icon";
import { Confetti } from "./confetti";

interface ResultsCardProps {
  result: CalculationResult;
}

export function ResultsCard({ result }: ResultsCardProps) {
  const { tier, days, totalHours, totalCost, allBenefits, unbenefits, country, hourlyRate, discountApplied, dailyHours } = result;

    const formattedCost = `${country.currencySymbol}${new Intl.NumberFormat('en-US', {
        maximumFractionDigits: 0,
    }).format(totalCost)}`;


  const handleShare = () => {
    let message = `Hi! I'm interested in hiring you for a project.\n\nI've selected the '${tier.label}' plan for ${days} days from ${country.label}.`;
    
    if (dailyHours) {
        message += `\nThis includes a custom commitment of ${dailyHours} hours/day.`
    }

    if (discountApplied) {
        message += `\nA referral discount of ${discountApplied}% has been applied.`
    }

    message += `\n\nThe estimated total cost is ${formattedCost} for ${totalHours} hours.`;
    message += `\n\nLet's discuss this further.`;

    const whatsappUrl = `https://wa.me/+917015954990?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <TooltipProvider>
      <Card className="relative overflow-hidden rounded-2xl border border-primary/20 bg-card/10 p-4 sm:p-8 shadow-2xl shadow-primary/10 backdrop-blur-lg animate-in fade-in-50 zoom-in-95 duration-500">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-50">
          <Confetti />
        </div>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-background to-foreground">
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
              {dailyHours ? 'Total' : 'Approx.'} {totalHours.toLocaleString()} hours @ {country.currencySymbol}{hourlyRate.toFixed(2)}/hr
              {dailyHours && ` (${dailyHours} hrs/day)`}
            </p>
          </div>

          <Separator className="my-8 bg-border/50" />
          
          <h3 className="text-xl font-bold text-center mb-6">What's Included?</h3>
          
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
                    <TooltipContent side="top" align="center" className="max-w-xs">
                      <p>{benefit.description}</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </li>
            ))}
            {unbenefits.map((unbenefit, index) => (
              <li key={index} className="flex items-start">
                <CircleX className="h-5 w-5 mr-3 mt-0.5 text-muted flex-shrink-0" />
                <div className="flex-grow">
                  <span className="font-medium text-foreground">
                    {unbenefit.text}
                  </span>
                </div>
                {unbenefit.description && (
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                       <button className="ml-2 flex-shrink-0">
                         <Info className="h-4 w-4 text-muted-foreground hover:text-accent" />
                       </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" align="center" className="max-w-xs">
                      <p>{unbenefit.description}</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </li>
            ))}
          </ul>

          <Separator className="my-8 bg-border/50" />

          <Button onClick={handleShare} className="w-full text-lg py-6 gap-2" size="lg" variant="secondary">
            <WhatsAppIcon className="h-6 w-6" />
            Discuss on WhatsApp
          </Button>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
