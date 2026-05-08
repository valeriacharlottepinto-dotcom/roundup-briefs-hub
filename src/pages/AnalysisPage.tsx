import { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  BarChart, Bar,
} from "recharts";
import Masthead from "@/components/Masthead";
import SiteFooter from "@/components/SiteFooter";
import { supabase } from "@/lib/supabase";

const COLORS = [
  "#C8003C","#4A1FA8","#006064","#E65100","#1B5E20",
  "#0D47A1","#4A148C","#B71C1C","#2E7D32","#37474F",
  "#C62828","#FF6F00",
];

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground border-b border-border pb-2 mb-6 mt-12 font-sans">
    {children}
  </h2>
);

const AnalysisPage = () => {
  const [sourcesData, setSourcesData] = useState<{source: string; count: number}[]>([]);
  const [dailyData, setDailyData] = useState<{date: string; count: number}[]>([]);
  const [keywordsData, setKeywordsData] = useState<{keyword: string; count: number}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const ninetyDaysAgo = new Date(
          Date.now() - 90 * 24 * 60 * 60 * 1000
        ).toISOString();
        const sevenDaysAgo = new Date(
          Date.now() - 7 * 24 * 60 * 60 * 1000
        );

        const { data, error } = await supabase
          .from("articles")
          .select("source, scraped_at, published_at, topics")
          .gte("scraped_at", ninetyDaysAgo);

        if (error || !data) throw error;

        // ── Articles per source (last 7 days) ──────────────────────────────
        const sourceMap: Record<string, number> = {};
        data
          .filter((a) => new Date(a.scraped_at) >= sevenDaysAgo)
          .forEach((a) => {
            sourceMap[a.source] = (sourceMap[a.source] || 0) + 1;
          });
        setSourcesData(
          Object.entries(sourceMap)
            .map(([source, count]) => ({ source, count }))
            .sort((a, b) => b.count - a.count)
        );

        // ── Articles per day (last 90 days) ────────────────────────────────
        const dailyMap: Record<string, number> = {};
        data.forEach((a) => {
          const date = (a.published_at || a.scraped_at).slice(0, 10);
          if (date) dailyMap[date] = (dailyMap[date] || 0) + 1;
        });
        setDailyData(
          Object.entries(dailyMap)
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => a.date.localeCompare(b.date))
        );

        // ── Top 20 topics (from the topics field) ──────────────────────────
        const kwMap: Record<string, number> = {};
        data.forEach((a) => {
          if (a.topics) {
            a.topics
              .split(",")
              .map((t: string) => t.trim())
              .filter(Boolean)
              .forEach((t: string) => {
                kwMap[t] = (kwMap[t] || 0) + 1;
              });
          }
        });
        setKeywordsData(
          Object.entries(kwMap)
            .map(([keyword, count]) => ({ keyword, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 20)
        );
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Masthead />
        <main className="max-w-[1100px] mx-auto px-4 py-16 text-center font-sans">
          <p className="text-muted-foreground text-sm">Daten werden geladen...</p>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Masthead />
      <main className="max-w-[1100px] mx-auto px-4 py-10">

        <SectionHeading>Artikel pro Quelle — letzte 7 Tage</SectionHeading>
        <p className="text-[0.85rem] text-muted-foreground font-sans mb-6">
          Wie viele Artikel mit unseren Keywords wurden von welcher Quelle veröffentlicht?
        </p>
        <div className="w-full h-[380px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sourcesData}
                dataKey="count"
                nameKey="source"
                cx="50%"
                cy="50%"
                outerRadius={140}
                label={({ source, percent }: { source: string; percent: number }) =>
                  `${source} ${(percent * 100).toFixed(0)}%`
                }
                labelLine={false}
              >
                {sourcesData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} Artikel`]} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <SectionHeading>Artikel pro Tag — letzte 90 Tage</SectionHeading>
        <p className="text-[0.85rem] text-muted-foreground font-sans mb-6">
          Entwicklung der Berichterstattung über Zeit.
        </p>
        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10 }}
                tickFormatter={(v: string) => v.slice(5)}
                interval={6}
              />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip
                labelFormatter={(v) => `Datum: ${v}`}
                formatter={(value) => [`${value} Artikel`]}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#C8003C"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <SectionHeading>Häufigste Themen</SectionHeading>
        <p className="text-[0.85rem] text-muted-foreground font-sans mb-6">
          Die 20 meistvertretenen Themen in allen Artikeln.
        </p>
        <div className="w-full h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={keywordsData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis type="number" tick={{ fontSize: 10 }} />
              <YAxis
                type="category"
                dataKey="keyword"
                tick={{ fontSize: 10 }}
                width={200}
              />
              <Tooltip formatter={(value) => [`${value}x`]} />
              <Bar dataKey="count" fill="#4A1FA8" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </main>
      <SiteFooter />
    </div>
  );
};

export default AnalysisPage;
