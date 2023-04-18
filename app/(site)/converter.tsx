"use client";

import { useState } from "react";
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
      value: 1.18,
    },
  };

  const [conversion, setConversion] = useState<CurrentConversion>(defaultData);

  const updateConversion = async (
    currency: Currency,
    type: CurrencyInputType
  ) => {
    if (type === "origin") {
      if (currency.currency === conversion.target.currency) {
        const newTargetCurrency = Object.keys(currencies).filter(
          (key) => key !== currency.currency
        )[0];
        const res = await getConversionData(currency, {
          currency: newTargetCurrency,
          value: 0,
        });
        setConversion((prev) => ({
          target: {
            currency: newTargetCurrency,
            value: res.rates[newTargetCurrency],
          },
          [type]: currency,
        }));
      } else {
        const res = await getConversionData(currency, conversion.target);
        setConversion((prev) => ({
          target: {
            ...prev.target,
            value: res.rates[prev.target.currency],
          },
          [type]: currency,
        }));
      }
    } else {
      const res = await getConversionData(currency, conversion.origin);
      setConversion((prev) => ({
        origin: {
          ...prev.origin,
          value: res.rates[prev.origin.currency],
        },
        [type]: currency,
      }));
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

async function getConversionData(origin: Currency, target: Currency) {
  const host = "api.frankfurter.app";
  const res = await fetch(
    `https://${host}/latest?amount=${origin.value}&from=${origin.currency}&to=${target.currency}`
  );
  const data = await res.json();
  return data;
}
