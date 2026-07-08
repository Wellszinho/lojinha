"use client";

import {
  Activity,
  AlertTriangle,
  BarChart3,
  BrainCircuit,
  CircleDollarSign,
  FileText,
  Gauge,
  Link2,
  Loader2,
  PieChart,
  Shield,
  Sparkles,
  Swords,
  Target,
  Trophy,
  Upload,
  WandSparkles,
  Zap
} from "lucide-react";
import { ChangeEvent, FormEvent, useMemo, useState } from "react";

import { Button } from "@/components/ui/Button";
import { deckFormats, deckGames, type DeckGame } from "@/lib/deck-analyzer/formats";
import type { DeckAnalysis, DeckSourceType, ScoreLine } from "@/lib/deck-analyzer/types";
import { cn, formatMoney } from "@/lib/utils";

const sampleDeck = `Deck: Atraxa Superfriends
Commander:
1 Atraxa, Praetors' Voice

Creatures:
1 Birds of Paradise
1 Eternal Witness
1 Opposition Agent
1 Drannith Magistrate
1 Collector Ouphe
1 Thassa's Oracle

Artifacts:
1 Sol Ring
1 Arcane Signet
1 Fellwar Stone
1 Chromatic Lantern
1 Lightning Greaves
1 Swiftfoot Boots
1 Isochron Scepter

Instants:
1 Swords to Plowshares
1 Path to Exile
1 Assassin's Trophy
1 Beast Within
1 Cyclonic Rift
1 Counterspell
1 Swan Song
1 Fierce Guardianship
1 Heroic Intervention
1 Dramatic Reversal
1 Tainted Pact

Sorceries:
1 Cultivate
1 Kodama's Reach
1 Demonic Tutor
1 Toxic Deluge
1 Farewell
1 Finale of Devastation

Enchantments:
1 Rhystic Study
1 Mystic Remora
1 Phyrexian Arena
1 Rule of Law

Lands:
1 Command Tower
1 Exotic Orchard
1 Reflecting Pool
1 Mana Confluence
1 City of Brass
1 Ancient Tomb
6 Forest
5 Island
5 Swamp
4 Plains
3 Mountain`;

const sourceModes: Array<{ value: DeckSourceType; label: string; icon: typeof FileText }> = [
  { value: "text", label: "Texto", icon: FileText },
  { value: "url", label: "Link", icon: Link2 },
  { value: "file", label: "Arquivo", icon: Upload }
];

const chartColors = ["#D7B46A", "#7C3AED", "#34D399", "#60A5FA", "#F97316", "#F43F5E", "#A78BFA", "#F8FAFC"];

function StatCard({
  icon: Icon,
  label,
  value,
  text
}: {
  icon: typeof Gauge;
  label: string;
  value: string;
  text: string;
}) {
  return (
    <div className="rounded-premium border border-white/10 bg-white/[.045] p-4">
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-premium border border-gold/25 bg-gold/10 text-gold">
          <Icon className="size-5" />
        </span>
        <div>
          <p className="text-sm text-mist">{label}</p>
          <strong className="text-xl font-black text-frost">{value}</strong>
        </div>
      </div>
      <p className="mt-3 text-sm leading-6 text-mist">{text}</p>
    </div>
  );
}

function Panel({
  title,
  icon: Icon,
  children,
  className
}: {
  title: string;
  icon: typeof Sparkles;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-premium border border-white/10 bg-white/[.045] p-5", className)}>
      <div className="mb-4 flex items-center gap-2">
        <Icon className="size-5 text-gold" />
        <h2 className="text-lg font-black text-frost">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Meter({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-3 text-sm">
        <span className="text-mist">{label}</span>
        <strong className="text-frost">{value}/10</strong>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-gradient-to-r from-gold to-violet" style={{ width: `${Math.min(100, value * 10)}%` }} />
      </div>
    </div>
  );
}

function ManaCurveChart({ analysis }: { analysis: DeckAnalysis }) {
  const max = Math.max(...analysis.mana.curve.map((item) => item.count), 1);
  return (
    <div className="grid h-56 grid-cols-8 items-end gap-2">
      {analysis.mana.curve.map((item) => (
        <div key={item.label} className="grid h-full items-end gap-2 text-center">
          <div className="relative flex h-full items-end rounded-premium bg-white/[.04]">
            <div
              className="w-full rounded-premium bg-gradient-to-t from-violet to-gold"
              style={{ height: `${Math.max(6, (item.count / max) * 100)}%` }}
            />
          </div>
          <div>
            <strong className="block text-sm text-frost">{item.count}</strong>
            <span className="text-xs text-mist">{item.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function RolePie({ analysis }: { analysis: DeckAnalysis }) {
  const groups = analysis.roleGroups.filter((group) => group.count > 0).slice(0, 8);
  const total = groups.reduce((sum, group) => sum + group.count, 0) || 1;
  const gradient = groups.reduce(
    (state, group, index) => {
      const start = state.cursor;
      const next = start + (group.count / total) * 100;
      return {
        cursor: next,
        segments: [...state.segments, `${chartColors[index % chartColors.length]} ${start}% ${next}%`]
      };
    },
    { cursor: 0, segments: [] as string[] }
  ).segments.join(", ");

  return (
    <div className="grid gap-5 md:grid-cols-[220px_1fr] md:items-center">
      <div className="mx-auto grid size-48 place-items-center rounded-full border border-white/10" style={{ background: `conic-gradient(${gradient})` }}>
        <div className="grid size-24 place-items-center rounded-full border border-white/10 bg-obsidian text-center">
          <span className="text-xs text-mist">Papeis</span>
          <strong className="text-xl text-frost">{total}</strong>
        </div>
      </div>
      <div className="grid gap-2">
        {groups.map((group, index) => (
          <div key={group.role} className="flex items-center justify-between gap-3 rounded-premium bg-white/[.04] px-3 py-2">
            <span className="inline-flex items-center gap-2 text-sm text-mist">
              <span className="size-3 rounded-full" style={{ background: chartColors[index % chartColors.length] }} />
              {group.label}
            </span>
            <strong className="text-sm text-frost">{group.count}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

function RadarChart({ scores }: { scores: ScoreLine[] }) {
  const selected = scores.slice(0, 8);
  const size = 260;
  const center = size / 2;
  const radius = 96;
  const points = selected.map((score, index) => {
    const angle = (Math.PI * 2 * index) / selected.length - Math.PI / 2;
    const valueRadius = (score.value / 10) * radius;
    return {
      score,
      x: center + Math.cos(angle) * valueRadius,
      y: center + Math.sin(angle) * valueRadius,
      labelX: center + Math.cos(angle) * (radius + 24),
      labelY: center + Math.sin(angle) * (radius + 24)
    };
  });
  const polygon = points.map((point) => `${point.x},${point.y}`).join(" ");
  const rings = [0.25, 0.5, 0.75, 1].map((scale) =>
    selected
      .map((_, index) => {
        const angle = (Math.PI * 2 * index) / selected.length - Math.PI / 2;
        return `${center + Math.cos(angle) * radius * scale},${center + Math.sin(angle) * radius * scale}`;
      })
      .join(" ")
  );

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="mx-auto w-full max-w-[320px]">
      {rings.map((ring) => (
        <polygon key={ring} points={ring} fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="1" />
      ))}
      {points.map((point) => (
        <line key={point.score.label} x1={center} y1={center} x2={point.labelX} y2={point.labelY} stroke="rgba(255,255,255,.08)" />
      ))}
      <polygon points={polygon} fill="rgba(215,180,106,.32)" stroke="#D7B46A" strokeWidth="2" />
      {points.map((point) => (
        <g key={point.score.label}>
          <circle cx={point.x} cy={point.y} r="4" fill="#D7B46A" />
          <text x={point.labelX} y={point.labelY} fill="#A6A8B5" fontSize="10" textAnchor="middle" dominantBaseline="middle">
            {point.score.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

function MatchupHeatMap({ analysis }: { analysis: DeckAnalysis }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {analysis.matchups.map((matchup) => {
        const hue = Math.round((matchup.winChance / 100) * 120);
        return (
          <div key={matchup.archetype} className="rounded-premium border border-white/10 bg-black/18 p-4">
            <div className="flex items-center justify-between gap-3">
              <strong className="text-frost">{matchup.archetype}</strong>
              <span
                className="rounded-full px-2 py-1 text-xs font-black text-obsidian"
                style={{ backgroundColor: `hsl(${hue} 70% 62%)` }}
              >
                {matchup.winChance}%
              </span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full" style={{ width: `${matchup.winChance}%`, backgroundColor: `hsl(${hue} 70% 56%)` }} />
            </div>
            <p className="mt-3 text-sm leading-6 text-mist">{matchup.strategy}</p>
          </div>
        );
      })}
    </div>
  );
}

function AnalysisReport({ analysis }: { analysis: DeckAnalysis }) {
  const overview = analysis.overview;
  const roleSummary = analysis.roleGroups.filter((group) => group.count > 0);

  return (
    <div className="mt-10 space-y-6">
      {analysis.source.warnings.length ? (
        <div className="rounded-premium border border-amber-400/25 bg-amber-400/10 p-4 text-sm leading-6 text-amber-100">
          <div className="mb-2 flex items-center gap-2 font-bold">
            <AlertTriangle className="size-4" />
            Observacoes da importacao
          </div>
          {analysis.source.warnings.map((warning) => (
            <p key={warning}>{warning}</p>
          ))}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Trophy} label="Power Level" value={`${overview.powerLevel}/10`} text={`${overview.archetype} com ${overview.subArchetypes.join(", ")}.`} />
        <StatCard icon={Gauge} label="Complexidade" value={`${overview.complexity}/10`} text="Sequenciamento, tutors, combos e cores elevam a exigencia tecnica." />
        <StatCard icon={Zap} label="Velocidade" value={`${overview.speed}/10`} text="Estima quando o deck consegue impor pressao ou ameacar finalizacao." />
        <StatCard icon={CircleDollarSign} label="Preco aprox." value={formatMoney(overview.estimatedPrice * 100)} text="Estimativa baseada em staples e media local para cartas desconhecidas." />
      </div>

      <Panel title="Visao Geral" icon={BrainCircuit}>
        <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            <p className="text-lg leading-8 text-frost">{analysis.executiveSummary}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ["Deck", overview.deckName],
                ["Jogo", overview.game],
                ["Comandante", overview.commander],
                ["Cores", overview.colors.length ? overview.colors.join(" ") : "Nao identificadas"],
                ["Formato", overview.format],
                ["Arquetipo", overview.archetype],
                ["Subarquetipos", overview.subArchetypes.join(", ")]
              ].map(([label, value]) => (
                <div key={label} className="rounded-premium border border-white/10 bg-black/15 p-3">
                  <span className="text-xs text-mist">{label}</span>
                  <strong className="mt-1 block text-frost">{value}</strong>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-4">
            <Meter label="Consistencia" value={overview.consistency} />
            <Meter label="Agressividade" value={overview.aggression} />
            <Meter label="Resiliencia" value={overview.resilience} />
            <Meter label="Velocidade" value={overview.speed} />
          </div>
        </div>
      </Panel>

      <Panel title="Estilo de Jogo" icon={Sparkles}>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            ["Plano principal", analysis.style.mainPlan],
            ["Plano secundario", analysis.style.secondaryPlan],
            ["Como vence", analysis.style.winPattern],
            ["Turnos fortes", analysis.style.turnWindows],
            ["Quando atacar", analysis.style.attackTiming],
            ["Quando controlar", analysis.style.controlTiming],
            ["Quando guardar recursos", analysis.style.resourceTiming]
          ].map(([title, text]) => (
            <div key={title} className="rounded-premium border border-white/10 bg-black/15 p-4">
              <h3 className="font-bold text-frost">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-mist">{text}</p>
            </div>
          ))}
        </div>
      </Panel>

      <div className="grid gap-6 xl:grid-cols-[1fr_.8fr]">
        <Panel title="Curva de Mana" icon={BarChart3}>
          <ManaCurveChart analysis={analysis} />
          <div className="mt-5 grid gap-3 sm:grid-cols-4">
            {[
              ["CMC medio", analysis.mana.averageCmc],
              ["Terrenos", analysis.mana.lands],
              ["Ramp", analysis.mana.ramp],
              ["Fix", analysis.mana.fix]
            ].map(([label, value]) => (
              <div key={label} className="rounded-premium bg-black/18 p-3 text-center">
                <strong className="block text-xl text-frost">{value}</strong>
                <span className="text-xs text-mist">{label}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm leading-6 text-mist">{analysis.mana.distributionText}</p>
        </Panel>

        <Panel title="Distribuicao por Papel" icon={PieChart}>
          <RolePie analysis={analysis} />
        </Panel>
      </div>

      <Panel title="Analise das Cartas" icon={FileText}>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {roleSummary.map((group) => (
            <div key={group.role} className="rounded-premium border border-white/10 bg-black/15 p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-bold text-frost">{group.label}</h3>
                <span className="rounded-full bg-gold/15 px-2 py-1 text-xs font-bold text-gold">{group.count}</span>
              </div>
              <p className="mt-2 text-sm leading-6 text-mist">{group.commentary}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {group.cards.map((card) => (
                  <span key={card} className="rounded-full border border-white/10 bg-white/[.04] px-2 py-1 text-xs text-mist">
                    {card}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Sinergias e Cartas-Chave" icon={WandSparkles}>
          <div className="space-y-4">
            {analysis.synergies.map((text) => (
              <p key={text} className="text-sm leading-6 text-mist">{text}</p>
            ))}
            <div>
              <h3 className="font-bold text-frost">Cartas mais importantes</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {analysis.keyCards.map((card) => (
                  <span key={card} className="rounded-full bg-gold/10 px-3 py-1 text-sm text-gold">{card}</span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-bold text-frost">Maior impacto</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {analysis.highImpactCards.map((card) => (
                  <span key={card} className="rounded-full bg-violet/15 px-3 py-1 text-sm text-frost">{card}</span>
                ))}
              </div>
            </div>
          </div>
        </Panel>

        <Panel title="Combos Detectados" icon={Target}>
          {analysis.combos.length ? (
            <div className="space-y-4">
              {analysis.combos.map((combo) => (
                <div key={combo.name} className="rounded-premium border border-white/10 bg-black/15 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-bold text-frost">{combo.name}</h3>
                    <span className="text-sm font-bold text-gold">{combo.confidence}%</span>
                  </div>
                  <p className="mt-2 text-sm text-mist">Pecas: {combo.pieces.join(" + ")}</p>
                  <p className="mt-3 text-sm leading-6 text-mist">{combo.howToExecute}</p>
                  <p className="mt-2 text-sm leading-6 text-mist">{combo.howToProtect}</p>
                  <p className="mt-2 text-sm leading-6 text-mist">{combo.howToStop}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm leading-6 text-mist">Nenhum combo catalogado foi detectado. O deck parece depender mais de valor, mesa e finalizadores.</p>
          )}
        </Panel>
      </div>

      <Panel title="Mulligan e Probabilidades" icon={Activity}>
        <div className="grid gap-5 lg:grid-cols-[.9fr_1.1fr]">
          <div className="space-y-4">
            <div className="rounded-premium border border-white/10 bg-black/15 p-4">
              <h3 className="font-bold text-frost">Mao para manter</h3>
              <p className="mt-2 text-sm leading-6 text-mist">{analysis.mulligan.keep}</p>
            </div>
            <div className="rounded-premium border border-white/10 bg-black/15 p-4">
              <h3 className="font-bold text-frost">Mao para devolver</h3>
              <p className="mt-2 text-sm leading-6 text-mist">{analysis.mulligan.ship}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {analysis.mulligan.lookFor.map((item) => (
                <span key={item} className="rounded-full bg-white/[.06] px-3 py-1 text-sm text-mist">{item}</span>
              ))}
            </div>
          </div>
          <div className="grid gap-3">
            {analysis.probabilities.map((item) => (
              <div key={item.label} className="rounded-premium bg-black/18 p-3">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-bold text-frost">{item.label}</span>
                  <span className="text-gold">{item.chance}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-gradient-to-r from-gold to-violet" style={{ width: `${item.chance}%` }} />
                </div>
                <p className="mt-2 text-xs leading-5 text-mist">{item.explanation} Base: {item.count} carta(s).</p>
              </div>
            ))}
          </div>
        </div>
      </Panel>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Pontos Fortes" icon={Shield}>
          <ul className="space-y-3 text-sm leading-6 text-mist">
            {analysis.strengths.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </Panel>
        <Panel title="Pontos Fracos" icon={AlertTriangle}>
          <ul className="space-y-3 text-sm leading-6 text-mist">
            {analysis.weaknesses.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </Panel>
      </div>

      <Panel title="Matchups" icon={Swords}>
        <MatchupHeatMap analysis={analysis} />
      </Panel>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="Melhores Comandantes Contra" icon={Trophy}>
          <CommanderTable commanders={analysis.bestCommandersAgainst} />
        </Panel>
        <Panel title="Piores Comandantes Para Enfrentar" icon={AlertTriangle}>
          <CommanderTable commanders={analysis.worstCommandersToFace} />
        </Panel>
        <Panel title="Melhores Decks Para Enfrentar" icon={Shield}>
          <CommanderTable commanders={analysis.bestDecksToFace} />
        </Panel>
        <Panel title="Piores Decks Para Enfrentar" icon={Swords}>
          <CommanderTable commanders={analysis.worstDecksToFace} />
        </Panel>
      </div>

      <Panel title="Como Jogar Contra Esse Deck" icon={Target}>
        <div className="grid gap-3 md:grid-cols-2">
          {analysis.howToPlayAgainst.map((item) => (
            <p key={item} className="rounded-premium border border-white/10 bg-black/15 p-4 text-sm leading-6 text-mist">{item}</p>
          ))}
        </div>
      </Panel>

      <Panel title="Como Vencer Esse Deck" icon={Zap}>
        <div className="grid gap-3 md:grid-cols-2">
          {analysis.howToBeat.map((item) => (
            <p key={item} className="rounded-premium border border-white/10 bg-black/15 p-4 text-sm leading-6 text-mist">{item}</p>
          ))}
        </div>
      </Panel>

      <Panel title="Melhor Comandante Para Counterar" icon={Trophy}>
        <div className="rounded-premium border border-gold/25 bg-gold/10 p-5">
          <h3 className="text-2xl font-black text-frost">{analysis.bestCounterCommander.commander}</h3>
          <p className="mt-2 text-sm text-gold">{analysis.bestCounterCommander.colors.join(" ")} - {analysis.bestCounterCommander.archetype}</p>
          <p className="mt-4 text-sm leading-6 text-mist">{analysis.bestCounterCommander.reason}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <Meter label="Power" value={analysis.bestCounterCommander.power} />
            <Meter label="Dificuldade" value={analysis.bestCounterCommander.difficulty} />
            <div className="rounded-premium bg-black/20 p-3">
              <span className="text-xs text-mist">Chance estimada</span>
              <strong className="block text-xl text-frost">{analysis.bestCounterCommander.winChance}%</strong>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-mist">{analysis.bestCounterCommander.strategy}</p>
        </div>
      </Panel>

      <div className="grid gap-6 xl:grid-cols-[.8fr_1fr]">
        <Panel title="Sugestoes de Melhorias" icon={WandSparkles}>
          <div className="space-y-3">
            {analysis.upgrades.map((upgrade) => (
              <div key={`${upgrade.mode}-${upgrade.card}`} className="rounded-premium border border-white/10 bg-black/15 p-4">
                <span className="text-xs font-bold uppercase text-gold">{upgrade.mode}</span>
                <h3 className="mt-1 font-bold text-frost">{upgrade.card}</h3>
                <p className="mt-2 text-sm leading-6 text-mist">{upgrade.reason}</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Score Final" icon={Gauge}>
          <div className="grid gap-5 lg:grid-cols-[300px_1fr]">
            <RadarChart scores={analysis.scores} />
            <div className="grid gap-3">
              {analysis.scores.map((score) => (
                <div key={score.label} className="rounded-premium bg-black/18 p-3">
                  <Meter label={score.label} value={score.value} />
                  <p className="mt-2 text-xs leading-5 text-mist">{score.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}

function CommanderTable({ commanders }: { commanders: DeckAnalysis["bestCommandersAgainst"] }) {
  return (
    <div className="space-y-3">
      {commanders.map((item) => (
        <div key={item.commander} className="rounded-premium border border-white/10 bg-black/15 p-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="font-bold text-frost">{item.commander}</h3>
              <p className="text-sm text-mist">{item.colors.join(" ")} - {item.archetype}</p>
            </div>
            <span className="rounded-full bg-gold/15 px-2 py-1 text-xs font-bold text-gold">{item.winChance}%</span>
          </div>
          <p className="mt-3 text-sm leading-6 text-mist">{item.reason}</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <Meter label="Power" value={item.power} />
            <Meter label="Dificuldade" value={item.difficulty} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function DeckAnalyzerClient() {
  const [game, setGame] = useState<DeckGame>("magic");
  const [format, setFormat] = useState("commander");
  const [sourceType, setSourceType] = useState<DeckSourceType>("text");
  const [input, setInput] = useState("");
  const [commander, setCommander] = useState("");
  const [deckName, setDeckName] = useState("");
  const [analysis, setAnalysis] = useState<DeckAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = useMemo(() => input.trim().length >= 10 && !isLoading, [input, isLoading]);
  const availableFormats = deckFormats[game];

  function handleGameChange(nextGame: DeckGame) {
    setGame(nextGame);
    setFormat(deckFormats[nextGame][0].value);
  }

  function getPlaceholder() {
    if (sourceType !== "url") return "1 Sol Ring\n1 Arcane Signet\n1 Swords to Plowshares...";
    return "https://www.ligamagic.com.br/?view=dks/deck&id=10100776";
  }

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setSourceType("file");
    setInput(await file.text());
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    setIsLoading(true);
    setError("");

    const response = await fetch("/api/deck-analyzer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sourceType,
        input,
        game,
        format,
        commander: commander || undefined,
        deckName: deckName || undefined
      })
    });
    const result = await response.json();
    setIsLoading(false);

    if (!response.ok) {
      setError(result.error ?? "Nao foi possivel analisar esse deck.");
      return;
    }

    setAnalysis(result.analysis);
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="rounded-premium border border-gold/20 bg-white/[.045] p-5 shadow-premium">
        <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
          <div>
            <div className="mb-4 grid gap-3 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-bold text-frost">
                Jogo
                <select
                  value={game}
                  onChange={(event) => handleGameChange(event.target.value as DeckGame)}
                  className="rounded-premium border border-white/10 bg-black/25 px-3 py-2 text-sm text-frost outline-none focus:border-gold/50"
                >
                  {deckGames.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-bold text-frost">
                Modo/Formato
                <select
                  value={format}
                  onChange={(event) => setFormat(event.target.value)}
                  className="rounded-premium border border-white/10 bg-black/25 px-3 py-2 text-sm text-frost outline-none focus:border-gold/50"
                >
                  {availableFormats.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
              {sourceModes.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setSourceType(value)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-premium border px-3 py-2 text-sm font-bold transition",
                    sourceType === value ? "border-gold/50 bg-gold/15 text-gold" : "border-white/10 bg-white/[.04] text-mist hover:text-frost"
                  )}
                >
                  <Icon className="size-4" />
                  {label}
                </button>
              ))}
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-premium border border-white/10 bg-white/[.04] px-3 py-2 text-sm font-bold text-mist transition hover:text-frost">
                <Upload className="size-4" />
                Importar arquivo
                <input type="file" accept=".txt,.dek,.csv,.json" className="sr-only" onChange={handleFile} />
              </label>
              <button
                type="button"
                onClick={() => {
                  setSourceType("text");
                  setGame("magic");
                  setFormat("commander");
                  setInput(sampleDeck);
                  setCommander("Atraxa, Praetors' Voice");
                  setDeckName("Atraxa Superfriends");
                }}
                className="inline-flex items-center gap-2 rounded-premium border border-violet/30 bg-violet/10 px-3 py-2 text-sm font-bold text-frost transition hover:bg-violet/15"
              >
                <Sparkles className="size-4" />
                Exemplo
              </button>
            </div>

            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={getPlaceholder()}
              className="min-h-[340px] w-full resize-y rounded-premium border border-white/10 bg-black/25 p-4 font-mono text-sm leading-6 text-frost outline-none transition placeholder:text-mist/60 focus:border-gold/50 focus:ring-2 focus:ring-gold/20"
            />
          </div>

          <div className="space-y-4">
            <div className="rounded-premium border border-white/10 bg-black/18 p-4">
              <h2 className="flex items-center gap-2 font-black text-frost">
                <BrainCircuit className="size-5 text-gold" />
                Analisador de Deck
              </h2>
              <p className="mt-3 text-sm leading-6 text-mist">
                Relatorio estrategico para Magic, com importacao por texto, arquivo ou link publico do Liga Magic.
              </p>
            </div>
            <label className="grid gap-2 text-sm font-bold text-frost">
              Nome do deck
              <input
                value={deckName}
                onChange={(event) => setDeckName(event.target.value)}
                className="rounded-premium border border-white/10 bg-black/25 px-3 py-2 text-sm text-frost outline-none focus:border-gold/50"
                placeholder="Atraxa Superfriends"
              />
            </label>
            <label className="grid gap-2 text-sm font-bold text-frost">
              Comandante
              <input
                value={commander}
                onChange={(event) => setCommander(event.target.value)}
                className="rounded-premium border border-white/10 bg-black/25 px-3 py-2 text-sm text-frost outline-none focus:border-gold/50"
                placeholder="Atraxa, Praetors' Voice"
              />
            </label>
            {error ? <p className="rounded-premium border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-100">{error}</p> : null}
            <Button type="submit" disabled={!canSubmit} className="w-full">
              {isLoading ? <Loader2 className="size-4 animate-spin" /> : <WandSparkles className="size-4" />}
              {isLoading ? "Analisando..." : "Gerar analise"}
            </Button>
          </div>
        </div>
      </form>

      {analysis ? <AnalysisReport analysis={analysis} /> : null}
    </div>
  );
}
