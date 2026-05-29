import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const AD_GROUPS = [
  { id: "ag_1", ads: ["ad_1", "ad_2", "ad_3"], baseImpressions: 850, baseCtr: 3.8 },
  { id: "ag_2", ads: ["ad_4", "ad_5", "ad_6"], baseImpressions: 620, baseCtr: 3.2 },
  { id: "ag_3", ads: ["ad_7", "ad_8"], baseImpressions: 380, baseCtr: 2.9 },
];

function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function dayMultiplier(dayIndex) {
  const date = new Date("2026-04-28");
  date.setDate(date.getDate() + dayIndex);
  const dow = date.getDay();
  const isWeekend = dow === 0 || dow === 6;

  let ramp = 1;
  if (dayIndex < 3) ramp = 0.3 + dayIndex * 0.15;
  else if (dayIndex >= 22) ramp = 0.85 - (dayIndex - 22) * 0.02;

  const weekend = isWeekend ? 0.72 : 1;
  const noise = 0.85 + seededRandom(dayIndex * 17) * 0.3;
  return ramp * weekend * noise;
}

const records = [];
const startDate = new Date("2026-04-28");

for (let day = 0; day < 30; day += 1) {
  const date = new Date(startDate);
  date.setDate(date.getDate() + day);
  const dateStr = date.toISOString().slice(0, 10);
  const mult = dayMultiplier(day);

  for (const group of AD_GROUPS) {
    for (const adId of group.ads) {
      const adFactor = adId === "ad_1" ? 1.15 : adId === "ad_3" ? 0.75 : 1;
      const predictedImpressions = Math.round(group.baseImpressions * mult * adFactor);
      const actualFactor = 0.72 + seededRandom(day * 31 + adId.charCodeAt(3)) * 0.18;
      const actualImpressions = Math.round(predictedImpressions * actualFactor);
      const predictedCtr = group.baseCtr + (seededRandom(day + adId.length) - 0.5) * 0.4;
      const actualCtr = predictedCtr + (seededRandom(day * 7) - 0.5) * 0.6;
      const predictedClicks = Math.round((predictedImpressions * predictedCtr) / 100);
      const actualClicks = Math.round((actualImpressions * actualCtr) / 100);
      const avgCpc = 3.2 + seededRandom(day * 13) * 0.8;
      const spend = Math.round(actualClicks * avgCpc * 100) / 100;
      const conversions = Math.max(0, Math.round(actualClicks * 0.04 + seededRandom(day * 5) * 2 - 0.5));

      records.push({
        date: dateStr,
        ad_group_id: group.id,
        ad_id: adId,
        predicted_impressions: predictedImpressions,
        actual_impressions: actualImpressions,
        predicted_clicks: predictedClicks,
        actual_clicks: actualClicks,
        predicted_ctr: Math.round(predictedCtr * 10) / 10,
        actual_ctr: Math.round(actualCtr * 10) / 10,
        spend_usd: spend,
        avg_cpc_usd: Math.round(avgCpc * 100) / 100,
        conversions,
        conversion_value_usd: Math.round(conversions * 23.5 * 100) / 100,
      });
    }
  }
}

const summary = {
  total_spend_30d: Math.round(records.reduce((s, r) => s + r.spend_usd, 0) * 100) / 100,
  total_clicks_30d: records.reduce((s, r) => s + r.actual_clicks, 0),
  total_impressions_30d: records.reduce((s, r) => s + r.actual_impressions, 0),
  total_conversions_30d: records.reduce((s, r) => s + r.conversions, 0),
  avg_ctr: Math.round(
    (records.reduce((s, r) => s + r.actual_ctr, 0) / records.length) * 10,
  ) / 10,
};

const output = {
  campaign_id: "cmpn_bubble_q2",
  generated_at: new Date().toISOString(),
  summary,
  daily: records,
};

const outPath = path.join(
  __dirname,
  "..",
  "public",
  "demo-cache",
  "bubble-skincare-performance.json",
);
writeFileSync(outPath, JSON.stringify(output, null, 2));
console.log(`Wrote ${records.length} records to ${outPath}`);
console.log("Summary:", summary);
