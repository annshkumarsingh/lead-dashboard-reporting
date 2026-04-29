import { GoogleGenAI } from "@google/genai";
import { LeadModel } from "../models/lead.model";
import { env } from "../config/env";

export async function getDashboardMetrics() {
  const [totalLeads, statusBreakdown, cityDistribution, serviceDistribution, budgetAgg, recentLeads] =
    await Promise.all([
      LeadModel.countDocuments(),
      LeadModel.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
      LeadModel.aggregate([{ $group: { _id: "$city", count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 10 }]),
      LeadModel.aggregate([{ $group: { _id: "$service", count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 10 }]),
      LeadModel.aggregate([
        { $group: { _id: null, totalBudget: { $sum: "$budget" }, averageBudget: { $avg: "$budget" } } },
      ]),
      LeadModel.find().sort({ createdAt: -1 }).limit(8).lean(),
    ]);

  const converted = statusBreakdown.find((item) => item._id === "Converted")?.count || 0;
  const conversionRate = totalLeads ? Number(((converted / totalLeads) * 100).toFixed(2)) : 0;

  return {
    totalLeads,
    conversionRate,
    statusBreakdown: statusBreakdown.map((x) => ({ status: x._id, count: x.count })),
    cityDistribution: cityDistribution.map((x) => ({ city: x._id, count: x.count })),
    serviceDistribution: serviceDistribution.map((x) => ({ service: x._id, count: x.count })),
    budgetStats: {
      totalBudget: budgetAgg[0]?.totalBudget || 0,
      averageBudget: Math.round(budgetAgg[0]?.averageBudget || 0),
    },
    recentLeads,
  };
}

export async function getDashboardInsights() {
  const metrics = await getDashboardMetrics();
  const fallback = buildRuleBasedInsights(metrics);

  if (!env.geminiApiKey) {
    return { provider: "rule-based", insights: fallback };
  }

  try {
    const ai = new GoogleGenAI({ apiKey: env.geminiApiKey });
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Analyze these lead dashboard metrics and return exactly 4 concise business insights as JSON array of strings. Metrics: ${JSON.stringify(metrics)}`,
    });

    const text = response.text || "";
    const parsed = parseJsonArray(text);
    return { provider: "gemini", insights: parsed.length ? parsed.slice(0, 4) : fallback };
  } catch (error) {
    console.error("Gemini insights failed, using fallback:", error);
    return { provider: "rule-based-fallback", insights: fallback };
  }
}

function buildRuleBasedInsights(metrics: Awaited<ReturnType<typeof getDashboardMetrics>>) {
  const topCity = metrics.cityDistribution[0];
  const topService = metrics.serviceDistribution[0];
  const topStatus = metrics.statusBreakdown[0];

  return [
    metrics.conversionRate >= 25
      ? `Conversion rate is healthy at ${metrics.conversionRate}%. Keep tracking which services are converting best.`
      : `Conversion rate is ${metrics.conversionRate}%. Follow-up automation can help move Interested leads to Converted.`,
    topCity ? `${topCity.city} contributes the highest lead volume with ${topCity.count} leads.` : "City data is not available yet.",
    topService ? `${topService.service} is the most requested service with ${topService.count} leads.` : "Service demand data is not available yet.",
    topStatus ? `Most leads are currently in ${topStatus.status} status, indicating the dominant funnel stage.` : "Status distribution is not available yet.",
  ];
}

function parseJsonArray(text: string): string[] {
  const cleaned = text.replace(/```json|```/g, "").trim();
  const start = cleaned.indexOf("[");
  const end = cleaned.lastIndexOf("]");
  if (start === -1 || end === -1) return [];
  try {
    const value = JSON.parse(cleaned.slice(start, end + 1));
    return Array.isArray(value) ? value.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}
