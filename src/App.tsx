import React, { useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Box,
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
    hint: "Если нужен понятный и спокойный вариант для дома и занятий",
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
    hint: "Фильмы, интернет, документы и обычные повседневные задачи",
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
    title: "Для кода и тяжёлой работы",
    hint: "Если важны мощность, запас по задачам и возможность менять детали",
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
    hint: "Если компьютер должен работать долго и без лишнего шума",
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
    short: "Удобный и понятный вариант для большинства людей",
    description:
      "Маленький готовый компьютер. Подходит для учёбы, интернета, фильмов, работы с документами и обычной многозадачности.",
    icon: Monitor,
    examples: ["Небольшой офисный мини-ПК", "Домашний мини-ПК", "Компактный готовый компьютер"],
    bestFor: ["учёба", "интернет", "фильмы", "простая работа"],
    limits: ["не самый удобный для серьёзного апгрейда", "не лучший выбор для тяжёлых игр и 3D"],
    metrics: { compactness: 9, performance: 6, silence: 8, upgrade: 4, economy: 8 },
  },
  miniITX: {
    title: "Компактный системный блок",
    short: "Лучший вариант, если нужна мощность и возможность менять детали",
    description:
      "Небольшой, но уже очень мощный компьютер. Подходит для игр, 3D, сложных программ и тех, кто хочет собирать систему сам.",
    icon: Box,
    examples: ["Небольшой корпус", "Компактная материнская плата", "Мощная сборка в маленьком размере"],
    bestFor: ["игры", "3D", "сложные задачи", "апгрейд"],
    limits: ["обычно дороже", "сложнее собирать", "нужно следить за охлаждением"],
    metrics: { compactness: 6, performance: 10, silence: 6, upgrade: 10, economy: 5 },
  },
  singleBoard: {
    title: "Одноплатный компьютер",
    short: "Очень маленький вариант для опытов, сервера и учёбы",
    description:
      "Это совсем маленькая плата-компьютер. Хорошо подходит для сервера, умного дома, обучения Linux и разных экспериментов.",
    icon: CircuitBoard,
    examples: ["Raspberry Pi", "Orange Pi", "Другие маленькие платы"],
    bestFor: ["умный дом", "сервер", "обучение", "эксперименты"],
    limits: ["не для тяжёлых игр", "не для серьёзного 3D", "не всегда удобно как обычный ПК"],
    metrics: { compactness: 10, performance: 3, silence: 10, upgrade: 3, economy: 9 },
  },
  fanless: {
    title: "Бесшумный мини-ПК",
    short: "Подходит тем, кому очень важна тишина",
    description:
      "Компьютер без обычных шумных вентиляторов. Хорош для фильмов, офиса, работы 24/7 и спокойных домашних задач.",
    icon: VolumeX,
    examples: ["Тихий домашний ПК", "Мини-ПК без шума", "Компактный компьютер для постоянной работы"],
    bestFor: ["тишина", "фильмы", "офис", "круглосуточная работа"],
    limits: ["не самый мощный", "обычно слабее игровых сборок"],
    metrics: { compactness: 8, performance: 5, silence: 10, upgrade: 4, economy: 9 },
  },
  microDesktop: {
    title: "Сверхмалый настольный ПК",
    short: "Очень маленький и часто выгодный по цене вариант",
    description:
      "Очень маленький настольный компьютер. Подходит для повседневных задач, если нужен маленький размер и разумная цена.",
    icon: HardDrive,
    examples: ["Очень маленький офисный ПК", "Компактный домашний ПК", "Миниатюрный настольный компьютер"],
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
  const budgetNote = budget === "low" ? "С упором на цену" : budget === "high" ? "С запасом на будущее" : "С хорошим балансом";

  switch (solutionId) {
    case "readyMini":
      if (level === "Мощный") {
        return {
          title: "Что можно искать среди более мощных готовых мини-ПК",
          items: [
            "Процессор: Ryzen 7 или похожий",
            "Память: 32 ГБ",
            "Накопитель: 1 ТБ SSD",
            "Подойдёт для тяжёлой повседневной работы",
            budgetNote,
          ],
        };
      }
      if (level === "Средний") {
        return {
          title: "Что можно искать среди средних готовых мини-ПК",
          items: [
            "Процессор: Ryzen 5 или Core i5",
            "Память: 16–32 ГБ",
            "Накопитель: 512 ГБ – 1 ТБ SSD",
            "Подойдёт для кода, фильмов и обычной работы",
            budgetNote,
          ],
        };
      }
      return {
        title: "Что можно искать среди базовых готовых мини-ПК",
        items: [
          "Процессор: Intel N100 / N200 или похожий",
          "Память: 16 ГБ",
          "Накопитель: 512 ГБ SSD",
          "Подойдёт для учёбы, интернета и фильмов",
          budgetNote,
        ],
      };

    case "miniITX":
      if (level === "Мощный") {
        return {
          title: "Что можно искать среди мощных компактных сборок",
          items: [
            "Процессор: Core i5-13400 или Ryzen 7 7700",
            "Видеокарта: RTX 4060 / 4060 Ti",
            "Память: 32 ГБ",
            "Накопитель: 1 ТБ SSD",
            "Небольшой корпус и маленький блок питания",
          ],
        };
      }
      return {
        title: "Что можно искать среди средних компактных сборок",
        items: [
          "Процессор: Ryzen 5 / Core i5",
          "Память: 16–32 ГБ",
          "Накопитель: 1 ТБ SSD",
          "Видеокарта по желанию",
          "Подходит для работы, кода и части игр",
        ],
      };

    case "singleBoard":
      return {
        title: "Что можно искать среди одноплатных компьютеров",
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
        title: "Что можно искать среди бесшумных мини-ПК",
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
        title: "Что можно искать среди сверхмалых настольных ПК",
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
      text: "У вас довольно гибкие требования, поэтому можно смотреть сразу в две стороны и выбирать по цене, внешнему виду или удобству покупки.",
    };
  }
  if (diff <= 3) {
    return {
      title: "Результат достаточно уверенный",
      text: "Лучший вариант уже заметно впереди, но запасной тоже стоит держать в уме, если найдётся более выгодное предложение.",
    };
  }
  return {
    title: "Результат уверенный",
    text: "По выбранным параметрам один формат явно подходит лучше остальных, поэтому именно с него стоит начинать поиск.",
  };
}

function getOtherVariantNotes(
  ranked: Array<{ id: SolutionId; title: string }> ,
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
              ? "Этот вариант не поднялся выше, потому что для вас сейчас важнее тишина, простота или готовое решение, а не максимальная мощность и сборка своими руками."
              : "Этот вариант близок, но в вашем случае победил другой формат из-за лучшего баланса между удобством, ценой и повседневными задачами.",
        };
      }
      if (item.id === "singleBoard") {
        return {
          title: item.title,
          text:
            tasks.includes("gaming") || tasks.includes("graphicsAi") || tasks.includes("programming")
              ? "Он не вышел на первое место, потому что вы выбрали задачи, для которых нужна заметно более высокая мощность."
              : "Он хорошо подходит для сервера, Linux и экспериментов, но как основной ПК удобен не для всех.",
        };
      }
      if (item.id === "fanless") {
        return {
          title: item.title,
          text:
            noiseLevel !== "silent"
              ? "Он не стал первым, потому что тишина для вас не была главным приоритетом, а другие варианты оказались универсальнее."
              : "Он близок к первому месту и особенно хорош, если вы хотите максимально тихую систему без лишнего шума.",
        };
      }
      if (item.id === "microDesktop") {
        return {
          title: item.title,
          text:
            budget === "high"
              ? "Он опустился ниже, потому что при вашем бюджете можно смотреть в сторону более сильных и гибких решений."
              : "Он хорош по цене и размеру, но часто уступает более серьёзным вариантам по запасу мощности и апгрейду.",
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
  "rounded-[30px] border border-white/40 bg-white/18 shadow-[0_20px_80px_rgba(15,23,42,0.16)] backdrop-blur-2xl";

function ChoiceButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
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
        <div className="mb-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
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

                <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr] xl:items-start">
                  <div>
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between xl:block">
                      <div>
                        <h1 className="max-w-3xl text-3xl font-bold tracking-tight text-slate-950 md:text-5xl">
                          Подбор мини-ПК по вашим требованиям
                        </h1>
                        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-900/80 md:text-base">
                          Сайт помогает спокойно сузить выбор и понять, какой тип компактного компьютера подойдёт именно вам: готовый мини-ПК, компактная сборка, одноплатный компьютер, бесшумное решение или сверхмалый настольный ПК.
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        className="rounded-[22px] border-white/40 bg-white/18 text-slate-950 backdrop-blur-xl hover:bg-white/26 xl:mt-6"
                        onClick={resetAll}
                      >
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Начать заново
                      </Button>
                    </div>

                    <div className="mt-8 grid gap-3 sm:grid-cols-2">
                      {[
                        ["Базовый", "учёба, интернет, фильмы"],
                        ["Средний", "код, много окон, медиа"],
                        ["Мощный", "игры, 3D, тяжёлая работа"],
                        ["24/7", "сервер, хранение, автоматизация"],
                      ].map(([title, text]) => (
                        <InfoPill key={title} title={title} text={text} />
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[28px] border border-white/34 bg-[linear-gradient(135deg,rgba(255,255,255,0.28),rgba(255,255,255,0.14))] p-5 shadow-[0_18px_40px_rgba(148,163,184,0.16)] backdrop-blur-2xl">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
                      <Sparkles className="h-4 w-4" />
                      Быстрый старт
                    </div>
                    <div className="mt-1 text-sm leading-6 text-slate-900/75">
                      Если не хочется выбирать всё вручную, можно начать с готового сценария
                    </div>
                    <div className="mt-4 grid gap-3">
                      {presets.map((preset) => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => applyPreset(preset)}
                          className="group flex cursor-pointer items-start justify-between gap-3 rounded-[24px] border border-white/32 bg-white/16 p-4 text-left shadow-[0_10px_24px_rgba(255,255,255,0.08)] backdrop-blur-xl transition-all duration-200 hover:-translate-y-0.5 hover:border-white/48 hover:bg-white/22 active:scale-[0.99]"
                        >
                          <div>
                            <div className="text-sm font-semibold text-slate-950">{preset.title}</div>
                            <div className="mt-2 text-xs leading-6 text-slate-900/75">{preset.hint}</div>
                          </div>
                          <span className="mt-1 rounded-full border border-white/34 bg-white/18 p-1 text-slate-950 transition-transform duration-200 group-hover:translate-x-0.5">
                            <ArrowRight className="h-3.5 w-3.5" />
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={glassCard}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl text-slate-950">
                <BadgeCheck className="h-5 w-5" />
                Короткий итог
              </CardTitle>
              <CardDescription className="text-slate-900/75">Самое главное — без лишнего текста</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-[24px] border border-white/34 bg-white/22 p-4 backdrop-blur-xl">
                <div className="text-xs uppercase tracking-[0.18em] text-slate-700/75">Лучший формат</div>
                <div className="mt-2 text-2xl font-bold text-slate-950">{results.top.title}</div>
              </div>

              <div className="grid gap-3">
                <div className="rounded-[22px] border border-white/26 bg-white/14 p-4 backdrop-blur-xl">
                  <div className="text-sm font-semibold text-slate-950">Подходит, если вам нужно</div>
                  <div className="mt-1 text-sm leading-6 text-slate-900/80">{results.top.bestFor.slice(0, 3).join(", ")}</div>
                </div>
                <div className="rounded-[22px] border border-white/26 bg-white/14 p-4 backdrop-blur-xl">
                  <div className="text-sm font-semibold text-slate-950">Главное, что стоит учесть</div>
                  <div className="mt-1 text-sm leading-6 text-slate-900/80">{results.top.limits[0]}</div>
                </div>
                <div className="rounded-[22px] border border-white/26 bg-white/14 p-4 backdrop-blur-xl">
                  <div className="text-sm font-semibold text-slate-950">Уровень задач</div>
                  <div className="mt-1 text-sm leading-6 text-slate-900/80">{results.level}</div>
                </div>
              </div>

              <div className="rounded-[24px] border border-white/30 bg-[linear-gradient(135deg,rgba(255,255,255,0.28),rgba(255,255,255,0.16))] p-4 text-slate-950 shadow-[0_18px_40px_rgba(148,163,184,0.18)] backdrop-blur-2xl">
                <div className="text-sm font-semibold">{results.confidence.title}</div>
                <div className="mt-1 text-sm leading-6 text-slate-900/80">{results.confidence.text}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className={glassCard}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-950">
                <Target className="h-4 w-4" />
                Шаг 1. Для чего вам нужен компьютер?
              </CardTitle>
              <CardDescription className="text-slate-900/75">Можно выбрать несколько пунктов. Чем точнее выбор, тем полезнее итог.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {taskOptions.map((task) => {
                  const Icon = task.icon;
                  const active = selectedTasks.includes(task.id);
                  return (
                    <ChoiceButton key={task.id} active={active} onClick={() => toggleTask(task.id)}>
                      <div className="flex items-start gap-3">
                        <div className={`rounded-[18px] p-2 ${active ? "bg-white/24" : "bg-white/16"}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-semibold">{task.label}</div>
                          <div className={`mt-1 text-sm leading-6 ${active ? "text-slate-900/80" : "text-slate-900/70"}`}>{task.hint}</div>
                        </div>
                      </div>
                    </ChoiceButton>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className={glassCard}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-950">
                <SlidersHorizontal className="h-4 w-4" />
                Шаг 2. Что для вас важно?
              </CardTitle>
              <CardDescription className="text-slate-900/75">Сейчас сайт уточнит ваши приоритеты: размер, шум, цена и удобство.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-950">
                  <Box className="h-4 w-4" /> Размер
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  <ChoiceButton active={sizePreference === "tiny"} onClick={() => setSizePreference("tiny")}>
                    <div className="font-semibold">Максимально маленький</div>
                    <div className="mt-1 text-sm text-slate-900/70">чем меньше, тем лучше</div>
                  </ChoiceButton>
                  <ChoiceButton active={sizePreference === "small"} onClick={() => setSizePreference("small")}>
                    <div className="font-semibold">Просто компактный</div>
                    <div className="mt-1 text-sm text-slate-900/70">маленький, но без крайностей</div>
                  </ChoiceButton>
                  <ChoiceButton active={sizePreference === "bigger"} onClick={() => setSizePreference("bigger")}>
                    <div className="font-semibold">Размер не главный</div>
                    <div className="mt-1 text-sm text-slate-900/70">важнее мощность и удобство</div>
                  </ChoiceButton>
                </div>
              </div>

              <div>
                <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-950">
                  <Wrench className="h-4 w-4" /> Апгрейд
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  <ChoiceButton active={upgradeLevel === "low"} onClick={() => setUpgradeLevel("low")}>
                    <div className="font-semibold">Не важен</div>
                  </ChoiceButton>
                  <ChoiceButton active={upgradeLevel === "medium"} onClick={() => setUpgradeLevel("medium")}>
                    <div className="font-semibold">Желателен</div>
                  </ChoiceButton>
                  <ChoiceButton active={upgradeLevel === "high"} onClick={() => setUpgradeLevel("high")}>
                    <div className="font-semibold">Очень важна</div>
                  </ChoiceButton>
                </div>
              </div>

              <div>
                <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-950">
                  <VolumeX className="h-4 w-4" /> Шум
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  <ChoiceButton active={noiseLevel === "silent"} onClick={() => setNoiseLevel("silent")}>
                    <div className="font-semibold">Максимально тихий</div>
                  </ChoiceButton>
                  <ChoiceButton active={noiseLevel === "balanced"} onClick={() => setNoiseLevel("balanced")}>
                    <div className="font-semibold">Средне</div>
                  </ChoiceButton>
                  <ChoiceButton active={noiseLevel === "any"} onClick={() => setNoiseLevel("any")}>
                    <div className="font-semibold">Не важно</div>
                  </ChoiceButton>
                </div>
              </div>

              <div>
                <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-950">
                  <Wallet className="h-4 w-4" /> Бюджет
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  <ChoiceButton active={budget === "low"} onClick={() => setBudget("low")}>
                    <div className="font-semibold">Низкий</div>
                  </ChoiceButton>
                  <ChoiceButton active={budget === "mid"} onClick={() => setBudget("mid")}>
                    <div className="font-semibold">Средний</div>
                  </ChoiceButton>
                  <ChoiceButton active={budget === "high"} onClick={() => setBudget("high")}>
                    <div className="font-semibold">Высокий</div>
                  </ChoiceButton>
                </div>
              </div>

              <div>
                <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-950">
                  <Gauge className="h-4 w-4" /> Предпочтительный формат
                </div>
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  <ChoiceButton active={formatPreference === "ready"} onClick={() => setFormatPreference("ready")}>
                    <div className="font-semibold">Готовый компьютер</div>
                  </ChoiceButton>
                  <ChoiceButton active={formatPreference === "build"} onClick={() => setFormatPreference("build")}>
                    <div className="font-semibold leading-tight">Сборка своими руками</div>
                  </ChoiceButton>
                  <ChoiceButton active={formatPreference === "experiment"} onClick={() => setFormatPreference("experiment")}>
                    <div className="font-semibold">Эксперименты и обучение</div>
                  </ChoiceButton>
                  <ChoiceButton active={formatPreference === "any"} onClick={() => setFormatPreference("any")}>
                    <div className="font-semibold">Без разницы</div>
                  </ChoiceButton>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <ChoiceButton active={alwaysOn} onClick={() => setAlwaysOn((v) => !v)}>
                  <div className="flex items-center gap-2 font-semibold">
                    <Leaf className="h-4 w-4" /> Должен работать постоянно
                  </div>
                  <div className={`mt-1 text-sm ${alwaysOn ? "text-slate-900/80" : "text-slate-900/70"}`}>
                    например как сервер или устройство для дома
                  </div>
                </ChoiceButton>
                <ChoiceButton active={portable} onClick={() => setPortable((v) => !v)}>
                  <div className="flex items-center gap-2 font-semibold">
                    <Sparkles className="h-4 w-4" /> Лёгкое перемещение
                  </div>
                  <div className={`mt-1 text-sm ${portable ? "text-slate-900/80" : "text-slate-900/70"}`}>
                    важны размер и удобство
                  </div>
                </ChoiceButton>
              </div>
            </CardContent>
          </Card>

          <Card className={glassCard}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-950">
                <BadgeCheck className="h-4 w-4" />
                Шаг 3. Получите рекомендацию
              </CardTitle>
              <CardDescription className="text-slate-900/75">Сначала — короткий ответ, ниже — подробности и объяснение.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="rounded-[28px] border border-white/34 bg-[linear-gradient(135deg,rgba(255,255,255,0.34),rgba(255,255,255,0.16))] p-5 text-slate-950 shadow-[0_18px_40px_rgba(148,163,184,0.18)] backdrop-blur-2xl">
                <div className="text-xs uppercase tracking-[0.18em] text-slate-700/75">Что подойдёт лучше всего</div>
                <div className="mt-2 text-2xl font-bold">{results.top.title}</div>
                <div className="mt-2 text-sm leading-6 text-slate-900/80">{results.top.short}</div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {results.top.bestFor.map((item) => (
                    <span key={item} className="rounded-full border border-white/34 bg-white/18 px-3 py-1 text-xs text-slate-950 backdrop-blur-xl">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-[22px] border border-white/28 bg-white/14 p-4 backdrop-blur-xl">
                  <div className="text-sm font-semibold text-slate-950">Лучший формат</div>
                  <div className="mt-1 text-sm leading-6 text-slate-900/80">{results.top.title}</div>
                </div>
                <div className="rounded-[22px] border border-white/28 bg-white/14 p-4 backdrop-blur-xl">
                  <div className="text-sm font-semibold text-slate-950">Подходит, если вам нужно</div>
                  <div className="mt-1 text-sm leading-6 text-slate-900/80">{results.top.bestFor.slice(0, 3).join(", ")}</div>
                </div>
                <div className="rounded-[22px] border border-white/28 bg-white/14 p-4 backdrop-blur-xl">
                  <div className="text-sm font-semibold text-slate-950">Главное, что стоит учесть</div>
                  <div className="mt-1 text-sm leading-6 text-slate-900/80">{results.top.limits[0]}</div>
                </div>
              </div>

              <CollapsibleBlock title="Почему выбран именно этот формат" description="Короткое человеческое объяснение" defaultOpen>
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
                      По выбранным параметрам лучше всего подходит универсальный и практичный вариант.
                    </div>
                  )}
                </div>
              </CollapsibleBlock>

              <CollapsibleBlock title="Что можно искать дальше" description="Пример направления, а не одна конкретная модель" defaultOpen>
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

              <CollapsibleBlock title="Сильные стороны этого варианта" description="Так проще понять, в чём он выигрывает" defaultOpen={false}>
                <div className="space-y-3">
                  {[
                    ["Компактность", results.top.metrics.compactness],
                    ["Мощность", results.top.metrics.performance],
                    ["Тишина", results.top.metrics.silence],
                    ["Апгрейд", results.top.metrics.upgrade],
                    ["Экономичность", results.top.metrics.economy],
                  ].map(([label, value]) => (
                    <div key={label as string}>
                      <div className="mb-1 flex items-center justify-between text-sm text-slate-950">
                        <span>{label as string}</span>
                        <span className="font-medium">{value as number}/10</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/28">
                        <div className="h-2 rounded-full bg-[linear-gradient(90deg,rgba(15,23,42,0.82),rgba(59,130,246,0.7))] transition-all" style={{ width: metricBar(value as number) }} />
                      </div>
                    </div>
                  ))}
                </div>
              </CollapsibleBlock>

              <CollapsibleBlock title="Почему другие варианты ниже" description="Сайт показывает не только лучший вариант, но и почему остальные не стали первыми" defaultOpen={false}>
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
                Сбросить выбор
              </Button>
            </CardContent>
          </Card>

          <CollapsibleBlock
            title="О сайте и о том, как понимать результат"
            description="Этот блок можно открыть, если хочется понять логику подбора глубже"
            defaultOpen={showAbout}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[22px] border border-white/28 bg-white/14 p-4 backdrop-blur-xl">
                <div className="mb-2 text-sm font-semibold text-slate-950">О проекте и цели сайта</div>
                <p className="text-sm leading-6 text-slate-900/80">
                  Этот сайт является практическим продуктом проекта о малогабаритных персональных компьютерах. Его цель — помочь пользователю подобрать подходящий тип компактного ПК с учётом реальных задач, уровня компактности, шума, бюджета и возможности апгрейда.
                </p>
              </div>
              <div className="rounded-[22px] border border-white/28 bg-white/14 p-4 backdrop-blur-xl">
                <div className="mb-2 text-sm font-semibold text-slate-950">Как понимать результат</div>
                <p className="text-sm leading-6 text-slate-900/80">
                  Сайт не выбирает за пользователя одну «идеальную» модель, а подсказывает наиболее подходящее направление. Это помогает быстрее сузить выбор и понять, что именно стоит искать дальше.
                </p>
              </div>
            </div>
          </CollapsibleBlock>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
          <Card className={glassCard}>
            <CardHeader>
              <CardTitle className="text-slate-950">Сравнение подходящих вариантов</CardTitle>
              <CardDescription className="text-slate-900/75">Здесь уже не просто баллы, а более понятное сравнение по практике</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {results.ranked.map((item) => {
                  const Icon = item.icon;
                  const label = getMatchLabel(item.score, results.top.score);
                  return (
                    <div
                      key={item.id}
                      className={`rounded-[28px] border p-4 backdrop-blur-2xl ${item.id === results.top.id ? "border-white/40 bg-[linear-gradient(135deg,rgba(255,255,255,0.34),rgba(255,255,255,0.18))] text-slate-950 shadow-[0_16px_40px_rgba(148,163,184,0.18)]" : "border-white/28 bg-white/12 text-slate-950 shadow-[0_12px_30px_rgba(255,255,255,0.1)]"}`}
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

                      <div className="mt-4 space-y-3 text-sm text-slate-900/80">
                        <div>
                          <div className="font-semibold text-slate-950">Подойдёт, если вам важно</div>
                          <div className="mt-1">{item.bestFor.slice(0, 3).join(", ")}</div>
                        </div>
                        <div>
                          <div className="font-semibold text-slate-950">Что может не подойти</div>
                          <div className="mt-1">{item.limits[0]}</div>
                        </div>
                        <div>
                          <div className="font-semibold text-slate-950">Уровень</div>
                          <div className="mt-1">{item.metrics.performance >= 8 ? "Мощный" : item.metrics.performance >= 5 ? "Средний" : "Базовый"}</div>
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
                <CardDescription className="text-slate-900/75">Небольшая расшифровка непонятных слов и сокращений</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-900/82">
                <div><span className="font-semibold text-slate-950">ПК</span> — персональный компьютер.</div>
                <div><span className="font-semibold text-slate-950">Мини-ПК</span> — маленький готовый компьютер.</div>
                <div><span className="font-semibold text-slate-950">SSD</span> — быстрый накопитель для файлов и системы.</div>
                <div><span className="font-semibold text-slate-950">3D</span> — работа с объёмной графикой.</div>
                <div><span className="font-semibold text-slate-950">24/7</span> — работа постоянно, днём и ночью.</div>
                <div className="pt-2 text-sm font-semibold text-slate-950">Что значит каждый вид ПК</div>
                <div><span className="font-semibold text-slate-950">Готовый мини-ПК</span> — маленький готовый компьютер для учёбы, фильмов, интернета и обычной работы.</div>
                <div><span className="font-semibold text-slate-950">Компактный системный блок</span> — небольшая, но более мощная сборка, где обычно проще менять детали и делать апгрейд.</div>
                <div><span className="font-semibold text-slate-950">Одноплатный компьютер</span> — очень маленькая плата-компьютер для обучения, сервера, Linux и разных экспериментов.</div>
                <div><span className="font-semibold text-slate-950">Бесшумный мини-ПК</span> — компактный компьютер с упором на тишину и спокойную повседневную работу.</div>
                <div><span className="font-semibold text-slate-950">Сверхмалый настольный ПК</span> — очень маленький настольный компьютер для дома, учёбы и простых повседневных задач.</div>
              </CardContent>
            </Card>

            <Card className={glassCard}>
              <CardHeader>
                <CardTitle className="text-slate-950">О назначении сайта-подборщика</CardTitle>
                <CardDescription className="text-slate-900/75">Практическая часть проекта и её назначение</CardDescription>
              </CardHeader>
              <CardContent className="text-sm leading-6 text-slate-900/82">
                Данный сайт-подборщик является практическим продуктом проекта, посвящённого малогабаритным персональным компьютерам. Его назначение заключается в том, чтобы на основе рассмотренных в проекте критериев помочь пользователю определить наиболее подходящий тип компактного ПК с учётом задач, уровня компактности, допустимого шума, бюджета и возможности дальнейшей модернизации.
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
