// lib/roadmaps.ts

export interface RoadmapMilestone {
  title: string;
  description: string;
  criteria: string[];
  xpReward: number;
  projectId?: string; // Link to a guided project
}

export interface RoadmapWeek {
  week: number;
  title: string;
  lessons: string[]; // references to lesson IDs
  projects: string[]; // references to project IDs
  milestone: RoadmapMilestone;
}

export interface Roadmap {
  id: string;
  title: string;
  description: string;
  weeks: RoadmapWeek[];
}

export const ROADMAPS: Roadmap[] = [
  {
    id: "python-developer",
    title: "Python Developer Roadmap",
    description: "From complete beginner to building full backend applications.",
    weeks: [
      {
        week: 1,
        title: "Fundamentals",
        lessons: [
          "py-001-variables",
          "py-002-operators",
          "py-003-conditionals"
        ],
        projects: [],
        milestone: {
          title: "First Script",
          description: "Write a script that takes input and uses basic logic.",
          criteria: ["Understand Variables", "Use Math Operators", "Write basic IF statements"],
          xpReward: 100,
          projectId: "cli-calculator" // Connect the milestone to a project
        }
      },
      {
        week: 2,
        title: "Control Flow & Functions",
        lessons: [
          "py-004-loops",
          "py-005-functions"
        ],
        projects: ["cli-calculator"],
        milestone: {
          title: "Logic Master",
          description: "Use loops and functions to structure your calculator program.",
          criteria: ["Write While/For loops", "Define reusable functions", "Complete the CLI Calculator project"],
          xpReward: 150
        }
      },
      {
        week: 3,
        title: "Data Structures",
        lessons: [
          "py-006-lists",
          "py-007-dictionaries",
          "py-008-sets"
        ],
        projects: [],
        milestone: {
          title: "Data Wrangler",
          description: "Effectively store and manipulate complex data structures.",
          criteria: ["Work with Lists", "Store key-values in Dicts", "Use Sets for uniqueness"],
          xpReward: 200
        }
      }
    ]
  }
];

export function getRoadmapById(id: string): Roadmap | undefined {
  return ROADMAPS.find(r => r.id === id);
}
