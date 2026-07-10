"use client";

import {
  Bot,
  Brain,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  FileText,
  Play,
  Save,
  Search,
  Share2,
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
  styleOptions,
  suggestColorIdentity,
  type ColorIdentity,
  type ColorIdentityGroup,
  type CommanderFilterId,
  type CommanderProfile,
  type ManaColor
} from "@/lib/deck-builder";
import { cn, formatMoney } from "@/lib/utils";

type DeckCardLine = {
  name: string;
  reason: string;
  expensive?: boolean;
  budgetAlternative?: string;
  premiumAlternative?: string;
};

type DeckSection = {
  title: string;
  target: string;
  cards: DeckCardLine[];
};

const wizardSections = [
  { title: "Identidade de cores", description: "Escolha as cores ou deixe a IA sugerir com base no plano do deck." },
  { title: "Orcamento", description: "Defina quanto o deck pode custar e se existe teto real de investimento." },
  { title: "Experiencia", description: "Ajuste a lista para iniciante, intermediario, avancado ou competitivo." },
  { title: "Complexidade", description: "Escolha se o deck precisa ser simples ou extremamente tecnico." },
  { title: "Comandante", description: "Veja todos os comandantes que contem as cores escolhidas." },
  { title: "Arquetipo", description: "Defina uma ou mais linhas principais do deck." },
  { title: "Estilo", description: "Modele como o deck deve se comportar na mesa." },
  { title: "Preferencias", description: "Ajuste combos, cartas caras, proxies, banlist e power level." },
  { title: "Resultado", description: "Revise a lista, explicacao, alternativas, otimização, exportacao e simulador." }
];

const identityGroups: ColorIdentityGroup[] = ["Monocolor", "Duas cores", "Tres cores", "Quatro cores", "Cinco cores"];

const budgetPresets = [10000, 30000, 50000, 80000, 100000, 200000, 300000, 500000];

const playerExperienceOptions = ["Nunca joguei", "Iniciante", "Intermediario", "Avancado", "Competitivo"];

const complexityOptions = ["Muito simples", "Facil", "Media", "Dificil", "Extremamente tecnica"];

const optimizationOptions = [
  "Mais barato",
  "Mais competitivo",
  "Mais divertido",
  "Mais consistente",
  "Mais combos",
  "Mais interacao",
  "Mais draw",
  "Mais ramp",
  "Mais remocoes",
  "Mais velocidade",
  "Mais resistencia"
];

const exportOptions = ["LigaMagic", "Moxfield", "Archidekt", "ManaBox", "TappedOut", "Texto", "CSV", "PDF"];

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
            "grid place-items-center rounded-full border font-black shadow-[0_0_14px_rgba(255,255,255,.12)]",
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

function commanderContainsColors(identity: ColorIdentity, commander: CommanderProfile) {
  if (identity.colors.includes("C")) return commander.identity.includes("C");
  return identity.colors.every((color) => commander.identity.includes(color));
}

function estimatePower(commander: CommanderProfile | undefined, preferences: Record<string, string>, archetypes: string[], complexity: string) {
  const base = commander?.power ?? 6;
  const tableBonus = preferences.tablePower === "cEDH" ? 2 : preferences.tablePower === "Power Level 9" ? 1 : 0;
  const comboBonus = archetypes.includes("Combo") || archetypes.includes("Storm") ? 1 : 0;
  const complexityBonus = complexity === "Extremamente tecnica" || complexity === "Dificil" ? 1 : 0;
  const proxyBonus = preferences.proxies === "Sim" ? 1 : 0;
  return Math.min(10, Math.max(1, base + tableBonus + comboBonus + complexityBonus + proxyBonus));
}

function getStrategyLine(identity: ColorIdentity, commander: CommanderProfile | undefined, archetypes: string[], styles: string[]) {
  const commanderName = commander?.name ?? "um comandante compativel";
  const archetypeText = archetypes.length ? archetypes.slice(0, 3).join(", ") : "Value, Ramp e Interacao";
  const styleText = styles.length ? styles.slice(0, 2).join(" + ") : "jogo equilibrado";
  return `A IA montaria uma base ${identity.name} (${identity.code}) em torno de ${commanderName}, priorizando ${archetypeText} e ajustando a lista para ${styleText}.`;
}

function buildDeckSections(commander: CommanderProfile | undefined, identity: ColorIdentity, archetypes: string[], budgetUnlimited: boolean): DeckSection[] {
  const commanderName = commander?.name ?? `${identity.name} Commander`;
  const hasGreen = identity.colors.includes("G");
  const hasBlue = identity.colors.includes("U");
  const hasBlack = identity.colors.includes("B");
  const hasWhite = identity.colors.includes("W");
  const hasRed = identity.colors.includes("R");
  const wantsCombo = archetypes.includes("Combo") || archetypes.includes("Storm");
  const wantsTokens = archetypes.includes("Tokens") || archetypes.includes("Tribal");
  const wantsArtifacts = archetypes.includes("Artifacts");

  return [
    {
      title: "Comandante",
      target: "1 carta",
      cards: [
        {
          name: commanderName,
          reason: "Define a identidade de cores, o plano principal e a forma como a lista sera construida ao redor da mesa."
        }
      ]
    },
    {
      title: "Terrenos",
      target: "36 cartas",
      cards: [
        { name: "Command Tower", reason: "Entra desvirado e gera qualquer cor da identidade do comandante." },
        { name: "Path of Ancestry", reason: "Corrige mana e ainda filtra o topo em decks com criaturas relevantes." },
        { name: hasGreen ? "Yavimaya, Cradle of Growth" : "Exotic Orchard", reason: hasGreen ? "Melhora a base verde e ajuda terrenos a produzirem verde." : "Costuma gerar cores importantes em mesas multiplayer." },
        { name: "Pacote de terrenos basicos", reason: "Mantem consistencia, resiste a hate de terrenos nao basicos e respeita o orcamento." }
      ]
    },
    {
      title: "Ramp",
      target: "10 cartas",
      cards: [
        { name: "Sol Ring", reason: "Acelerador universal de Commander e melhor abertura para quase qualquer lista.", expensive: false },
        { name: "Arcane Signet", reason: "Corrige cores e acelera sem exigir condicao adicional." },
        { name: hasGreen ? "Cultivate" : "Mind Stone", reason: hasGreen ? "Busca terrenos, estabiliza cores e garante land drops." : "Acelera cedo e pode virar compra no late game." },
        { name: hasGreen ? "Nature's Lore" : "Fellwar Stone", reason: hasGreen ? "Ramp eficiente que encontra duals com tipo Floresta." : "Boa pedra de mana em mesas com muitas cores." }
      ]
    },
    {
      title: "Draw",
      target: "10 cartas",
      cards: [
        { name: hasBlue ? "Rhystic Study" : "Skullclamp", reason: hasBlue ? "Fonte premium de vantagem que pune oponentes por jogar no ritmo normal." : "Compra muitas cartas em decks com criaturas pequenas ou tokens.", expensive: hasBlue, budgetAlternative: hasBlue ? "Mystic Remora" : "Village Rites", premiumAlternative: hasBlue ? "The One Ring" : "Necropotence" },
        { name: hasGreen ? "Guardian Project" : "Esper Sentinel", reason: hasGreen ? "Transforma criaturas em fluxo constante de cartas." : "Compra ou taxa recursos dos oponentes desde cedo." },
        { name: hasBlack ? "Night's Whisper" : "Tome of Legends", reason: hasBlack ? "Compra barata e eficiente para manter a mao cheia." : "Funciona bem com comandante atacando ou entrando em jogo." }
      ]
    },
    {
      title: "Tutores",
      target: "3 a 5 cartas",
      cards: [
        { name: hasBlack ? "Demonic Tutor" : hasGreen ? "Finale of Devastation" : "Solve the Equation", reason: "Encontra a carta certa para fechar o plano, buscar resposta ou iniciar uma linha de vitoria.", expensive: true, budgetAlternative: hasBlack ? "Diabolic Tutor" : "Shared Summons", premiumAlternative: "Imperial Seal" },
        { name: wantsArtifacts ? "Fabricate" : "Open the Armory", reason: wantsArtifacts ? "Busca a peca de artefato essencial." : "Encontra equipamento, aura ou protecao importante." }
      ]
    },
    {
      title: "Remocoes",
      target: "8 cartas",
      cards: [
        { name: hasWhite ? "Swords to Plowshares" : hasBlack ? "Feed the Swarm" : "Beast Within", reason: "Remove ameacas problematicas com baixo custo e alta flexibilidade." },
        { name: hasRed ? "Chaos Warp" : hasBlue ? "Pongify" : "Generous Gift", reason: "Resposta versatil para permanentes que podem impedir seu plano." },
        { name: "Respostas pontuais flexiveis", reason: "A IA reserva slots para criaturas, encantamentos, artefatos e permanentes-chave do meta local." }
      ]
    },
    {
      title: "Board Wipes",
      target: "2 a 4 cartas",
      cards: [
        { name: hasWhite ? "Austere Command" : hasRed ? "Blasphemous Act" : "Toxic Deluge", reason: "Limpa a mesa no momento certo sem abandonar o plano principal do deck.", expensive: !hasWhite && !hasRed, budgetAlternative: "Crux of Fate", premiumAlternative: "Cyclonic Rift" },
        { name: hasBlue ? "Cyclonic Rift" : "Nevinyrral's Disk", reason: hasBlue ? "Reseta o ritmo dos oponentes e abre uma janela de vitoria." : "Botao de emergencia para mesas travadas." }
      ]
    },
    {
      title: "Protecoes",
      target: "5 cartas",
      cards: [
        { name: hasGreen ? "Heroic Intervention" : "Swiftfoot Boots", reason: hasGreen ? "Protege a mesa inteira contra wipes e remocoes." : "Mantem o comandante vivo e acelera ataques importantes.", expensive: hasGreen, budgetAlternative: "Tamiyo's Safekeeping", premiumAlternative: "Teferi's Protection" },
        { name: hasWhite ? "Teferi's Protection" : "Lightning Greaves", reason: "Protege o investimento principal e evita perder o jogo para uma unica resposta." }
      ]
    },
    {
      title: "Win Conditions",
      target: "4 a 6 cartas",
      cards: [
        { name: wantsTokens ? "Craterhoof Behemoth" : wantsCombo ? "Aetherflux Reservoir" : "Finale of Devastation", reason: "Converte vantagem acumulada em fechamento real de partida.", expensive: true, budgetAlternative: wantsTokens ? "Overrun" : "Overwhelming Stampede", premiumAlternative: "Craterhoof Behemoth" },
        { name: commanderName, reason: "O comandante tambem funciona como motor ou condicao de vitoria quando protegido." }
      ]
    },
    {
      title: "Combos",
      target: wantsCombo ? "3 pacotes" : "0 a 1 pacote",
      cards: [
        { name: wantsCombo ? "Isochron Scepter + Dramatic Reversal" : "Combo leve opcional", reason: wantsCombo ? "Linha compacta para gerar valor/mana repetidamente com pedras suficientes." : "Mantido como pacote discreto para nao dominar a experiencia casual." },
        { name: hasBlack ? "Reassembling Skeleton + Ashnod's Altar" : "Engine de valor recorrente", reason: hasBlack ? "Base sacrificio simples para aristocrats e mana." : "A IA prefere sinergias que parecam jogo normal antes de virar vitoria." }
      ]
    },
    {
      title: "Utilidades",
      target: "10 a 12 cartas",
      cards: [
        { name: hasGreen ? "Eternal Witness" : "Commander's Sphere", reason: hasGreen ? "Recupera cartas importantes e aumenta resiliencia." : "Corrige mana e compra carta quando nao for mais necessario." },
        { name: "Reliquary Tower", reason: "Evita descartar quando o deck compra muitas cartas." },
        { name: "Graveyard hate flexivel", reason: "Mantem a lista preparada contra reanimator e combos de cemiterio." }
      ]
    }
  ];
}

function getExplanation(
  commander: CommanderProfile | undefined,
  identity: ColorIdentity,
  archetypes: string[],
  styles: string[],
  experience: string,
  complexity: string
) {
  const commanderName = commander?.name ?? `${identity.name} Commander`;
  const archetypeText = archetypes.length ? archetypes.join(", ") : "Value";
  return [
    {
      title: "Por que cada carta foi escolhida",
      text: "Cada slot aparece com uma justificativa funcional: acelerar, comprar, responder, proteger, finalizar ou sustentar o plano do comandante."
    },
    {
      title: "Como o deck joga",
      text: `${commanderName} usa ${identity.code} para desenvolver mana, criar vantagem e transformar ${archetypeText} em pressao progressiva. A curva e ajustada para ${experience.toLowerCase()} e complexidade ${complexity.toLowerCase()}.`
    },
    {
      title: "Como vencer",
      text: "A lista vence acumulando vantagem, protegendo o motor principal e escolhendo a janela certa para combo, ataque letal ou finalizador de alto impacto."
    },
    {
      title: "Quando fazer mulligan",
      text: "Mulligue maos sem duas fontes de mana, sem acelerador ou sem plano ate o turno tres. Maos com ramp, draw e uma interacao costumam ser melhores."
    },
    {
      title: "Melhores jogadas",
      text: "Priorize mana cedo, proteja o comandante antes de expor pecas caras e use remocoes apenas em ameacas que impedem sua vitoria."
    },
    {
      title: "Combos",
      text: styles.includes("Nao quero combos infinitos") ? "A IA evita combos infinitos e prefere sinergias de valor." : "Combos sao incluidos como linhas justificadas, com pecas que tambem funcionam fora do combo."
    },
    {
      title: "Fraquezas",
      text: "O deck pode sofrer contra stax pesado, hate de cemiterio, excesso de wipes ou mesas mais rapidas que seu power level configurado."
    },
    {
      title: "Pontos fortes",
      text: "A principal forca e ter um plano claro, cartas com funcoes definidas e alternativas de upgrade ou economia para cada peca cara."
    }
  ];
}

export function DeckBuilderClient() {
  const [activeSection, setActiveSection] = useState(0);
  const [colorMode, setColorMode] = useState<"choose" | "auto">("choose");
  const [selectedIdentityId, setSelectedIdentityId] = useState("g");
  const [budget, setBudget] = useState(80000);
  const [budgetUnlimited, setBudgetUnlimited] = useState(false);
  const [playerExperience, setPlayerExperience] = useState("Iniciante");
  const [complexity, setComplexity] = useState("Media");
  const [activeCommanderFilter, setActiveCommanderFilter] = useState<CommanderFilterId>("popular");
  const [commanderSearch, setCommanderSearch] = useState("");
  const [selectedCommanderName, setSelectedCommanderName] = useState("");
  const [selectedArchetypes, setSelectedArchetypes] = useState<string[]>(["Ramp", "Value"]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>(["Quero deck divertido", "Quero muita interacao"]);
  const [preferences, setPreferences] = useState<Record<string, string>>(initialPreferences);
  const [optimizationFocus, setOptimizationFocus] = useState("Mais consistente");
  const [handTested, setHandTested] = useState(false);

  const suggestedIdentity = useMemo(
    () => suggestColorIdentity(selectedArchetypes, selectedStyles),
    [selectedArchetypes, selectedStyles]
  );

  const activeIdentity = colorMode === "auto" ? suggestedIdentity : getColorIdentityById(selectedIdentityId);

  const compatibleCommanders = useMemo(() => {
    const search = commanderSearch.trim().toLowerCase();
    const pool = commanderPool.filter((commander) => commanderContainsColors(activeIdentity, commander));
    const searched = search ? pool.filter((commander) => commander.name.toLowerCase().includes(search)) : pool;
    return sortCommanders(searched, activeCommanderFilter);
  }, [activeCommanderFilter, activeIdentity, commanderSearch]);

  const selectedCommander = useMemo(
    () => commanderPool.find((commander) => commander.name === selectedCommanderName),
    [selectedCommanderName]
  );

  const recommendedCommander = compatibleCommanders[0];
  const displayCommander =
    selectedCommander && compatibleCommanders.some((commander) => commander.name === selectedCommander.name)
      ? selectedCommander
      : recommendedCommander;

  const estimatedPower = estimatePower(displayCommander, preferences, selectedArchetypes, complexity);
  const deckSections = buildDeckSections(displayCommander, activeIdentity, selectedArchetypes, budgetUnlimited);
  const explanation = getExplanation(displayCommander, activeIdentity, selectedArchetypes, selectedStyles, playerExperience, complexity);
  const totalCards = 100;
  const displayedCost = budgetUnlimited ? "Sem limite" : formatMoney(budget);
  const progress = Math.round(((activeSection + 1) / wizardSections.length) * 100);
  const simulatorStats = {
    mulligan: Math.max(8, 26 - Math.round(estimatedPower * 1.2)),
    ramp: selectedArchetypes.includes("Ramp") || activeIdentity.colors.includes("G") ? 78 : 62,
    draw: activeIdentity.colors.includes("U") ? 74 : 58,
    lands: budget >= 100000 || budgetUnlimited ? 83 : 76
  };

  function updatePreference(questionId: string, value: string) {
    setPreferences((current) => ({ ...current, [questionId]: value }));
  }

  function surpriseMe() {
    const candidates = compatibleCommanders.slice(0, Math.min(compatibleCommanders.length, 8));
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
              Um configurador premium para Commander: escolha cores, orcamento, experiencia, comandante, estrategia e veja a
              estrutura do deck com justificativas.
            </p>
          </div>
          <div className="min-w-[220px]">
            <div className="flex items-center justify-between text-xs font-bold uppercase text-mist">
              <span>Progresso</span>
              <span>{progress}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-gold transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-2 md:grid-cols-3 xl:grid-cols-9">
          {wizardSections.map((section, index) => (
            <button
              key={section.title}
              type="button"
              onClick={() => setActiveSection(index)}
              className={cn(
                "rounded-premium border p-3 text-left transition",
                activeSection === index ? "border-gold/50 bg-gold/10 text-frost" : "border-white/10 bg-black/15 text-mist hover:text-frost"
              )}
            >
              <span className="block text-sm font-bold">{section.title}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="rounded-premium border border-white/10 bg-white/[.045] p-5">
          <div className="flex flex-col gap-3 border-b border-white/10 pb-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-2xl font-black text-frost">{wizardSections[activeSection].title}</h3>
              <p className="mt-2 text-sm text-mist">{wizardSections[activeSection].description}</p>
            </div>
            <div className="inline-flex rounded-premium border border-white/10 bg-black/20 p-1">
              <Button type="button" size="sm" variant="ghost" disabled={activeSection === 0} onClick={() => setActiveSection((step) => Math.max(0, step - 1))}>
                <ChevronLeft className="size-4" />
              </Button>
              <Button type="button" size="sm" variant="ghost" disabled={activeSection === wizardSections.length - 1} onClick={() => setActiveSection((step) => Math.min(wizardSections.length - 1, step + 1))}>
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>

          <div className="pt-5">
            {activeSection === 0 ? (
              <ColorIdentitySection
                colorMode={colorMode}
                setColorMode={setColorMode}
                selectedIdentityId={selectedIdentityId}
                setSelectedIdentityId={setSelectedIdentityId}
                suggestedIdentity={suggestedIdentity}
              />
            ) : null}

            {activeSection === 1 ? (
              <BudgetSection
                budget={budget}
                setBudget={setBudget}
                budgetUnlimited={budgetUnlimited}
                setBudgetUnlimited={setBudgetUnlimited}
              />
            ) : null}

            {activeSection === 2 ? (
              <ChoiceCards options={playerExperienceOptions} selected={playerExperience} onSelect={setPlayerExperience} />
            ) : null}

            {activeSection === 3 ? (
              <ChoiceCards options={complexityOptions} selected={complexity} onSelect={setComplexity} />
            ) : null}

            {activeSection === 4 ? (
              <CommanderSection
                activeIdentity={activeIdentity}
                activeCommanderFilter={activeCommanderFilter}
                setActiveCommanderFilter={setActiveCommanderFilter}
                commanderSearch={commanderSearch}
                setCommanderSearch={setCommanderSearch}
                compatibleCommanders={compatibleCommanders}
                displayCommander={displayCommander}
                setSelectedCommanderName={setSelectedCommanderName}
                surpriseMe={surpriseMe}
              />
            ) : null}

            {activeSection === 5 ? (
              <OptionGrid
                options={archetypeOptions}
                selected={selectedArchetypes}
                onToggle={(value) => setSelectedArchetypes((current) => toggleValue(current, value))}
              />
            ) : null}

            {activeSection === 6 ? (
              <OptionGrid
                options={styleOptions}
                selected={selectedStyles}
                onToggle={(value) => setSelectedStyles((current) => toggleValue(current, value))}
              />
            ) : null}

            {activeSection === 7 ? (
              <PreferencesSection preferences={preferences} updatePreference={updatePreference} />
            ) : null}

            {activeSection === 8 ? (
              <ResultSection
                deckSections={deckSections}
                explanation={explanation}
                optimizationFocus={optimizationFocus}
                setOptimizationFocus={setOptimizationFocus}
                handTested={handTested}
                setHandTested={setHandTested}
                simulatorStats={simulatorStats}
              />
            ) : null}
          </div>

          <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:justify-between">
            <Button type="button" variant="secondary" disabled={activeSection === 0} onClick={() => setActiveSection((step) => Math.max(0, step - 1))}>
              <ChevronLeft className="size-4" />
              Voltar
            </Button>
            <Button
              type="button"
              disabled={activeSection === wizardSections.length - 1}
              onClick={() => setActiveSection((step) => Math.min(wizardSections.length - 1, step + 1))}
            >
              Continuar
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>

        <aside className="rounded-premium border border-gold/20 bg-gold/10 p-5 xl:sticky xl:top-28 xl:self-start">
          <div className="flex items-center gap-2 text-gold">
            <Sparkles className="size-5" />
            <strong>Previa inteligente</strong>
          </div>
          <h3 className="mt-4 text-2xl font-black text-frost">
            {displayCommander ? `${displayCommander.name} ${activeIdentity.code}` : `${activeIdentity.name} Commander`}
          </h3>
          <p className="mt-3 text-sm leading-6 text-mist">{getStrategyLine(activeIdentity, displayCommander, selectedArchetypes, selectedStyles)}</p>

          <div className="mt-5 grid gap-3">
            <SummaryLine label="Identidade" value={activeIdentity.name} detail={<ManaPips colors={activeIdentity.colors} />} />
            <SummaryLine label="Comandante" value={displayCommander?.name ?? "Aguardando escolha"} />
            <SummaryLine label="Custo do deck" value={displayedCost} />
            <SummaryLine label="Experiencia" value={playerExperience} />
            <SummaryLine label="Complexidade" value={complexity} />
            <SummaryLine label="Power estimado" value={`${estimatedPower}/10`} />
            <SummaryLine label="Cartas" value={`${totalCards} cartas`} />
          </div>

          <div className="mt-5 rounded-premium border border-white/10 bg-black/20 p-4">
            <div className="flex items-center gap-2">
              <Brain className="size-5 text-gold" />
              <strong className="text-frost">IA com justificativa</strong>
            </div>
            <p className="mt-3 text-sm leading-6 text-mist">
              A lista nunca aparece como pilha de nomes: cada categoria mostra motivo, funcao, alternativas e impacto no plano de jogo.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function ColorIdentitySection({
  colorMode,
  setColorMode,
  selectedIdentityId,
  setSelectedIdentityId,
  suggestedIdentity
}: {
  colorMode: "choose" | "auto";
  setColorMode: (mode: "choose" | "auto") => void;
  selectedIdentityId: string;
  setSelectedIdentityId: (id: string) => void;
  suggestedIdentity: ColorIdentity;
}) {
  return (
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
          <strong className="text-frost">Escolher as cores primeiro</strong>
          <span className="mt-2 block text-sm leading-6 text-mist">
            Mostra todas as identidades e depois lista comandantes que contem essas cores.
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
          <strong className="text-frost">Deixar a IA sugerir</strong>
          <span className="mt-2 block text-sm leading-6 text-mist">
            A IA sugere uma identidade baseada em arquetipos, estilo e preferencias.
          </span>
        </button>
      </div>

      {colorMode === "auto" ? (
        <div className="rounded-premium border border-violet/30 bg-violet/10 p-4">
          <div className="flex flex-wrap items-center gap-3">
            <Bot className="size-5 text-gold" />
            <strong className="text-frost">Sugestao atual: {suggestedIdentity.name}</strong>
            <ManaPips colors={suggestedIdentity.colors} size="md" />
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
  );
}

function BudgetSection({
  budget,
  setBudget,
  budgetUnlimited,
  setBudgetUnlimited
}: {
  budget: number;
  setBudget: (value: number) => void;
  budgetUnlimited: boolean;
  setBudgetUnlimited: (value: boolean) => void;
}) {
  return (
    <section className="grid gap-5">
      <div className="rounded-premium border border-white/10 bg-black/20 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h4 className="text-xl font-black text-frost">Custo do deck</h4>
            <p className="mt-1 text-sm text-mist">Esse valor guia escolhas, staples caras e alternativas economicas.</p>
          </div>
          <strong className="text-2xl text-gold">{budgetUnlimited ? "Sem limite" : formatMoney(budget)}</strong>
        </div>
        <input
          type="range"
          min={10000}
          max={500000}
          step={10000}
          value={budget}
          disabled={budgetUnlimited}
          onChange={(event) => setBudget(Number(event.target.value))}
          className="mt-5 w-full accent-[#D7B46A]"
        />
        <div className="mt-4 flex flex-wrap gap-2">
          {budgetPresets.map((preset) => (
            <button
              key={preset}
              type="button"
              disabled={budgetUnlimited}
              onClick={() => setBudget(preset)}
              className={cn(
                "rounded-premium border px-3 py-2 text-sm font-bold transition disabled:opacity-40",
                budget === preset && !budgetUnlimited ? "border-gold/50 bg-gold/10 text-gold" : "border-white/10 bg-white/[.04] text-mist hover:text-frost"
              )}
            >
              {formatMoney(preset)}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setBudgetUnlimited(!budgetUnlimited)}
            className={cn(
              "rounded-premium border px-3 py-2 text-sm font-bold transition",
              budgetUnlimited ? "border-gold/50 bg-gold/10 text-gold" : "border-white/10 bg-white/[.04] text-mist hover:text-frost"
            )}
          >
            Sem limite
          </button>
        </div>
        <label className="mt-5 block text-sm font-bold text-frost">
          Valor personalizado
          <input
            type="number"
            min={100}
            step={50}
            value={Math.round(budget / 100)}
            disabled={budgetUnlimited}
            onChange={(event) => setBudget(Math.max(100, Number(event.target.value) || 100) * 100)}
            className="mt-2 h-11 w-full rounded-premium border border-white/10 bg-black/30 px-3 text-frost outline-none disabled:opacity-40"
          />
        </label>
      </div>
    </section>
  );
}

function ChoiceCards({ options, selected, onSelect }: { options: string[]; selected: string; onSelect: (value: string) => void }) {
  return (
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onSelect(option)}
          className={cn(
            "min-h-24 rounded-premium border p-4 text-left transition",
            selected === option ? "border-gold/50 bg-gold/10 text-frost" : "border-white/10 bg-black/20 text-mist hover:text-frost"
          )}
        >
          <strong>{option}</strong>
          <span className="mt-2 block text-sm leading-6 text-mist">
            {option.includes("tecn") || option.includes("Competitivo")
              ? "A IA pode usar linhas mais exigentes, stacks e decisoes de sequencing."
              : "A IA prioriza clareza, consistencia e cartas faceis de entender."}
          </span>
        </button>
      ))}
    </section>
  );
}

function CommanderSection({
  activeIdentity,
  activeCommanderFilter,
  setActiveCommanderFilter,
  commanderSearch,
  setCommanderSearch,
  compatibleCommanders,
  displayCommander,
  setSelectedCommanderName,
  surpriseMe
}: {
  activeIdentity: ColorIdentity;
  activeCommanderFilter: CommanderFilterId;
  setActiveCommanderFilter: (filter: CommanderFilterId) => void;
  commanderSearch: string;
  setCommanderSearch: (value: string) => void;
  compatibleCommanders: CommanderProfile[];
  displayCommander: CommanderProfile | undefined;
  setSelectedCommanderName: (value: string) => void;
  surpriseMe: () => void;
}) {
  return (
    <section className="grid gap-5">
      <div className="flex flex-col gap-3 rounded-premium border border-white/10 bg-black/20 p-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-mist">Mostrando comandantes que contem</p>
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
  );
}

function PreferencesSection({
  preferences,
  updatePreference
}: {
  preferences: Record<string, string>;
  updatePreference: (questionId: string, value: string) => void;
}) {
  return (
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
  );
}

function ResultSection({
  deckSections,
  explanation,
  optimizationFocus,
  setOptimizationFocus,
  handTested,
  setHandTested,
  simulatorStats
}: {
  deckSections: DeckSection[];
  explanation: Array<{ title: string; text: string }>;
  optimizationFocus: string;
  setOptimizationFocus: (value: string) => void;
  handTested: boolean;
  setHandTested: (value: boolean) => void;
  simulatorStats: { mulligan: number; ramp: number; draw: number; lands: number };
}) {
  return (
    <section className="grid gap-6">
      <Panel title="Lista completa" icon={<FileText className="size-5" />}>
        <div className="grid gap-3">
          {deckSections.map((section) => (
            <details key={section.title} className="rounded-premium border border-white/10 bg-black/20 p-4" open={section.title === "Comandante"}>
              <summary className="cursor-pointer text-sm font-black text-frost">
                {section.title} <span className="text-gold">({section.target})</span>
              </summary>
              <div className="mt-4 grid gap-3">
                {section.cards.map((card) => (
                  <div key={`${section.title}-${card.name}`} className="rounded-[7px] border border-white/10 bg-white/[.04] p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <strong className="text-frost">{card.name}</strong>
                      {card.expensive ? <span className="rounded-full bg-gold/10 px-2 py-1 text-xs font-bold text-gold">carta cara</span> : null}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-mist">{card.reason}</p>
                    {card.budgetAlternative || card.premiumAlternative ? (
                      <div className="mt-3 grid gap-2 text-xs text-mist sm:grid-cols-2">
                        {card.budgetAlternative ? <span>Economica: <strong className="text-frost">{card.budgetAlternative}</strong></span> : null}
                        {card.premiumAlternative ? <span>Premium: <strong className="text-frost">{card.premiumAlternative}</strong></span> : null}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </details>
          ))}
        </div>
      </Panel>

      <Panel title="Explicacao da IA" icon={<Brain className="size-5" />}>
        <div className="grid gap-3 md:grid-cols-2">
          {explanation.map((item) => (
            <div key={item.title} className="rounded-premium border border-white/10 bg-black/20 p-4">
              <h4 className="font-black text-frost">{item.title}</h4>
              <p className="mt-2 text-sm leading-6 text-mist">{item.text}</p>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Otimizacao" icon={<Sparkles className="size-5" />}>
        <div className="flex flex-wrap gap-2">
          {optimizationOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setOptimizationFocus(option)}
              className={cn(
                "rounded-premium border px-3 py-2 text-sm font-bold transition",
                optimizationFocus === option ? "border-gold/50 bg-gold/10 text-gold" : "border-white/10 bg-black/20 text-mist hover:text-frost"
              )}
            >
              {option}
            </button>
          ))}
        </div>
        <p className="mt-4 text-sm leading-6 text-mist">
          Foco atual: <strong className="text-frost">{optimizationFocus}</strong>. A IA recalibraria cortes, upgrades e
          proporcoes de ramp/draw/remocoes antes de fechar a lista.
        </p>
        <Button type="button" className="mt-4">
          <Wand2 className="size-4" />
          Otimizar Deck
        </Button>
      </Panel>

      <Panel title="Exportacao e salvar" icon={<Download className="size-5" />}>
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <h4 className="font-black text-frost">Exportar para</h4>
            <div className="mt-3 flex flex-wrap gap-2">
              {exportOptions.map((option) => (
                <button key={option} type="button" className="rounded-premium border border-white/10 bg-black/20 px-3 py-2 text-sm font-bold text-mist transition hover:border-gold/40 hover:text-frost">
                  {option}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-black text-frost">Salvar e compartilhar</h4>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button type="button" variant="secondary"><Save className="size-4" /> Salvar na conta</Button>
              <Button type="button" variant="secondary"><Share2 className="size-4" /> Compartilhar link</Button>
              <Button type="button" variant="secondary"><Copy className="size-4" /> Duplicar deck</Button>
            </div>
          </div>
        </div>
      </Panel>

      <Panel title="Simulador de mao inicial" icon={<Play className="size-5" />}>
        <Button type="button" onClick={() => setHandTested(true)}>
          <Play className="size-4" />
          Testar Mao Inicial
        </Button>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Chance de mulligan" value={handTested ? `${simulatorStats.mulligan}%` : "--"} />
          <Stat label="Chance de abrir ramp" value={handTested ? `${simulatorStats.ramp}%` : "--"} />
          <Stat label="Chance de abrir draw" value={handTested ? `${simulatorStats.draw}%` : "--"} />
          <Stat label="Chance de abrir terrenos" value={handTested ? `${simulatorStats.lands}%` : "--"} />
        </div>
        <p className="mt-3 text-sm leading-6 text-mist">
          A estrutura ja esta pronta para futuramente rodar milhares de maos reais com base na lista final de 100 cartas.
        </p>
      </Panel>
    </section>
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

function Panel({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <div className="rounded-premium border border-white/10 bg-white/[.045] p-5">
      <div className="mb-4 flex items-center gap-2 text-gold">
        {icon}
        <h3 className="text-lg font-black text-frost">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-premium border border-white/10 bg-black/20 p-4">
      <span className="text-xs font-bold uppercase text-mist">{label}</span>
      <strong className="mt-2 block text-2xl text-frost">{value}</strong>
    </div>
  );
}
