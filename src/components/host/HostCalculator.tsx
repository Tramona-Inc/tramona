import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const HostCalculator = () => {
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
    return "optimistic";
  };

  const handleNumberInput =
    (setValue: (value: number) => void) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value === "" || value === "0") {
        setValue(0);
      } else {
        setValue(Number(value));
      }
    };

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
        <div className="absolute left-0 right-0 top-0 rounded-t-md bg-blue-500 py-1 text-center text-sm font-semibold text-white">
          Most likely
        </div>
      )}
      <Card className="h-full rounded-md border border-gray-200 bg-white p-4">
        <CardTitle className="mb-2 text-lg font-semibold text-gray-800">
          {title}
        </CardTitle>
        <p className="text-2xl font-bold text-green-600">+${value}</p>
        <p className="text-sm text-gray-600">-{reduction}% Vacancy</p>
      </Card>
    </div>
  );

  return (
    <Card className="mx-auto w-full max-w-xl overflow-hidden rounded-lg bg-white shadow-lg">
      <CardHeader className="bg-gray-800 px-6 py-2 text-white">
        <CardTitle className="text-xl font-bold">
          Host Earnings Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <h2 className="text-center text-2xl font-semibold text-gray-800">
          How much more could you be making with your short-term rental?
        </h2>
        <p className="text-center italic text-gray-600">
          We turn your empty dates into extra money!
        </p>
        <div className="space-y-4 pt-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
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
            <div className="flex justify-between space-x-2">
              <Button
                onClick={() => setVacancy(70)}
                className="flex-1 bg-gray-200 text-gray-800 hover:bg-gray-300"
              >
                High (70%)
              </Button>
              <Button
                onClick={() => setVacancy(50)}
                className="flex-1 bg-gray-200 text-gray-800 hover:bg-gray-300"
              >
                Medium (50%)
              </Button>
              <Button
                onClick={() => setVacancy(25)}
                className="flex-1 bg-gray-200 text-gray-800 hover:bg-gray-300"
              >
                Low (25%)
              </Button>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Cleaning Fee per Booking ($)
            </label>
            <Input
              type="number"
              value={cleaningFee || ""}
              onChange={handleNumberInput(setCleaningFee)}
              className="w-full"
              min="0"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Average Price per Stay ($)
            </label>
            <Input
              type="number"
              value={averagePrice || ""}
              onChange={handleNumberInput(setAveragePrice)}
              className="w-full"
              min="0"
            />
          </div>
        </div>

        <div className="rounded-md bg-gray-100 p-4">
          <h3 className="mb-2 text-lg font-semibold text-gray-800">
            Current Annual Earnings
          </h3>
          <p className="text-3xl font-bold text-gray-900">
            ${earnings.current}
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-center text-xl font-semibold text-gray-800">
            Potential Extra Annual Earnings with Tramona
          </h3>
          <div className="grid grid-cols-3 gap-4">
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
                title: "Optimistic",
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
};

export default HostCalculator;
