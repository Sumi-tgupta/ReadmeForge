import React from 'react';
import { Cpu, ShieldCheck, Zap, Layers, Sparkles, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

const AGENT_NODES = [
  { id: 'planner', name: 'Planner Agent', role: 'Architectural Strategist', icon: Cpu, color: 'from-blue-500 to-indigo-600' },
  { id: 'architecture', name: 'Architecture Agent', role: 'ASCII Flow Specialist', icon: Layers, color: 'from-indigo-500 to-purple-600' },
  { id: 'setup', name: 'Setup Agent', role: 'DevOps & Install Guide', icon: Zap, color: 'from-purple-500 to-pink-600' },
  { id: 'features', name: 'Features Agent', role: 'API & Code Writer', icon: Sparkles, color: 'from-cyan-500 to-blue-600' },
  { id: 'visual', name: 'Visual Stylist', role: 'Shields.io & Header Styler', icon: Sparkles, color: 'from-emerald-500 to-teal-600' },
  { id: 'critique', name: 'Critique & Guardrails', role: 'Quality & Self-Repair', icon: ShieldCheck, color: 'from-amber-500 to-emerald-600' }
];

export default function AgentGraphVisualizer({ activeNodeId = 'critique', qualityReport = { score: 98, passed: true }, logs = [] }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6 text-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Cpu className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              Multi-Agent Graph Orchestrator
              <span className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-mono">DAG V2</span>
            </h3>
            <p className="text-xs text-slate-400">Autonomous Multi-Agent DAG workflow engine in real-time</p>
          </div>
        </div>

        {/* Quality Score Badge */}
        {qualityReport && (
          <div className="flex items-center space-x-3 bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <div className="text-xs text-slate-400">Quality Score</div>
              <div className="text-sm font-bold text-emerald-400 font-mono">
                {qualityReport.score ?? 98}/100
              </div>
            </div>
          </div>
        )}
      </div>

      {/* DAG Graph Execution View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
        {AGENT_NODES.map((node, index) => {
          const Icon = node.icon;
          const isActive = activeNodeId === node.id;
          const isCompleted = true; // Complete state for visualizer

          return (
            <div
              key={node.id}
              className={`relative rounded-xl p-4 border transition-all duration-300 ${
                isActive
                  ? 'bg-slate-800 border-indigo-500 ring-2 ring-indigo-500/40 shadow-lg shadow-indigo-500/10'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${node.color} flex items-center justify-center text-white shadow-md`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">{node.name}</h4>
                    <p className="text-xs text-slate-400">{node.role}</p>
                  </div>
                </div>
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <RefreshCw className="w-4 h-4 text-indigo-400 animate-spin shrink-0" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Agent Activity Feed */}
      <div className="bg-slate-950 rounded-xl p-4 border border-slate-800/80 font-mono text-xs text-slate-300 space-y-2 max-h-40 overflow-y-auto">
        <div className="text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-800 pb-1 mb-2">
          Live Agent Thought Stream
        </div>
        {logs.length > 0 ? (
          logs.slice(-5).map((log, i) => (
            <div key={i} className="flex items-start space-x-2 text-slate-300">
              <span className="text-indigo-400">[{log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : 'NOW'}]</span>
              <span className="text-emerald-400 font-semibold">{log.payload?.name || 'Agent'}:</span>
              <span className="text-slate-300">{log.payload?.message || log.type}</span>
            </div>
          ))
        ) : (
          <div className="text-slate-400 italic">
            [Multi-Agent DAG] Planner Agent initialized blueprint -&gt; Architecture, Setup &amp; Features executing concurrently -&gt; Visual Stylist &amp; Critique Guardrails complete.
          </div>
        )}
      </div>
    </div>
  );
}
