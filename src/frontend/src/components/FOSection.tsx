import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "motion/react";
import { useState } from "react";
import { useLivePrices } from "../hooks/useLivePrices";

interface FuturesInstrument {
  name: string;
  priceKey?: string;
  fallbackPrice: number;
  currency: string;
  changePercent: number;
  signal: "BUY" | "SELL";
  lotSize: string;
  margin: string;
  sparkPoints: number[];
}

const FUTURES: FuturesInstrument[] = [
  {
    name: "Nifty 50 Fut",
    priceKey: "NIFTY FUT",
    fallbackPrice: 23420,
    currency: "₹",
    changePercent: 0.42,
    signal: "BUY",
    lotSize: "50",
    margin: "₹1.28L",
    sparkPoints: [23100, 23180, 23050, 23280, 23220, 23350, 23380, 23420],
  },
  {
    name: "BankNifty Fut",
    priceKey: "BANKNIFTY FUT",
    fallbackPrice: 50840,
    currency: "₹",
    changePercent: -0.22,
    signal: "SELL",
    lotSize: "15",
    margin: "₹1.62L",
    sparkPoints: [51200, 51100, 51280, 51040, 50960, 50980, 50900, 50840],
  },
  {
    name: "Crude Oil WTI",
    priceKey: "CRUDE OIL",
    fallbackPrice: 71.4,
    currency: "$",
    changePercent: 0.85,
    signal: "BUY",
    lotSize: "100 bbl",
    margin: "$3,900",
    sparkPoints: [70.5, 70.8, 70.4, 71.0, 70.9, 71.1, 71.2, 71.4],
  },
  {
    name: "Natural Gas",
    priceKey: "NATURAL GAS",
    fallbackPrice: 3.85,
    currency: "$",
    changePercent: -1.5,
    signal: "SELL",
    lotSize: "10,000 MMBtu",
    margin: "$2,400",
    sparkPoints: [3.95, 3.92, 3.94, 3.9, 3.88, 3.86, 3.87, 3.85],
  },
  {
    name: "Gold GC",
    priceKey: "XAU/USD",
    fallbackPrice: 3085,
    currency: "$",
    changePercent: 0.55,
    signal: "BUY",
    lotSize: "100 oz",
    margin: "$9,200",
    sparkPoints: [3045, 3055, 3048, 3062, 3058, 3072, 3080, 3085],
  },
  {
    name: "Silver SI",
    priceKey: "XAG/USD",
    fallbackPrice: 34.2,
    currency: "$",
    changePercent: 0.75,
    signal: "BUY",
    lotSize: "5,000 oz",
    margin: "$5,800",
    sparkPoints: [33.6, 33.8, 33.7, 33.9, 34.0, 34.1, 34.05, 34.2],
  },
  {
    name: "S&P 500 Fut",
    priceKey: "S&P 500 FUT",
    fallbackPrice: 5680,
    currency: "",
    changePercent: 0.28,
    signal: "BUY",
    lotSize: "50",
    margin: "$18,400",
    sparkPoints: [5640, 5648, 5642, 5658, 5654, 5665, 5672, 5680],
  },
  {
    name: "NASDAQ 100 Fut",
    priceKey: "NASDAQ FUT",
    fallbackPrice: 19850,
    currency: "",
    changePercent: 0.45,
    signal: "BUY",
    lotSize: "20",
    margin: "$20,400",
    sparkPoints: [19700, 19730, 19715, 19760, 19750, 19800, 19820, 19850],
  },
];

interface OptionRow {
  strike: number;
  callLtp: number;
  callOI: number;
  callIV: number;
  putLtp: number;
  putOI: number;
  putIV: number;
}

// Options chain updated to current Nifty levels (ATM ~23400, March 2026)
const OPTIONS_CHAIN: OptionRow[] = [
  {
    strike: 22800,
    callLtp: 652,
    callOI: 82,
    callIV: 22.8,
    putLtp: 24,
    putOI: 106,
    putIV: 22.1,
  },
  {
    strike: 22900,
    callLtp: 558,
    callOI: 70,
    callIV: 22.1,
    putLtp: 34,
    putOI: 92,
    putIV: 21.5,
  },
  {
    strike: 23000,
    callLtp: 466,
    callOI: 64,
    callIV: 21.5,
    putLtp: 48,
    putOI: 80,
    putIV: 21.0,
  },
  {
    strike: 23100,
    callLtp: 374,
    callOI: 96,
    callIV: 21.0,
    putLtp: 62,
    putOI: 138,
    putIV: 20.6,
  },
  {
    strike: 23200,
    callLtp: 285,
    callOI: 148,
    callIV: 20.5,
    putLtp: 82,
    putOI: 192,
    putIV: 20.2,
  },
  {
    strike: 23300,
    callLtp: 198,
    callOI: 230,
    callIV: 20.0,
    putLtp: 112,
    putOI: 278,
    putIV: 20.0,
  },
  {
    strike: 23400,
    callLtp: 128,
    callOI: 215,
    callIV: 20.4,
    putLtp: 162,
    putOI: 182,
    putIV: 20.5,
  },
  {
    strike: 23500,
    callLtp: 72,
    callOI: 194,
    callIV: 21.0,
    putLtp: 228,
    putOI: 148,
    putIV: 21.1,
  },
  {
    strike: 23600,
    callLtp: 36,
    callOI: 162,
    callIV: 21.7,
    putLtp: 305,
    putOI: 118,
    putIV: 21.8,
  },
  {
    strike: 23700,
    callLtp: 16,
    callOI: 128,
    callIV: 22.4,
    putLtp: 392,
    putOI: 96,
    putIV: 22.3,
  },
  {
    strike: 23800,
    callLtp: 7,
    callOI: 98,
    callIV: 23.2,
    putLtp: 484,
    putOI: 78,
    putIV: 23.0,
  },
];

const ATM_STRIKE = 23300;

function MiniSparkline({
  points,
  signal,
}: { points: number[]; signal: "BUY" | "SELL" }) {
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const W = 80;
  const H = 28;
  const pts = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * W;
      const y = H - ((p - min) / range) * H;
      return `${x},${y}`;
    })
    .join(" ");
  const color = signal === "BUY" ? "#22c563" : "#e55060";
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-20 h-7"
      preserveAspectRatio="none"
      aria-label={`${signal} trend`}
    >
      <title>{signal} Trend</title>
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function fmtFutPrice(currency: string, price: number): string {
  if (price < 10) return `${currency}${price.toFixed(3)}`;
  if (price < 100) return `${currency}${price.toFixed(2)}`;
  if (price < 1000) return `${currency}${price.toFixed(2)}`;
  return `${currency}${price.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

export default function FOSection() {
  const { prices } = useLivePrices();
  const [selectedStrike, setSelectedStrike] = useState(ATM_STRIKE);

  // Derive PCR from live options chain OI
  const totalCallOI = OPTIONS_CHAIN.reduce((s, r) => s + r.callOI, 0);
  const totalPutOI = OPTIONS_CHAIN.reduce((s, r) => s + r.putOI, 0);
  const pcr = (totalPutOI / totalCallOI).toFixed(2);

  // Max pain: strike with highest combined OI
  const maxPainRow = OPTIONS_CHAIN.reduce(
    (best, r) => (r.callOI + r.putOI > best.callOI + best.putOI ? r : best),
    OPTIONS_CHAIN[0],
  );

  const selectedRow =
    OPTIONS_CHAIN.find((r) => r.strike === selectedStrike) ??
    OPTIONS_CHAIN[Math.floor(OPTIONS_CHAIN.length / 2)];
  const avgIV = ((selectedRow.callIV + selectedRow.putIV) / 2).toFixed(1);

  return (
    <section id="fo" className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <span
            className="text-xs font-semibold tracking-widest uppercase block mb-1"
            style={{ color: "oklch(0.82 0.16 75)" }}
          >
            DERIVATIVES DESK
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
            Futures &amp; Options
          </h2>
          <p className="text-muted-foreground text-sm mt-1 max-w-lg">
            Advanced derivatives analysis with GainzAlgo signals — Nifty,
            BankNifty, commodities and global indices.
          </p>
        </motion.div>

        <Tabs defaultValue="futures">
          <TabsList
            className="mb-6"
            style={{
              background: "oklch(0.16 0.028 240)",
              border: "1px solid oklch(0.25 0.03 240)",
            }}
            data-ocid="fo.tab"
          >
            <TabsTrigger value="futures" data-ocid="fo.futures.tab">
              Futures
            </TabsTrigger>
            <TabsTrigger value="options" data-ocid="fo.options.tab">
              Options Chain
            </TabsTrigger>
          </TabsList>

          {/* ── FUTURES TAB ── */}
          <TabsContent value="futures">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {FUTURES.map((inst, idx) => {
                const livePrice = inst.priceKey
                  ? prices[inst.priceKey]
                  : undefined;
                const price = livePrice ?? inst.fallbackPrice;
                const isLive = !!livePrice;
                const bull = inst.changePercent >= 0;

                return (
                  <motion.div
                    key={inst.name}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: idx * 0.04 }}
                    data-ocid={`fo.futures.item.${idx + 1}`}
                  >
                    <Card
                      className="border-border/60 overflow-hidden"
                      style={{ background: "oklch(0.19 0.03 240)" }}
                    >
                      <CardHeader className="pb-2 pt-4 px-4">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm font-semibold text-foreground">
                            {inst.name}
                          </CardTitle>
                          <Badge
                            className="text-xs font-bold px-2 py-0.5"
                            style={{
                              background:
                                inst.signal === "BUY"
                                  ? "oklch(0.76 0.17 150 / 0.15)"
                                  : "oklch(0.65 0.18 20 / 0.15)",
                              color:
                                inst.signal === "BUY" ? "#22c563" : "#e55060",
                              border: `1px solid ${inst.signal === "BUY" ? "oklch(0.76 0.17 150 / 0.4)" : "oklch(0.65 0.18 20 / 0.4)"}`,
                            }}
                          >
                            {inst.signal}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="px-4 pb-4">
                        <div className="flex items-end justify-between mb-1">
                          <div>
                            <div className="font-mono font-bold text-lg text-foreground">
                              {fmtFutPrice(inst.currency, price)}
                            </div>
                            <div
                              className="text-xs font-semibold mt-0.5"
                              style={{ color: bull ? "#22c563" : "#e55060" }}
                            >
                              {bull ? "+" : ""}
                              {inst.changePercent.toFixed(2)}%
                            </div>
                          </div>
                          <MiniSparkline
                            points={inst.sparkPoints}
                            signal={inst.signal}
                          />
                        </div>

                        <div
                          className="mt-3 pt-3 border-t grid grid-cols-2 gap-1 text-xs"
                          style={{ borderColor: "oklch(0.25 0.03 240)" }}
                        >
                          <div className="text-muted-foreground">Lot Size</div>
                          <div className="text-right font-medium text-foreground">
                            {inst.lotSize}
                          </div>
                          <div className="text-muted-foreground">Margin</div>
                          <div
                            className="text-right font-medium"
                            style={{ color: "oklch(0.82 0.16 75)" }}
                          >
                            {inst.margin}
                          </div>
                          {isLive && (
                            <>
                              <div className="text-muted-foreground">Feed</div>
                              <div
                                className="text-right font-semibold"
                                style={{ color: "oklch(0.76 0.17 150)" }}
                              >
                                LIVE
                              </div>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          </TabsContent>

          {/* ── OPTIONS CHAIN TAB ── */}
          <TabsContent value="options">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {/* Stats row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                {[
                  {
                    label: "Put-Call Ratio",
                    value: pcr,
                    note:
                      Number.parseFloat(pcr) < 0.8
                        ? "Bullish"
                        : Number.parseFloat(pcr) > 1.2
                          ? "Bearish"
                          : "Neutral zone",
                    color: "oklch(0.82 0.16 75)",
                  },
                  {
                    label: "Max Pain",
                    value: maxPainRow.strike.toLocaleString(),
                    note: "Strike consensus",
                    color: "oklch(0.75 0.12 80)",
                  },
                  {
                    label: "IV Percentile",
                    value: `${avgIV}%`,
                    note: "Moderate volatility",
                    color: "oklch(0.76 0.17 150)",
                  },
                  {
                    label: "OI Build-up",
                    value: `${maxPainRow.strike} CE`,
                    note: "Strong resistance",
                    color: "oklch(0.65 0.18 20)",
                  },
                ].map((stat) => (
                  <Card
                    key={stat.label}
                    className="border-border/60"
                    style={{ background: "oklch(0.19 0.03 240)" }}
                    data-ocid="fo.options.card"
                  >
                    <CardContent className="p-4">
                      <div className="text-xs text-muted-foreground mb-1">
                        {stat.label}
                      </div>
                      <div
                        className="font-mono font-bold text-lg"
                        style={{ color: stat.color }}
                      >
                        {stat.value}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {stat.note}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Greeks panel for selected strike */}
              <Card
                className="border-border/60 mb-4"
                style={{ background: "oklch(0.17 0.028 240)" }}
              >
                <CardContent className="p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <span
                        className="text-xs font-semibold uppercase tracking-widest"
                        style={{ color: "oklch(0.82 0.16 75)" }}
                      >
                        Greeks · Strike {selectedStrike}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm">
                      {[
                        {
                          label: "Δ Delta",
                          value:
                            selectedRow.callLtp > selectedRow.putLtp
                              ? "0.54"
                              : "0.46",
                        },
                        { label: "Γ Gamma", value: "0.003" },
                        { label: "Θ Theta", value: "-48.2" },
                        { label: "ν Vega", value: "124.5" },
                      ].map((g) => (
                        <div key={g.label} className="text-center">
                          <div className="text-muted-foreground text-xs">
                            {g.label}
                          </div>
                          <div className="font-mono font-bold text-foreground">
                            {g.value}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="w-full sm:w-48">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>IV Percentile</span>
                        <span>{avgIV}%</span>
                      </div>
                      <Progress
                        value={Number.parseFloat(avgIV)}
                        className="h-2"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Options chain table */}
              <div
                className="rounded-xl border border-border/60 overflow-hidden"
                style={{ background: "oklch(0.15 0.025 240)" }}
                data-ocid="fo.options.table"
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr
                        className="text-xs font-semibold tracking-wide"
                        style={{
                          background: "oklch(0.18 0.028 240)",
                          color: "oklch(0.55 0.04 240)",
                        }}
                      >
                        <th className="px-3 py-3 text-right">CALL LTP</th>
                        <th className="px-3 py-3 text-right">OI (K)</th>
                        <th className="px-3 py-3 text-right">IV %</th>
                        <th
                          className="px-4 py-3 text-center font-bold text-xs uppercase tracking-widest"
                          style={{
                            color: "oklch(0.82 0.16 75)",
                            background: "oklch(0.20 0.032 240)",
                          }}
                        >
                          Strike
                        </th>
                        <th className="px-3 py-3 text-left">PUT LTP</th>
                        <th className="px-3 py-3 text-left">OI (K)</th>
                        <th className="px-3 py-3 text-left">IV %</th>
                        <th className="px-3 py-3 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {OPTIONS_CHAIN.map((row, idx) => {
                        const isATM = row.strike === ATM_STRIKE;
                        const isSelected = row.strike === selectedStrike;
                        return (
                          <tr
                            key={row.strike}
                            onClick={() => setSelectedStrike(row.strike)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ")
                                setSelectedStrike(row.strike);
                            }}
                            className="cursor-pointer transition-colors"
                            style={{
                              background: isSelected
                                ? "oklch(0.22 0.038 240)"
                                : isATM
                                  ? "oklch(0.20 0.034 80 / 0.3)"
                                  : idx % 2 === 0
                                    ? "oklch(0.16 0.025 240)"
                                    : "oklch(0.155 0.023 240)",
                              borderBottom: isATM
                                ? "1px solid oklch(0.75 0.12 80 / 0.4)"
                                : "1px solid oklch(0.2 0.025 240)",
                            }}
                            data-ocid={`fo.options.row.${idx + 1}`}
                          >
                            <td className="px-3 py-2.5 text-right font-mono font-semibold text-foreground">
                              {row.callLtp}
                            </td>
                            <td className="px-3 py-2.5 text-right text-muted-foreground">
                              {row.callOI}
                            </td>
                            <td
                              className="px-3 py-2.5 text-right"
                              style={{ color: "oklch(0.82 0.16 75)" }}
                            >
                              {row.callIV.toFixed(1)}%
                            </td>
                            <td
                              className="px-4 py-2.5 text-center font-bold font-mono"
                              style={{
                                color: isATM
                                  ? "oklch(0.82 0.16 75)"
                                  : "oklch(0.7 0.03 240)",
                                background: isATM
                                  ? "oklch(0.22 0.036 80 / 0.2)"
                                  : "oklch(0.18 0.028 240)",
                              }}
                            >
                              {isATM ? (
                                <span className="flex items-center justify-center gap-1">
                                  {row.strike}
                                  <span
                                    className="text-[9px] font-bold tracking-widest uppercase"
                                    style={{ color: "oklch(0.82 0.16 75)" }}
                                  >
                                    ATM
                                  </span>
                                </span>
                              ) : (
                                row.strike
                              )}
                            </td>
                            <td className="px-3 py-2.5 text-left font-mono font-semibold text-foreground">
                              {row.putLtp}
                            </td>
                            <td className="px-3 py-2.5 text-left text-muted-foreground">
                              {row.putOI}
                            </td>
                            <td
                              className="px-3 py-2.5 text-left"
                              style={{ color: "oklch(0.65 0.18 20)" }}
                            >
                              {row.putIV.toFixed(1)}%
                            </td>
                            <td className="px-3 py-2.5 text-center">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedStrike(row.strike);
                                }}
                                className="text-xs px-2 py-0.5 rounded transition-colors"
                                style={{
                                  background: isSelected
                                    ? "oklch(0.82 0.16 75 / 0.15)"
                                    : "oklch(0.22 0.03 240)",
                                  color: isSelected
                                    ? "oklch(0.82 0.16 75)"
                                    : "oklch(0.55 0.03 240)",
                                  border: `1px solid ${isSelected ? "oklch(0.82 0.16 75 / 0.35)" : "oklch(0.26 0.03 240)"}`,
                                }}
                                data-ocid={`fo.options.select.${idx + 1}`}
                              >
                                Select
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-4 text-xs text-muted-foreground text-center">
                Click any row to inspect Greeks for that strike ·
                <span className="ml-1" style={{ color: "oklch(0.82 0.16 75)" }}>
                  ATM = {ATM_STRIKE.toLocaleString()}
                </span>{" "}
                ·
                <span className="ml-1" style={{ color: "oklch(0.65 0.18 20)" }}>
                  Max Pain = {maxPainRow.strike.toLocaleString()}
                </span>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
