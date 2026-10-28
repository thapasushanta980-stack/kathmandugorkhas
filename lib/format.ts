import type { Fixture } from "./types";

const NPT_OFFSET = "+05:45";
/** Matches are treated as finished this long after the scheduled start. */
const MATCH_WINDOW_MS = 5 * 60 * 60 * 1000;

const asUTC = (date: string) => new Date(`${date}T00:00:00Z`);

export const formatDate = (date: string, style: "long" | "short" = "long") =>
  new Intl.DateTimeFormat("en-GB", {
    weekday: style === "long" ? "short" : undefined,
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(asUTC(date));

export const dayOfMonth = (date: string) => String(asUTC(date).getUTCDate());
export const monthShort = (date: string) => new Intl.DateTimeFormat("en-GB", { month: "short", timeZone: "UTC" }).format(asUTC(date));

export const kickoff = (f: Fixture) => (f.time ? new Date(`${f.date}T${f.time}:00${NPT_OFFSET}`) : asUTC(f.date));

export type FixtureStatus = "result" | "upcoming" | "awaiting-result";

export function fixtureStatus(f: Fixture, now = Date.now()): FixtureStatus {
  if (f.result) return "result";
  return kickoff(f).getTime() + MATCH_WINDOW_MS > now ? "upcoming" : "awaiting-result";
}

export function nextFixture(fixtures: Fixture[], now = Date.now()) {
  return fixtures
    .filter((f) => fixtureStatus(f, now) === "upcoming")
    .sort((a, b) => kickoff(a).getTime() - kickoff(b).getTime())[0];
}

export const whenLabel = (f: Fixture) =>
  `${formatDate(f.date)}${f.time ? ` · ${f.time} NPT` : ""}${f.dayNight ? " · Day/night" : ""}`;

export const ordinal = (n: number) => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return `${n}${s[(v - 20) % 10] ?? s[v] ?? s[0]}`;
};
