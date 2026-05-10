// lib/projects.ts

export interface GuidedProjectStage {
  number: number;
  title: string;
  description: string;
  hints: string[];
  checklist: string[];
  starterCode?: string;
  testCases?: { expectedOutput: string; description: string; hidden?: boolean }[];
  validationRegex?: string; // Extremely simple heuristic grading for MVP
  xpReward: number;
}

export interface GuidedProject {
  id: string;
  title: string;
  description: string;
  requiredLevel: number;
  requiredLessons: string[];
  lang: 'python' | 'html' | 'css' | 'javascript';
  stages: GuidedProjectStage[];
  resources: {
    docLink?: string;
    videoUrl?: string;
    exampleGitHub?: string;
  };
}

export const GUIDED_PROJECTS: GuidedProject[] = [
  {
    id: "cli-calculator",
    title: "CLI Calculator",
    description: "Build a command-line calculator in Python that can perform basic arithmetic and handle errors gracefully.",
    requiredLevel: 2,
    requiredLessons: ["py-001-variables", "py-003-conditionals"], // Example mapping
    lang: "python",
    resources: {
      docLink: "https://docs.python.org/3/tutorial/errors.html"
    },
    stages: [
      {
        number: 1,
        title: "Accept User Input",
        description: "Parse the first number, operator, and second number from the user.",
        hints: ["Use the input() function.", "Remember to convert numerical inputs to floats."],
        checklist: ["Ask for num1", "Ask for operator", "Ask for num2"],
        starterCode: "# CLI Calculator\n# TODO: Get num1, op, and num2 from the user\n\nprint('Welcome to the Calculator')",
        validationRegex: "input\\(.*\\)", // extremely basic heuristic
        xpReward: 50,
      },
      {
        number: 2,
        title: "Implement Operations",
        description: "Use conditional statements to perform the correct math based on the operator (+, -, *, /).",
        hints: ["Use an if/elif/else structure.", "Print the result."],
        checklist: ["Handle addition", "Handle subtraction", "Handle multiplication", "Handle division"],
        starterCode: "num1 = 10\nop = '+'\nnum2 = 5\n\n# TODO: Perform calculation",
        validationRegex: "if|elif",
        xpReward: 50,
      },
      {
        number: 3,
        title: "Error Handling",
        description: "Prevent crashes by checking if the user tries to divide by zero.",
        hints: ["Before dividing, check if num2 is 0."],
        checklist: ["Check for division by zero", "Print an error message instead of crashing"],
        starterCode: "num1 = 10\nop = '/'\nnum2 = 0\n\nif op == '/':\n    # TODO: Handle zero division\n    print(num1 / num2)",
        validationRegex: "num2\\s*==\\s*0",
        xpReward: 25,
      },
      {
        number: 4,
        title: "Application Loop",
        description: "Wrap your calculator in a while loop so it keeps running until the user types 'quit'.",
        hints: ["Use a while True: loop.", "Add a break statment if the input is 'quit'."],
        checklist: ["Create an infinite loop", "Break if user wants to quit"],
        starterCode: "while True:\n    # TODO: Add logic here\n    pass",
        validationRegex: "while\\s+.*:|break",
        xpReward: 25,
      }
    ]
  },
  {
    id: "personal-portfolio",
    title: "Personal Portfolio",
    description: "Design a responsive mobile-first portfolio using Semantic HTML5 and CSS.",
    requiredLevel: 1,
    requiredLessons: [],
    lang: "html", // We will use HTML sandbox
    resources: {
      docLink: "https://developer.mozilla.org/en-US/docs/Web/HTML"
    },
    stages: [
      {
        number: 1,
        title: "Semantic Structure",
        description: "Create the core HTML document structure including header, nav, main, and footer.",
        hints: ["Use <header>, <nav>, <main>, and <footer> tags.", "Include a profile image and short bio."],
        checklist: ["Add a <header>", "Add a <main> section for content", "Add a <footer>"],
        starterCode: "<!DOCTYPE html>\n<html>\n<body>\n  <!-- TODO: Add semantic structure here -->\n  <h1>My Portfolio</h1>\n</body>\n</html>",
        validationRegex: "<header>[\\s\\S]*<main>[\\s\\S]*<footer>",
        xpReward: 50,
      },
      {
        number: 2,
        title: "CSS Styling & Layout",
        description: "Apply CSS Flexbox or Grid to organize the layout and style the typography.",
        hints: ["Use an internal <style> tag or write your CSS directly.", "display: flex; is very useful for navigation bars."],
        checklist: ["Style the navigation bar", "Add padding and margins", "Set a custom font"],
        starterCode: "<style>\n  /* TODO: Add styles here */\n  body { font-family: sans-serif; }\n</style>\n\n<header>\n  <nav>\n    <a>Home</a> <a>Projects</a>\n  </nav>\n</header>",
        validationRegex: "display\\s*:\\s*(flex|grid)",
        xpReward: 50,
      },
      {
        number: 3,
        title: "Responsive Design",
        description: "Add a media query to ensure the portfolio looks good on mobile devices.",
        hints: ["Use @media (max-width: 768px).", "Change flex-direction to column on mobile."],
        checklist: ["Add a mobile media query", "Adjust layout for small screens"],
        starterCode: "<style>\n  .nav-links { display: flex; gap: 1rem; }\n  \n  /* TODO: Add media query */\n</style>",
        validationRegex: "@media",
        xpReward: 100,
      }
    ]
  },
  {
    id: "todo-app",
    title: "Interactive Todo App",
    description: "Build a functional Todo list application using HTML, CSS, and Vanilla JavaScript.",
    requiredLevel: 3,
    requiredLessons: [],
    lang: "javascript",
    resources: {
      docLink: "https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model"
    },
    stages: [
      {
        number: 1,
        title: "HTML DOM Structure",
        description: "Create an input field, an 'Add' button, and an empty list container.",
        hints: ["Use <input id='task'>", "Use an empty <ul id='list'></ul>"],
        checklist: ["Create input element", "Create button element", "Create an empty UL tag"],
        starterCode: "<!-- Todo App Structure -->\n<div id=\"app\">\n  <h1>Todos</h1>\n  <!-- TODO: Add input and button -->\n  <!-- TODO: Add empty list -->\n</div>",
        validationRegex: "<input.*>.*<button.*>.*<ul.*>",
        xpReward: 50,
      },
      {
        number: 2,
        title: "Adding Tasks",
        description: "Write JavaScript to read the input value and append a new <li> element to the list when the button is clicked.",
        hints: ["Use document.getElementById()", "Use addEventListener('click', ...)", "Use document.createElement('li')"],
        checklist: ["Attach click listener", "Create new list item", "Append to the UL container"],
        starterCode: "const btn = document.getElementById('addBtn');\nconst input = document.getElementById('taskInput');\n\nbtn.addEventListener('click', () => {\n  // TODO: Add logic to append item\n});",
        validationRegex: "createElement\\(.*\\)|innerHTML",
        xpReward: 100,
      },
      {
        number: 3,
        title: "Deleting Tasks",
        description: "Add a delete button to each created task that removes the <li> when clicked.",
        hints: ["When creating the li, also create a remove button.", "Use element.remove()"],
        checklist: ["Add delete button to each item", "Implement deletion logic"],
        starterCode: "// When creating a new li:\nconst li = document.createElement('li');\n// TODO: add delete button logic",
        validationRegex: "\\.remove\\(\\)",
        xpReward: 100,
      }
    ]
  }
];

export function getProjectById(id: string): GuidedProject | undefined {
  return GUIDED_PROJECTS.find(p => p.id === id);
}
