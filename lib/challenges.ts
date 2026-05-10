// lib/challenges.ts
// Typed challenge catalog + filtering / recommendation utilities

export type ChallengeDifficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type ChallengeCategory   = 'syntax' | 'logic' | 'optimization' | 'debugging' | 'edge-cases';
export type ChallengeLang       = 'python' | 'html' | 'css' | 'javascript';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: ChallengeDifficulty;
  category: ChallengeCategory;
  lang: ChallengeLang;
  /** prerequisite lesson IDs that must be completed to unlock */
  prerequisiteLessons: string[];
  /** time limit in seconds */
  timeLimit: number;
  hints: string[];
  xpReward: number;
  buggyCode: string;
  solution: {
    code: string;
    explanation: string;
    commonMistakes: string[];
    relatedConcepts: string[];
  };
  testCases: { input: string; expected: string }[];
  solutionWalkthrough?: ChallengeSolution;
}

export interface ChallengeSolution {
  code: string;
  explanation: {
    approach: string;
    pitfalls: string[];
    alternatives: {
      code: string;
      pros: string;
      cons: string;
    }[];
    relatedConcepts: string[];
  };
  videoWalkthrough?: {
    url: string;
    duration: number;
  };
}

// ─── XP table ────────────────────────────────────────────────────────────────

export const DIFFICULTY_XP: Record<ChallengeDifficulty, number> = {
  beginner:     25,
  intermediate: 50,
  advanced:     100,
  expert:       150,
};

// ─── Challenge catalog (28 challenges) ───────────────────────────────────────

export const CHALLENGES: Challenge[] = [

  /* ══════════════ BEGINNER ══════════════ */

  {
    id: 'ch-b-01', difficulty: 'beginner', category: 'syntax', lang: 'python',
    title: 'Fix the Greeting', xpReward: 25, timeLimit: 600,
    description: "The function should return 'Hello, [name]!' but crashes due to a case error.",
    prerequisiteLessons: [],
    hints: [
      'Python is case-sensitive — check your variable names.',
      "The parameter is 'name' (lowercase) but you're using 'Name'.",
    ],
    buggyCode: `def greet(name):\n    message = "Hello, " + Name + "!"\n    return message\n\nprint(greet("Alex"))`,
    solution: {
      code: `def greet(name):\n    message = "Hello, " + name + "!"\n    return message\n\nprint(greet("Alex"))`,
      explanation: "Python is case-sensitive. 'Name' ≠ 'name'. The parameter name is 'name' (lowercase).",
      commonMistakes: ["Forgetting Python is case-sensitive", "Confusing parameter vs class names"],
      relatedConcepts: ["variables", "functions", "case-sensitivity"],
    },
    testCases: [
      { input: 'greet("Alex")', expected: 'Hello, Alex!' },
      { input: 'greet("World")', expected: 'Hello, World!' },
    ],
    solutionWalkthrough: {
      code: "def greet(name):\n    message = \"Hello, \" + name + \"!\"\n    return message",
      explanation: {
        approach: "1. Python uses exact string matching for variables.\n2. We must locate everywhere `Name` is called and downgrade it to `name`.\n3. The concatenation then links the pieces flawlessly.",
        pitfalls: [
          "Failing to realise Python is case-sensitive (`Name` is treated as a completely different variable than `name`)",
          "Attempting to redefine `Name` rather than fixing the parameter reference"
        ],
        alternatives: [
          {
            code: "def greet(name):\n    return f\"Hello, {name}!\"",
            pros: "Using f-strings is much more readable and pythonic than string concatenation with +.",
            cons: "Requires Python 3.6+"
          }
        ],
        relatedConcepts: ["f-strings", "case-sensitivity", "variables"]
      },
      videoWalkthrough: {
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        duration: 180
      }
    }
  },

  {
    id: 'ch-b-02', difficulty: 'beginner', category: 'debugging', lang: 'python',
    title: 'Infinite Loop Fix', xpReward: 25, timeLimit: 600,
    description: 'This while loop runs forever. Fix it to print numbers 1–5 then "Done!".',
    prerequisiteLessons: [],
    hints: [
      "Does 'count' ever change inside the loop?",
      "Add 'count += 1' at the end of the while block.",
    ],
    buggyCode: `count = 1\nwhile count <= 5:\n    print(count)\n\nprint("Done!")`,
    solution: {
      code: `count = 1\nwhile count <= 5:\n    print(count)\n    count += 1\n\nprint("Done!")`,
      explanation: "Without incrementing count the loop condition never becomes False.",
      commonMistakes: ["Forgetting to increment loop variable", "Placing increment outside the loop"],
      relatedConcepts: ["while loops", "loop variables", "infinite loops"],
    },
    testCases: [{ input: 'Loop output', expected: '1\n2\n3\n4\n5\nDone!' }],
    solutionWalkthrough: {
      code: "count = 1\nwhile count <= 5:\n    print(count)\n    count += 1\n\nprint(\"Done!\")",
      explanation: {
        approach: "1. The `while` loop checks `count <= 5`.\n2. In the original code, `count` remains 1 forever.\n3. Adding `count += 1` inside the loop ensures that `count` steadily increments until the condition breaks.",
        pitfalls: [
          "Forgetting to increment the loop variable inside the body.",
          "Placing the increment _outside_ the loop block (indentation error)."
        ],
        alternatives: [
          {
            code: "for count in range(1, 6):\n    print(count)\nprint(\"Done!\")",
            pros: "`for` loops inherently handle incrementing constraints, avoiding infinite loops.",
            cons: "Less flexible if increment conditions suddenly get dynamic."
          }
        ],
        relatedConcepts: ["infinite loops", "for ranges", "mutability"]
      }
    }
  },

  {
    id: 'ch-b-03', difficulty: 'beginner', category: 'syntax', lang: 'python',
    title: 'Wrong Division Result', xpReward: 25, timeLimit: 480,
    description: 'The average() function gives wrong results due to operator precedence.',
    prerequisiteLessons: [],
    hints: [
      'Division has higher precedence than addition.',
      'Wrap (a + b) in parentheses.',
    ],
    buggyCode: `def average(a, b):\n    return a + b / 2\n\nprint(average(4, 8))   # Expected: 6.0\nprint(average(10, 20)) # Expected: 15.0`,
    solution: {
      code: `def average(a, b):\n    return (a + b) / 2\n\nprint(average(4, 8))\nprint(average(10, 20))`,
      explanation: "Without parentheses Python evaluates b/2 first, then adds a.",
      commonMistakes: ["Ignoring operator precedence", "Not testing with multiple inputs"],
      relatedConcepts: ["arithmetic", "operator precedence", "functions"],
    },
    testCases: [
      { input: 'average(4,8)',   expected: '6.0' },
      { input: 'average(10,20)', expected: '15.0' },
    ],
    solutionWalkthrough: {
      code: "def average(a, b):\n    return (a + b) / 2",
      explanation: {
        approach: "1. We want to average a and b, which is the sum divided by the count.\n2. By wrapping `a + b` in parentheses, we force Python to execute addition first.\n3. Finally, divide the aggregated total by 2.",
        pitfalls: [
          "Ignorance of PEMDAS. Python will execute `b/2` before attempting to add `a` unless parentheses are used."
        ],
        alternatives: [
          {
            code: "def average(a, b):\n    import statistics\n    return statistics.mean([a, b])",
            pros: "Highly robust for n-numbers.",
            cons: "Overhead of importing an entire library just for evaluating 2 elements."
          }
        ],
        relatedConcepts: ["PEMDAS", "operator precedence", "math functions"]
      }
    }
  },

  {
    id: 'ch-b-04', difficulty: 'beginner', category: 'syntax', lang: 'python',
    title: 'Missing Colon', xpReward: 25, timeLimit: 300,
    description: 'This function definition has a syntax error. Spot and fix it.',
    prerequisiteLessons: [],
    hints: [
      'Every function definition line must end with a colon.',
      "Look at the 'def' line carefully.",
    ],
    buggyCode: `def square(n)\n    return n * n\n\nprint(square(5))`,
    solution: {
      code: `def square(n):\n    return n * n\n\nprint(square(5))`,
      explanation: "Python function definitions require a colon ':' after the parameter list.",
      commonMistakes: ["Forgetting the colon after def/if/for/while"],
      relatedConcepts: ["syntax", "functions", "colon"],
    },
    testCases: [{ input: 'square(5)', expected: '25' }],
  },

  {
    id: 'ch-b-05', difficulty: 'beginner', category: 'syntax', lang: 'html',
    title: 'Broken Link', xpReward: 25, timeLimit: 480,
    description: "The anchor tag doesn't open GitHub in a new tab. Two bugs to fix.",
    prerequisiteLessons: [],
    hints: [
      "Web URLs need the 'https://' prefix.",
      "target='_blank' needs an underscore.",
    ],
    buggyCode: `<a href="github.com" target="blank">\n  Visit GitHub\n</a>`,
    solution: {
      code: `<a href="https://github.com" target="_blank">\n  Visit GitHub\n</a>`,
      explanation: "Two bugs: missing https:// and target='blank' should be '_blank'.",
      commonMistakes: ["Omitting protocol from URLs", "Missing underscore in _blank"],
      relatedConcepts: ["anchor tags", "href", "target attribute"],
    },
    testCases: [{ input: 'Link href', expected: 'https://github.com' }],
  },

  {
    id: 'ch-b-06', difficulty: 'beginner', category: 'syntax', lang: 'python',
    title: 'Indentation Error', xpReward: 25, timeLimit: 360,
    description: 'This if-else block has an indentation error. Fix the alignment.',
    prerequisiteLessons: [],
    hints: [
      'The else clause must align with the if keyword.',
      "The code inside each block must be indented consistently.",
    ],
    buggyCode: `x = 10\nif x > 5:\n    print("big")\n  else:\n    print("small")`,
    solution: {
      code: `x = 10\nif x > 5:\n    print("big")\nelse:\n    print("small")`,
      explanation: "The 'else' keyword must be at the same indentation level as 'if'.",
      commonMistakes: ["Inconsistent indentation", "Mixing tabs and spaces"],
      relatedConcepts: ["indentation", "if-else", "control flow"],
    },
    testCases: [{ input: 'Output when x=10', expected: 'big' }],
  },

  {
    id: 'ch-b-07', difficulty: 'beginner', category: 'debugging', lang: 'python',
    title: 'String vs Integer Bug', xpReward: 25, timeLimit: 420,
    description: "The code should add user's age to 10, but crashes with a TypeError.",
    prerequisiteLessons: [],
    hints: [
      "input() always returns a string in Python.",
      "You need to convert the string to an integer with int().",
    ],
    buggyCode: `age = input("Enter age: ")\nnew_age = age + 10\nprint("In 10 years:", new_age)`,
    solution: {
      code: `age = int(input("Enter age: "))\nnew_age = age + 10\nprint("In 10 years:", new_age)`,
      explanation: "input() returns str. Wrapping with int() converts it before arithmetic.",
      commonMistakes: ["Forgetting to cast input()", "Using + for string concatenation instead of addition"],
      relatedConcepts: ["type casting", "input()", "TypeError"],
    },
    testCases: [{ input: 'Type of age after cast', expected: 'int' }],
  },

  /* ══════════════ INTERMEDIATE ══════════════ */

  {
    id: 'ch-i-01', difficulty: 'intermediate', category: 'debugging', lang: 'python',
    title: 'Off-By-One in Range', xpReward: 50, timeLimit: 720,
    description: 'The loop should print 1 to 10 inclusive, but stops at 9.',
    prerequisiteLessons: ['py-001-variables'],
    hints: [
      "range(start, stop) excludes the stop value.",
      "Change 10 → 11 in the range call.",
    ],
    buggyCode: `for i in range(1, 10):\n    print(i)`,
    solution: {
      code: `for i in range(1, 11):\n    print(i)`,
      explanation: "range(1,10) → 1–9. range(1,11) → 1–10 inclusive.",
      commonMistakes: ["Off-by-one in range end", "Assuming range is inclusive"],
      relatedConcepts: ["range()", "for loops", "off-by-one"],
    },
    testCases: [{ input: 'Last printed value', expected: '10' }],
  },

  {
    id: 'ch-i-02', difficulty: 'intermediate', category: 'debugging', lang: 'python',
    title: 'List Index Error', xpReward: 50, timeLimit: 720,
    description: 'The code crashes with IndexError when getting the last item.',
    prerequisiteLessons: ['py-001-variables'],
    hints: [
      'List indices start at 0. A 3-item list has indices 0, 1, 2.',
      'Use index -1 to always get the last element.',
    ],
    buggyCode: `fruits = ["apple", "banana", "cherry"]\nlast = fruits[3]\nprint("Last fruit:", last)`,
    solution: {
      code: `fruits = ["apple", "banana", "cherry"]\nlast = fruits[-1]\nprint("Last fruit:", last)`,
      explanation: "Accessing fruits[3] is out of bounds. fruits[-1] always gives the last item.",
      commonMistakes: ["Using length as last index", "Not knowing negative indexing"],
      relatedConcepts: ["lists", "indexing", "IndexError", "negative index"],
    },
    testCases: [{ input: 'Output', expected: 'Last fruit: cherry' }],
  },

  {
    id: 'ch-i-03', difficulty: 'intermediate', category: 'debugging', lang: 'python',
    title: 'Missing Return Value', xpReward: 50, timeLimit: 600,
    description: 'The is_even() function always returns None. Fix it.',
    prerequisiteLessons: ['py-001-variables'],
    hints: [
      "Writing 'True' inside an if block without 'return' does nothing.",
      "Add 'return' before 'True' and add 'return False' for the else case.",
    ],
    buggyCode: `def is_even(n):\n    if n % 2 == 0:\n        True\n\nprint(is_even(4))   # Expected: True\nprint(is_even(7))   # Expected: False`,
    solution: {
      code: `def is_even(n):\n    if n % 2 == 0:\n        return True\n    return False\n\nprint(is_even(4))\nprint(is_even(7))`,
      explanation: "Without 'return', a function exits with None. Add 'return True' and 'return False'.",
      commonMistakes: ["Forgetting return keyword", "Assuming True evaluates means it's returned"],
      relatedConcepts: ["return statement", "boolean", "functions"],
    },
    testCases: [
      { input: 'is_even(4)', expected: 'True' },
      { input: 'is_even(7)', expected: 'False' },
    ],
  },

  {
    id: 'ch-i-04', difficulty: 'intermediate', category: 'logic', lang: 'python',
    title: 'Dictionary Key Error', xpReward: 50, timeLimit: 780,
    description: "The function crashes with KeyError when a key doesn't exist. Make it return 0 instead.",
    prerequisiteLessons: ['py-001-variables'],
    hints: [
      "Accessing dict[key] raises KeyError if the key is missing.",
      "Use dict.get(key, default) to safely access a missing key.",
    ],
    buggyCode: `def get_score(scores, name):\n    return scores[name]\n\ndata = {"Alice": 95, "Bob": 87}\nprint(get_score(data, "Alice"))  # 95\nprint(get_score(data, "Eve"))    # Should be 0, not crash`,
    solution: {
      code: `def get_score(scores, name):\n    return scores.get(name, 0)\n\ndata = {"Alice": 95, "Bob": 87}\nprint(get_score(data, "Alice"))\nprint(get_score(data, "Eve"))`,
      explanation: "dict.get(key, default) returns the default value instead of raising KeyError.",
      commonMistakes: ["Using [] instead of .get()", "Not handling missing keys"],
      relatedConcepts: ["dictionaries", "KeyError", ".get()"],
    },
    testCases: [
      { input: 'get_score(data,"Alice")', expected: '95' },
      { input: 'get_score(data,"Eve")',   expected: '0' },
    ],
  },

  {
    id: 'ch-i-05', difficulty: 'intermediate', category: 'logic', lang: 'python',
    title: 'Mutable Default Argument', xpReward: 50, timeLimit: 840,
    description: 'The append function accumulates items between calls — a classic Python gotcha. Fix it.',
    prerequisiteLessons: ['py-001-variables'],
    hints: [
      "Default mutable arguments (like lists) are created once and shared across all calls.",
      "Use None as the default and create a new list inside the function.",
    ],
    buggyCode: `def add_item(item, items=[]):\n    items.append(item)\n    return items\n\nprint(add_item("a"))  # ['a']\nprint(add_item("b"))  # Should be ['b'], not ['a','b']`,
    solution: {
      code: `def add_item(item, items=None):\n    if items is None:\n        items = []\n    items.append(item)\n    return items\n\nprint(add_item("a"))\nprint(add_item("b"))`,
      explanation: "Mutable defaults persist across calls. Use None and create a fresh list each time.",
      commonMistakes: ["Using mutable default arguments", "Not knowing this Python gotcha"],
      relatedConcepts: ["mutable defaults", "None", "lists", "function arguments"],
    },
    testCases: [
      { input: 'add_item("a")', expected: "['a']" },
      { input: 'add_item("b")', expected: "['b']" },
    ],
  },

  {
    id: 'ch-i-06', difficulty: 'intermediate', category: 'syntax', lang: 'javascript',
    title: 'var vs let Scope Bug', xpReward: 50, timeLimit: 780,
    description: 'The loop counter leaks outside the loop. Fix the variable declaration.',
    prerequisiteLessons: [],
    hints: [
      "'var' is function-scoped, 'let' is block-scoped.",
      "Change 'var' to 'let' inside the for loop.",
    ],
    buggyCode: `for (var i = 0; i < 3; i++) {\n  console.log(i);\n}\nconsole.log("After loop:", i); // Should throw ReferenceError`,
    solution: {
      code: `for (let i = 0; i < 3; i++) {\n  console.log(i);\n}\n// i is not accessible here — correct!`,
      explanation: "'var' leaks to function scope; 'let' is block-scoped. Use 'let' in loops.",
      commonMistakes: ["Using var when let/const is more appropriate", "Not understanding block scope"],
      relatedConcepts: ["var", "let", "scope", "block scope"],
    },
    testCases: [{ input: 'Scoping behavior', expected: '0\n1\n2' }],
  },

  {
    id: 'ch-i-07', difficulty: 'intermediate', category: 'debugging', lang: 'python',
    title: 'String Concatenation in Loop', xpReward: 50, timeLimit: 900,
    description: 'The sentence builder has a logic bug with trailing spaces. Fix the condition.',
    prerequisiteLessons: ['py-001-variables'],
    hints: [
      "The condition 'i < len(words)' is always True for valid loop indices.",
      "Change to 'i < len(words) - 1' to skip the space after the last word.",
    ],
    buggyCode: `def build_sentence(words):\n    sentence = ""\n    for i in range(len(words)):\n        sentence += words[i]\n        if i < len(words):\n            sentence += " "\n    return sentence.strip()\n\nprint(build_sentence(["Hello", "World"]))`,
    solution: {
      code: `def build_sentence(words):\n    sentence = ""\n    for i in range(len(words)):\n        sentence += words[i]\n        if i < len(words) - 1:\n            sentence += " "\n    return sentence\n\nprint(build_sentence(["Hello", "World"]))`,
      explanation: "The condition must be '< len - 1' to not add a trailing space, removing the need for .strip().",
      commonMistakes: ["Off-by-one in boundary check", "Using .strip() as a lazy fix"],
      relatedConcepts: ["string manipulation", "loops", "boundary conditions"],
    },
    testCases: [{ input: 'build_sentence(["Hello","World"])', expected: 'Hello World' }],
  },

  {
    id: 'ch-i-08', difficulty: 'intermediate', category: 'logic', lang: 'python',
    title: 'Global vs Local Variable', xpReward: 50, timeLimit: 720,
    description: "The counter function doesn't increment the global count. Fix it.",
    prerequisiteLessons: ['py-001-variables'],
    hints: [
      "Assigning to a name inside a function creates a local variable by default.",
      "Use the 'global' keyword to modify a global variable.",
    ],
    buggyCode: `count = 0\n\ndef increment():\n    count = count + 1\n\nincrement()\nincrement()\nprint(count)  # Expected: 2`,
    solution: {
      code: `count = 0\n\ndef increment():\n    global count\n    count = count + 1\n\nincrement()\nincrement()\nprint(count)`,
      explanation: "Without 'global count', Python treats 'count' as a local variable, causing UnboundLocalError.",
      commonMistakes: ["Forgetting 'global' keyword", "Assuming global variables are automatically mutable in functions"],
      relatedConcepts: ["global", "local scope", "variable scope"],
    },
    testCases: [{ input: 'count after 2 increments', expected: '2' }],
  },

  {
    id: 'ch-i-09', difficulty: 'intermediate', category: 'edge-cases', lang: 'python',
    title: 'Empty List Division', xpReward: 50, timeLimit: 660,
    description: 'The average function crashes on empty lists. Add a guard.',
    prerequisiteLessons: ['py-001-variables'],
    hints: [
      "Dividing by zero raises ZeroDivisionError.",
      "Check if the list is empty first and return 0 or None.",
    ],
    buggyCode: `def average(nums):\n    return sum(nums) / len(nums)\n\nprint(average([10, 20, 30]))  # 20.0\nprint(average([]))            # Should return 0, not crash`,
    solution: {
      code: `def average(nums):\n    if not nums:\n        return 0\n    return sum(nums) / len(nums)\n\nprint(average([10, 20, 30]))\nprint(average([]))`,
      explanation: "len([]) is 0 causing ZeroDivisionError. Guard with 'if not nums: return 0'.",
      commonMistakes: ["Not handling empty input", "Forgetting ZeroDivisionError possibility"],
      relatedConcepts: ["ZeroDivisionError", "edge cases", "guard clauses"],
    },
    testCases: [
      { input: 'average([10,20,30])', expected: '20.0' },
      { input: 'average([])',         expected: '0' },
    ],
  },

  {
    id: 'ch-i-10', difficulty: 'intermediate', category: 'syntax', lang: 'css',
    title: 'Broken Flexbox', xpReward: 50, timeLimit: 600,
    description: 'The flex items should be centered horizontally AND vertically. Fix the CSS.',
    prerequisiteLessons: [],
    hints: [
      "Flexbox centering needs both justify-content and align-items.",
      "For centering with flexbox, the container needs a defined height.",
    ],
    buggyCode: `.container {\n  display: flex;\n  justify-content: center;\n  height: 200px;\n  background: #1a1a2e;\n}\n\n.item {\n  width: 60px;\n  height: 60px;\n  background: #00ff87;\n}`,
    solution: {
      code: `.container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 200px;\n  background: #1a1a2e;\n}\n\n.item {\n  width: 60px;\n  height: 60px;\n  background: #00ff87;\n}`,
      explanation: "justify-content centers on the main axis; align-items centers on the cross axis.",
      commonMistakes: ["Forgetting align-items for vertical centering", "Not setting a container height"],
      relatedConcepts: ["flexbox", "justify-content", "align-items"],
    },
    testCases: [{ input: 'CSS property', expected: 'align-items: center' }],
  },

  /* ══════════════ ADVANCED ══════════════ */

  {
    id: 'ch-a-01', difficulty: 'advanced', category: 'optimization', lang: 'python',
    title: 'O(n²) to O(n) — Pair Sum', xpReward: 100, timeLimit: 1200,
    description: 'The nested loop solution works but is too slow for large inputs. Rewrite it using a set.',
    prerequisiteLessons: ['py-001-variables'],
    hints: [
      'A set lookup is O(1) vs O(n) for a list scan.',
      'Store seen numbers in a set. For each number, check if (target - num) is in the set.',
    ],
    buggyCode: `def has_pair_sum(nums, target):\n    for i in range(len(nums)):\n        for j in range(i + 1, len(nums)):\n            if nums[i] + nums[j] == target:\n                return True\n    return False\n\nprint(has_pair_sum([1, 4, 7, 2], 9))  # True`,
    solution: {
      code: `def has_pair_sum(nums, target):\n    seen = set()\n    for num in nums:\n        if target - num in seen:\n            return True\n        seen.add(num)\n    return False\n\nprint(has_pair_sum([1, 4, 7, 2], 9))`,
      explanation: "The set approach is O(n) time and O(n) space, vs O(n²) for the nested loop.",
      commonMistakes: ["Not thinking about time complexity", "Using list instead of set for lookup"],
      relatedConcepts: ["sets", "time complexity", "O(n)", "hashing"],
    },
    testCases: [
      { input: 'has_pair_sum([1,4,7,2],9)', expected: 'True' },
      { input: 'has_pair_sum([1,2,3],10)',  expected: 'False' },
    ],
  },

  {
    id: 'ch-a-02', difficulty: 'advanced', category: 'edge-cases', lang: 'python',
    title: 'Recursive Factorial — Stack Overflow', xpReward: 100, timeLimit: 1200,
    description: 'The recursive factorial crashes on n=0 and for large n. Add a base case and memoization.',
    prerequisiteLessons: ['py-001-variables'],
    hints: [
      "Every recursive function needs a base case to stop recursion.",
      "Use functools.lru_cache to memoize results and avoid recomputation.",
    ],
    buggyCode: `def factorial(n):\n    return n * factorial(n - 1)\n\nprint(factorial(5))   # 120\nprint(factorial(0))   # Should be 1, not infinite recursion`,
    solution: {
      code: `from functools import lru_cache\n\n@lru_cache(maxsize=None)\ndef factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)\n\nprint(factorial(5))\nprint(factorial(0))`,
      explanation: "Base case 'if n<=1 return 1' stops recursion. lru_cache memoizes for larger n.",
      commonMistakes: ["Missing base case", "Not considering memoization for repeated calls"],
      relatedConcepts: ["recursion", "base case", "lru_cache", "memoization"],
    },
    testCases: [
      { input: 'factorial(5)', expected: '120' },
      { input: 'factorial(0)', expected: '1' },
    ],
  },

  {
    id: 'ch-a-03', difficulty: 'advanced', category: 'debugging', lang: 'python',
    title: 'Generator vs List Memory Leak', xpReward: 100, timeLimit: 1080,
    description: "The function builds a full list in memory for large ranges. Convert it to a generator.",
    prerequisiteLessons: ['py-001-variables'],
    hints: [
      "Lists materialise all values at once; generators produce them lazily.",
      "Replace 'return [...]' with 'yield' to make it a generator.",
    ],
    buggyCode: `def squares(n):\n    result = []\n    for i in range(n):\n        result.append(i * i)\n    return result\n\nfor sq in squares(1000000):\n    if sq > 100:\n        break`,
    solution: {
      code: `def squares(n):\n    for i in range(n):\n        yield i * i\n\nfor sq in squares(1000000):\n    if sq > 100:\n        break`,
      explanation: "A generator yields one value at a time instead of materialising the entire list.",
      commonMistakes: ["Building lists unnecessarily", "Not knowing about generators"],
      relatedConcepts: ["generators", "yield", "memory efficiency", "lazy evaluation"],
    },
    testCases: [{ input: 'Type of squares(10)', expected: "<class 'generator'>" }],
  },

  {
    id: 'ch-a-04', difficulty: 'advanced', category: 'logic', lang: 'python',
    title: 'Shallow vs Deep Copy', xpReward: 100, timeLimit: 1200,
    description: 'Modifying the copy also changes the original. Fix the copy operation.',
    prerequisiteLessons: ['py-001-variables'],
    hints: [
      "Assigning a list creates a reference, not a copy.",
      "Use copy.deepcopy() for nested structures.",
    ],
    buggyCode: `import copy\n\noriginal = [[1, 2], [3, 4]]\ncopied = original.copy()  # Shallow!\ncopied[0][0] = 99\n\nprint(original)  # Should be [[1,2],[3,4]] but is [[99,2],[3,4]]`,
    solution: {
      code: `import copy\n\noriginal = [[1, 2], [3, 4]]\ncopied = copy.deepcopy(original)\ncopied[0][0] = 99\n\nprint(original)  # [[1, 2], [3, 4]] — unchanged\nprint(copied)    # [[99, 2], [3, 4]]`,
      explanation: ".copy() creates a shallow copy — inner objects are still shared references. deepcopy() recurses.",
      commonMistakes: ["Using .copy() for nested structures", "Not understanding shallow vs deep copy"],
      relatedConcepts: ["shallow copy", "deep copy", "references", "copy module"],
    },
    testCases: [{ input: 'original after mutation', expected: '[[1, 2], [3, 4]]' }],
  },

  {
    id: 'ch-a-05', difficulty: 'advanced', category: 'optimization', lang: 'python',
    title: 'Repeated String Concatenation', xpReward: 100, timeLimit: 1080,
    description: 'The function creates 1000 intermediate strings. Optimise it.',
    prerequisiteLessons: ['py-001-variables'],
    hints: [
      "Each += on a string creates a new string object — O(n²) overall.",
      "Collect into a list and use ''.join() for O(n) performance.",
    ],
    buggyCode: `def build_string(items):\n    result = ""\n    for item in items:\n        result += str(item) + ", "\n    return result.rstrip(", ")\n\nprint(build_string(range(1000)))`,
    solution: {
      code: `def build_string(items):\n    return ", ".join(str(item) for item in items)\n\nprint(build_string(range(1000)))`,
      explanation: "String concatenation is O(n²). ''.join() builds the final string in one O(n) pass.",
      commonMistakes: ["Repeated string concatenation in loops", "Not knowing join()"],
      relatedConcepts: ["join()", "string optimization", "time complexity"],
    },
    testCases: [{ input: 'build_string([1,2,3])', expected: '1, 2, 3' }],
  },

  {
    id: 'ch-a-06', difficulty: 'advanced', category: 'edge-cases', lang: 'javascript',
    title: 'Floating-Point Precision', xpReward: 100, timeLimit: 900,
    description: "0.1 + 0.2 doesn't equal 0.3 in JavaScript. Write a safe comparison function.",
    prerequisiteLessons: [],
    hints: [
      "Floating-point arithmetic is imprecise: 0.1+0.2 = 0.30000000000000004.",
      "Use Math.abs(a - b) < epsilon for float comparison.",
    ],
    buggyCode: `function isEqual(a, b) {\n  return a === b;\n}\n\nconsole.log(isEqual(0.1 + 0.2, 0.3)); // Should be true`,
    solution: {
      code: `function isEqual(a, b, epsilon = 1e-10) {\n  return Math.abs(a - b) < epsilon;\n}\n\nconsole.log(isEqual(0.1 + 0.2, 0.3)); // true`,
      explanation: "Floating-point numbers can't represent 0.1 and 0.2 exactly. Use an epsilon tolerance.",
      commonMistakes: ["Using === for float comparison", "Not knowing about floating-point precision"],
      relatedConcepts: ["floating-point", "epsilon comparison", "IEEE 754"],
    },
    testCases: [{ input: 'isEqual(0.1+0.2, 0.3)', expected: 'true' }],
  },

  {
    id: 'ch-a-07', difficulty: 'advanced', category: 'debugging', lang: 'python',
    title: 'Closure Variable Capture', xpReward: 100, timeLimit: 1080,
    description: 'All lambdas print the same value because of late binding. Fix the closure.',
    prerequisiteLessons: ['py-001-variables'],
    hints: [
      "Python closures capture variable references, not values.",
      "Use a default argument (i=i) to capture the current value of i.",
    ],
    buggyCode: `funcs = []\nfor i in range(3):\n    funcs.append(lambda: i)\n\nprint([f() for f in funcs])  # Prints [2, 2, 2] — should be [0, 1, 2]`,
    solution: {
      code: `funcs = []\nfor i in range(3):\n    funcs.append(lambda i=i: i)\n\nprint([f() for f in funcs])  # [0, 1, 2]`,
      explanation: "Default args are evaluated at definition time, capturing the current value of i.",
      commonMistakes: ["Not knowing about late binding", "Using shared loop variable in closures"],
      relatedConcepts: ["closures", "late binding", "default arguments", "lambda"],
    },
    testCases: [{ input: '[f() for f in funcs]', expected: '[0, 1, 2]' }],
  },

  /* ══════════════ EXPERT ══════════════ */

  {
    id: 'ch-e-01', difficulty: 'expert', category: 'optimization', lang: 'python',
    title: 'LRU Cache Implementation', xpReward: 150, timeLimit: 1800,
    description: 'Implement a simple LRU cache from scratch using an OrderedDict.',
    prerequisiteLessons: ['py-001-variables'],
    hints: [
      "An LRU cache evicts the Least Recently Used item when full.",
      "Python's OrderedDict maintains insertion order and has move_to_end().",
    ],
    buggyCode: `from collections import OrderedDict\n\nclass LRUCache:\n    def __init__(self, capacity):\n        self.capacity = capacity\n        self.cache = {}\n    \n    def get(self, key):\n        return self.cache.get(key, -1)\n    \n    def put(self, key, value):\n        self.cache[key] = value\n        # BUG: no eviction, no ordering\n\ncache = LRUCache(2)\ncache.put(1, 1)\ncache.put(2, 2)\nprint(cache.get(1))  # 1\ncache.put(3, 3)      # evicts key 2\nprint(cache.get(2))  # Should be -1`,
    solution: {
      code: `from collections import OrderedDict\n\nclass LRUCache:\n    def __init__(self, capacity):\n        self.capacity = capacity\n        self.cache = OrderedDict()\n    \n    def get(self, key):\n        if key not in self.cache:\n            return -1\n        self.cache.move_to_end(key)\n        return self.cache[key]\n    \n    def put(self, key, value):\n        if key in self.cache:\n            self.cache.move_to_end(key)\n        self.cache[key] = value\n        if len(self.cache) > self.capacity:\n            self.cache.popitem(last=False)\n\ncache = LRUCache(2)\ncache.put(1, 1)\ncache.put(2, 2)\nprint(cache.get(1))\ncache.put(3, 3)\nprint(cache.get(2))`,
      explanation: "OrderedDict tracks insertion order. move_to_end() marks an item as recently used. popitem(last=False) evicts the LRU item.",
      commonMistakes: ["Using a plain dict (no ordering)", "Not moving accessed items to the end"],
      relatedConcepts: ["LRU cache", "OrderedDict", "eviction policy", "data structures"],
    },
    testCases: [
      { input: 'cache.get(1) after put(1,1),put(2,2)', expected: '1' },
      { input: 'cache.get(2) after put(3,3)',          expected: '-1' },
    ],
  },

  {
    id: 'ch-e-02', difficulty: 'expert', category: 'debugging', lang: 'python',
    title: 'Thread-Safe Counter Bug', xpReward: 150, timeLimit: 1800,
    description: 'The counter is not thread-safe and loses increments. Fix it with threading.Lock.',
    prerequisiteLessons: ['py-001-variables'],
    hints: [
      "Multiple threads reading and writing the same variable cause race conditions.",
      "Use threading.Lock() as a context manager to serialise access.",
    ],
    buggyCode: `import threading\n\ncounter = 0\n\ndef increment():\n    global counter\n    for _ in range(10000):\n        counter += 1  # Not atomic!\n\nthreads = [threading.Thread(target=increment) for _ in range(5)]\nfor t in threads: t.start()\nfor t in threads: t.join()\nprint(counter)  # Should be 50000 but isn't`,
    solution: {
      code: `import threading\n\ncounter = 0\nlock = threading.Lock()\n\ndef increment():\n    global counter\n    for _ in range(10000):\n        with lock:\n            counter += 1\n\nthreads = [threading.Thread(target=increment) for _ in range(5)]\nfor t in threads: t.start()\nfor t in threads: t.join()\nprint(counter)`,
      explanation: "counter += 1 is three operations (read, add, write) — not atomic. A Lock ensures only one thread executes at a time.",
      commonMistakes: ["Assuming += is atomic", "Not using locks for shared mutable state"],
      relatedConcepts: ["threading", "race condition", "Lock", "thread safety"],
    },
    testCases: [{ input: 'Final counter value', expected: '50000' }],
  },

  {
    id: 'ch-e-03', difficulty: 'expert', category: 'edge-cases', lang: 'python',
    title: 'Decorator with Arguments', xpReward: 150, timeLimit: 1800,
    description: "Write a @retry(times=3) decorator that re-runs a failing function up to n times.",
    prerequisiteLessons: ['py-001-variables'],
    hints: [
      "A decorator that takes arguments needs three levels of nesting.",
      "The outermost function receives the arguments; the next wraps the function; the inner calls it.",
    ],
    buggyCode: `def retry(func):  # BUG: doesn't accept times argument\n    def wrapper(*args, **kwargs):\n        return func(*args, **kwargs)\n    return wrapper\n\n@retry(times=3)\ndef flaky():\n    import random\n    if random.random() < 0.7:\n        raise ValueError("Failed")\n    return "OK"\n\nprint(flaky())`,
    solution: {
      code: `import time\n\ndef retry(times=3, delay=0):\n    def decorator(func):\n        def wrapper(*args, **kwargs):\n            last_err = None\n            for attempt in range(times):\n                try:\n                    return func(*args, **kwargs)\n                except Exception as e:\n                    last_err = e\n                    if delay:\n                        time.sleep(delay)\n            raise last_err\n        return wrapper\n    return decorator\n\n@retry(times=3)\ndef flaky():\n    import random\n    if random.random() < 0.7:\n        raise ValueError("Failed")\n    return "OK"\n\nprint(flaky())`,
      explanation: "Parameterised decorators need 3 levels: the arg receiver, the function wrapper, and the call wrapper.",
      commonMistakes: ["Confusing decorator factories with plain decorators", "Not passing *args/**kwargs through"],
      relatedConcepts: ["decorators", "closures", "retry pattern", "higher-order functions"],
    },
    testCases: [{ input: 'Decorator structure', expected: 'OK' }],
  },

  {
    id: 'ch-e-04', difficulty: 'expert', category: 'logic', lang: 'python',
    title: 'Binary Search Off-by-One', xpReward: 150, timeLimit: 1500,
    description: 'The binary search misses elements due to incorrect boundary updates. Fix mid calculation and boundary updates.',
    prerequisiteLessons: ['py-001-variables'],
    hints: [
      "When target > mid, the new left should be mid + 1, not mid.",
      "Avoid integer overflow: use left + (right - left) // 2 instead of (left + right) // 2.",
    ],
    buggyCode: `def binary_search(arr, target):\n    left, right = 0, len(arr)\n    while left < right:\n        mid = (left + right) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            left = mid      # BUG: should be mid + 1\n        else:\n            right = mid - 1  # BUG: should be mid\n    return -1\n\nprint(binary_search([1,3,5,7,9,11], 7))   # Should be 3`,
    solution: {
      code: `def binary_search(arr, target):\n    left, right = 0, len(arr) - 1\n    while left <= right:\n        mid = left + (right - left) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1\n\nprint(binary_search([1,3,5,7,9,11], 7))`,
      explanation: "Classic binary search pitfalls: right must be len-1, update left=mid+1, right=mid-1, use <= in while condition.",
      commonMistakes: ["Wrong initial right boundary", "Not updating left/right correctly", "Using < instead of <="],
      relatedConcepts: ["binary search", "off-by-one", "algorithm correctness"],
    },
    testCases: [
      { input: 'binary_search([1,3,5,7,9,11],7)', expected: '3' },
      { input: 'binary_search([1,3,5,7,9,11],6)', expected: '-1' },
    ],
  },

  {
    id: 'ch-e-05', difficulty: 'expert', category: 'optimization', lang: 'python',
    title: 'Fibonacci — Exponential to Linear', xpReward: 150, timeLimit: 1500,
    description: 'The naive recursive Fibonacci is O(2ⁿ). Optimise it to O(n) without recursion.',
    prerequisiteLessons: ['py-001-variables'],
    hints: [
      "Iterative solutions avoid the overhead of recursive calls.",
      "Keep track of only the previous two values.",
    ],
    buggyCode: `def fib(n):\n    if n <= 1:\n        return n\n    return fib(n-1) + fib(n-2)  # O(2^n)\n\nprint(fib(35))  # Slow!`,
    solution: {
      code: `def fib(n):\n    if n <= 1:\n        return n\n    a, b = 0, 1\n    for _ in range(2, n + 1):\n        a, b = b, a + b\n    return b\n\nprint(fib(35))`,
      explanation: "The iterative approach is O(n) time O(1) space. Only the two previous values need to be tracked.",
      commonMistakes: ["Using naive recursion for large n", "Using dp array when only two vars needed"],
      relatedConcepts: ["fibonacci", "dynamic programming", "time complexity", "iteration vs recursion"],
    },
    testCases: [
      { input: 'fib(10)', expected: '55' },
      { input: 'fib(0)',  expected: '0' },
    ],
  },
];

// ─── Filtering & discovery helpers ───────────────────────────────────────────

export interface ChallengeFilter {
  difficulty?: ChallengeDifficulty;
  category?: ChallengeCategory;
  lang?: ChallengeLang;
  search?: string;
}

export function getFilteredChallenges(filter: ChallengeFilter = {}): Challenge[] {
  return CHALLENGES.filter(c => {
    if (filter.difficulty && c.difficulty !== filter.difficulty) return false;
    if (filter.category   && c.category   !== filter.category)   return false;
    if (filter.lang       && c.lang       !== filter.lang)       return false;
    if (filter.search) {
      const q = filter.search.toLowerCase();
      if (
        !c.title.toLowerCase().includes(q) &&
        !c.description.toLowerCase().includes(q)
      ) return false;
    }
    return true;
  });
}

/**
 * Returns 3-5 recommended challenges based on completed lessons and challenge history.
 * Prioritises the next difficulty tier the user hasn't fully explored.
 */
export function getRecommendedChallenges(
  completedLessons: string[],
  completedChallengeIds: string[]
): Challenge[] {
  const notDone = CHALLENGES.filter(c => !completedChallengeIds.includes(c.id));

  // Challenges whose prerequisites are satisfied
  const unlocked = notDone.filter(c =>
    c.prerequisiteLessons.every(l => completedLessons.includes(l))
  );

  // Sort by difficulty tier (ascend) then by prereq count (more specific first)
  const tierOrder: Record<ChallengeDifficulty, number> = {
    beginner: 0, intermediate: 1, advanced: 2, expert: 3,
  };
  unlocked.sort((a, b) =>
    tierOrder[a.difficulty] - tierOrder[b.difficulty] ||
    b.prerequisiteLessons.length - a.prerequisiteLessons.length
  );

  return unlocked.slice(0, 5);
}

/** Progress summary for the challenge browser UI */
export function getChallengeSummary(completedIds: string[]) {
  const tiers: ChallengeDifficulty[] = ['beginner','intermediate','advanced','expert'];
  return tiers.map(tier => {
    const all  = CHALLENGES.filter(c => c.difficulty === tier);
    const done = all.filter(c => completedIds.includes(c.id));
    return { tier, total: all.length, completed: done.length };
  });
}
