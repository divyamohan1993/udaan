import type { PurposeVector, PurposeAxis, Mission } from "../../shared/types";
import missions from "../../data/missions/templates.json";

const missionList = missions as Mission[];

// Question answer mappings to purpose axes
// Each answer maps to axis weights
interface AnswerWeight {
  axis: PurposeAxis;
  weight: number;
}

const questionAnswers: Record<string, AnswerWeight[]>[] = [
  // Q1: What did you enjoy before work?
  {
    "teaching": [{ axis: "people", weight: 0.8 }, { axis: "knowledge", weight: 0.6 }],
    "gardening": [{ axis: "nature", weight: 0.9 }, { axis: "craft", weight: 0.3 }],
    "fixing": [{ axis: "craft", weight: 0.9 }, { axis: "service", weight: 0.4 }],
    "singing": [{ axis: "expression", weight: 0.9 }, { axis: "people", weight: 0.3 }],
    "cooking": [{ axis: "service", weight: 0.7 }, { axis: "craft", weight: 0.5 }],
    "stories": [{ axis: "expression", weight: 0.8 }, { axis: "knowledge", weight: 0.5 }],
  },
  // Q2: What does your neighborhood need?
  {
    "education": [{ axis: "knowledge", weight: 0.9 }, { axis: "people", weight: 0.5 }],
    "greenery": [{ axis: "nature", weight: 0.9 }, { axis: "service", weight: 0.3 }],
    "repairs": [{ axis: "craft", weight: 0.8 }, { axis: "service", weight: 0.5 }],
    "culture": [{ axis: "expression", weight: 0.8 }, { axis: "people", weight: 0.5 }],
    "food": [{ axis: "service", weight: 0.9 }, { axis: "people", weight: 0.4 }],
    "health": [{ axis: "service", weight: 0.8 }, { axis: "people", weight: 0.6 }],
  },
  // Q3: If money wasn't the question?
  {
    "teach": [{ axis: "people", weight: 0.9 }, { axis: "knowledge", weight: 0.7 }],
    "grow": [{ axis: "nature", weight: 0.9 }, { axis: "craft", weight: 0.4 }],
    "build": [{ axis: "craft", weight: 0.9 }, { axis: "service", weight: 0.3 }],
    "perform": [{ axis: "expression", weight: 0.9 }, { axis: "people", weight: 0.4 }],
    "serve": [{ axis: "service", weight: 0.9 }, { axis: "people", weight: 0.5 }],
    "learn": [{ axis: "knowledge", weight: 0.9 }, { axis: "expression", weight: 0.3 }],
  },
  // Q4: Which problem bothers you most?
  {
    "illiteracy": [{ axis: "knowledge", weight: 0.9 }, { axis: "people", weight: 0.5 }],
    "pollution": [{ axis: "nature", weight: 0.9 }, { axis: "service", weight: 0.3 }],
    "unemployment": [{ axis: "craft", weight: 0.7 }, { axis: "service", weight: 0.6 }],
    "loneliness": [{ axis: "people", weight: 0.9 }, { axis: "expression", weight: 0.4 }],
    "hunger": [{ axis: "service", weight: 0.9 }, { axis: "nature", weight: 0.3 }],
    "boredom": [{ axis: "expression", weight: 0.8 }, { axis: "craft", weight: 0.5 }],
  },
  // Q5: What do you want to be known for?
  {
    "mentor": [{ axis: "people", weight: 0.9 }, { axis: "knowledge", weight: 0.5 }],
    "grower": [{ axis: "nature", weight: 0.9 }, { axis: "craft", weight: 0.3 }],
    "maker": [{ axis: "craft", weight: 0.9 }, { axis: "expression", weight: 0.4 }],
    "artist": [{ axis: "expression", weight: 0.9 }, { axis: "people", weight: 0.3 }],
    "helper": [{ axis: "service", weight: 0.9 }, { axis: "people", weight: 0.5 }],
    "thinker": [{ axis: "knowledge", weight: 0.9 }, { axis: "expression", weight: 0.4 }],
  },
];

export function computePurposeVector(answers: string[]): PurposeVector {
  const vector: PurposeVector = {
    people: 0, nature: 0, knowledge: 0, craft: 0, service: 0, expression: 0,
  };

  for (let i = 0; i < answers.length && i < questionAnswers.length; i++) {
    const answer = answers[i];
    const weights = questionAnswers[i][answer];
    if (weights) {
      for (const w of weights) {
        vector[w.axis] = Math.min(1, vector[w.axis] + w.weight * 0.4);
      }
    }
  }

  // Normalize to 0-1
  const maxVal = Math.max(...Object.values(vector), 0.01);
  for (const axis of Object.keys(vector) as PurposeAxis[]) {
    vector[axis] = Math.round((vector[axis] / maxVal) * 100) / 100;
  }

  return vector;
}

export function matchMissions(vector: PurposeVector): Mission[] {
  // Sort missions by category relevance to the purpose vector
  const sorted = [...missionList].sort((a, b) => {
    return (vector[b.category] ?? 0) - (vector[a.category] ?? 0);
  });
  return sorted.slice(0, 5);
}

export function getQuestionOptions(questionIndex: number): { value: string; label: string; labelHi: string }[] {
  const optionLabels: Record<string, { label: string; labelHi: string }>[] = [
    {
      teaching: { label: "Teaching kids", labelHi: "बच्चों को पढ़ाना" },
      gardening: { label: "Gardening", labelHi: "बागवानी" },
      fixing: { label: "Fixing things", labelHi: "चीज़ें ठीक करना" },
      singing: { label: "Singing/music", labelHi: "गाना/संगीत" },
      cooking: { label: "Cooking", labelHi: "खाना बनाना" },
      stories: { label: "Telling stories", labelHi: "कहानियां सुनाना" },
    },
    {
      education: { label: "Better education", labelHi: "बेहतर शिक्षा" },
      greenery: { label: "More greenery", labelHi: "ज़्यादा हरियाली" },
      repairs: { label: "Repair services", labelHi: "मरम्मत सेवाएं" },
      culture: { label: "Cultural events", labelHi: "सांस्कृतिक कार्यक्रम" },
      food: { label: "Food access", labelHi: "भोजन की उपलब्धता" },
      health: { label: "Health services", labelHi: "स्वास्थ्य सेवाएं" },
    },
    {
      teach: { label: "Teach", labelHi: "पढ़ाना" },
      grow: { label: "Grow food", labelHi: "खेती करना" },
      build: { label: "Build things", labelHi: "चीज़ें बनाना" },
      perform: { label: "Perform/create art", labelHi: "कला बनाना/प्रदर्शन" },
      serve: { label: "Serve people", labelHi: "लोगों की सेवा" },
      learn: { label: "Learn new things", labelHi: "नई चीज़ें सीखना" },
    },
    {
      illiteracy: { label: "Illiteracy", labelHi: "अशिक्षा" },
      pollution: { label: "Pollution", labelHi: "प्रदूषण" },
      unemployment: { label: "Unemployment", labelHi: "बेरोज़गारी" },
      loneliness: { label: "Loneliness", labelHi: "अकेलापन" },
      hunger: { label: "Hunger", labelHi: "भूख" },
      boredom: { label: "Boredom", labelHi: "ऊबन/बोरियत" },
    },
    {
      mentor: { label: "A mentor", labelHi: "एक गुरु" },
      grower: { label: "A grower", labelHi: "एक उगाने वाला" },
      maker: { label: "A maker", labelHi: "एक बनाने वाला" },
      artist: { label: "An artist", labelHi: "एक कलाकार" },
      helper: { label: "A helper", labelHi: "एक मददगार" },
      thinker: { label: "A thinker", labelHi: "एक विचारक" },
    },
  ];

  const opts = optionLabels[questionIndex] ?? {};
  return Object.entries(opts).map(([value, labels]) => ({
    value,
    label: labels.label,
    labelHi: labels.labelHi,
  }));
}

export function getAllMissions(): Mission[] {
  return missionList;
}
