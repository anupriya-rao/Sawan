export interface District {
  id: number;
  name: string;
  state: string;
  lgd: string | null;
  lat: number;
  lon: number;
  cells: [number, number][];
}

export interface LeadDistrict {
  id: number;
  name: string;
  state: string;
  lgd: string | null;
  mean: number;
  max: number;
  raw_mean: number;
  p_heavy: number;
  p_very_heavy: number;
  level: "green" | "yellow" | "orange" | "red";
}

export interface GateInfo {
  key: string;
  cells: number;
  amount: string;
  warning: string;
}

export interface LeadForecast {
  lead: number;
  valid: string;
  raw: number[];
  corrected: number[];
  p_heavy: number[];
  p_very_heavy: number[];
  level: number[];
  gate: GateInfo[];
  districts: LeadDistrict[];
  thresholds: Record<string, number>;
}

export interface RegimeInfo {
  large_scale: string;
  anomaly: number | null;
  based_on: string | null;
  recent: unknown[];
  depressions: { time: string; lat: number; lon: number; grade: string }[];
  depression_cells: number;
}

export interface ProductMeta {
  issue: string;
  generated: string;
  leads: { lead: number; valid: string }[];
  regime: RegimeInfo;
  seasonNote: string | null;
  districts: number;
  status: {
    running: boolean;
    step: string;
    lastStarted: string | null;
    lastFinished: string | null;
    lastError: string | null;
    output: string[];
  };
  sources: {
    name: string;
    agency: string;
    url: string;
    role: string;
  }[];
}

export interface HealthInfo {
  ok: boolean;
  service: string;
  time: string;
  uptime_s: number;
  product: {
    issue: string;
    generated: string;
    age_hours: number;
    fresh: boolean;
  } | null;
  cycle: {
    running: boolean;
    step: string;
    lastFinished: string | null;
    lastError: string | null;
  };
}

export interface VoiceQueryResponse {
  query: string;
  language: string;
  response: string;
  audioScript: string;
  region: string;
  probability_heavy: number;
  timestamp: string;
}

export interface DownscalingData {
  lead: number;
  diffusion_steps: number;
  coarse_resolution_km: number;
  downscaled_resolution_km: number;
  metrics: {
    peak_preservation_score: string;
    sharpness_gain: string;
    spatial_rmse_reduction: string;
    latent_noise_scale: number;
  };
  sample_grid: {
    cell_id: number;
    lat: number;
    lon: number;
    raw_nwp_12km: number;
    downscaled_1km: number;
    latent_variance: number;
  }[];
}

export interface GnnGraphData {
  nodes: {
    id: number;
    name: string;
    region: string;
    lat: number;
    lon: number;
    rain_mm: number;
  }[];
  edges: {
    source: number;
    target: number;
    attention_weight: number;
    flow_type: string;
  }[];
  attention_heads: {
    head: number;
    name: string;
    spatial_coherence: number;
  }[];
}

export interface BulletinResponse {
  sdma: string;
  level: string;
  language: string;
  bulletin_id: string;
  script: string;
  audio_duration_seconds: number;
  channels: string[];
  timestamp: string;
}

export interface VisionAnalysisResponse {
  chart_type: string;
  detected_features: {
    name: string;
    bbox: number[];
    confidence: number;
  }[];
  executive_summary: string;
  meteorologist_recommendation: string;
  timestamp: string;
}

export interface AskDistrictResponse {
  query: string;
  total_matched: number;
  matched_districts: {
    id: number;
    name: string;
    state: string;
    mean: number;
    max: number;
    raw_mean: number;
    p_heavy: number;
    p_very_heavy: number;
    level: "green" | "yellow" | "orange" | "red";
    far: number;
    pod: number;
  }[];
  export_pdf_ready: boolean;
  filter_applied: string;
}

export interface NeuralUncertaintyData {
  district_id: number;
  district_name: string;
  neural_inference_time_ms: number;
  traditional_gefs_time_sec: number;
  speedup_factor: string;
  prob_threshold_64_5mm: number;
  prob_threshold_115_5mm: number;
  percentiles: {
    p10: number;
    p50: number;
    p90: number;
  };
  density_curve: {
    rain_mm: number;
    probability_density: number;
    cumulative_risk: number;
  }[];
}
