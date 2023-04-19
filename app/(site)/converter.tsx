"use client";

import { useEffect, useState } from "react";
import { CurrencyInput } from "./input";
import { Currencies } from "./page";

interface ConverterProps {
  currencies: Currencies;
}

export interface Currency {
  currency: string;
  value: number;
}

export type CurrencyInputType = "origin" | "target";

type CurrentConversion = {
  [key in CurrencyInputType]: Currency;
};

export const ConverterComponent = ({ currencies }: ConverterProps) => {
  const defaultData: CurrentConversion = {
    origin: {
      currency: "EUR",
      value: 1,
    },
    target: {
      currency: "USD",
      value: 0,
    },
  };

  const [conversion, setConversion] = useState<CurrentConversion>(defaultData);

  useEffect(() => {
    updateConversion(conversion.origin, "origin");
  }, []);

  const updateConversion = async (
    updatedCurrency: Currency,
    updatedType: CurrencyInputType
  ) => {
    if (updatedType === "origin") {
      const targetCurrency = getValidTargetCurrency(
        updatedCurrency,
        conversion,
        currencies
      );

      const data = await getConversionData(updatedCurrency, targetCurrency);
      if (data) {
        setConversion({
          target: {
            currency: targetCurrency.currency,
            value: data.rates[targetCurrency.currency],
          },
          origin: updatedCurrency,
        });
      }
    } else {
      const data = await getConversionData(updatedCurrency, conversion.origin);
      if (data) {
        setConversion((prev) => ({
          origin: {
            ...prev.origin,
            value: data.rates[prev.origin.currency],
          },
          target: updatedCurrency,
        }));
      }
    }
  };

  const targetCurrencies = Object.keys(currencies)
    .filter((key) => key !== conversion.origin.currency)
    .reduce((obj, key) => {
      return Object.assign(obj, {
        [key]: currencies[key],
      });
    }, {});

  return (
    <div>
      <CurrencyInput
        currencies={currencies}
        currentCurrency={conversion.origin}
        type="origin"
        onChange={updateConversion}
      />
      <CurrencyInput
        currencies={targetCurrencies}
        currentCurrency={conversion.target}
        type="target"
        onChange={updateConversion}
      />
      <pre>{JSON.stringify(conversion, null, 2)}</pre>
    </div>
  );
};

async function getConversionData(
  updatedCurrency: Currency,
  conversionTarget: Currency
) {
  try {
    const host = "api.frankfurter.app";
    const res = await fetch(
      `https://${host}/latest?amount=${updatedCurrency.value}&from=${updatedCurrency.currency}&to=${conversionTarget.currency}`
    );
    if (!res.ok) {
      throw new Error("Something went wrong");
    }
    const data = await res.json();
    return data;
  } catch {
    throw new Error("Something went wrong");
  }
}

function getValidTargetCurrency(
  updatedOrigin: Currency,
  conversionData: CurrentConversion,
  currencies: Currencies
) {
  const isTargetEqualToUpdatedOrigin =
    updatedOrigin.currency === conversionData.target.currency;

  const newTargetCurrency = isTargetEqualToUpdatedOrigin
    ? Object.keys(currencies).filter((key) => key !== updatedOrigin.currency)[0]
    : conversionData.target.currency;

  return {
    currency: newTargetCurrency,
    value: 0,
  };
}
