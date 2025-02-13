import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/utils"; // Ensure this doesn't divide by 100
import { Slider } from "../ui/slider";

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
  const [error, setError] = useState("");

  const calculateEarnings = useCallback(
    (
      customVacancyRate: number,
      customAveragePrice: number,
      customCleaningFee: number,
    ): number => {
      const daysPerYear = 365;
      const occupiedDays = daysPerYear * (1 - customVacancyRate / 100);
      const earningsPerStay = Math.max(
        0,
        customAveragePrice - customCleaningFee,
      );
      return occupiedDays * earningsPerStay * 100; // Multiply by 100
    },
    [],
  );

  const calculateAllEarnings = useCallback(() => {
    const current = calculateEarnings(vacancyRate, averagePrice, cleaningFee);
    const calculateExtraEarnings = (vacancyReduction: number) => {
      const newVacancyRate = Math.max(0, vacancyRate - vacancyReduction);
      const newEarnings = calculateEarnings(
        newVacancyRate,
        averagePrice,
        cleaningFee,
      );
      return Math.max(0, newEarnings - current);
    };
    setEarnings({
      current,
      tramona: {
        conservative: calculateExtraEarnings(10),
        moderate: calculateExtraEarnings(20),
        optimistic: calculateExtraEarnings(30),
      },
    });
  }, [vacancyRate, cleaningFee, averagePrice, calculateEarnings]);

  useEffect(() => {
    calculateAllEarnings();
  }, [calculateAllEarnings]);

  const setVacancy = (rate: number) => {
    setVacancyRate(rate);
    setError("");
  };

  const getMostLikelyEstimate = () => {
    if (vacancyRate >= 0 && vacancyRate <= 40) return "conservative";
    if (vacancyRate > 40 && vacancyRate <= 58) return "moderate";
    return "best case";
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setValue: (value: number) => void,
    min = 0,
    max = Infinity,
  ) => {
    const value = e.target.value === "" ? "" : Number(e.target.value);
    if (value === "" || (value >= min && value <= max)) {
      setValue(value === "" ? 0 : value);
      setError("");
    } else {
      setError(`Please enter a value between ${min} and ${max}`);
    }
  };

  return (
    <Card className="mx-auto my-4 w-full max-w-2xl overflow-hidden rounded-lg border bg-white px-7 shadow-md @container">
      <CardHeader>
        <CardTitle className="mt-12 text-center text-[#004236]">
          How much more could you be making annually?
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4 pt-4">
          <div>
            <label className="mb-6 block text-sm font-medium text-zinc-700">
              Vacancy Rate (%)
            </label>
            <Slider
              value={[vacancyRate]}
              onValueChange={(value) => {
                if (value[0] !== undefined) {
                  setVacancyRate(value[0]);
                }
              }}
              min={0}
              max={100}
              step={1}
              aria-describedby={error ? "vacancyError" : undefined}
              className="mb-4 w-full"
            />
            <div className="mt-4 text-center text-sm font-medium text-zinc-700">
              {vacancyRate}%
            </div>
            {error && (
              <span id="vacancyError" className="text-red-500">
                {error}
              </span>
            )}
            <div className="mt-4 flex flex-col gap-2 *:flex-1 @sm:flex-row">
              <Button
                onClick={() => setVacancy(25)}
                variant="secondary"
                className={`border-primaryGreen ${
                  vacancyRate === 25 ? "bg-primaryGreen text-white" : "bg-white"
                }`}
              >
                Low (25%)
              </Button>
              <Button
                onClick={() => setVacancy(50)}
                variant="secondary"
                className={`border-primaryGreen ${
                  vacancyRate === 50 ? "bg-primaryGreen text-white" : "bg-white"
                } `}
              >
                Medium (50%)
              </Button>

              <Button
                onClick={() => setVacancy(75)}
                variant="secondary"
                className={`border-primaryGreen ${
                  vacancyRate === 77 ? "bg-primaryGreen text-white" : "bg-white"
                } `}
              >
                High (70%)
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
                onChange={(e) => handleInputChange(e, setAveragePrice)}
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
                onChange={(e) => handleInputChange(e, setCleaningFee)}
                className="w-full"
                min="0"
              />
            </div>
          </div>
        </div>
        <div className="rounded-md border border-b p-4 pb-2">
          <h3 className="font-semibold text-zinc-500">
            Current Annual Earnings
          </h3>
          <p className="text-3xl font-bold text-zinc-900">
            {formatCurrency(earnings.current)}
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
                title: "Most likely",
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
  <div
    className={`flex flex-col items-center rounded-lg border-2 p-4 ${
      isMostLikely
        ? "border-4 border-primaryGreen text-primaryGreen"
        : "border-gray-300"
    }`}
  >
    <p className="text-sm font-semibold text-gray-800">{title}</p>
    <p className="text-2xl font-bold text-primaryGreen">
      +{formatCurrency(value)}
    </p>
    <p className="text-sm text-gray-600">-{reduction}% vacancy</p>
  </div>
);
