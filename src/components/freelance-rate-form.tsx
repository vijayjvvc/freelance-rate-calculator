"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2, TicketPercent } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { tiers, referralCodes } from "@/lib/data";

const formSchema = z.object({
  tierId: z.string({ required_error: "Please select a project duration." }),
  days: z.coerce.number().min(1, "Days must be at least 1."),
  refId: z.string().optional(),
}).refine(
  (data) => {
    const tier = tiers.find((t) => t.id === data.tierId);
    if (!tier) return false;
    return data.days >= tier.minDays && data.days <= tier.maxDays;
  },
  {
    message: "Days must be within the selected duration range.",
    path: ["days"],
  }
).refine(
    (data) => {
        if (!data.refId) return true;
        return Object.keys(referralCodes).includes(data.refId.toUpperCase());
    },
    {
        message: "Invalid referral code.",
        path: ["refId"],
    }
);

export type FormData = z.infer<typeof formSchema>;

interface FreelanceRateFormProps {
  onCalculate: (data: FormData) => void;
  isCalculating: boolean;
}

export function FreelanceRateForm({ onCalculate, isCalculating }: FreelanceRateFormProps) {
  const [selectedTierId, setSelectedTierId] = useState<string | undefined>();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tierId: undefined,
      days: 1,
      refId: "",
    },
  });

  const selectedTier = tiers.find((t) => t.id === selectedTierId);
  
  const handleTierChange = (tierId: string) => {
    const tier = tiers.find((t) => t.id === tierId);
    if (tier) {
      setSelectedTierId(tierId);
      form.setValue("tierId", tierId);
      const currentDays = form.getValues("days");
      if (currentDays < tier.minDays || currentDays > tier.maxDays) {
         form.setValue("days", tier.minDays);
      }
      form.trigger("days");
    }
  };

  return (
    <Card className="bg-card/30 border-border/50">
      <CardHeader>
        <CardTitle className="text-2xl font-bold tracking-tight">Calculate Your Estimate</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onCalculate)} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="tierId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Duration</FormLabel>
                    <Select onValueChange={handleTierChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a duration tier..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {tiers.map((tier) => (
                          <SelectItem key={tier.id} value={tier.id}>
                            {tier.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="days"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custom Days</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 5" {...field} disabled={!selectedTier} />
                    </FormControl>
                    {selectedTier && (
                      <FormDescription>
                        Enter a value between {selectedTier.minDays} and {selectedTier.maxDays}.
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
             <FormField
                control={form.control}
                name="refId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Referral Code (Optional)</FormLabel>
                    <FormControl>
                        <div className="relative">
                            <TicketPercent className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input placeholder="e.g., JV02" {...field} className="pl-10" />
                        </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            <Button type="submit" className="w-full text-lg py-6" size="lg" disabled={isCalculating}>
              {isCalculating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Calculating...
                </>
              ) : (
                "Calculate Cost"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
