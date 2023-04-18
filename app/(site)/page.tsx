import { ConverterComponent } from "./converter";

export type Currencies = { [key: string]: string };

export default async function Home() {
  const currenciesData: Currencies = await getData();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <ConverterComponent currencies={currenciesData} />
      </div>
    </main>
  );
}

async function getData() {
  const host = "api.frankfurter.app";
  const res = await fetch(`https://${host}/currencies`);
  const data = await res.json();
  return data;
}
