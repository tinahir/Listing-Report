export function currencyEUR(price: number) {
  return (
    new Intl.NumberFormat("en-DE", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
    }).format(price) + ",-"
  );
}

export function formateKM(value: number) {
  return new Intl.NumberFormat("en-DE", {
    style: "unit",
    unit: "kilometer",
  }).format(value);
}

export function formatePercentage(value: number) {
  return new Intl.NumberFormat("en-DE", {
    style: "percent",
  }).format(value);
}

export function formateMonth(value: string) {
  return (Number(value) / 10000).toPrecision(5);
}
