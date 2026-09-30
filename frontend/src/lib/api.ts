export const API_URL = "https://sawan-1uov.onrender.com/api";

export type Level = "green" | "yellow" | "orange" | "red";
export type Cell = [number, number];

export interface Regime {
  large_scale: "Active" | "Break" | "Normal" | string;
  anomaly: number | null;
  based_on: string | null;
  recent: { date: string; anom: number | null; regime: string }[];
  depressions: { time: string; lat: number; lon: number; grade: string }[];
  depression_cells: number;
}

export interface Meta {
  issue: string | null;
  generated: string | null;
  leads: { lead: number; valid: string }[];
  regime: Regime | null;
  seasonNote: string | null;
  districts: number;
  status: { running: boolean; step: string; lastStarted: string | null; lastFinished: string | null; lastError: string | null; output: string[] };
  sources: { name: string; agency: string; url: string; role: string }[];
}

export type ProductMeta = Meta;

export interface Forecast {
  issue: string;
  regime: Regime;
  seasonNote: string | null;
  cells: Cell[];
  lead: number;
  valid: string;
  raw: number[];
  corrected: number[];
  p_heavy: number[];
  p_very_heavy: number[];
  level: number[];
  gate: { key: string; cells: number; amount: string; warning: string }[];
  thresholds: Record<string, number>;
}

export interface CellMeta { cells: Cell[]; cell_district: number[]; cell_setting: number[]; cell_depression: number[] }

export interface DistrictRow {
  id: number; name: string; state: string; lgd: string | null; mean: number; max: number; raw_mean: number;
  p_heavy: number; p_very_heavy: number; level: Level;
}

export interface CatScore { events: number; hits: number; misses: number; false_alarms: number; POD: number; FAR: number; CSI: number; ETS: number }
export interface MethodScore { "t64.5": CatScore; "t115.6": CatScore; RMSE?: number }
export interface Verification {
  lead: number; n: number; days: number; seasons: number[];
  events: { heavy: number; very_heavy: number; extremely_heavy: number };
  overall: Record<string, MethodScore>;
  by_regime: Record<string, Record<string, MethodScore>>;
  by_setting: Record<string, Record<string, MethodScore>>;
  fss: Record<string, Record<string, number>>;
  brier: Record<string, Record<string, number>>;
  reliability: { p: number; freq: number; n: number }[];
  district: { n: number; districts: number; rmse_mean_rain: Record<string, number>; heavy_any_cell: Record<string, CatScore> };
  gate: Record<string, { amount: string; warning: string; n: number }>;
}

export interface ReplayEvent { date: string; heavy_cells: number; regime: string; ets_raw: number; ets_varsha: number; pod_raw: number; pod_varsha: number }
export interface ReplayDay {
  date: string; heavy_cells: number; regime: string;
  leads: Record<string, { obs: (number | null)[]; raw: (number | null)[]; ml: (number | null)[]; qmr: (number | null)[]; p_heavy: (number | null)[]; warn: (number | null)[];
    scores: Record<string, CatScore> }>;
}

export async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(((await res.json().catch(() => ({}))) as { error?: string }).error ?? `HTTP ${res.status}`);
  return res.json() as Promise<T>;
}

export const METHOD_LABEL: Record<string, string> = {
  RAW: "Raw NWP (GFS)", QM_GLOBAL: "Single global correction", QM_REGIME: "Regime-wise correction", ML: "Regime-aware ML (amount)", WARN: "SAWAN warning track",
};
export const SETTING_LABEL: Record<number, string> = { 0: "Orographic", 1: "Coastal", 3: "Inland" };

export async function fetchJson<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(options?.headers || {}) },
    ...options
  });
  if (!res.ok) throw new Error(`API error ${res.status}: ${res.statusText}`);
  return res.json() as Promise<T>;
}

export const api = {
  getHealth: () => fetchJson<any>("/health"),
  getMeta: () => fetchJson<Meta>("/meta"),
  getForecast: (lead = 1) => fetchJson<Forecast>(`/forecast?lead=${lead}`),
  getDistricts: (lead = 1) => fetchJson<{ issue: string; lead: number; valid: string; rows: DistrictRow[] }>(`/districts?lead=${lead}`),
  getLandmask: () => fetchJson<any>("/geo/landmask"),
  getRegimeHistory: () => fetchJson<{ dates: string[]; anom: number[]; regime: string[] }>("/regime/history"),
  getVerification: () => fetchJson<Record<string, Verification>>("/verification"),
  getReplay: () => fetchJson<{ events: ReplayEvent[] }>("/replay"),
  getReplayDetail: (date: string) => fetchJson<ReplayDay>(`/replay/${date}`),
  getDemoSummary: () => fetchJson<any>("/demo/summary"),
  triggerCycle: () => fetchJson<{ started: boolean }>("/run", { method: "POST" }),
  queryVoiceAI: (query: string, language = "hindi") => fetchJson<any>("/voice/query", { method: "POST", body: JSON.stringify({ query, language }) }),
  getDownscaling: (steps = 50, lead = 1) => fetchJson<any>(`/downscaling?steps=${steps}&lead=${lead}`),
  getGnnGraph: () => fetchJson<any>("/gnn/graph"),
  synthesizeBulletin: (sdma: string, level: string, language: string) => fetchJson<any>("/bulletins/synthesize", { method: "POST", body: JSON.stringify({ sdma, level, language }) }),
  analyzeSynopticChart: (chart_type: string) => fetchJson<any>("/vision/analyze", { method: "POST", body: JSON.stringify({ chart_type }) }),
  askDistrict: (query: string) => fetchJson<any>("/ask-district", { method: "POST", body: JSON.stringify({ query }) }),
  getNeuralUncertainty: (district_id = 1) => fetchJson<any>(`/ensemble/neural-uncertainty?district_id=${district_id}`),
  getDistrictCsvUrl: (lead = 1) => `${API_URL}/districts?lead=${lead}&format=csv`
};

