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

// Bengali date — FIXED for server-side rendering
const BANGLA_MONTHS = [
  "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল",
  "মে", "জুন", "জুলাই", "আগস্ট",
  "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর",
];

// Static Bengali date (server-safe) — used in layout/navbar
export function todayBn() {
  return "১০ অক্টোবর, ২০২৬";
}

// For client-side dynamic date if needed
export function dynamicTodayBn() {
  const now = new Date();
  const day = toBn(now.getDate());
  const month = BANGLA_MONTHS[now.getMonth()];
  const year = toBn(now.getFullYear());
  return `${day} ${month}, ${year}`;
}
