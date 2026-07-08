import {
  Award,
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  GraduationCap,
  HelpCircle,
  LayoutDashboard,
  LifeBuoy,
  MessageCircle,
  Route,
  SearchCheck,
  Sparkles,
  Trophy,
  Users
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type Status = "not-started" | "in-progress" | "completed" | "locked";

export type Lesson = {
  id: string;
  title: string;
  description: string;
  duration: string;
  type: "Videoaula" | "Leitura" | "Questionário" | "Projeto" | "Encontro" | "Pesquisa";
  status: Status;
};

export type Course = {
  id: string;
  slug: string;
  sequence: number;
  title: string;
  moodleTitle: string;
  description: string;
  shortDescription: string;
  estimatedTime: string;
  progress: number;
  status: Status;
  lessons: Lesson[];
  materials: string[];
  activities: string[];
  certificateId: string;
};

export type Trail = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  href: string;
  progress: number;
  completedCourses: number;
  totalCourses: number;
  status: Status;
  icon: LucideIcon;
};

export type ImportantLink = {
  title: string;
  description: string;
  href: string;
  label: string;
  icon: LucideIcon;
};

export type Certificate = {
  id: string;
  title: string;
  description: string;
  status: Status;
  href: string;
};

export type Survey = {
  id: string;
  title: string;
  description: string;
  required: boolean;
  status: Status;
  canSkip?: boolean;
};

export const ACADEMY_BASE_PATH = "/fit-academy";

export function academyPath(path = "") {
  if (!path) return ACADEMY_BASE_PATH;
  return `${ACADEMY_BASE_PATH}${path.startsWith("/") ? path : `/${path}`}`;
}

export type EdgeAiContent = {
  title: string;
  description: string;
  progress: number;
  status: Status;
  estimatedTime: string;
};

export const academyUser = {
  name: "Wellington Ribeiro",
  email: "wellington.ribeiro1@fit-tecnologia.org.br",
  role: "Aluno PNAAT",
  cohort: "Capacitação em Sistemas Embarcados e Inteligência Artificial na Borda"
};

export const support = {
  email: "educacao@fit-tecnologia.org.br",
  responseTime: "até 24 horas úteis",
  faq: [
    {
      question: "Por onde começo?",
      answer: "Comece pela seção Ambientação da Trilha Fundamentos e siga para o Curso 1 quando concluir a leitura inicial."
    },
    {
      question: "Onde vejo atividades síncronas?",
      answer: "As atividades síncronas ficam centralizadas na página Atividades, com data, tipo de encontro e status de presença."
    },
    {
      question: "Quando libero o certificado final?",
      answer:
        "O certificado da Trilha Fundamentos é liberado após concluir todos os cursos obrigatórios, registrar a atividade síncrona exigida e responder à pesquisa geral."
    },
    {
      question: "Onde peço ajuda sobre acesso ou certificado?",
      answer: "Use o botão de suporte ou envie um e-mail para a equipe de educação informando seu nome, turma e curso relacionado."
    }
  ]
};

export const importantLinks: ImportantLink[] = [
  {
    title: "Grupo da turma",
    description: "Comunidade oficial para avisos rápidos, dúvidas gerais e conexão com a turma.",
    href: "https://chat.whatsapp.com/K6e4b3Z1wyrHFsynQbnBJM",
    label: "Abrir comunidade",
    icon: MessageCircle
  },
  {
    title: "FAQ da capacitação",
    description: "Perguntas frequentes sobre acesso, certificados, atividades síncronas e funcionamento da jornada.",
    href: "https://fit-tecnologia.org.br/ava/local/staticpage/view.php?page=FAQ",
    label: "Consultar FAQ",
    icon: HelpCircle
  },
  {
    title: "Atividades síncronas",
    description: "Webinars, sessões tira-dúvidas e registros de presença da capacitação.",
    href: academyPath("/atividades#sincronas"),
    label: "Ver agenda",
    icon: CalendarDays
  },
  {
    title: "Suporte da plataforma",
    description: "Canal para questões técnicas, administrativas, certificados e acesso ao AVA.",
    href: academyPath("/suporte"),
    label: "Solicitar suporte",
    icon: LifeBuoy
  }
];

const completed = "completed" satisfies Status;
const progress = "in-progress" satisfies Status;
const waiting = "not-started" satisfies Status;

export const fundamentalsCourses: Course[] = [
  {
    id: "course-python",
    slug: "curso-1-fundamentos-em-python",
    sequence: 1,
    title: "Curso 1 - Fundamentos em Python",
    moodleTitle: "Fundamentos em Python",
    description:
      "Construa a base de programação usada ao longo da capacitação. O curso apresenta sintaxe, variáveis, estruturas de dados, decisões, funções, POO, arquivos e avaliação final.",
    shortDescription: "Base de programação para avançar com segurança nos próximos cursos da trilha.",
    estimatedTime: "12h",
    progress: 76,
    status: progress,
    certificateId: "cert-python",
    materials: ["Roteiro do microcurso", "Caderno de exemplos Python", "Lista de exercícios orientados"],
    activities: ["Questionário: Avaliação Final", "Exercícios por unidade", "Fórum de dúvidas do microcurso"],
    lessons: [
      {
        id: "py-welcome",
        title: "Boas-vindas e roteiro do microcurso",
        description: "Visão geral da jornada, objetivos e formas de avaliação.",
        duration: "20 min",
        type: "Leitura",
        status: completed
      },
      {
        id: "py-1",
        title: "Introdução à linguagem Python e suas aplicações",
        description: "Panorama da linguagem, casos de uso e estrutura do curso.",
        duration: "1h",
        type: "Videoaula",
        status: completed
      },
      {
        id: "py-2",
        title: "Introdução ao Python",
        description: "Configuração do ambiente, primeiro programa e sintaxe fundamental.",
        duration: "1h30",
        type: "Videoaula",
        status: completed
      },
      {
        id: "py-3",
        title: "Variáveis",
        description: "Tipos de dados, operadores e expressões lógicas e matemáticas.",
        duration: "1h20",
        type: "Videoaula",
        status: completed
      },
      {
        id: "py-4",
        title: "Estruturas de dados",
        description: "Listas, tuplas, dicionários e organização de conjuntos de informações.",
        duration: "1h30",
        type: "Videoaula",
        status: completed
      },
      {
        id: "py-5",
        title: "Controle de fluxo e decisões",
        description: "Condições, repetições e lógica de execução.",
        duration: "1h20",
        type: "Questionário",
        status: completed
      },
      {
        id: "py-6",
        title: "Funções e modularização",
        description: "Reutilização de código, organização e manutenção de programas.",
        duration: "1h10",
        type: "Videoaula",
        status: completed
      },
      {
        id: "py-7",
        title: "Programação orientada a objetos",
        description: "Classes, objetos e modelagem de elementos do mundo real.",
        duration: "1h",
        type: "Videoaula",
        status: progress
      },
      {
        id: "py-8",
        title: "Leitura e escrita em arquivos",
        description: "Manipulação de TXT, CSV e JSON.",
        duration: "1h",
        type: "Projeto",
        status: waiting
      },
      {
        id: "py-9",
        title: "Avaliação final",
        description: "Validação dos conhecimentos desenvolvidos no microcurso.",
        duration: "40 min",
        type: "Questionário",
        status: waiting
      }
    ]
  },
  {
    id: "course-electricity",
    slug: "curso-2-fundamentos-de-eletricidade",
    sequence: 2,
    title: "Curso 2 - Fundamentos de Eletricidade",
    moodleTitle: "Fundamentos de Eletricidade",
    description:
      "Aprenda grandezas elétricas, Lei de Ohm, Leis de Kirchhoff, associação de resistores, capacitores e indutores para dar base aos estudos de eletrônica e embarcados.",
    shortDescription: "Conceitos elétricos essenciais para compreender circuitos e componentes.",
    estimatedTime: "10h",
    progress: 0,
    status: waiting,
    certificateId: "cert-electricity",
    materials: ["Roteiro do microcurso", "Tabela de unidades e prefixos", "Guia de código de cores de resistores"],
    activities: ["Quizzes por unidade", "Avaliação Final", "Fórum de dúvidas do microcurso"],
    lessons: [
      {
        id: "el-welcome",
        title: "Boas-vindas e visão geral",
        description: "Apresentação dos objetivos e habilidades práticas do microcurso.",
        duration: "15 min",
        type: "Leitura",
        status: waiting
      },
      {
        id: "el-1",
        title: "Grandezas elétricas fundamentais",
        description: "Carga, corrente, tensão, resistência, potência, energia e notação científica.",
        duration: "2h",
        type: "Videoaula",
        status: waiting
      },
      {
        id: "el-2",
        title: "Lei de Ohm e aplicações",
        description: "Cálculo de corrente, tensão, resistência e potência em circuitos resistivos.",
        duration: "2h",
        type: "Questionário",
        status: waiting
      },
      {
        id: "el-3",
        title: "Leis de Kirchhoff e associação de resistores",
        description: "Circuitos série, paralelo, mistos e código de cores.",
        duration: "2h30",
        type: "Videoaula",
        status: waiting
      },
      {
        id: "el-4",
        title: "Capacitores e indutores",
        description: "Componentes reativos, associação em série e paralelo.",
        duration: "2h",
        type: "Questionário",
        status: waiting
      },
      {
        id: "el-5",
        title: "Avaliação final",
        description: "Consolidação dos conceitos de eletricidade.",
        duration: "45 min",
        type: "Questionário",
        status: waiting
      }
    ]
  },
  {
    id: "course-embedded",
    slug: "curso-3-introducao-a-sistemas-embarcados",
    sequence: 3,
    title: "Curso 3 - Introdução a Sistemas Embarcados",
    moodleTitle: "Introdução a Sistemas Embarcados",
    description:
      "Entenda microcontroladores, GPIO, sinais analógicos, timers, interrupções, comunicação serial, sensores, atuadores e um projeto prático de monitoramento.",
    shortDescription: "Primeiros passos para criar aplicações com microcontroladores e IoT.",
    estimatedTime: "14h",
    progress: 0,
    status: waiting,
    certificateId: "cert-embedded",
    materials: ["Roteiro do microcurso", "Guia de MicroPython para hardware", "Checklist do projeto prático"],
    activities: ["Projeto: Monitor de Ambiente Interativo", "Quizzes por unidade", "Avaliação Final"],
    lessons: [
      {
        id: "se-welcome",
        title: "Boas-vindas e estrutura do curso",
        description: "Objetivos e habilidades para iniciar em sistemas embarcados.",
        duration: "15 min",
        type: "Leitura",
        status: waiting
      },
      {
        id: "se-1",
        title: "Fundamentos de sistemas embarcados",
        description: "Definição, aplicações, microcontroladores e MicroPython.",
        duration: "1h30",
        type: "Videoaula",
        status: waiting
      },
      {
        id: "se-2",
        title: "Entradas e saídas digitais",
        description: "GPIO, acionamento de componentes, blink e leitura de botões.",
        duration: "2h",
        type: "Projeto",
        status: waiting
      },
      {
        id: "se-3",
        title: "Entradas e saídas analógicas",
        description: "ADC, PWM e controle de intensidade.",
        duration: "1h40",
        type: "Videoaula",
        status: waiting
      },
      {
        id: "se-4",
        title: "Temporizadores e interrupções",
        description: "Eventos assíncronos, timers e watchdog.",
        duration: "1h40",
        type: "Questionário",
        status: waiting
      },
      {
        id: "se-5",
        title: "Protocolos de comunicação com fio",
        description: "UART, SPI e I2C em aplicações embarcadas.",
        duration: "2h",
        type: "Videoaula",
        status: waiting
      },
      {
        id: "se-6",
        title: "Sensores, transdutores e atuadores",
        description: "Medição de variáveis físicas e interação com o ambiente.",
        duration: "2h",
        type: "Projeto",
        status: waiting
      },
      {
        id: "se-7",
        title: "Projeto prático: monitor de ambiente",
        description: "Integração de sensor, display, potenciômetro e indicador visual.",
        duration: "2h",
        type: "Projeto",
        status: waiting
      },
      {
        id: "se-8",
        title: "Avaliação final",
        description: "Verificação da aprendizagem do microcurso.",
        duration: "45 min",
        type: "Questionário",
        status: waiting
      }
    ]
  },
  {
    id: "course-ai",
    slug: "curso-4-fundamentos-de-ia-para-sistemas-embarcados",
    sequence: 4,
    title: "Curso 4 - Fundamentos de IA para Sistemas Embarcados",
    moodleTitle: "Fundamentos de Inteligência Artificial para Sistemas Embarcados",
    description:
      "Explore Edge AI, aplicações industriais, bibliotecas Python, machine learning, deep learning e redes neurais aplicadas a sistemas de borda.",
    shortDescription: "Fundamentos de IA e aprendizado de máquina aplicados a dispositivos embarcados.",
    estimatedTime: "11h",
    progress: 0,
    status: waiting,
    certificateId: "cert-ai",
    materials: ["Roteiro do microcurso", "Bibliotecas Python para dados", "Simulador TensorFlow Playground"],
    activities: ["Quizzes por unidade", "Avaliação Final", "Fórum de dúvidas do microcurso"],
    lessons: [
      {
        id: "ai-welcome",
        title: "Boas-vindas e percurso",
        description: "Apresentação dos desafios e objetivos da IA embarcada.",
        duration: "15 min",
        type: "Leitura",
        status: waiting
      },
      {
        id: "ai-1",
        title: "Desafios e oportunidades em Edge AI",
        description: "Latência, energia, privacidade e processamento em tempo real.",
        duration: "1h30",
        type: "Videoaula",
        status: waiting
      },
      {
        id: "ai-2",
        title: "Aplicações industriais de Edge AI",
        description: "Manutenção preditiva, qualidade e inspeção automatizada.",
        duration: "1h30",
        type: "Videoaula",
        status: waiting
      },
      {
        id: "ai-3",
        title: "Bibliotecas Python",
        description: "Arrays, DataFrames e ferramentas para dados e IA.",
        duration: "2h",
        type: "Projeto",
        status: waiting
      },
      {
        id: "ai-4",
        title: "Fundamentos em machine learning",
        description: "Aprendizado supervisionado, não supervisionado e identificação de padrões.",
        duration: "2h",
        type: "Questionário",
        status: waiting
      },
      {
        id: "ai-5",
        title: "Deep learning e redes neurais artificiais",
        description: "Conceitos, simulação e implementação de redes neurais.",
        duration: "2h",
        type: "Projeto",
        status: waiting
      },
      {
        id: "ai-6",
        title: "Avaliação final",
        description: "Validação dos conceitos de IA para sistemas embarcados.",
        duration: "45 min",
        type: "Questionário",
        status: waiting
      }
    ]
  }
];

export const edgeAiContents: EdgeAiContent[] = [
  {
    title: "Análise Preditiva de Dados de Sensores",
    description: "Modelos para identificar padrões e antecipar falhas em dados de sensores.",
    progress: 0,
    status: waiting,
    estimatedTime: "8h"
  },
  {
    title: "Sistemas de Visão Computacional Embarcada",
    description: "Inspeção visual automatizada para automação e controle de qualidade.",
    progress: 0,
    status: waiting,
    estimatedTime: "10h"
  },
  {
    title: "Otimização de Modelos em Sistemas Embarcados",
    description: "Técnicas para reduzir custo computacional e melhorar execução na borda.",
    progress: 0,
    status: waiting,
    estimatedTime: "8h"
  },
  {
    title: "Modelos de Linguagem Compactos (SLMs)",
    description: "Uso de modelos menores em cenários com restrições de memória, energia e latência.",
    progress: 0,
    status: waiting,
    estimatedTime: "6h"
  }
];

export const trails: Trail[] = [
  {
    id: "fundamentals",
    title: "0. Trilha Fundamentos",
    subtitle: "Comece sua jornada por aqui",
    description:
      "Ambientação, cursos obrigatórios, atividades síncronas, suporte e conclusão da jornada em uma sequência clara.",
    href: academyPath("/trilha-fundamentos"),
    progress: 19,
    completedCourses: 0,
    totalCourses: fundamentalsCourses.length,
    status: progress,
    icon: Route
  },
  {
    id: "edge-ai",
    title: "Trilha Edge AI",
    subtitle: "Conteúdos avançados e complementares",
    description:
      "Espaço separado para cursos, materiais, avisos e certificados ligados a Edge AI fora da Trilha Fundamentos.",
    href: academyPath("/trilha-edge-ai"),
    progress: 0,
    completedCourses: 0,
    totalCourses: edgeAiContents.length,
    status: waiting,
    icon: Sparkles
  }
];

export const onboardingItems = [
  {
    title: "Apresentação da trilha",
    content:
      "Entenda a proposta da capacitação, os requisitos para conclusão e como a Trilha Fundamentos organiza seus primeiros passos."
  },
  {
    title: "Como navegar na plataforma",
    content:
      "Use a navegação lateral para acessar início, trilhas, atividades, certificados e suporte. Dentro da trilha, siga a ordem sugerida dos cursos."
  },
  {
    title: "Cronograma da jornada",
    content:
      "Acompanhe atividades assíncronas no seu ritmo e participe de pelo menos uma atividade síncrona obrigatória quando indicada."
  },
  {
    title: "Links importantes",
    content:
      "Links de grupo, FAQ, suporte e atividades síncronas ficam centralizados na área de ambientação para evitar duplicidade."
  },
  {
    title: "Grupo da turma",
    content:
      "Entre na comunidade oficial para receber comunicados e interagir com a turma. O link aparece uma única vez em Links importantes."
  },
  {
    title: "Atividades síncronas",
    content:
      "Webinars e sessões tira-dúvidas aparecem na página Atividades, com status de presença e orientação sobre próximos encontros."
  },
  {
    title: "Materiais de apoio",
    content:
      "Roteiros, guias e materiais complementares ficam vinculados aos cursos correspondentes, sem misturar com comunicados."
  },
  {
    title: "Contate o suporte",
    content:
      "Para problemas técnicos, acesso e certificados, use a página Suporte ou envie e-mail para educacao@fit-tecnologia.org.br."
  }
];

export const announcements = [
  {
    title: "Comunidade da turma no WhatsApp",
    date: "29/04/2026",
    description:
      "Canal criado para dúvidas rápidas, avisos e atualizações importantes da jornada PNAAT.",
    href: importantLinks[0].href
  },
  {
    title: "Atividades síncronas contam para conclusão",
    date: "Próxima etapa",
    description:
      "Para concluir a Trilha Fundamentos, participe de pelo menos uma atividade síncrona e registre sua presença.",
    href: academyPath("/atividades#sincronas")
  },
  {
    title: "Certificados ficam fora da lista de cursos",
    date: "Organização",
    description:
      "Certificados individuais aparecem ao concluir cada curso; o certificado final fica em Conclusão da Trilha.",
    href: academyPath("/certificados")
  }
];

export const synchronousActivities = [
  {
    title: "Webinar de abertura da jornada",
    date: "10/07/2026",
    time: "19h",
    type: "Webinar",
    status: "Inscrições abertas"
  },
  {
    title: "Sessão tira-dúvidas: Fundamentos em Python",
    date: "17/07/2026",
    time: "19h",
    type: "Tira-dúvidas",
    status: "Recomendado para você"
  },
  {
    title: "Plantão de suporte técnico",
    date: "24/07/2026",
    time: "18h30",
    type: "Suporte",
    status: "Opcional"
  }
];

export const surveys: Survey[] = [
  {
    id: "survey-final",
    title: "Pesquisa geral da Trilha Fundamentos",
    description:
      "Pesquisa obrigatória liberada após a conclusão de todos os cursos obrigatórios da Trilha Fundamentos.",
    required: true,
    status: "locked"
  },
  {
    id: "survey-profile",
    title: "Pesquisa opcional de perfil do aluno",
    description:
      "Ajuda a equipe a conhecer melhor a turma. Pode ser respondida depois ou pulada antes da emissão do certificado final.",
    required: false,
    status: "locked",
    canSkip: true
  }
];

export const certificates: Certificate[] = [
  ...fundamentalsCourses.map((course) => ({
    id: course.certificateId,
    title: `Certificado - ${course.title.replace(" - ", ": ")}`,
    description: "Disponível quando todas as aulas e a avaliação final do curso forem concluídas.",
    status: course.lessons.every((lesson) => lesson.status === "completed") ? ("completed" as Status) : ("locked" as Status),
    href: academyPath(`/trilha-fundamentos/${course.slug}`)
  })),
  {
    id: "cert-fundamentals",
    title: "Certificado Final - Trilha Fundamentos",
    description:
      "Liberado após concluir todos os cursos obrigatórios, realizar a etapa síncrona exigida e responder à pesquisa geral.",
    status: "locked",
    href: academyPath("/trilha-fundamentos/conclusao")
  },
  {
    id: "cert-edge-ai",
    title: "Certificado - Trilha Edge AI",
    description: "Certificado próprio da trilha avançada, separado da Trilha Fundamentos.",
    status: "locked",
    href: academyPath("/trilha-edge-ai")
  }
];

export const quickAccess = [
  { title: "Minhas trilhas", href: academyPath("/minhas-trilhas"), icon: Route },
  { title: "Atividades síncronas", href: academyPath("/atividades#sincronas"), icon: CalendarDays },
  { title: "Grupo da turma", href: importantLinks[0].href, icon: Users },
  { title: "Suporte", href: academyPath("/suporte"), icon: LifeBuoy },
  { title: "Certificados", href: academyPath("/certificados"), icon: Award },
  { title: "Pesquisas", href: academyPath("/pesquisas"), icon: ClipboardCheck }
];

export const navigation = [
  { title: "Início", href: academyPath(), icon: LayoutDashboard },
  { title: "Minhas Trilhas", href: academyPath("/minhas-trilhas"), icon: Route },
  { title: "Trilha Fundamentos", href: academyPath("/trilha-fundamentos"), icon: GraduationCap },
  { title: "Trilha Edge AI", href: academyPath("/trilha-edge-ai"), icon: Sparkles },
  { title: "Atividades", href: academyPath("/atividades"), icon: CalendarDays },
  { title: "Certificados", href: academyPath("/certificados"), icon: Trophy },
  { title: "Suporte", href: academyPath("/suporte"), icon: LifeBuoy }
];

export const dashboardMetrics = [
  { label: "Progresso da trilha", value: "19%", icon: SearchCheck },
  { label: "Cursos concluídos", value: "0/4", icon: BookOpen },
  { label: "Próximo passo", value: "Curso 1", icon: Route },
  { label: "Certificado final", value: "Bloqueado", icon: Award }
];

export function getCourseBySlug(slug: string) {
  return fundamentalsCourses.find((course) => course.slug === slug);
}

export function getNextCourse(course: Course) {
  return fundamentalsCourses.find((item) => item.sequence === course.sequence + 1);
}

export function getPreviousCourse(course: Course) {
  return fundamentalsCourses.find((item) => item.sequence === course.sequence - 1);
}

export function getRecommendedCourse() {
  return fundamentalsCourses.find((course) => course.status === "in-progress") ?? fundamentalsCourses.find((course) => course.status === "not-started") ?? fundamentalsCourses[0];
}

export function areFundamentalsCompleted() {
  return fundamentalsCourses.every((course) => course.lessons.every((lesson) => lesson.status === "completed"));
}

export function getStatusLabel(status: Status) {
  const labels: Record<Status, string> = {
    completed: "Concluído",
    "in-progress": "Em andamento",
    locked: "Bloqueado",
    "not-started": "Não iniciado"
  };

  return labels[status];
}
