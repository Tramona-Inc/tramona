import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/utils/utils";
import { Badge } from "../ui/badge";

export default function HostCalculator() {
  const [vacancyRate, setVacancyRate] = useState(50);
  const [cleaningFee, setCleaningFee] = useState(50);
  const [averagePrice, setAveragePrice] = useState(100);
  const [earnings, setEarnings] = useState({
    current: 0,
    tramona: {
      conservative: 0,
      moderate: 0,
      optimistic: 0,
    },
  });

  const calculateEarnings = (
    customVacancyRate: number,
    customAveragePrice: number,
  ): number => {
    const daysPerYear = 365;
    const occupiedDays = daysPerYear * (1 - customVacancyRate / 100);
    return occupiedDays * (customAveragePrice - cleaningFee);
  };

  const calculateAllEarnings = () => {
    const current = calculateEarnings(vacancyRate, averagePrice);

    const calculateExtraEarnings = (vacancyReduction: number): number => {
      const newVacancyRate = Math.max(0, vacancyRate - vacancyReduction);
      const newEarnings = calculateEarnings(newVacancyRate, averagePrice);
      return newEarnings - current;
    };

    setEarnings({
      current: parseFloat(current.toFixed(2)),
      tramona: {
        conservative: parseFloat(calculateExtraEarnings(10).toFixed(2)),
        moderate: parseFloat(calculateExtraEarnings(20).toFixed(2)),
        optimistic: parseFloat(calculateExtraEarnings(30).toFixed(2)),
      },
    });
  };

  useEffect(() => {
    calculateAllEarnings();
  }, [vacancyRate, cleaningFee, averagePrice]);

  const setVacancy = (rate: number) => {
    setVacancyRate(rate);
  };

  const getMostLikelyEstimate = () => {
    if (vacancyRate >= 0 && vacancyRate <= 40) return "conservative";
    if (vacancyRate > 40 && vacancyRate <= 58) return "moderate";
    return "best case";
  };

  const handleNumberInput =
    (setValue: (value: number) => void) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value === "" || value === "0") {
        setValue(0);
      } else {
        setValue(Math.min(Math.max(Number(value), 0), 100));
      }
    };

  return (
    <Card className="mx-auto w-full max-w-xl overflow-hidden rounded-lg bg-white shadow-lg @container">
      <CardHeader>
        <CardTitle>
          How much more could you be making with your short-term rental?
        </CardTitle>
        <CardDescription>
          We turn your empty dates into extra money!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4 pt-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">
              Vacancy Rate (%)
            </label>
            <Input
              type="number"
              value={vacancyRate || ""}
              onChange={handleNumberInput(setVacancyRate)}
              className="mb-2 w-full"
              min="0"
              max="100"
            />
            <div className="flex flex-col gap-2 *:flex-1 @sm:flex-row">
              <Button onClick={() => setVacancy(70)} variant="secondary">
                High (70%)
              </Button>
              <Button onClick={() => setVacancy(50)} variant="secondary">
                Medium (50%)
              </Button>
              <Button onClick={() => setVacancy(25)} variant="secondary">
                Low (25%)
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-2 *:flex-1 @sm:flex-row">
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">
                Average Price per Night
              </label>
              <Input
                prefix="$"
                type="number"
                inputMode="decimal"
                value={averagePrice || ""}
                onChange={handleNumberInput(setAveragePrice)}
                className="w-full"
                min="0"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">
                Cleaning Fee per Booking
              </label>
              <Input
                prefix="$"
                type="number"
                inputMode="decimal"
                value={cleaningFee || ""}
                onChange={handleNumberInput(setCleaningFee)}
                className="w-full"
                min="0"
              />
            </div>
          </div>
        </div>
        <div className="rounded-md bg-zinc-100 p-4">
          <h3 className="font-semibold text-zinc-500">
            Current Annual Earnings
          </h3>
          <p className="text-3xl font-bold text-zinc-900">
            {formatCurrency(earnings.current * 100)}
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-center text-xl font-semibold text-zinc-800">
            Potential Extra Annual Earnings with Tramona
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              {
                title: "Conservative",
                value: earnings.tramona.conservative,
                reduction: 10,
              },
              {
                title: "Moderate",
                value: earnings.tramona.moderate,
                reduction: 20,
              },
              {
                title: "Best case",
                value: earnings.tramona.optimistic,
                reduction: 30,
              },
            ].map((estimate, index) => (
              <EstimateCard
                key={index}
                title={estimate.title}
                value={estimate.value}
                reduction={estimate.reduction}
                isMostLikely={
                  getMostLikelyEstimate() === estimate.title.toLowerCase()
                }
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const EstimateCard = ({
  title,
  value,
  reduction,
  isMostLikely,
}: {
  title: string;
  value: number;
  reduction: number;
  isMostLikely: boolean;
}) => (
  <div className="relative pt-6">
    {isMostLikely && (
      <div className="absolute left-0 right-0 top-0 rounded-t-md bg-primaryGreen py-1 text-center text-sm font-semibold text-white">
        Most likely
      </div>
    )}
    <div className="flex flex-col items-center rounded-lg border p-4">
      <p className="text-sm font-semibold">{title}</p>
      <p className="text-2xl font-bold text-green-600">
        +{formatCurrency(value * 100)}
      </p>
      <Badge>-{reduction}% vacancy</Badge>
    </div>
  </div>
);
