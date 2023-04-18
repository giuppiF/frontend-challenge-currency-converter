import { Currency, CurrencyInputType } from "./converter";
import { Currencies } from "./page";

interface InputProps {
  currencies: Currencies;
  currentCurrency: Currency;
  type: CurrencyInputType;
  onChange: (currency: Currency, type: CurrencyInputType) => void;
}

export const CurrencyInput = ({
  currencies,
  currentCurrency,
  type,
  onChange,
}: InputProps) => {
  return (
    <div className="flex flex-col">
      <select
        value={currentCurrency.currency}
        onChange={(e) =>
          onChange(
            {
              ...currentCurrency,
              currency: e.target.value,
            },
            type
          )
        }
      >
        {Object.keys(currencies).map((key) => (
          <option key={key} value={key} label={`(${key}) ${currencies[key]}`} />
        ))}
      </select>
      <input
        type="number"
        value={currentCurrency.value}
        min={0.1}
        max={9999}
        onChange={(e) =>
          onChange(
            {
              ...currentCurrency,
              value: Number(e.target.value),
            },
            type
          )
        }
      />
    </div>
  );
};
