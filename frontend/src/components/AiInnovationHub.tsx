import React, { useState, useEffect } from "react";
import {
  Mic,
  Sliders,
  Share2,
  AlertOctagon,
  Eye,
  BrainCircuit,
  MessageSquare,
  Sparkles,
  Play,
  Pause,
  Radio,
  CheckCircle
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import { api } from "@/lib/api";
import { ImdAlertBadge } from "./ImdAlertBadge";
import type {
  VoiceQueryResponse,
  DownscalingData,
  GnnGraphData,
  BulletinResponse,
  VisionAnalysisResponse,
  AskDistrictResponse,
  NeuralUncertaintyData
} from "@/types";

export const AiInnovationHub: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<
    "voice" | "diffusion" | "gnn" | "bulletins" | "vision" | "ensemble" | "ask"
  >("voice");

  // 1. Voice AI state
  const [voiceQuery, setVoiceQuery] = useState("Show me rain forecast for Maharashtra and Ratnagiri");
  const [voiceLanguage, setVoiceLanguage] = useState("marathi");
  const [voiceResult, setVoiceResult] = useState<VoiceQueryResponse | null>(null);
  const [voiceLoading, setVoiceLoading] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // 2. Diffusion Downscaling state
  const [diffusionSteps, setDiffusionSteps] = useState(50);
  const [downscalingData, setDownscalingData] = useState<DownscalingData | null>(null);
  const [diffusionLoading, setDiffusionLoading] = useState(false);

  // 3. GNN Graph state
  const [gnnData, setGnnData] = useState<GnnGraphData | null>(null);
  const [selectedNode, setSelectedNode] = useState<any>(null);

  // 4. Bulletins state
  const [sdmaSelection, setSdmaSelection] = useState("Maharashtra SDMA");
  const [bulletinLevel, setBulletinLevel] = useState("Orange Alert");
  const [bulletinLang, setBulletinLang] = useState("Marathi");
  const [bulletinResult, setBulletinResult] = useState<BulletinResponse | null>(null);
  const [bulletinLoading, setBulletinLoading] = useState(false);

  // 5. Vision Agent state
  const [chartType, setChartType] = useState("850 hPa Wind Field");
  const [visionResult, setVisionResult] = useState<VisionAnalysisResponse | null>(null);
  const [visionLoading, setVisionLoading] = useState(false);

  // 6. Neural Ensemble state
  const [ensembleDistrictId, setEnsembleDistrictId] = useState(1);
  const [ensembleData, setEnsembleData] = useState<NeuralUncertaintyData | null>(null);

  // 7. Ask District state
  const [askQuery, setAskQuery] = useState("districts with orange alert");
  const [askResult, setAskResult] = useState<AskDistrictResponse | null>(null);
  const [askLoading, setAskLoading] = useState(false);

  // Initial loads
  useEffect(() => {
    handleRunVoice();
    handleFetchDiffusion(50);
    api.getGnnGraph().then(setGnnData).catch(console.error);
    handleSynthesizeBulletin();
    handleAnalyzeVision();
    api.getNeuralUncertainty(1).then(setEnsembleData).catch(console.error);
    handleAskDistrict("districts with orange alert");
  }, []);

  const handleRunVoice = async () => {
    setVoiceLoading(true);
    try {
      const res = await api.queryVoiceAI(voiceQuery, voiceLanguage);
      setVoiceResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setVoiceLoading(false);
    }
  };

  const handleSpeech = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }
    const utter = new SpeechSynthesisUtterance(text);
    utter.onend = () => setIsPlayingAudio(false);
    utter.onerror = () => setIsPlayingAudio(false);
    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utter);
  };

  const handleFetchDiffusion = async (steps: number) => {
    setDiffusionSteps(steps);
    setDiffusionLoading(true);
    try {
      const res = await api.getDownscaling(steps, 1);
      setDownscalingData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setDiffusionLoading(false);
    }
  };

  const handleSynthesizeBulletin = async () => {
    setBulletinLoading(true);
    try {
      const res = await api.synthesizeBulletin(sdmaSelection, bulletinLevel, bulletinLang);
      setBulletinResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setBulletinLoading(false);
    }
  };

  const handleAnalyzeVision = async () => {
    setVisionLoading(true);
    try {
      const res = await api.analyzeSynopticChart(chartType);
      setVisionResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setVisionLoading(false);
    }
  };

  const handleAskDistrict = async (q: string) => {
    setAskLoading(true);
    try {
      const res = await api.askDistrict(q);
      setAskResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setAskLoading(false);
    }
  };

  const subTabs = [
    { id: "voice", label: "Multi-Lingual Voice AI", icon: Mic },
    { id: "diffusion", label: "Diffusion Downscaling (1 km)", icon: Sliders },
    { id: "gnn", label: "Graph Attention (GNN)", icon: Share2 },
    { id: "bulletins", label: "SDMA Emergency Bulletins", icon: AlertOctagon },
    { id: "vision", label: "Multimodal Synoptic Vision", icon: Eye },
    { id: "ensemble", label: "Neural Ensemble Uncertainty", icon: BrainCircuit },
    { id: "ask", label: "Ask-My-District Bot", icon: MessageSquare }
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4.5 h-4.5 text-blue-600" />
          <h1 className="section-title">AI Innovation Hub</h1>
          <span className="badge badge-indigo">New AI</span>
        </div>
        <p className="section-subtitle max-w-3xl">
          Generative AI, graph-transformer spatial attention, diffusion physics, and multilingual voice synthesis for grassroots disaster resilience.
        </p>
      </div>

      {/* Sub-tab navigation */}
      <div className="flex overflow-x-auto gap-1 p-1 bg-slate-100/80 rounded-xl border border-slate-200 scrollbar-none">
        {subTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? "bg-white text-blue-700 border border-slate-200 shadow-sm"
                  : "text-slate-500 hover:text-slate-800 hover:bg-white/60"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SUB-TAB 1: Voice AI Assistant */}
      {activeSubTab === "voice" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-150">
          <div className="lg:col-span-2 glass-panel rounded-3xl p-6 space-y-5 bg-white border border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Mic className="w-5 h-5 text-blue-600" />
              <span>Voice Query &amp; Multilingual Voice AI</span>
            </h2>

            {/* Quick Queries */}
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="text-slate-500 py-1 font-medium">Quick prompts:</span>
              {[
                { label: "Ratnagiri in Marathi", q: "Ratnagiri weather warning", lang: "marathi" },
                { label: "Odisha Coast in Odia", q: "Odisha rainfall probability", lang: "odia" },
                { label: "Bengal in Bengali", q: "South 24 Parganas rainfall", lang: "bengali" },
                { label: "Hindi Forecast", q: "Maharashtra Ghats rainfall", lang: "hindi" }
              ].map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setVoiceQuery(p.q);
                    setVoiceLanguage(p.lang);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-medium transition-colors cursor-pointer"
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Input & Language Switcher */}
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={voiceQuery}
                  onChange={(e) => setVoiceQuery(e.target.value)}
                  placeholder="Ask any district, regime status, or alert level..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white font-medium"
                />
                <button
                  onClick={handleRunVoice}
                  disabled={voiceLoading}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-blue-500/20 disabled:opacity-50 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{voiceLoading ? "Synthesizing..." : "Query AI"}</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-semibold">Response Language:</span>
                {["hindi", "marathi", "odia", "bengali", "english"].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setVoiceLanguage(lang)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                      voiceLanguage === lang
                        ? "bg-blue-600 text-white shadow-2xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Response Card */}
            {voiceResult && (
              <div className="p-5 bg-blue-50/60 rounded-2xl border border-blue-200 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-blue-800 uppercase tracking-wider">
                    AI Meteorological Response ({voiceResult.language})
                  </span>
                  <button
                    onClick={() => handleSpeech(voiceResult.audioScript || voiceResult.response)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    {isPlayingAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isPlayingAudio ? "Stop Audio" : "Listen in Native Accent"}</span>
                  </button>
                </div>

                <p className="text-sm text-slate-800 leading-relaxed font-semibold">
                  {voiceResult.response}
                </p>

                {/* Native Script Box */}
                {voiceResult.audioScript && (
                  <div className="p-3.5 bg-white rounded-xl border border-blue-100 shadow-2xs">
                    <span className="text-[10px] text-slate-500 uppercase block mb-1 font-bold">
                      Local Language Script:
                    </span>
                    <p className="text-base text-blue-950 font-serif leading-relaxed font-semibold">
                      {voiceResult.audioScript}
                    </p>
                  </div>
                )}

                {/* Audio visualizer bars when playing */}
                {isPlayingAudio && (
                  <div className="flex items-center gap-1.5 h-8 px-3 bg-blue-100 rounded-lg border border-blue-200">
                    <span className="w-1 bg-blue-600 rounded-full animate-soundwave-1" />
                    <span className="w-1 bg-blue-600 rounded-full animate-soundwave-2" />
                    <span className="w-1 bg-blue-600 rounded-full animate-soundwave-3" />
                    <span className="w-1 bg-blue-600 rounded-full animate-soundwave-4" />
                    <span className="w-1 bg-blue-600 rounded-full animate-soundwave-5" />
                    <span className="text-xs text-blue-900 font-mono ml-2 font-bold">Audio Broadcast Streaming...</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Voice AI Capabilities Card */}
          <div className="glass-panel rounded-3xl p-6 space-y-4 bg-white border border-slate-200">
            <span className="text-xs font-mono font-bold text-blue-600 uppercase">Grassroots Reach</span>
            <h3 className="text-base font-bold text-slate-900">Why Voice AI Matters</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              District collectors and local Panchayats need real-time weather advisories in regional languages without navigating complex meteorology tables.
            </p>
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <strong className="text-slate-900 block mb-0.5">Multi-Dialect Coverage:</strong>
                <span className="text-slate-600">Hindi, Marathi, Odia, Bengali, English.</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <strong className="text-slate-900 block mb-0.5">Instant Text-to-Speech:</strong>
                <span className="text-slate-600">Zero-latency client synthesis compatible with WhatsApp voice notes and radio feeds.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: Diffusion Downscaling */}
      {activeSubTab === "diffusion" && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="glass-panel rounded-3xl p-6 space-y-6 bg-white border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-blue-600" />
                  <span>AI Diffusion Downscaling Engine (12 km &rarr; 1 km)</span>
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Physics-conditioned latent diffusion model recovers sub-grid convective peaks lost in coarse numerical models.
                </p>
              </div>

              {/* Slider for Diffusion Steps */}
              <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200">
                <span className="text-xs text-slate-600 font-semibold">Denoising Steps:</span>
                <input
                  type="range"
                  min={10}
                  max={100}
                  step={10}
                  value={diffusionSteps}
                  onChange={(e) => handleFetchDiffusion(Number(e.target.value))}
                  className="w-32 accent-blue-600 cursor-pointer"
                />
                <span className="text-xs font-mono font-bold text-blue-700 w-8">{diffusionSteps}</span>
              </div>
            </div>

            {/* Downscaling Metrics Banner */}
            {downscalingData?.metrics && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 bg-blue-50/60 rounded-2xl border border-blue-100">
                  <span className="text-[10px] text-blue-800 uppercase font-bold">Sharpness Gain</span>
                  <div className="text-xl font-bold font-mono text-blue-700 mt-1">
                    {downscalingData.metrics.sharpness_gain}
                  </div>
                </div>
                <div className="p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-100">
                  <span className="text-[10px] text-emerald-800 uppercase font-bold">Spatial RMSE Reduction</span>
                  <div className="text-xl font-bold font-mono text-emerald-700 mt-1">
                    {downscalingData.metrics.spatial_rmse_reduction}
                  </div>
                </div>
                <div className="p-3.5 bg-amber-50/60 rounded-2xl border border-amber-100">
                  <span className="text-[10px] text-amber-800 uppercase font-bold">Peak Preservation</span>
                  <div className="text-xl font-bold font-mono text-amber-800 mt-1">
                    {downscalingData.metrics.peak_preservation_score}
                  </div>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] text-slate-600 uppercase font-bold">Latent Noise Scale</span>
                  <div className="text-xl font-bold font-mono text-slate-800 mt-1">
                    {downscalingData.metrics.latent_noise_scale}
                  </div>
                </div>
              </div>
            )}

            {/* Grid Cells Comparison */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                High-Resolution Sample Grid (Konkan / Western Ghats Crest)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(downscalingData?.sample_grid || []).map((cell) => (
                  <div key={cell.cell_id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <div className="flex justify-between text-[11px] font-mono text-slate-500">
                      <span className="font-semibold">Cell #{cell.cell_id}</span>
                      <span>{cell.lat.toFixed(2)}&deg;N, {cell.lon.toFixed(2)}&deg;E</span>
                    </div>
                    <div className="flex justify-between items-baseline pt-1">
                      <span className="text-xs text-slate-600 font-medium">Coarse NWP:</span>
                      <span className="text-sm font-mono text-slate-700 font-bold">{cell.raw_nwp_12km} mm</span>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs text-blue-700 font-bold">1 km AI Field:</span>
                      <span className="text-base font-mono font-black text-blue-700">{cell.downscaled_1km} mm</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: Graph Attention (GNN) */}
      {activeSubTab === "gnn" && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="glass-panel rounded-3xl p-6 space-y-5 bg-white border border-slate-200">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Share2 className="w-5 h-5 text-blue-600" />
                <span>Graph-Transformer Spatial Attention Architecture</span>
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Models physical teleconnections and moisture fluxes between orographic crests, coastal cells, and leeward slopes.
              </p>
            </div>

            {/* Attention Heads */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(gnnData?.attention_heads || []).map((h) => (
                <div key={h.head} className="p-3.5 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-1">
                  <span className="text-[10px] text-blue-700 uppercase font-mono font-bold">Head #{h.head}</span>
                  <div className="text-sm font-bold text-slate-900">{h.name}</div>
                  <div className="text-xs text-emerald-700 font-mono font-bold">
                    Spatial Coherence: {(h.spatial_coherence * 100).toFixed(0)}%
                  </div>
                </div>
              ))}
            </div>

            {/* Interactive Graph Network Nodes & Edges */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Nodes List */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 uppercase block">Topological Network Nodes</span>
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {(gnnData?.nodes || []).map((node) => (
                    <div
                      key={node.id}
                      onClick={() => setSelectedNode(node)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        selectedNode?.id === node.id
                          ? "bg-blue-50 border-blue-500 shadow-2xs"
                          : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <div>
                        <div className="font-bold text-sm text-slate-900">{node.name}</div>
                        <div className="text-xs text-slate-500 font-medium">{node.region}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-black text-blue-700">{node.rain_mm} mm</div>
                        <div className="text-[10px] text-slate-500 font-mono">{node.lat}&deg;N, {node.lon}&deg;E</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Edge Fluxes */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 uppercase block">Learned Attention Edges</span>
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {(gnnData?.edges || []).map((edge, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900">{edge.flow_type}</span>
                        <span className="font-mono text-blue-700 font-bold">
                          Weight: {(edge.attention_weight * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-blue-600 h-1.5 rounded-full"
                          style={{ width: `${edge.attention_weight * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: Emergency Bulletins */}
      {activeSubTab === "bulletins" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-150">
          <div className="lg:col-span-2 glass-panel rounded-3xl p-6 space-y-5 bg-white border border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <AlertOctagon className="w-5 h-5 text-red-600" />
              <span>State Disaster Management Authority (SDMA) Live Bulletins</span>
            </h2>

            {/* Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-slate-600 font-semibold block mb-1">Target Authority:</label>
                <select
                  value={sdmaSelection}
                  onChange={(e) => setSdmaSelection(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium"
                >
                  <option>Maharashtra SDMA</option>
                  <option>Odisha SDMA</option>
                  <option>West Bengal SDMA</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-600 font-semibold block mb-1">Alert Level:</label>
                <select
                  value={bulletinLevel}
                  onChange={(e) => setBulletinLevel(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium"
                >
                  <option>Orange Alert</option>
                  <option>Red Alert</option>
                  <option>Yellow Watch</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-600 font-semibold block mb-1">Broadcast Language:</label>
                <select
                  value={bulletinLang}
                  onChange={(e) => setBulletinLang(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium"
                >
                  <option>Marathi</option>
                  <option>Hindi</option>
                  <option>Odia</option>
                  <option>Bengali</option>
                  <option>English</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleSynthesizeBulletin}
              disabled={bulletinLoading}
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-red-500/20 cursor-pointer"
            >
              <Radio className="w-4 h-4 animate-pulse" />
              <span>{bulletinLoading ? "Synthesizing Broadcast..." : "Synthesize Emergency Bulletin"}</span>
            </button>

            {/* Generated Bulletin Output */}
            {bulletinResult && (
              <div className="p-5 bg-red-50/60 rounded-2xl border border-red-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-red-800">{bulletinResult.bulletin_id}</span>
                    <ImdAlertBadge level={bulletinResult.level.toLowerCase().includes("red") ? "red" : "orange"} size="sm" />
                  </div>
                  <span className="text-xs font-mono text-slate-500 font-semibold">{bulletinResult.audio_duration_seconds}s Audio Track</span>
                </div>

                <div className="p-4 bg-white rounded-xl border border-red-100 shadow-2xs">
                  <p className="text-base text-slate-900 font-serif leading-relaxed font-semibold">
                    {bulletinResult.script}
                  </p>
                </div>

                {/* Distribution Channels */}
                <div>
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                    Broadcast Distribution Channels
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {bulletinResult.channels.map((ch, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-white text-slate-800 text-xs font-semibold border border-slate-200 flex items-center gap-1.5 shadow-2xs">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        {ch}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="glass-panel rounded-3xl p-6 space-y-4 bg-white border border-slate-200">
            <span className="text-xs font-mono font-bold text-red-600 uppercase">Emergency Protocol</span>
            <h3 className="text-base font-bold text-slate-900">Automated SDMA Bulletins</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              When P(&ge;115.6 mm) exceeds the audited warning threshold, SAWAN automatically synthesizes broadcast-ready speech scripts for All India Radio and WhatsApp district alert channels.
            </p>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: Multimodal Synoptic Vision */}
      {activeSubTab === "vision" && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="glass-panel rounded-3xl p-6 space-y-5 bg-white border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-blue-600" />
                  <span>Multimodal Vision-Text Weather Agent</span>
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Computer vision models detect synoptic patterns, low-level jet axes, and convective cloud bands directly from isobaric charts.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={chartType}
                  onChange={(e) => setChartType(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium"
                >
                  <option>850 hPa Wind Field</option>
                  <option>500 hPa Geopotential Height</option>
                  <option>INSAT-3D Infrared Cloud Cover</option>
                </select>
                <button
                  onClick={handleAnalyzeVision}
                  disabled={visionLoading}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer shadow-xs"
                >
                  {visionLoading ? "Analyzing..." : "Analyze Chart"}
                </button>
              </div>
            </div>

            {visionResult && (
              <div className="space-y-4">
                {/* Detected Features Bounding Boxes */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {visionResult.detected_features.map((f, i) => (
                    <div key={i} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-900">{f.name}</span>
                        <span className="font-mono text-blue-700 font-black">{(f.confidence * 100).toFixed(0)}%</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        BBox: [{f.bbox.join(", ")}]
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-200 space-y-2">
                  <span className="text-xs font-bold text-blue-800 uppercase block">Executive Synoptic Summary:</span>
                  <p className="text-sm text-slate-800 leading-relaxed font-medium">
                    {visionResult.executive_summary}
                  </p>
                </div>

                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-1">
                  <span className="text-xs font-bold text-amber-800 uppercase block">Meteorologist Operational Recommendation:</span>
                  <p className="text-sm text-amber-900 font-semibold leading-relaxed">
                    {visionResult.meteorologist_recommendation}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 6: Neural Ensemble Uncertainty */}
      {activeSubTab === "ensemble" && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="glass-panel rounded-3xl p-6 space-y-6 bg-white border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <BrainCircuit className="w-5 h-5 text-blue-600" />
                  <span>Neural Ensemble Uncertainty &amp; Probability Density</span>
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Deep generative surrogate generates continuous probability distributions in 12 ms (120x faster than traditional GEFS).
                </p>
              </div>

              {/* District Switcher */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-600 font-semibold">Target District:</span>
                <select
                  value={ensembleDistrictId}
                  onChange={(e) => {
                    const id = Number(e.target.value);
                    setEnsembleDistrictId(id);
                    api.getNeuralUncertainty(id).then(setEnsembleData);
                  }}
                  className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 font-bold"
                >
                  <option value={1}>Ratnagiri (Maharashtra)</option>
                  <option value={2}>Kolhapur (Maharashtra)</option>
                  <option value={3}>Puri (Odisha)</option>
                  <option value={4}>Jagatsinghpur (Odisha)</option>
                  <option value={5}>South 24 Parganas (West Bengal)</option>
                </select>
              </div>
            </div>

            {/* Metrics */}
            {ensembleData && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 bg-blue-50/60 rounded-2xl border border-blue-100">
                  <span className="text-[10px] text-blue-800 uppercase font-bold">Inference Latency</span>
                  <div className="text-xl font-bold font-mono text-blue-700 mt-1">
                    {ensembleData.neural_inference_time_ms} ms
                  </div>
                  <span className="text-[10px] text-emerald-700 font-bold">120x speedup vs GEFS</span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] text-slate-600 uppercase font-bold">10th Percentile (p10)</span>
                  <div className="text-xl font-bold font-mono text-slate-800 mt-1">
                    {ensembleData.percentiles.p10} mm
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] text-slate-600 uppercase font-bold">Median (p50)</span>
                  <div className="text-xl font-bold font-mono text-blue-700 mt-1">
                    {ensembleData.percentiles.p50} mm
                  </div>
                </div>

                <div className="p-3.5 bg-red-50 rounded-2xl border border-red-200">
                  <span className="text-[10px] text-red-800 uppercase font-bold">90th Percentile (p90)</span>
                  <div className="text-xl font-bold font-mono text-red-700 mt-1">
                    {ensembleData.percentiles.p90} mm
                  </div>
                </div>
              </div>
            )}

            {/* Recharts Gaussian PDF Curve */}
            {ensembleData?.density_curve && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 uppercase block">
                  Continuous Probability Density Function (PDF)
                </span>
                <div className="h-64 w-full bg-slate-50 rounded-2xl p-4 border border-slate-200">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={ensembleData.density_curve}>
                      <defs>
                        <linearGradient id="rainDensityLight" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563eb" stopOpacity={0.6} />
                          <stop offset="95%" stopColor="#2563eb" stopOpacity={0.05} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="rain_mm" stroke="#64748b" unit="mm" tick={{ fontSize: 11 }} />
                      <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#ffffff", borderColor: "#cbd5e1", borderRadius: "0.75rem", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                        labelFormatter={(v) => `Rainfall: ${v} mm`}
                      />
                      <Area
                        type="monotone"
                        dataKey="probability_density"
                        stroke="#2563eb"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#rainDensityLight)"
                        name="Probability Density"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 7: Conversational Ask-My-District Bot */}
      {activeSubTab === "ask" && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="glass-panel rounded-3xl p-6 space-y-5 bg-white border border-slate-200">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <span>Conversational &ldquo;Ask My District&rdquo; Natural Language Bot</span>
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Ask in plain English or local criteria to instantly filter and rank districts across all operational metrics.
              </p>
            </div>

            {/* Quick Filter Prompts */}
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="text-slate-500 py-1 font-semibold">Try asking:</span>
              {[
                "Odisha districts",
                "Maharashtra with orange or red alert",
                "High reliability districts (FAR < 0.3)",
                "Districts with heavy rainfall"
              ].map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setAskQuery(q);
                    handleAskDistrict(q);
                  }}
                  className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-medium transition-colors cursor-pointer"
                >
                  &ldquo;{q}&rdquo;
                </button>
              ))}
            </div>

            {/* Query Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={askQuery}
                onChange={(e) => setAskQuery(e.target.value)}
                placeholder="Ask e.g. 'Show Odisha districts with Red Alert'..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white font-medium"
              />
              <button
                onClick={() => handleAskDistrict(askQuery)}
                disabled={askLoading}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <span>{askLoading ? "Searching..." : "Search"}</span>
              </button>
            </div>

            {/* Matched Districts Result Cards */}
            {askResult && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-600 font-semibold">
                  <span>Found {askResult.total_matched} matching districts</span>
                  <span className="text-blue-700 font-mono">Filter: {askResult.filter_applied}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {askResult.matched_districts.map((d) => (
                    <div key={d.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold text-slate-900">{d.name}</div>
                          <div className="text-xs text-slate-500 font-medium">{d.state}</div>
                        </div>
                        <ImdAlertBadge level={d.level} size="sm" />
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-200 font-mono">
                        <div>
                          <span className="text-slate-500 block text-[10px]">AI Mean:</span>
                          <span className="text-blue-700 font-bold">{d.mean} mm</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">POD / FAR:</span>
                          <span className="text-slate-700 font-bold">{d.pod} / {d.far}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
