export function formatDate(value: string): string {
  const [year, month, day] = value.split("-");
  if (!year) return value;
  if (!month) return year;
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const label = months[Number(month) - 1] ?? month;
  return day ? `${label} ${Number(day)} ${year}` : `${label} ${year}`;
}

export function formatN(n: number, type: "actual" | "estimated"): string {
  const count = n.toLocaleString("en-US");
  return type === "estimated" ? `${count} est.` : count;
}
