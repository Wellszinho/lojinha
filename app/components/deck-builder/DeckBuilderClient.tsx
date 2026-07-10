"use client";

import {
  Bot,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Search,
  Shuffle,
  Sparkles,
  Wand2
} from "lucide-react";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/Button";
import {
  archetypeOptions,
  colorIdentities,
  commanderFilters,
  commanderPool,
  getColorIdentityById,
  manaColorClasses,
  manaColorLabels,
  preferenceQuestions,
  sameIdentity,
  styleOptions,
  suggestColorIdentity,
  type ColorIdentity,
  type ColorIdentityGroup,
  type CommanderFilterId,
  type CommanderProfile,
  type ManaColor
} from "@/lib/deck-builder";
import { cn } from "@/lib/utils";

const stepItems = [
  { number: 12, title: "Identidade de cores", description: "Escolha as cores primeiro ou deixe a IA sugerir." },
  { number: 13, title: "Comandante", description: "Filtre comandantes compativeis e selecione o lider ideal." },
  { number: 14, title: "Arquétipo", description: "Defina uma ou mais linhas principais do deck." },
  { number: 15, title: "Estilo do deck", description: "Modele como o deck deve se comportar na mesa." },
  { number: 16, title: "Preferências", description: "Ajuste combos, budget, proxies, banlist e power level." }
];

const identityGroups: ColorIdentityGroup[] = ["Monocolor", "Duas cores", "Tres cores", "Quatro cores", "Cinco cores"];

const initialPreferences = Object.fromEntries(
  preferenceQuestions.map((question) => [question.id, question.options[0]])
) as Record<string, string>;

function ManaPips({ colors, size = "sm" }: { colors: ManaColor[]; size?: "sm" | "md" }) {
  return (
    <span className="inline-flex items-center gap-1" aria-label={colors.map((color) => manaColorLabels[color]).join(", ")}>
      {colors.map((color) => (
        <span
          key={color}
          className={cn(
            "grid place-items-center rounded-full border font-black",
            manaColorClasses[color],
            size === "md" ? "size-7 text-xs" : "size-5 text-[10px]"
          )}
        >
          {color}
        </span>
      ))}
    </span>
  );
}

function toggleValue(values: string[], value: string) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

function sortCommanders(commanders: CommanderProfile[], filter: CommanderFilterId) {
  const tagged = commanders.filter((commander) => commander.tags.includes(filter));
  const base = tagged.length ? tagged : commanders;

  return [...base].sort((left, right) => {
    if (filter === "budget") return left.priceTier.localeCompare(right.priceTier) || right.power - left.power;
    if (filter === "easy") return left.complexity - right.complexity || right.power - left.power;
    if (filter === "hard") return right.complexity - left.complexity || right.power - left.power;
    if (filter === "recent") return right.releaseYear - left.releaseYear;
    if (filter === "old") return left.releaseYear - right.releaseYear;
    return right.power - left.power || left.complexity - right.complexity;
  });
}

function identityMatch(identity: ColorIdentity, commander: CommanderProfile) {
  return sameIdentity(identity.colors, commander.identity);
}

function estimatePower(commander: CommanderProfile | undefined, preferences: Record<string, string>, archetypes: string[]) {
  const base = commander?.power ?? 6;
  const tableBonus = preferences.tablePower === "cEDH" ? 2 : preferences.tablePower === "Power Level 9" ? 1 : 0;
  const comboBonus = archetypes.includes("Combo") || archetypes.includes("Storm") ? 1 : 0;
  const proxyBonus = preferences.proxies === "Sim" ? 1 : 0;
  return Math.min(10, Math.max(1, base + tableBonus + comboBonus + proxyBonus));
}

function estimateBudget(preferences: Record<string, string>, commander: CommanderProfile | undefined) {
  if (preferences.expensiveCards === "Nao") return "Budget controlado";
  if (preferences.expensiveCards === "Apenas se forem essenciais") return "Intermediario com upgrades pontuais";
  if (commander?.priceTier === "caro") return "Premium";
  return "Flexivel";
}

function getStrategyLine(identity: ColorIdentity, commander: CommanderProfile | undefined, archetypes: string[], styles: string[]) {
  const commanderName = commander?.name ?? "um comandante compativel";
  const archetypeText = archetypes.length ? archetypes.slice(0, 3).join(", ") : "Value, Ramp e Interacao";
  const styleText = styles.length ? styles.slice(0, 2).join(" + ") : "jogo equilibrado";
  return `A IA montaria uma base ${identity.name} (${identity.code}) em torno de ${commanderName}, priorizando ${archetypeText} e ajustando a lista para ${styleText}.`;
}

export function DeckBuilderClient() {
  const [activeStep, setActiveStep] = useState(0);
  const [colorMode, setColorMode] = useState<"choose" | "auto">("choose");
  const [selectedIdentityId, setSelectedIdentityId] = useState("ug");
  const [activeCommanderFilter, setActiveCommanderFilter] = useState<CommanderFilterId>("popular");
  const [commanderSearch, setCommanderSearch] = useState("");
  const [selectedCommanderName, setSelectedCommanderName] = useState("");
  const [selectedArchetypes, setSelectedArchetypes] = useState<string[]>(["Ramp", "Value"]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>(["Quero deck divertido", "Quero muita interacao"]);
  const [preferences, setPreferences] = useState<Record<string, string>>(initialPreferences);

  const suggestedIdentity = useMemo(
    () => suggestColorIdentity(selectedArchetypes, selectedStyles),
    [selectedArchetypes, selectedStyles]
  );

  const activeIdentity = colorMode === "auto" ? suggestedIdentity : getColorIdentityById(selectedIdentityId);

  const compatibleCommanders = useMemo(() => {
    const search = commanderSearch.trim().toLowerCase();
    const exact = commanderPool.filter((commander) => identityMatch(activeIdentity, commander));
    const pool = exact.length ? exact : commanderPool.filter((commander) => commander.identity.every((color) => activeIdentity.colors.includes(color)));
    const searched = search ? pool.filter((commander) => commander.name.toLowerCase().includes(search)) : pool;
    return sortCommanders(searched, activeCommanderFilter);
  }, [activeCommanderFilter, activeIdentity, commanderSearch]);

  const selectedCommander = useMemo(
    () => commanderPool.find((commander) => commander.name === selectedCommanderName),
    [selectedCommanderName]
  );

  const recommendedCommander = compatibleCommanders[0];
  const displayCommander = selectedCommander && compatibleCommanders.some((commander) => commander.name === selectedCommander.name)
    ? selectedCommander
    : recommendedCommander;

  const estimatedPower = estimatePower(displayCommander, preferences, selectedArchetypes);
  const estimatedBudget = estimateBudget(preferences, displayCommander);
  const progress = Math.round(((activeStep + 1) / stepItems.length) * 100);

  function updatePreference(questionId: string, value: string) {
    setPreferences((current) => ({ ...current, [questionId]: value }));
  }

  function surpriseMe() {
    const candidates = compatibleCommanders.slice(0, Math.min(compatibleCommanders.length, 6));
    if (!candidates.length) return;
    const index = Math.floor(Math.random() * candidates.length);
    setSelectedCommanderName(candidates[index].name);
  }

  return (
    <div className="grid gap-6">
      <div className="rounded-premium border border-white/10 bg-white/[.045] p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-premium border border-gold/30 bg-gold/10 px-3 py-2 text-sm font-bold text-gold">
              <Wand2 className="size-4" />
              Deck Builder Inteligente
            </span>
            <h2 className="mt-4 text-3xl font-black text-frost sm:text-4xl">Monte seu Deck Ideal</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-mist">
              Responda as etapas de identidade, comandante, arquetipo, estilo e preferencias. O assistente atualiza a
              sugestao como um configurador premium de Commander.
            </p>
          </div>
          <div className="min-w-[220px]">
            <div className="flex items-center justify-between text-xs font-bold uppercase text-mist">
              <span>Progresso</span>
              <span>{progress}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-gold transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-2 md:grid-cols-5">
          {stepItems.map((step, index) => (
            <button
              key={step.number}
              type="button"
              onClick={() => setActiveStep(index)}
              className={cn(
                "rounded-premium border p-3 text-left transition",
                activeStep === index ? "border-gold/50 bg-gold/10 text-frost" : "border-white/10 bg-black/15 text-mist hover:text-frost"
              )}
            >
              <span className="text-xs font-black text-gold">Passo {step.number}</span>
              <span className="mt-1 block text-sm font-bold">{step.title}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="rounded-premium border border-white/10 bg-white/[.045] p-5">
          <div className="flex flex-col gap-3 border-b border-white/10 pb-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <span className="text-sm font-black uppercase text-gold">Passo {stepItems[activeStep].number}</span>
              <h3 className="mt-2 text-2xl font-black text-frost">{stepItems[activeStep].title}</h3>
              <p className="mt-2 text-sm text-mist">{stepItems[activeStep].description}</p>
            </div>
            <div className="inline-flex rounded-premium border border-white/10 bg-black/20 p-1">
              <Button type="button" size="sm" variant="ghost" disabled={activeStep === 0} onClick={() => setActiveStep((step) => Math.max(0, step - 1))}>
                <ChevronLeft className="size-4" />
              </Button>
              <Button type="button" size="sm" variant="ghost" disabled={activeStep === stepItems.length - 1} onClick={() => setActiveStep((step) => Math.min(stepItems.length - 1, step + 1))}>
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>

          <div className="pt-5">
            {activeStep === 0 ? (
              <section className="grid gap-5">
                <div className="grid gap-3 md:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setColorMode("choose")}
                    className={cn(
                      "rounded-premium border p-4 text-left transition",
                      colorMode === "choose" ? "border-gold/50 bg-gold/10" : "border-white/10 bg-black/20 hover:border-white/20"
                    )}
                  >
                    <strong className="text-frost">Modo 1 — Escolher as cores primeiro</strong>
                    <span className="mt-2 block text-sm leading-6 text-mist">
                      Exibe todas as combinacoes possiveis e filtra comandantes pela identidade escolhida.
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setColorMode("auto")}
                    className={cn(
                      "rounded-premium border p-4 text-left transition",
                      colorMode === "auto" ? "border-gold/50 bg-gold/10" : "border-white/10 bg-black/20 hover:border-white/20"
                    )}
                  >
                    <strong className="text-frost">Modo 2 — Nao escolher cores</strong>
                    <span className="mt-2 block text-sm leading-6 text-mist">
                      A IA sugere automaticamente a melhor identidade com base no estilo e arquetipos.
                    </span>
                  </button>
                </div>

                {colorMode === "auto" ? (
                  <div className="rounded-premium border border-violet/30 bg-violet/10 p-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <Bot className="size-5 text-gold" />
                      <strong className="text-frost">Sugestao atual da IA: {suggestedIdentity.name}</strong>
                      <ManaPips colors={suggestedIdentity.colors} />
                    </div>
                    <p className="mt-2 text-sm leading-6 text-mist">{suggestedIdentity.description}</p>
                  </div>
                ) : null}

                <div className={cn("grid gap-5", colorMode === "auto" && "opacity-50")}>
                  {identityGroups.map((group) => (
                    <div key={group}>
                      <h4 className="text-sm font-black uppercase text-gold">{group}</h4>
                      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        {colorIdentities
                          .filter((identity) => identity.group === group)
                          .map((identity) => (
                            <button
                              key={identity.id}
                              type="button"
                              disabled={colorMode === "auto"}
                              onClick={() => setSelectedIdentityId(identity.id)}
                              className={cn(
                                "rounded-premium border p-3 text-left transition disabled:pointer-events-none",
                                selectedIdentityId === identity.id && colorMode === "choose"
                                  ? "border-gold/50 bg-gold/10"
                                  : "border-white/10 bg-black/20 hover:border-gold/30"
                              )}
                            >
                              <span className="flex items-center justify-between gap-3">
                                <strong className="text-frost">{identity.name}</strong>
                                <ManaPips colors={identity.colors} />
                              </span>
                              <span className="mt-1 block text-xs font-bold text-gold">{identity.code}</span>
                              <span className="mt-2 block text-xs leading-5 text-mist">{identity.description}</span>
                            </button>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            {activeStep === 1 ? (
              <section className="grid gap-5">
                <div className="flex flex-col gap-3 rounded-premium border border-white/10 bg-black/20 p-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm text-mist">Identidade ativa</p>
                    <div className="mt-1 flex items-center gap-3">
                      <strong className="text-frost">{activeIdentity.name}</strong>
                      <ManaPips colors={activeIdentity.colors} />
                    </div>
                  </div>
                  <Button type="button" variant="secondary" onClick={surpriseMe}>
                    <Shuffle className="size-4" />
                    Surpreenda-me
                  </Button>
                </div>

                <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                  <label className="flex min-h-11 flex-1 items-center gap-2 rounded-premium border border-white/10 bg-black/20 px-3">
                    <Search className="size-4 text-mist" />
                    <input
                      value={commanderSearch}
                      onChange={(event) => setCommanderSearch(event.target.value)}
                      placeholder="Buscar comandante por nome"
                      className="w-full bg-transparent text-sm text-frost outline-none placeholder:text-mist"
                    />
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {commanderFilters.map((filter) => (
                      <button
                        key={filter.id}
                        type="button"
                        onClick={() => setActiveCommanderFilter(filter.id)}
                        className={cn(
                          "rounded-premium border px-3 py-2 text-xs font-bold transition",
                        activeCommanderFilter === filter.id
                            ? "border-gold/50 bg-gold/10 text-gold"
                            : "border-white/10 bg-black/20 text-mist hover:text-frost"
                        )}
                        title={filter.description}
                      >
                        {filter.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  {compatibleCommanders.map((commander) => (
                    <button
                      key={commander.name}
                      type="button"
                      onClick={() => setSelectedCommanderName(commander.name)}
                      className={cn(
                        "rounded-premium border p-4 text-left transition hover:border-gold/35",
                        displayCommander?.name === commander.name ? "border-gold/50 bg-gold/10" : "border-white/10 bg-black/20"
                      )}
                    >
                      <span className="flex items-start justify-between gap-3">
                        <span>
                          <strong className="text-frost">{commander.name}</strong>
                          <span className="mt-1 block text-xs text-gold">{commander.archetypes.slice(0, 3).join(" / ")}</span>
                        </span>
                        <ManaPips colors={commander.identity} />
                      </span>
                      <span className="mt-3 block text-sm leading-6 text-mist">{commander.summary}</span>
                      <span className="mt-3 flex flex-wrap gap-2 text-xs">
                        <span className="rounded-full bg-white/10 px-2 py-1 text-mist">Power {commander.power}</span>
                        <span className="rounded-full bg-white/10 px-2 py-1 text-mist">Dificuldade {commander.complexity}</span>
                        <span className="rounded-full bg-white/10 px-2 py-1 text-mist">{commander.priceTier}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </section>
            ) : null}

            {activeStep === 2 ? (
              <OptionGrid
                options={archetypeOptions}
                selected={selectedArchetypes}
                onToggle={(value) => setSelectedArchetypes((current) => toggleValue(current, value))}
              />
            ) : null}

            {activeStep === 3 ? (
              <OptionGrid
                options={styleOptions}
                selected={selectedStyles}
                onToggle={(value) => setSelectedStyles((current) => toggleValue(current, value))}
              />
            ) : null}

            {activeStep === 4 ? (
              <section className="grid gap-4">
                {preferenceQuestions.map((question) => (
                  <div key={question.id} className="rounded-premium border border-white/10 bg-black/20 p-4">
                    <h4 className="font-black text-frost">{question.label}</h4>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {question.options.map((option) => (
                        <label
                          key={option}
                          className={cn(
                            "flex cursor-pointer items-center gap-2 rounded-premium border px-3 py-2 text-sm transition",
                            preferences[question.id] === option
                              ? "border-gold/50 bg-gold/10 text-frost"
                              : "border-white/10 bg-white/[.04] text-mist hover:text-frost"
                          )}
                        >
                          <input
                            type="radio"
                            name={question.id}
                            checked={preferences[question.id] === option}
                            onChange={() => updatePreference(question.id, option)}
                            className="size-4 accent-[#D7B46A]"
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </section>
            ) : null}
          </div>

          <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:justify-between">
            <Button type="button" variant="secondary" disabled={activeStep === 0} onClick={() => setActiveStep((step) => Math.max(0, step - 1))}>
              <ChevronLeft className="size-4" />
              Voltar
            </Button>
            <Button
              type="button"
              disabled={activeStep === stepItems.length - 1}
              onClick={() => setActiveStep((step) => Math.min(stepItems.length - 1, step + 1))}
            >
              Continuar
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>

        <aside className="rounded-premium border border-gold/20 bg-gold/10 p-5 xl:sticky xl:top-28 xl:self-start">
          <div className="flex items-center gap-2 text-gold">
            <Sparkles className="size-5" />
            <strong>Prévia inteligente</strong>
          </div>
          <h3 className="mt-4 text-2xl font-black text-frost">{displayCommander ? `${displayCommander.name} ${activeIdentity.code}` : `${activeIdentity.name} Commander`}</h3>
          <p className="mt-3 text-sm leading-6 text-mist">{getStrategyLine(activeIdentity, displayCommander, selectedArchetypes, selectedStyles)}</p>

          <div className="mt-5 grid gap-3">
            <SummaryLine label="Identidade" value={activeIdentity.name} detail={<ManaPips colors={activeIdentity.colors} />} />
            <SummaryLine label="Comandante" value={displayCommander?.name ?? "Aguardando escolha"} />
            <SummaryLine label="Power estimado" value={`${estimatedPower}/10`} />
            <SummaryLine label="Budget" value={estimatedBudget} />
            <SummaryLine label="Arquétipos" value={selectedArchetypes.length ? selectedArchetypes.slice(0, 3).join(", ") : "Nenhum selecionado"} />
            <SummaryLine label="Mesa" value={preferences.tablePower ?? "Casual"} />
          </div>

          <div className="mt-5 rounded-premium border border-white/10 bg-black/20 p-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-5 text-gold" />
              <strong className="text-frost">Como a IA vai usar isso</strong>
            </div>
            <p className="mt-3 text-sm leading-6 text-mist">
              As escolhas alimentam a futura geracao do deck: comandante, curva de mana, nivel de interacao, tolerancia a
              combos, limite de cartas caras e adequacao ao power level da sua mesa.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function OptionGrid({ options, selected, onToggle }: { options: string[]; selected: string[]; onToggle: (value: string) => void }) {
  return (
    <section className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {options.map((option) => {
        const checked = selected.includes(option);
        return (
          <button
            key={option}
            type="button"
            onClick={() => onToggle(option)}
            className={cn(
              "flex min-h-14 items-center justify-between gap-3 rounded-premium border px-4 py-3 text-left transition",
              checked ? "border-gold/50 bg-gold/10 text-frost" : "border-white/10 bg-black/20 text-mist hover:text-frost"
            )}
          >
            <span className="text-sm font-bold">{option}</span>
            <span className={cn("grid size-5 place-items-center rounded-full border", checked ? "border-gold bg-gold text-obsidian" : "border-white/20")}>
              {checked ? <CheckCircle2 className="size-4" /> : null}
            </span>
          </button>
        );
      })}
    </section>
  );
}

function SummaryLine({ label, value, detail }: { label: string; value: string; detail?: ReactNode }) {
  return (
    <div className="rounded-premium border border-white/10 bg-black/20 p-3">
      <span className="text-xs font-bold uppercase text-mist">{label}</span>
      <span className="mt-1 flex items-center justify-between gap-3 text-sm font-black text-frost">
        {value}
        {detail}
      </span>
    </div>
  );
}
