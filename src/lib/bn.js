// src/lib/bn.js

const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

// English digit → Bengali digit
export function toBn(input) {
  if (input === null || input === undefined) return "";
  return String(input).replace(/\d/g, (d) => bnDigits[Number(d)]);
}

// Number → Bengali string with commas
export function formatBn(number) {
  if (number === null || number === undefined) return "";

  const num = Number(number);
  if (isNaN(num)) return "";

  const str = num.toString();
  const parts = str.split(".");
  const intPart = parts[0];
  const decPart = parts[1];

  let withComma = "";
  let count = 0;
  for (let i = intPart.length - 1; i >= 0; i--) {
    withComma = intPart[i] + withComma;
    count++;
    if (count === 3 && i !== 0) {
      withComma = "," + withComma;
      count = 0;
    }
  }

  const final = decPart ? `${withComma}.${decPart}` : withComma;
  return toBn(final);
}

// Unit translation
export function translateUnit(unit) {
  const units = {
    kg: "প্রতি কেজি",
    litre: "প্রতি লিটার",
    dozen: "প্রতি ডজন",
    piece: "প্রতি পিস",
  };
  return units[unit] || `প্রতি ${unit}`;
}

// Change pct
export function formatChange(pct) {
  if (pct === null || pct === undefined) return "";
  const num = Number(pct);
  const abs = Math.abs(num).toFixed(1);
  return toBn(abs);
}

// Bengali date — always use Bangladesh's local date, not the deployment server's timezone.
const BANGLA_MONTHS = [
  "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল",
  "মে", "জুন", "জুলাই", "আগস্ট",
  "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর",
];

export function todayBn() {
  const parts = new Intl.DateTimeFormat("bn-BD", {
    timeZone: "Asia/Dhaka",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).formatToParts(new Date());

  const part = (type) => parts.find((item) => item.type === type)?.value || "";
  return `${part("day")} ${part("month")}, ${part("year")}`;
}

// Client-side helper retained for existing imports.
export function dynamicTodayBn() {
  return todayBn();
}
