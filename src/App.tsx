import React, { useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Box,
  Check,
  ChevronDown,
  CircuitBoard,
  Code2,
  Cpu,
  Film,
  Gamepad2,
  Gauge,
  HardDrive,
  Info,
  Leaf,
  Monitor,
  RotateCcw,
  Server,
  SlidersHorizontal,
  Sparkles,
  Target,
  VolumeX,
  Wallet,
  Wrench,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";

type SolutionId = "readyMini" | "miniITX" | "singleBoard" | "fanless" | "microDesktop";
type Level = "Базовый" | "Средний" | "Мощный";
type TaskKey = "study" | "programming" | "media" | "gaming" | "graphicsAi" | "server";
type Budget = "low" | "mid" | "high";
type SizePreference = "tiny" | "small" | "bigger";
type UpgradeLevel = "low" | "medium" | "high";
type NoiseLevel = "silent" | "balanced" | "any";
type FormatPreference = "ready" | "build" | "experiment" | "any";

type Preset = {
  id: string;
  title: string;
  hint: string;
  tasks: TaskKey[];
  size: SizePreference;
  upgrade: UpgradeLevel;
  noise: NoiseLevel;
  budget: Budget;
  format: FormatPreference;
  alwaysOn: boolean;
  portable: boolean;
};

type OptionCardProps = {
  title: string;
  description?: string;
  active: boolean;
  onClick: () => void;
  icon?: React.ComponentType<{ className?: string }>;
  multi?: boolean;
  compact?: boolean;
};

const taskOptions: {
  id: TaskKey;
  label: string;
  hint: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: "study", label: "Учёба и интернет", hint: "документы, сайты, звонки", icon: BookOpen },
  { id: "programming", label: "Программирование", hint: "редактор кода, много окон", icon: Code2 },
  { id: "media", label: "Фильмы и видео", hint: "YouTube, сериалы, музыка", icon: Film },
  { id: "gaming", label: "Игры", hint: "от простых до современных", icon: Gamepad2 },
  { id: "graphicsAi", label: "3D, графика, ИИ", hint: "Blender, рендер, тяжёлые задачи", icon: Cpu },
  { id: "server", label: "Сервер или умный дом", hint: "работа 24/7, хранение, автоматизация", icon: Server },
];

const presets: Preset[] = [
  {
    id: "student",
    title: "Для учёбы",
    hint: "Быстрый старт для занятий, фильмов и обычных домашних задач",
    tasks: ["study", "media"],
    size: "small",
    upgrade: "medium",
    noise: "balanced",
    budget: "mid",
    format: "ready",
    alwaysOn: false,
    portable: true,
  },
  {
    id: "home",
    title: "Для дома",
    hint: "Спокойный сценарий: интернет, видео, документы, минимум лишнего",
    tasks: ["study", "media"],
    size: "tiny",
    upgrade: "low",
    noise: "silent",
    budget: "mid",
    format: "ready",
    alwaysOn: false,
    portable: false,
  },
  {
    id: "pro",
    title: "Для тяжёлой работы",
    hint: "Если важны мощность, запас на будущее и возможность апгрейда",
    tasks: ["programming", "graphicsAi"],
    size: "bigger",
    upgrade: "high",
    noise: "balanced",
    budget: "high",
    format: "build",
    alwaysOn: false,
    portable: false,
  },
  {
    id: "server",
    title: "Для сервера и опытов",
    hint: "Когда ПК должен работать долго, тихо и экономично",
    tasks: ["server"],
    size: "tiny",
    upgrade: "low",
    noise: "silent",
    budget: "low",
    format: "experiment",
    alwaysOn: true,
    portable: false,
  },
];

const solutions: Record<
  SolutionId,
  {
    title: string;
    short: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    examples: string[];
    bestFor: string[];
    limits: string[];
    metrics: {
      compactness: number;
      performance: number;
      silence: number;
      upgrade: number;
      economy: number;
    };
  }
> = {
  readyMini: {
    title: "Готовый мини-ПК",
    short: "Самый понятный и универсальный формат для большинства пользователей",
    description:
      "Маленький готовый компьютер, который удобно купить и сразу использовать для учёбы, фильмов, интернета и обычной многозадачности.",
    icon: Monitor,
    examples: ["офисный мини-ПК", "домашний мини-ПК", "готовый компактный компьютер"],
    bestFor: ["учёба", "интернет", "фильмы", "простая работа"],
    limits: ["не лучший вариант для серьёзного апгрейда", "обычно не рассчитан на тяжёлые игры и 3D"],
    metrics: { compactness: 9, performance: 6, silence: 8, upgrade: 4, economy: 8 },
  },
  miniITX: {
    title: "Компактный системный блок",
    short: "Лучше всего подходит, когда главные приоритеты — мощность и апгрейд",
    description:
      "Небольшая, но уже очень производительная сборка. Хороший выбор для игр, 3D, сложных программ и тех, кто хочет менять детали в будущем.",
    icon: Box,
    examples: ["небольшой корпус", "компактная материнская плата", "мощная сборка малого форм-фактора"],
    bestFor: ["игры", "3D", "сложные задачи", "апгрейд"],
    limits: ["обычно дороже", "сложнее собирать и подбирать охлаждение", "не самый тихий формат"],
    metrics: { compactness: 6, performance: 10, silence: 6, upgrade: 10, economy: 5 },
  },
  singleBoard: {
    title: "Одноплатный компьютер",
    short: "Очень маленький формат для сервера, обучения и экспериментов",
    description:
      "Это маленькая плата-компьютер, которая отлично подходит для Linux, умного дома, простых серверных задач и технических опытов.",
    icon: CircuitBoard,
    examples: ["Raspberry Pi", "Orange Pi", "другие одноплатные решения"],
    bestFor: ["умный дом", "сервер", "обучение", "эксперименты"],
    limits: ["не для тяжёлых игр", "не для серьёзного 3D", "не всем удобен как основной ПК"],
    metrics: { compactness: 10, performance: 3, silence: 10, upgrade: 3, economy: 9 },
  },
  fanless: {
    title: "Бесшумный мини-ПК",
    short: "Лучший вариант, если особенно важны тишина и спокойная работа",
    description:
      "Компьютер без обычных шумных вентиляторов. Хорошо подходит для фильмов, офиса, постоянной работы и тихого домашнего использования.",
    icon: VolumeX,
    examples: ["тихий домашний ПК", "мини-ПК без шума", "компактный ПК для работы 24/7"],
    bestFor: ["тишина", "фильмы", "офис", "круглосуточная работа"],
    limits: ["не самый мощный", "обычно уступает игровым и тяжёлым сборкам"],
    metrics: { compactness: 8, performance: 5, silence: 10, upgrade: 4, economy: 9 },
  },
  microDesktop: {
    title: "Сверхмалый настольный ПК",
    short: "Компактный и часто выгодный по цене вариант для повседневных задач",
    description:
      "Очень маленький настольный компьютер, который подходит для дома, учёбы и обычных повседневных сценариев при умеренном бюджете.",
    icon: HardDrive,
    examples: ["маленький офисный ПК", "компактный домашний ПК", "миниатюрный настольный компьютер"],
    bestFor: ["малый бюджет", "дом", "учёба", "обычные задачи"],
    limits: ["обычно слабее мощных сборок", "апгрейд ограничен"],
    metrics: { compactness: 9, performance: 5, silence: 7, upgrade: 5, economy: 10 },
  },
};

function addScore(map: Record<SolutionId, number>, patch: Partial<Record<SolutionId, number>>) {
  for (const key of Object.keys(patch) as SolutionId[]) {
    map[key] += patch[key] || 0;
  }
}

function getLevel(tasks: TaskKey[]): Level {
  if (tasks.includes("gaming") || tasks.includes("graphicsAi")) return "Мощный";
  if (tasks.includes("programming") || tasks.includes("media") || tasks.includes("server")) return "Средний";
  return "Базовый";
}

function getSpec(solutionId: SolutionId, level: Level, budget: Budget) {
  const budgetNote =
    budget === "low" ? "С упором на цену" : budget === "high" ? "С запасом на будущее" : "С хорошим балансом";

  switch (solutionId) {
    case "readyMini":
      if (level === "Мощный") {
        return {
          title: "Что искать среди более мощных готовых мини-ПК",
          items: [
            "Процессор: Ryzen 7 или похожий",
            "Память: 32 ГБ",
            "Накопитель: 1 ТБ SSD",
            "Подходит для тяжёлой повседневной работы",
            budgetNote,
          ],
        };
      }
      if (level === "Средний") {
        return {
          title: "Что искать среди средних готовых мини-ПК",
          items: [
            "Процессор: Ryzen 5 или Core i5",
            "Память: 16–32 ГБ",
            "Накопитель: 512 ГБ – 1 ТБ SSD",
            "Подходит для кода, фильмов и обычной работы",
            budgetNote,
          ],
        };
      }
      return {
        title: "Что искать среди базовых готовых мини-ПК",
        items: [
          "Процессор: Intel N100 / N200 или похожий",
          "Память: 16 ГБ",
          "Накопитель: 512 ГБ SSD",
          "Подходит для учёбы, интернета и фильмов",
          budgetNote,
        ],
      };

    case "miniITX":
      if (level === "Мощный") {
        return {
          title: "Что искать среди мощных компактных сборок",
          items: [
            "Процессор: Core i5-13400 или Ryzen 7 7700",
            "Видеокарта: RTX 4060 / 4060 Ti",
            "Память: 32 ГБ",
            "Накопитель: 1 ТБ SSD",
            "Небольшой корпус и компактный блок питания",
          ],
        };
      }
      return {
        title: "Что искать среди средних компактных сборок",
        items: [
          "Процессор: Ryzen 5 / Core i5",
          "Память: 16–32 ГБ",
          "Накопитель: 1 ТБ SSD",
          "Видеокарта по желанию",
          "Подходит для кода, работы и части игр",
        ],
      };

    case "singleBoard":
      return {
        title: "Что искать среди одноплатных компьютеров",
        items: [
          "Плата: Raspberry Pi 5 или похожая",
          "Память: 8 ГБ",
          "Хранилище: карта памяти или SSD",
          "Подходит для Linux, сервера и умного дома",
          "Очень маленький размер и низкое энергопотребление",
        ],
      };

    case "fanless":
      return {
        title: "Что искать среди бесшумных мини-ПК",
        items: [
          "Процессор: Intel N100 / N200 или похожий",
          "Память: 16 ГБ",
          "Накопитель: 512 ГБ SSD",
          "Без обычного шума вентиляторов",
          "Подходит для фильмов, офиса и работы 24/7",
        ],
      };

    case "microDesktop":
    default:
      return {
        title: "Что искать среди сверхмалых настольных ПК",
        items: [
          "Процессор: Core i5 или похожий",
          "Память: 16 ГБ",
          "Накопитель: 256–512 ГБ SSD",
          "Небольшой размер и умеренная цена",
          "Хорош для дома, учёбы и обычной работы",
        ],
      };
  }
}

function metricBar(value: number) {
  return `${value * 10}%`;
}

function getMatchLabel(score: number, topScore: number) {
  const ratio = topScore === 0 ? 0 : score / topScore;
  if (ratio >= 0.9) return "Очень близкий вариант";
  if (ratio >= 0.7) return "Хороший вариант";
  if (ratio >= 0.5) return "Подойдёт при других приоритетах";
  return "Скорее запасной вариант";
}

function getConfidence(topScore: number, altScore: number) {
  const diff = topScore - altScore;
  if (diff <= 1) {
    return {
      title: "Есть почти равный второй вариант",
      text: "У требований довольно гибкий характер, поэтому здесь можно выбирать ещё и по цене, внешнему виду или удобству покупки.",
    };
  }
  if (diff <= 3) {
    return {
      title: "Результат достаточно уверенный",
      text: "Лучший формат уже заметно впереди, но второй вариант всё ещё стоит держать в уме, если попадётся более выгодное предложение.",
    };
  }
  return {
    title: "Результат уверенный",
    text: "По выбранным параметрам один формат подходит заметно лучше остальных, поэтому именно с него стоит начинать поиск.",
  };
}

function getOtherVariantNotes(
  ranked: Array<{ id: SolutionId; title: string }>,
  topId: SolutionId,
  noiseLevel: NoiseLevel,
  budget: Budget,
  upgradeLevel: UpgradeLevel,
  sizePreference: SizePreference,
  tasks: TaskKey[]
) {
  return ranked
    .filter((item) => item.id !== topId)
    .slice(0, 3)
    .map((item) => {
      if (item.id === "miniITX") {
        return {
          title: item.title,
          text:
            upgradeLevel === "low" || noiseLevel === "silent"
              ? "Этот формат не поднялся выше, потому что сейчас для вас важнее тишина, простота или готовое решение, а не максимальная мощность и сборка своими руками."
              : "Этот формат близок к первому месту, но в вашем случае уступил по балансу между удобством, ценой и повседневными задачами.",
        };
      }
      if (item.id === "singleBoard") {
        return {
          title: item.title,
          text:
            tasks.includes("gaming") || tasks.includes("graphicsAi") || tasks.includes("programming")
              ? "Он не стал первым, потому что вы выбрали задачи, для которых нужна заметно более высокая производительность."
              : "Он хорошо подходит для сервера, Linux и экспериментов, но как основной ПК удобен не для всех.",
        };
      }
      if (item.id === "fanless") {
        return {
          title: item.title,
          text:
            noiseLevel !== "silent"
              ? "Он не оказался первым, потому что тишина не была вашим главным приоритетом, а другие варианты оказались универсальнее."
              : "Он близок к первому месту и особенно хорош, если вам нужна максимально тихая система без лишнего шума.",
        };
      }
      if (item.id === "microDesktop") {
        return {
          title: item.title,
          text:
            budget === "high"
              ? "Он опустился ниже, потому что при вашем бюджете можно смотреть в сторону более сильных и гибких решений."
              : "Он хорош по цене и размеру, но часто уступает более серьёзным форматам по запасу мощности и апгрейду.",
        };
      }
      return {
        title: item.title,
        text:
          sizePreference === "tiny"
            ? "Он не вышел на первое место, потому что приоритетом оказался очень маленький размер корпуса."
            : "Он остаётся разумным запасным вариантом, если важнее готовое решение и спокойная повседневная работа.",
      };
    });
}

const glassCard =
  "rounded-[30px] border border-white/45 bg-white/18 shadow-[0_18px_60px_rgba(15,23,42,0.14)] backdrop-blur-2xl";

function StepPill({ number, title, hint }: { number: string; title: string; hint: string }) {
  return (
    <div className="rounded-[22px] border border-white/35 bg-white/16 px-4 py-4 backdrop-blur-xl shadow-[0_8px_30px_rgba(255,255,255,0.08)]">
      <div className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-slate-900 px-2 text-xs font-semibold text-white">
        {number}
      </div>
      <div className="mt-3 text-sm font-semibold text-slate-950">{title}</div>
      <div className="mt-1 text-xs leading-5 text-slate-800/75">{hint}</div>
    </div>
  );
}

function OptionCard({
  title,
  description,
  active,
  onClick,
  icon: Icon,
  multi = false,
  compact = false,
}: OptionCardProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`group relative w-full cursor-pointer overflow-hidden rounded-[24px] border p-4 text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-300/70 ${
        active
          ? "border-sky-300/80 bg-white/34 text-slate-950 shadow-[0_16px_40px_rgba(125,211,252,0.18)] ring-1 ring-white/50"
          : "border-white/30 bg-white/12 text-slate-900 shadow-[0_10px_24px_rgba(255,255,255,0.08)] hover:-translate-y-0.5 hover:border-white/45 hover:bg-white/20"
      } ${compact ? "min-h-[96px]" : "min-h-[124px]"}`}
    >
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(135deg,rgba(255,255,255,0.16),rgba(255,255,255,0.04))]" />
      <div className="relative flex h-full flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {Icon ? (
              <div
                className={`inline-flex h-11 w-11 items-center justify-center rounded-[16px] border ${
                  active ? "border-sky-200/70 bg-white/70" : "border-white/30 bg-white/18"
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>
            ) : null}
            <div>
              <div className="text-sm font-semibold leading-5">{title}</div>
              {description ? <div className="mt-1 text-xs leading-5 text-slate-800/75">{description}</div> : null}
            </div>
          </div>
          <div
            className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-medium backdrop-blur-xl ${
              active
                ? "border-sky-200/70 bg-sky-100/80 text-slate-950"
                : "border-white/28 bg-white/16 text-slate-700/80"
            }`}
          >
            {active ? (multi ? "Выбрано" : "Активно") : "Нажмите"}
          </div>
        </div>
        <div className="mt-auto flex items-center justify-between text-xs text-slate-800/75">
          <span>{multi ? "Можно выбрать несколько" : "Выберите один вариант"}</span>
          <span
            className={`inline-flex h-6 w-6 items-center justify-center rounded-full border transition-all ${
              active
                ? "border-sky-300/80 bg-slate-900 text-white"
                : "border-white/35 bg-white/16 text-transparent group-hover:text-slate-500"
            }`}
          >
            <Check className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </button>
  );
}

function InfoPill({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-[22px] border border-white/30 bg-white/14 px-4 py-4 backdrop-blur-xl shadow-[0_8px_24px_rgba(255,255,255,0.08)]">
      <div className="text-sm font-semibold text-slate-950">{title}</div>
      <div className="mt-1 text-xs leading-5 text-slate-800/80">{text}</div>
    </div>
  );
}

function ActiveChip({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-white/38 bg-white/22 px-3 py-1 text-xs font-medium text-slate-900 shadow-[0_6px_18px_rgba(255,255,255,0.08)] backdrop-blur-xl">
      {label}
    </span>
  );
}

function MetricRow({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm text-slate-950">
        <span>{label}</span>
        <span className="font-medium">{value}/10</span>
      </div>
      <div className="h-2.5 rounded-full bg-white/28">
        <div
          className="h-2.5 rounded-full bg-[linear-gradient(90deg,rgba(15,23,42,0.92),rgba(56,189,248,0.72))] transition-all"
          style={{ width: metricBar(value) }}
        />
      </div>
    </div>
  );
}

function CollapsibleBlock({
  title,
  description,
  defaultOpen = false,
  children,
}: {
  title: string;
  description?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-[24px] border border-white/30 bg-white/14 backdrop-blur-xl shadow-[0_12px_30px_rgba(255,255,255,0.08)]">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left"
      >
        <div>
          <div className="text-sm font-semibold text-slate-950">{title}</div>
          {description ? <div className="mt-1 text-xs leading-5 text-slate-800/75">{description}</div> : null}
        </div>
        <ChevronDown className={`h-4 w-4 shrink-0 text-slate-700 transition-transform ${open ? "rotate-180" : "rotate-0"}`} />
      </button>
      {open ? <div className="border-t border-white/25 px-4 py-4">{children}</div> : null}
    </div>
  );
}

export default function MiniPcSelectorSite() {
  const [selectedTasks, setSelectedTasks] = useState<TaskKey[]>(["study", "media"]);
  const [sizePreference, setSizePreference] = useState<SizePreference>("small");
  const [upgradeLevel, setUpgradeLevel] = useState<UpgradeLevel>("medium");
  const [noiseLevel, setNoiseLevel] = useState<NoiseLevel>("balanced");
  const [budget, setBudget] = useState<Budget>("mid");
  const [formatPreference, setFormatPreference] = useState<FormatPreference>("any");
  const [alwaysOn, setAlwaysOn] = useState(false);
  const [portable, setPortable] = useState(false);

  const resetAll = () => {
    setSelectedTasks(["study", "media"]);
    setSizePreference("small");
    setUpgradeLevel("medium");
    setNoiseLevel("balanced");
    setBudget("mid");
    setFormatPreference("any");
    setAlwaysOn(false);
    setPortable(false);
  };

  const applyPreset = (preset: Preset) => {
    setSelectedTasks(preset.tasks);
    setSizePreference(preset.size);
    setUpgradeLevel(preset.upgrade);
    setNoiseLevel(preset.noise);
    setBudget(preset.budget);
    setFormatPreference(preset.format);
    setAlwaysOn(preset.alwaysOn);
    setPortable(preset.portable);
  };

  const toggleTask = (task: TaskKey) => {
    setSelectedTasks((prev) =>
      prev.includes(task) ? prev.filter((item) => item !== task) : [...prev, task]
    );
  };

  const results = useMemo(() => {
    const score: Record<SolutionId, number> = {
      readyMini: 0,
      miniITX: 0,
      singleBoard: 0,
      fanless: 0,
      microDesktop: 0,
    };

    if (selectedTasks.length === 0) addScore(score, { readyMini: 2, microDesktop: 1 });

    for (const task of selectedTasks) {
      if (task === "study") addScore(score, { readyMini: 4, fanless: 3, microDesktop: 3, miniITX: 1, singleBoard: 1 });
      if (task === "programming") addScore(score, { miniITX: 4, readyMini: 3, microDesktop: 2, fanless: 1, singleBoard: 1 });
      if (task === "media") addScore(score, { readyMini: 4, fanless: 4, microDesktop: 3, singleBoard: 2, miniITX: 1 });
      if (task === "gaming") addScore(score, { miniITX: 7, readyMini: 2, microDesktop: 1 });
      if (task === "graphicsAi") addScore(score, { miniITX: 8, readyMini: 2 });
      if (task === "server") addScore(score, { singleBoard: 6, fanless: 5, readyMini: 2, microDesktop: 2, miniITX: 1 });
    }

    if (sizePreference === "tiny") addScore(score, { singleBoard: 4, microDesktop: 4, fanless: 3, readyMini: 2, miniITX: -1 });
    if (sizePreference === "small") addScore(score, { readyMini: 3, fanless: 3, microDesktop: 2, singleBoard: 2, miniITX: 1 });
    if (sizePreference === "bigger") addScore(score, { miniITX: 4, readyMini: 1 });

    if (upgradeLevel === "high") addScore(score, { miniITX: 6, microDesktop: 1, readyMini: 1 });
    if (upgradeLevel === "medium") addScore(score, { readyMini: 3, miniITX: 3, microDesktop: 2 });
    if (upgradeLevel === "low") addScore(score, { fanless: 2, singleBoard: 2, readyMini: 1, microDesktop: 1 });

    if (noiseLevel === "silent") addScore(score, { fanless: 6, singleBoard: 3, readyMini: 2, microDesktop: 1, miniITX: -1 });
    if (noiseLevel === "balanced") addScore(score, { readyMini: 2, fanless: 2, miniITX: 2, microDesktop: 1 });
    if (noiseLevel === "any") addScore(score, { miniITX: 2, readyMini: 1 });

    if (budget === "low") addScore(score, { microDesktop: 5, singleBoard: 4, readyMini: 1, fanless: 1 });
    if (budget === "mid") addScore(score, { readyMini: 4, miniITX: 2, fanless: 2, microDesktop: 2 });
    if (budget === "high") addScore(score, { miniITX: 5, readyMini: 2, fanless: 1 });

    if (formatPreference === "ready") addScore(score, { readyMini: 5, fanless: 3, microDesktop: 2 });
    if (formatPreference === "build") addScore(score, { miniITX: 6 });
    if (formatPreference === "experiment") addScore(score, { singleBoard: 7 });

    if (alwaysOn) addScore(score, { fanless: 5, singleBoard: 4, readyMini: 2, microDesktop: 1 });
    if (portable) addScore(score, { readyMini: 3, microDesktop: 3, singleBoard: 2, fanless: 1 });

    const level = getLevel(selectedTasks);

    const ranked = (Object.keys(score) as SolutionId[])
      .map((id) => ({ id, score: score[id], ...solutions[id] }))
      .sort((a, b) => b.score - a.score);

    const top = ranked[0];
    const alt = ranked[1];

    const reasons: string[] = [];
    if (selectedTasks.includes("gaming") || selectedTasks.includes("graphicsAi")) {
      reasons.push("Вы выбрали тяжёлые задачи, поэтому наверх поднимаются более производительные форматы.");
    }
    if (selectedTasks.includes("server") || alwaysOn) {
      reasons.push("Так как компьютер должен работать долго или постоянно, сайт выше оценивает стабильные и экономичные решения.");
    }
    if (noiseLevel === "silent") {
      reasons.push("Для вас важна тишина, поэтому шумные варианты получают меньше баллов.");
    }
    if (upgradeLevel === "high") {
      reasons.push("Вы указали важность апгрейда, поэтому выше поднимаются форматы, где проще менять детали.");
    }
    if (budget === "low") {
      reasons.push("Из-за ограниченного бюджета подбор сильнее ориентируется на доступные решения.");
    }
    if (sizePreference === "tiny") {
      reasons.push("У вас высокий приоритет на очень маленький размер, поэтому более крупные форматы отходят на второй план.");
    }

    const confidence = getConfidence(top.score, alt.score);
    const alternatives = getOtherVariantNotes(ranked, top.id, noiseLevel, budget, upgradeLevel, sizePreference, selectedTasks);

    return {
      level,
      ranked,
      top,
      alt,
      reasons,
      confidence,
      alternatives,
      spec: getSpec(top.id, level, budget),
    };
  }, [selectedTasks, sizePreference, upgradeLevel, noiseLevel, budget, formatPreference, alwaysOn, portable]);

  const activeFilters = useMemo(() => {
    const labels: string[] = [];

    if (selectedTasks.length > 0) {
      labels.push(...selectedTasks.map((task) => taskOptions.find((item) => item.id === task)?.label || task));
    }

    const sizeLabels: Record<SizePreference, string> = {
      tiny: "максимально маленький",
      small: "просто компактный",
      bigger: "можно чуть больше",
    };

    const upgradeLabels: Record<UpgradeLevel, string> = {
      low: "апгрейд не важен",
      medium: "апгрейд желателен",
      high: "апгрейд очень важен",
    };

    const noiseLabels: Record<NoiseLevel, string> = {
      silent: "максимально тихий",
      balanced: "шум средне важен",
      any: "шум не важен",
    };

    const budgetLabels: Record<Budget, string> = {
      low: "низкий бюджет",
      mid: "средний бюджет",
      high: "высокий бюджет",
    };

    const formatLabels: Record<FormatPreference, string> = {
      ready: "готовый компьютер",
      build: "сборка своими руками",
      experiment: "эксперименты и обучение",
      any: "формат не важен",
    };

    labels.push(sizeLabels[sizePreference]);
    labels.push(upgradeLabels[upgradeLevel]);
    labels.push(noiseLabels[noiseLevel]);
    labels.push(budgetLabels[budget]);
    labels.push(formatLabels[formatPreference]);
    if (alwaysOn) labels.push("работа 24/7");
    if (portable) labels.push("лёгкое перемещение");

    return labels;
  }, [selectedTasks, sizePreference, upgradeLevel, noiseLevel, budget, formatPreference, alwaysOn, portable]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#dce8ff_0%,#cfdbff_20%,#c4d6fb_52%,#ecf3ff_100%)] text-slate-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-16 top-8 h-72 w-72 rounded-full bg-cyan-300/30 blur-3xl" />
        <div className="absolute right-0 top-10 h-80 w-80 rounded-full bg-violet-300/25 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-80 w-80 rounded-full bg-sky-200/25 blur-3xl" />
        <div className="absolute bottom-24 right-20 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.38),transparent_38%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
          <Card className={`${glassCard} overflow-hidden`}>
            <CardContent className="relative p-8 md:p-10">
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.34),rgba(255,255,255,0.12))]" />
              <div className="absolute -right-12 top-0 h-44 w-44 rounded-full bg-white/20 blur-3xl" />
              <div className="absolute bottom-0 left-0 h-44 w-44 rounded-full bg-cyan-100/22 blur-3xl" />
              <div className="relative">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/20 px-3 py-1 text-sm text-slate-900 shadow-[0_8px_24px_rgba(255,255,255,0.12)] backdrop-blur-xl">
                  <Sparkles className="h-4 w-4" />
                  Подбор мини-ПК
                </div>

                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h1 className="max-w-3xl text-3xl font-bold tracking-tight text-slate-950 md:text-5xl">
                      Подбор компактного ПК без путаницы
                    </h1>
                    <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-900/82 md:text-base">
                      Сайт стал более понятным: теперь видно, где шаги, что уже выбрано, а какие элементы можно нажимать.
                      Пользователь быстро проходит от задач к результату, а комиссия сразу понимает логику подбора.
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    className="rounded-[22px] border-white/40 bg-white/18 text-slate-950 backdrop-blur-xl hover:bg-white/28"
                    onClick={resetAll}
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Сбросить всё
                  </Button>
                </div>

                <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <StepPill number="1" title="Выберите сценарий" hint="Можно быстро начать с готового шаблона." />
                  <StepPill number="2" title="Отметьте требования" hint="Карточки теперь явно показывают состояние выбора." />
                  <StepPill number="3" title="Смотрите итог" hint="Справа всегда виден лучший формат и объяснение." />
                  <StepPill number="4" title="Сузьте поиск" hint="Ниже будут подсказки, что искать уже среди моделей." />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={glassCard}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl text-slate-950">
                <BadgeCheck className="h-5 w-5" />
                Что видно сразу
              </CardTitle>
              <CardDescription className="text-slate-900/75">Понятный короткий итог без прокрутки по всему сайту</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-[24px] border border-white/34 bg-white/22 p-4 backdrop-blur-xl">
                <div className="text-xs uppercase tracking-[0.18em] text-slate-700/75">Лучший формат сейчас</div>
                <div className="mt-2 text-2xl font-bold text-slate-950">{results.top.title}</div>
                <div className="mt-2 text-sm leading-6 text-slate-900/80">{results.top.short}</div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <InfoPill title="Уровень задач" text={results.level} />
                <InfoPill title="Второй вариант" text={results.alt.title} />
              </div>

              <div className="rounded-[24px] border border-white/28 bg-white/14 p-4 backdrop-blur-xl">
                <div className="text-sm font-semibold text-slate-950">Сейчас выбрано</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {activeFilters.slice(0, 8).map((item) => (
                    <ActiveChip key={item} label={item} />
                  ))}
                </div>
              </div>

              <div className="rounded-[24px] border border-white/30 bg-[linear-gradient(135deg,rgba(255,255,255,0.28),rgba(255,255,255,0.16))] p-4 text-slate-950 shadow-[0_18px_40px_rgba(148,163,184,0.18)] backdrop-blur-2xl">
                <div className="text-sm font-semibold">{results.confidence.title}</div>
                <div className="mt-1 text-sm leading-6 text-slate-900/80">{results.confidence.text}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
          <div className="space-y-6">
            <Card className={glassCard}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-950">
                  <Sparkles className="h-4 w-4" />
                  Шаг 1. Быстрый старт
                </CardTitle>
                <CardDescription className="text-slate-900/75">
                  Можно нажать на готовый сценарий, чтобы не заполнять всё с нуля.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {presets.map((preset) => (
                    <OptionCard
                      key={preset.id}
                      title={preset.title}
                      description={preset.hint}
                      active={
                        selectedTasks.join("|") === preset.tasks.join("|") &&
                        sizePreference === preset.size &&
                        upgradeLevel === preset.upgrade &&
                        noiseLevel === preset.noise &&
                        budget === preset.budget &&
                        formatPreference === preset.format &&
                        alwaysOn === preset.alwaysOn &&
                        portable === preset.portable
                      }
                      onClick={() => applyPreset(preset)}
                      icon={Sparkles}
                      compact
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className={glassCard}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-950">
                  <Target className="h-4 w-4" />
                  Шаг 2. Задачи и требования
                </CardTitle>
                <CardDescription className="text-slate-900/75">
                  Всё кликабельное теперь выглядит как отдельные кнопки-карточки с явным состоянием.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div>
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-950">
                    <ArrowRight className="h-4 w-4" />
                    Для чего нужен компьютер
                  </div>
                  <div className="mb-4 rounded-[18px] border border-white/24 bg-white/10 px-4 py-3 text-sm leading-6 text-slate-900/80 backdrop-blur-xl">
                    Можно выбрать несколько задач сразу. Активные карточки становятся светлее, получают отметку и подпись
                    «Выбрано».
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {taskOptions.map((task) => (
                      <OptionCard
                        key={task.id}
                        title={task.label}
                        description={task.hint}
                        active={selectedTasks.includes(task.id)}
                        onClick={() => toggleTask(task.id)}
                        icon={task.icon}
                        multi
                      />
                    ))}
                  </div>
                </div>

                <div className="grid gap-8 xl:grid-cols-2">
                  <div>
                    <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-950">
                      <SlidersHorizontal className="h-4 w-4" />
                      Насколько важен размер
                    </div>
                    <div className="grid gap-3">
                      <OptionCard
                        title="Как можно меньше"
                        description="чем компактнее, тем лучше"
                        active={sizePreference === "tiny"}
                        onClick={() => setSizePreference("tiny")}
                      />
                      <OptionCard
                        title="Просто компактный"
                        description="маленький, но удобный для повседневного использования"
                        active={sizePreference === "small"}
                        onClick={() => setSizePreference("small")}
                      />
                      <OptionCard
                        title="Можно чуть больше"
                        description="если это даст больше мощности и возможностей"
                        active={sizePreference === "bigger"}
                        onClick={() => setSizePreference("bigger")}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-950">
                      <Wrench className="h-4 w-4" />
                      Возможность менять детали
                    </div>
                    <div className="grid gap-3">
                      <OptionCard
                        title="Не важна"
                        description="главное — чтобы всё просто работало"
                        active={upgradeLevel === "low"}
                        onClick={() => setUpgradeLevel("low")}
                      />
                      <OptionCard
                        title="Желательно"
                        description="не обязательно, но запас на будущее приветствуется"
                        active={upgradeLevel === "medium"}
                        onClick={() => setUpgradeLevel("medium")}
                      />
                      <OptionCard
                        title="Очень важна"
                        description="хочу менять детали и постепенно улучшать систему"
                        active={upgradeLevel === "high"}
                        onClick={() => setUpgradeLevel("high")}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-8 xl:grid-cols-2">
                  <div>
                    <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-950">
                      <VolumeX className="h-4 w-4" />
                      Допустимый шум
                    </div>
                    <div className="grid gap-3">
                      <OptionCard
                        title="Максимально тихий"
                        description="тишина — один из главных приоритетов"
                        active={noiseLevel === "silent"}
                        onClick={() => setNoiseLevel("silent")}
                      />
                      <OptionCard
                        title="Средне"
                        description="важен баланс, а не полная тишина"
                        active={noiseLevel === "balanced"}
                        onClick={() => setNoiseLevel("balanced")}
                      />
                      <OptionCard
                        title="Не важно"
                        description="уровень шума не влияет на выбор"
                        active={noiseLevel === "any"}
                        onClick={() => setNoiseLevel("any")}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-950">
                      <Wallet className="h-4 w-4" />
                      Бюджет
                    </div>
                    <div className="grid gap-3">
                      <OptionCard
                        title="Низкий"
                        description="главное — доступность и разумная цена"
                        active={budget === "low"}
                        onClick={() => setBudget("low")}
                      />
                      <OptionCard
                        title="Средний"
                        description="нужен хороший баланс цены и возможностей"
                        active={budget === "mid"}
                        onClick={() => setBudget("mid")}
                      />
                      <OptionCard
                        title="Высокий"
                        description="можно смотреть более сильные и гибкие решения"
                        active={budget === "high"}
                        onClick={() => setBudget("high")}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-950">
                    <Gauge className="h-4 w-4" />
                    Какой формат вам ближе
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <OptionCard
                      title="Готовый компьютер"
                      description="хочу купить готовое решение и не собирать самому"
                      active={formatPreference === "ready"}
                      onClick={() => setFormatPreference("ready")}
                    />
                    <OptionCard
                      title="Сборка своими руками"
                      description="готов заниматься комплектующими и сборкой"
                      active={formatPreference === "build"}
                      onClick={() => setFormatPreference("build")}
                    />
                    <OptionCard
                      title="Эксперименты и обучение"
                      description="интересны Linux, платы и технические опыты"
                      active={formatPreference === "experiment"}
                      onClick={() => setFormatPreference("experiment")}
                    />
                    <OptionCard
                      title="Без разницы"
                      description="пусть сайт выберет наиболее подходящее направление сам"
                      active={formatPreference === "any"}
                      onClick={() => setFormatPreference("any")}
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <OptionCard
                    title="Должен работать постоянно"
                    description="например как сервер, медиахаб или устройство для дома"
                    active={alwaysOn}
                    onClick={() => setAlwaysOn((value) => !value)}
                    icon={Leaf}
                    multi
                    compact
                  />
                  <OptionCard
                    title="Важно лёгкое перемещение"
                    description="нужны маленький размер и удобство переноски"
                    active={portable}
                    onClick={() => setPortable((value) => !value)}
                    icon={Sparkles}
                    multi
                    compact
                  />
                </div>
              </CardContent>
            </Card>

            <CollapsibleBlock
              title="О сайте и как понимать результат"
              description="Комиссии и пользователю сразу ясно, что именно делает этот сайт"
              defaultOpen={false}
            >
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-[22px] border border-white/28 bg-white/14 p-4 backdrop-blur-xl">
                  <div className="mb-2 text-sm font-semibold text-slate-950">О практическом продукте</div>
                  <p className="text-sm leading-6 text-slate-900/80">
                    Сайт является практическим результатом проекта о малогабаритных персональных компьютерах. Его задача —
                    не назвать одну конкретную модель, а помочь определить наиболее подходящий тип компактного ПК.
                  </p>
                </div>
                <div className="rounded-[22px] border border-white/28 bg-white/14 p-4 backdrop-blur-xl">
                  <div className="mb-2 text-sm font-semibold text-slate-950">Как читать вывод</div>
                  <p className="text-sm leading-6 text-slate-900/80">
                    Справа показывается лучший формат, уровень уверенности и объяснение. Ниже есть сильные стороны,
                    альтернативы и подсказки, что искать уже среди реальных моделей.
                  </p>
                </div>
              </div>
            </CollapsibleBlock>
          </div>

          <div className="space-y-6">
            <Card className={`${glassCard} xl:sticky xl:top-6`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-950">
                  <BadgeCheck className="h-4 w-4" />
                  Шаг 3. Рекомендация
                </CardTitle>
                <CardDescription className="text-slate-900/75">
                  Справа всегда виден результат, поэтому интерфейс ощущается понятнее и живее.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="rounded-[28px] border border-white/34 bg-[linear-gradient(135deg,rgba(255,255,255,0.34),rgba(255,255,255,0.16))] p-5 text-slate-950 shadow-[0_18px_40px_rgba(148,163,184,0.18)] backdrop-blur-2xl">
                  <div className="text-xs uppercase tracking-[0.18em] text-slate-700/75">Лучший формат по текущим параметрам</div>
                  <div className="mt-2 flex items-start justify-between gap-3">
                    <div>
                      <div className="text-2xl font-bold">{results.top.title}</div>
                      <div className="mt-2 text-sm leading-6 text-slate-900/80">{results.top.description}</div>
                    </div>
                    <div className="inline-flex rounded-[18px] border border-white/35 bg-white/18 p-3 backdrop-blur-xl">
                      <results.top.icon className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {results.top.bestFor.map((item) => (
                      <span key={item} className="rounded-full border border-white/34 bg-white/18 px-3 py-1 text-xs text-slate-950 backdrop-blur-xl">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  <InfoPill title="Лучший формат" text={results.top.title} />
                  <InfoPill title="Второй по силе" text={results.alt.title} />
                  <InfoPill title="Уровень задач" text={results.level} />
                </div>

                <CollapsibleBlock title="Почему выбран именно этот формат" description="Короткое объяснение простыми словами" defaultOpen>
                  <div className="space-y-2">
                    {results.reasons.length > 0 ? (
                      results.reasons.map((reason) => (
                        <div key={reason} className="flex items-start gap-2 rounded-[18px] border border-white/24 bg-white/10 p-3 text-sm text-slate-900/85 backdrop-blur-xl">
                          <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0" />
                          <span>{reason}</span>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-[18px] border border-white/24 bg-white/10 p-3 text-sm text-slate-900/85 backdrop-blur-xl">
                        По выбранным параметрам лучше всего подходит спокойный и универсальный формат без лишней сложности.
                      </div>
                    )}
                  </div>
                </CollapsibleBlock>

                <CollapsibleBlock title="Что можно искать дальше" description="Пример направления для реального поиска" defaultOpen>
                  <div className="rounded-[18px] border border-white/24 bg-white/10 p-4 backdrop-blur-xl">
                    <div className="font-semibold text-slate-950">{results.spec.title}</div>
                    <ul className="mt-3 space-y-2 text-sm text-slate-900/80">
                      {results.spec.items.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-slate-500/70" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CollapsibleBlock>

                <CollapsibleBlock title="Сильные стороны этого варианта" description="Так проще понять его преимущества" defaultOpen>
                  <div className="space-y-4">
                    <MetricRow label="Компактность" value={results.top.metrics.compactness} />
                    <MetricRow label="Мощность" value={results.top.metrics.performance} />
                    <MetricRow label="Тишина" value={results.top.metrics.silence} />
                    <MetricRow label="Апгрейд" value={results.top.metrics.upgrade} />
                    <MetricRow label="Экономичность" value={results.top.metrics.economy} />
                  </div>
                </CollapsibleBlock>

                <CollapsibleBlock title="Почему другие форматы ниже" description="Не только лучший вариант, но и логика сравнения" defaultOpen={false}>
                  <div className="space-y-3">
                    {results.alternatives.map((item) => (
                      <div key={item.title} className="rounded-[18px] border border-white/24 bg-white/10 p-3 text-sm backdrop-blur-xl">
                        <div className="font-semibold text-slate-950">{item.title}</div>
                        <div className="mt-1 leading-6 text-slate-900/80">{item.text}</div>
                      </div>
                    ))}
                  </div>
                </CollapsibleBlock>

                <Button
                  className="w-full rounded-[22px] border border-white/35 bg-white/22 text-slate-950 shadow-[0_12px_30px_rgba(255,255,255,0.16)] backdrop-blur-xl hover:bg-white/28"
                  onClick={resetAll}
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Очистить выбор и начать заново
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.34fr_0.66fr]">
          <Card className={glassCard}>
            <CardHeader>
              <CardTitle className="text-slate-950">Сравнение всех форматов</CardTitle>
              <CardDescription className="text-slate-900/75">
                Здесь видно, какой вариант лучший, а какие остаются сильными запасными решениями.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {results.ranked.map((item) => {
                  const Icon = item.icon;
                  const label = getMatchLabel(item.score, results.top.score);

                  return (
                    <div
                      key={item.id}
                      className={`rounded-[28px] border p-4 backdrop-blur-2xl ${
                        item.id === results.top.id
                          ? "border-white/42 bg-[linear-gradient(135deg,rgba(255,255,255,0.34),rgba(255,255,255,0.18))] text-slate-950 shadow-[0_16px_40px_rgba(148,163,184,0.18)]"
                          : "border-white/28 bg-white/12 text-slate-950 shadow-[0_12px_30px_rgba(255,255,255,0.1)]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className={`inline-flex rounded-[18px] p-2 ${item.id === results.top.id ? "bg-white/24" : "bg-white/16"}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="rounded-full border border-white/34 bg-white/18 px-2.5 py-1 text-[11px] text-slate-900/80 backdrop-blur-xl">
                          {label}
                        </span>
                      </div>

                      <div className="mt-3 text-lg font-semibold leading-6">{item.title}</div>
                      <div className="mt-2 text-sm leading-6 text-slate-900/80">{item.short}</div>

                      <div className="mt-4 space-y-3 text-sm text-slate-900/82">
                        <div>
                          <div className="font-semibold text-slate-950">Подойдёт, если важно</div>
                          <div className="mt-1">{item.bestFor.slice(0, 3).join(", ")}</div>
                        </div>
                        <div>
                          <div className="font-semibold text-slate-950">Главное ограничение</div>
                          <div className="mt-1">{item.limits[0]}</div>
                        </div>
                        <div className="grid gap-2 pt-1">
                          <MetricRow label="Мощность" value={item.metrics.performance} />
                          <MetricRow label="Тишина" value={item.metrics.silence} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className={glassCard}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-950">
                  <Info className="h-4 w-4" />
                  Коротко о терминах
                </CardTitle>
                <CardDescription className="text-slate-900/75">Чтобы пользователь и комиссия не спотыкались о незнакомые слова</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-900/82">
                <div><span className="font-semibold text-slate-950">ПК</span> — персональный компьютер.</div>
                <div><span className="font-semibold text-slate-950">Мини-ПК</span> — маленький готовый компьютер.</div>
                <div><span className="font-semibold text-slate-950">SSD</span> — быстрый накопитель для системы и файлов.</div>
                <div><span className="font-semibold text-slate-950">3D</span> — работа с объёмной графикой.</div>
                <div><span className="font-semibold text-slate-950">24/7</span> — работа постоянно, днём и ночью.</div>
                <div className="pt-2 text-sm font-semibold text-slate-950">Что означает каждый формат</div>
                <div><span className="font-semibold text-slate-950">Готовый мини-ПК</span> — маленький готовый компьютер для учёбы, фильмов, интернета и обычной работы.</div>
                <div><span className="font-semibold text-slate-950">Компактный системный блок</span> — небольшая, но более мощная сборка, где обычно проще менять детали и делать апгрейд.</div>
                <div><span className="font-semibold text-slate-950">Одноплатный компьютер</span> — маленькая плата-компьютер для обучения, сервера и разных экспериментов.</div>
                <div><span className="font-semibold text-slate-950">Бесшумный мини-ПК</span> — компактный компьютер с упором на тишину и спокойную повседневную работу.</div>
                <div><span className="font-semibold text-slate-950">Сверхмалый настольный ПК</span> — очень маленький настольный компьютер для дома, учёбы и простых задач.</div>
              </CardContent>
            </Card>

            <Card className={glassCard}>
              <CardHeader>
                <CardTitle className="text-slate-950">Почему интерфейс стал понятнее</CardTitle>
                <CardDescription className="text-slate-900/75">Это можно использовать и как пояснение на защите проекта</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm leading-6 text-slate-900/82">
                <div>Интерфейс разбит на шаги, поэтому пользователь не теряется в большом количестве параметров.</div>
                <div>Каждая кнопка теперь выглядит как отдельная интерактивная карточка: видно, что на неё можно нажать и видно, когда она выбрана.</div>
                <div>Справа постоянно находится краткий результат, поэтому логика подбора читается сразу, без лишней прокрутки.</div>
                <div>Важные блоки — причины выбора, сильные стороны и альтернативы — открываются отдельно, поэтому экран не перегружен.</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
