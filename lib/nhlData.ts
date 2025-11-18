// lib/nhlData.ts

export const NHL_CONFERENCES = {
  Eastern: ["ATL", "MET"],
  Western: ["CEN", "PAC"],
} as const;

export const POSITION_GROUPS = {
  Forward: ["C", "L", "R", "W", "F"],
  Defense: ["D"],
  Goalie: ["G"],
} as const;

export function getConference(division: string): "Eastern" | "Western" | null {
  if (NHL_CONFERENCES.Eastern.includes(division as any)) return "Eastern";
  if (NHL_CONFERENCES.Western.includes(division as any)) return "Western";
  return null;
}

export function getPositionGroup(position: string): "Forward" | "Defense" | "Goalie" | null {
  if (POSITION_GROUPS.Forward.includes(position as any)) return "Forward";
  if (POSITION_GROUPS.Defense.includes(position as any)) return "Defense";
  if (POSITION_GROUPS.Goalie.includes(position as any)) return "Goalie";
  return null;
}

export function isSameConference(division1: string, division2: string): boolean {
  const conf1 = getConference(division1);
  const conf2 = getConference(division2);
  return conf1 !== null && conf1 === conf2;
}

export function isSamePositionGroup(pos1: string, pos2: string): boolean {
  const group1 = getPositionGroup(pos1);
  const group2 = getPositionGroup(pos2);
  return group1 !== null && group1 === group2;
}

export function isNumberClose(num1: number, num2: number, range: number): boolean {
  return Math.abs(num1 - num2) <= range;
}

const borderCache = new Map<string, string[]>();

export async function isCountryClose(country1: string, country2: string): Promise<boolean> {
  try {
    // Check cache first
    if (!borderCache.has(country1)) {
      const response = await fetch(`https://restcountries.com/v3.1/alpha/${country1}`);
      if (!response.ok) {
        console.error(`Country ${country1} not found`);
        return false;
      }
      
      const data = await response.json();
      const borderingCountryCodes: string[] = data[0]?.borders || [];
      borderCache.set(country1, borderingCountryCodes);
    }
    
    const borderingCountries = borderCache.get(country1) || [];
    return borderingCountries.includes(country2);
  } catch (error) {
    console.error("Failed to fetch bordering countries:", error);
    return false;
  }
}