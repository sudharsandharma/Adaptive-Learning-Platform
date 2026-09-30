"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const database_1 = require("./config/database");
const User_1 = require("./models/User");
const Topic_1 = require("./models/Topic");
const Question_1 = require("./models/Question");
const Resource_1 = require("./models/Resource");
const Assessment_1 = require("./models/Assessment");
const Progress_1 = require("./models/Progress");
const LearningPath_1 = require("./models/LearningPath");
const Recommendation_1 = require("./models/Recommendation");
async function seed() {
    await (0, database_1.connectDB)();
    console.log('🗑️  Clearing existing data...');
    await Promise.all([
        User_1.User.deleteMany({}),
        Topic_1.Topic.deleteMany({}),
        Question_1.Question.deleteMany({}),
        Resource_1.Resource.deleteMany({}),
        Assessment_1.Assessment.deleteMany({}),
        Progress_1.Progress.deleteMany({}),
        LearningPath_1.LearningPath.deleteMany({}),
        Recommendation_1.Recommendation.deleteMany({}),
    ]);
    // ==================== TOPICS ====================
    console.log('📚 Creating topics...');
    // Computer Science topics
    const csProgramming = await Topic_1.Topic.create({
        name: 'Programming Fundamentals', slug: 'programming-fundamentals',
        subject: 'Computer Science', description: 'Introduction to programming concepts, problem solving, and computational thinking.',
        prerequisites: [], difficulty: 'beginner', estimatedHours: 3, order: 1,
    });
    const csVariables = await Topic_1.Topic.create({
        name: 'Variables & Data Types', slug: 'variables-data-types',
        subject: 'Computer Science', description: 'Understanding variables, data types, operators, and basic I/O operations.',
        prerequisites: [csProgramming._id], difficulty: 'beginner', estimatedHours: 2, order: 2,
    });
    const csFunctions = await Topic_1.Topic.create({
        name: 'Functions & Modules', slug: 'functions-modules',
        subject: 'Computer Science', description: 'Creating reusable code with functions, parameters, return values, and modules.',
        prerequisites: [csVariables._id], difficulty: 'intermediate', estimatedHours: 3, order: 3,
    });
    const csRecursion = await Topic_1.Topic.create({
        name: 'Recursion', slug: 'recursion',
        subject: 'Computer Science', description: 'Understanding recursive problem solving, base cases, and recursive algorithms.',
        prerequisites: [csFunctions._id], difficulty: 'intermediate', estimatedHours: 4, order: 4,
    });
    const csDataStructures = await Topic_1.Topic.create({
        name: 'Data Structures', slug: 'data-structures',
        subject: 'Computer Science', description: 'Arrays, linked lists, stacks, queues, trees, and hash maps.',
        prerequisites: [csRecursion._id], difficulty: 'intermediate', estimatedHours: 5, order: 5,
    });
    const csAlgorithms = await Topic_1.Topic.create({
        name: 'Algorithms', slug: 'algorithms',
        subject: 'Computer Science', description: 'Sorting, searching, graph algorithms, and algorithmic complexity.',
        prerequisites: [csDataStructures._id], difficulty: 'advanced', estimatedHours: 6, order: 6,
    });
    // Mathematics topics
    const mathNumbers = await Topic_1.Topic.create({
        name: 'Number Systems', slug: 'number-systems',
        subject: 'Mathematics', description: 'Natural numbers, integers, rationals, reals, and number properties.',
        prerequisites: [], difficulty: 'beginner', estimatedHours: 2, order: 1,
    });
    const mathAlgebra = await Topic_1.Topic.create({
        name: 'Algebra Basics', slug: 'algebra-basics',
        subject: 'Mathematics', description: 'Variables, expressions, equations, and algebraic manipulation.',
        prerequisites: [mathNumbers._id], difficulty: 'beginner', estimatedHours: 3, order: 2,
    });
    const mathLinear = await Topic_1.Topic.create({
        name: 'Linear Equations', slug: 'linear-equations',
        subject: 'Mathematics', description: 'Solving linear equations, systems of equations, and graphing lines.',
        prerequisites: [mathAlgebra._id], difficulty: 'intermediate', estimatedHours: 3, order: 3,
    });
    const mathQuadratic = await Topic_1.Topic.create({
        name: 'Quadratic Equations', slug: 'quadratic-equations',
        subject: 'Mathematics', description: 'Solving quadratic equations, factoring, and the quadratic formula.',
        prerequisites: [mathLinear._id], difficulty: 'intermediate', estimatedHours: 3, order: 4,
    });
    const mathFunctions = await Topic_1.Topic.create({
        name: 'Functions & Graphs', slug: 'functions-graphs',
        subject: 'Mathematics', description: 'Function concepts, domain/range, graphing, transformations.',
        prerequisites: [mathQuadratic._id], difficulty: 'intermediate', estimatedHours: 4, order: 5,
    });
    const mathCalculus = await Topic_1.Topic.create({
        name: 'Introduction to Calculus', slug: 'intro-calculus',
        subject: 'Mathematics', description: 'Limits, derivatives, and basic integration concepts.',
        prerequisites: [mathFunctions._id], difficulty: 'advanced', estimatedHours: 6, order: 6,
    });
    // Physics topics
    const physUnits = await Topic_1.Topic.create({
        name: 'Units & Measurement', slug: 'units-measurement',
        subject: 'Physics', description: 'SI units, dimensional analysis, significant figures, and measurement techniques.',
        prerequisites: [], difficulty: 'beginner', estimatedHours: 2, order: 1,
    });
    const physMotion = await Topic_1.Topic.create({
        name: 'Motion & Kinematics', slug: 'motion-kinematics',
        subject: 'Physics', description: 'Displacement, velocity, acceleration, and equations of motion.',
        prerequisites: [physUnits._id], difficulty: 'beginner', estimatedHours: 3, order: 2,
    });
    const physNewton = await Topic_1.Topic.create({
        name: "Newton's Laws", slug: 'newtons-laws',
        subject: 'Physics', description: "Newton's three laws of motion, force, mass, and free body diagrams.",
        prerequisites: [physMotion._id], difficulty: 'intermediate', estimatedHours: 4, order: 3,
    });
    const physEnergy = await Topic_1.Topic.create({
        name: 'Work & Energy', slug: 'work-energy',
        subject: 'Physics', description: 'Work, kinetic energy, potential energy, conservation of energy.',
        prerequisites: [physNewton._id], difficulty: 'intermediate', estimatedHours: 3, order: 4,
    });
    const physWaves = await Topic_1.Topic.create({
        name: 'Waves & Optics', slug: 'waves-optics',
        subject: 'Physics', description: 'Wave properties, sound, light, reflection, refraction.',
        prerequisites: [physEnergy._id], difficulty: 'advanced', estimatedHours: 4, order: 5,
    });
    // Chemistry topics
    const chemAtomic = await Topic_1.Topic.create({
        name: 'Atomic Structure', slug: 'atomic-structure',
        subject: 'Chemistry', description: 'Atoms, subatomic particles, electron configuration, and atomic models.',
        prerequisites: [], difficulty: 'beginner', estimatedHours: 3, order: 1,
    });
    const chemPeriodic = await Topic_1.Topic.create({
        name: 'Periodic Table', slug: 'periodic-table',
        subject: 'Chemistry', description: 'Element groups, trends, properties, and periodic law.',
        prerequisites: [chemAtomic._id], difficulty: 'beginner', estimatedHours: 2, order: 2,
    });
    const chemBonding = await Topic_1.Topic.create({
        name: 'Chemical Bonding', slug: 'chemical-bonding',
        subject: 'Chemistry', description: 'Ionic, covalent, metallic bonds, Lewis structures, VSEPR.',
        prerequisites: [chemPeriodic._id], difficulty: 'intermediate', estimatedHours: 4, order: 3,
    });
    const chemReactions = await Topic_1.Topic.create({
        name: 'Chemical Reactions', slug: 'chemical-reactions',
        subject: 'Chemistry', description: 'Reaction types, balancing equations, stoichiometry.',
        prerequisites: [chemBonding._id], difficulty: 'intermediate', estimatedHours: 4, order: 4,
    });
    // English topics
    const engGrammar = await Topic_1.Topic.create({
        name: 'Grammar Fundamentals', slug: 'grammar-fundamentals',
        subject: 'English', description: 'Parts of speech, sentence structure, punctuation, and common errors.',
        prerequisites: [], difficulty: 'beginner', estimatedHours: 3, order: 1,
    });
    const engReading = await Topic_1.Topic.create({
        name: 'Reading Comprehension', slug: 'reading-comprehension',
        subject: 'English', description: 'Main ideas, inference, vocabulary in context, and critical reading.',
        prerequisites: [], difficulty: 'beginner', estimatedHours: 3, order: 2,
    });
    const engEssay = await Topic_1.Topic.create({
        name: 'Essay Writing', slug: 'essay-writing',
        subject: 'English', description: 'Thesis statements, paragraph structure, argumentation, and revision.',
        prerequisites: [engGrammar._id, engReading._id], difficulty: 'intermediate', estimatedHours: 4, order: 3,
    });
    const engCritical = await Topic_1.Topic.create({
        name: 'Critical Analysis', slug: 'critical-analysis',
        subject: 'English', description: 'Analyzing texts, rhetorical strategies, and constructing evidence-based arguments.',
        prerequisites: [engEssay._id], difficulty: 'advanced', estimatedHours: 5, order: 4,
    });
    console.log(`   ✅ Created ${25} topics across 5 subjects`);
    // ==================== QUESTIONS ====================
    console.log('❓ Creating questions...');
    const questions = await Question_1.Question.insertMany([
        // Computer Science - Programming Fundamentals
        { question: 'What is an algorithm?', options: ['A programming language', 'A step-by-step procedure to solve a problem', 'A type of computer hardware', 'A database system'], correctAnswer: 1, explanation: 'An algorithm is a step-by-step procedure or set of rules for solving a problem or accomplishing a task.', subject: 'Computer Science', topic: csProgramming._id, topicName: 'Programming Fundamentals', difficulty: 'beginner' },
        { question: 'Which of these is NOT a programming paradigm?', options: ['Object-Oriented', 'Functional', 'Procedural', 'Mechanical'], correctAnswer: 3, explanation: 'Mechanical is not a programming paradigm. The main paradigms are procedural, object-oriented, functional, and logical.', subject: 'Computer Science', topic: csProgramming._id, topicName: 'Programming Fundamentals', difficulty: 'beginner' },
        { question: 'What does a compiler do?', options: ['Runs code line by line', 'Translates entire source code to machine code', 'Connects to the internet', 'Manages files'], correctAnswer: 1, explanation: 'A compiler translates the entire source code into machine code before execution, unlike an interpreter which executes line by line.', subject: 'Computer Science', topic: csProgramming._id, topicName: 'Programming Fundamentals', difficulty: 'beginner' },
        // Computer Science - Variables & Data Types
        { question: 'Which data type would best represent a person\'s age?', options: ['String', 'Integer', 'Boolean', 'Float'], correctAnswer: 1, explanation: 'Integer is the best choice since age is always a whole number.', subject: 'Computer Science', topic: csVariables._id, topicName: 'Variables & Data Types', difficulty: 'beginner' },
        { question: 'What is the result of 10 / 3 in integer division?', options: ['3.33', '3', '4', '10'], correctAnswer: 1, explanation: 'In integer division, the decimal part is truncated, so 10 / 3 = 3.', subject: 'Computer Science', topic: csVariables._id, topicName: 'Variables & Data Types', difficulty: 'beginner' },
        { question: 'What is a boolean variable?', options: ['A variable that stores text', 'A variable that stores true or false', 'A variable that stores decimal numbers', 'A variable that stores multiple values'], correctAnswer: 1, explanation: 'A boolean variable can only hold one of two values: true or false.', subject: 'Computer Science', topic: csVariables._id, topicName: 'Variables & Data Types', difficulty: 'beginner' },
        // Computer Science - Functions
        { question: 'What is the purpose of a return statement in a function?', options: ['To print output', 'To send a value back to the caller', 'To stop the program', 'To create a loop'], correctAnswer: 1, explanation: 'A return statement sends a value back to where the function was called.', subject: 'Computer Science', topic: csFunctions._id, topicName: 'Functions & Modules', difficulty: 'intermediate' },
        { question: 'What are parameters in a function?', options: ['Output values', 'Input values passed to the function', 'Local variables', 'Global constants'], correctAnswer: 1, explanation: 'Parameters are variables listed in the function definition that accept values (arguments) when the function is called.', subject: 'Computer Science', topic: csFunctions._id, topicName: 'Functions & Modules', difficulty: 'intermediate' },
        { question: 'What is a pure function?', options: ['A function with no parameters', 'A function that always returns the same output for the same input', 'A function that modifies global state', 'A function that prints to console'], correctAnswer: 1, explanation: 'A pure function always produces the same output for the same input and has no side effects.', subject: 'Computer Science', topic: csFunctions._id, topicName: 'Functions & Modules', difficulty: 'intermediate' },
        // Computer Science - Recursion
        { question: 'What is the base case in a recursive function?', options: ['The fastest execution path', 'The condition that stops the recursion', 'The first function call', 'The return type'], correctAnswer: 1, explanation: 'The base case is the condition that stops the recursion and prevents infinite recursive calls.', subject: 'Computer Science', topic: csRecursion._id, topicName: 'Recursion', difficulty: 'intermediate' },
        { question: 'What happens if a recursive function lacks a base case?', options: ['It runs faster', 'It causes a stack overflow', 'It returns null', 'It compiles but doesn\'t run'], correctAnswer: 1, explanation: 'Without a base case, the function calls itself infinitely, eventually causing a stack overflow error.', subject: 'Computer Science', topic: csRecursion._id, topicName: 'Recursion', difficulty: 'intermediate' },
        { question: 'What is the time complexity of the naive recursive Fibonacci?', options: ['O(n)', 'O(n²)', 'O(2ⁿ)', 'O(log n)'], correctAnswer: 2, explanation: 'The naive recursive Fibonacci has exponential time complexity O(2ⁿ) because it recalculates the same subproblems.', subject: 'Computer Science', topic: csRecursion._id, topicName: 'Recursion', difficulty: 'advanced' },
        { question: 'Which technique can optimize recursive Fibonacci to O(n)?', options: ['Sorting', 'Memoization', 'Binary search', 'Hashing'], correctAnswer: 1, explanation: 'Memoization stores previously computed results to avoid redundant calculations, reducing Fibonacci from O(2ⁿ) to O(n).', subject: 'Computer Science', topic: csRecursion._id, topicName: 'Recursion', difficulty: 'advanced' },
        // Computer Science - Data Structures
        { question: 'Which data structure follows LIFO (Last In, First Out)?', options: ['Queue', 'Stack', 'Array', 'Linked List'], correctAnswer: 1, explanation: 'A stack follows LIFO - the last element added is the first to be removed.', subject: 'Computer Science', topic: csDataStructures._id, topicName: 'Data Structures', difficulty: 'intermediate' },
        { question: 'What is the time complexity of accessing an element by index in an array?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'], correctAnswer: 0, explanation: 'Arrays provide O(1) constant-time access by index because elements are stored contiguously in memory.', subject: 'Computer Science', topic: csDataStructures._id, topicName: 'Data Structures', difficulty: 'intermediate' },
        { question: 'Which data structure is best for implementing a priority queue?', options: ['Array', 'Linked List', 'Heap', 'Stack'], correctAnswer: 2, explanation: 'A heap (specifically a binary heap) efficiently supports priority queue operations with O(log n) insertion and extraction.', subject: 'Computer Science', topic: csDataStructures._id, topicName: 'Data Structures', difficulty: 'advanced' },
        // Computer Science - Algorithms
        { question: 'What is the average time complexity of QuickSort?', options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'], correctAnswer: 1, explanation: 'QuickSort has an average time complexity of O(n log n), making it one of the most efficient general-purpose sorting algorithms.', subject: 'Computer Science', topic: csAlgorithms._id, topicName: 'Algorithms', difficulty: 'advanced' },
        { question: 'What does Big-O notation describe?', options: ['Exact runtime', 'Upper bound of growth rate', 'Memory usage', 'Code quality'], correctAnswer: 1, explanation: 'Big-O notation describes the upper bound of an algorithm\'s time complexity, showing how it scales with input size.', subject: 'Computer Science', topic: csAlgorithms._id, topicName: 'Algorithms', difficulty: 'intermediate' },
        // Mathematics - Number Systems
        { question: 'Which number is irrational?', options: ['3/4', '√2', '0.5', '-7'], correctAnswer: 1, explanation: '√2 is irrational because it cannot be expressed as a ratio of two integers.', subject: 'Mathematics', topic: mathNumbers._id, topicName: 'Number Systems', difficulty: 'beginner' },
        { question: 'What is the absolute value of -15?', options: ['-15', '15', '0', '1'], correctAnswer: 1, explanation: 'The absolute value of a number is its distance from zero, so |−15| = 15.', subject: 'Mathematics', topic: mathNumbers._id, topicName: 'Number Systems', difficulty: 'beginner' },
        // Mathematics - Algebra
        { question: 'Solve for x: 2x + 5 = 13', options: ['x = 3', 'x = 4', 'x = 5', 'x = 9'], correctAnswer: 1, explanation: 'Subtract 5 from both sides: 2x = 8. Divide by 2: x = 4.', subject: 'Mathematics', topic: mathAlgebra._id, topicName: 'Algebra Basics', difficulty: 'beginner' },
        { question: 'Simplify: 3(x + 2) - x', options: ['2x + 6', '3x + 2', '4x + 6', '2x + 2'], correctAnswer: 0, explanation: 'Distribute: 3x + 6 - x = 2x + 6.', subject: 'Mathematics', topic: mathAlgebra._id, topicName: 'Algebra Basics', difficulty: 'beginner' },
        { question: 'What is the value of x if 5x - 3 = 2x + 9?', options: ['x = 2', 'x = 4', 'x = 3', 'x = 6'], correctAnswer: 1, explanation: 'Subtract 2x: 3x - 3 = 9. Add 3: 3x = 12. Divide by 3: x = 4.', subject: 'Mathematics', topic: mathAlgebra._id, topicName: 'Algebra Basics', difficulty: 'beginner' },
        // Mathematics - Linear Equations
        { question: 'What is the slope of the line y = 3x + 2?', options: ['2', '3', '5', '1'], correctAnswer: 1, explanation: 'In slope-intercept form y = mx + b, the slope m = 3.', subject: 'Mathematics', topic: mathLinear._id, topicName: 'Linear Equations', difficulty: 'intermediate' },
        { question: 'Two lines are parallel if they have:', options: ['The same y-intercept', 'The same slope', 'Perpendicular slopes', 'No slope'], correctAnswer: 1, explanation: 'Parallel lines have the same slope but different y-intercepts.', subject: 'Mathematics', topic: mathLinear._id, topicName: 'Linear Equations', difficulty: 'intermediate' },
        // Mathematics - Quadratic Equations
        { question: 'What are the roots of x² - 5x + 6 = 0?', options: ['x = 1, 6', 'x = 2, 3', 'x = -2, -3', 'x = -1, 6'], correctAnswer: 1, explanation: 'Factor: (x-2)(x-3) = 0, so x = 2 or x = 3.', subject: 'Mathematics', topic: mathQuadratic._id, topicName: 'Quadratic Equations', difficulty: 'intermediate' },
        { question: 'The discriminant b² - 4ac tells us:', options: ['The vertex', 'The number and type of roots', 'The axis of symmetry', 'The y-intercept'], correctAnswer: 1, explanation: 'If discriminant > 0: two real roots; = 0: one repeated root; < 0: no real roots (two complex roots).', subject: 'Mathematics', topic: mathQuadratic._id, topicName: 'Quadratic Equations', difficulty: 'intermediate' },
        // Mathematics - Functions & Graphs
        { question: 'What is the domain of f(x) = 1/(x-3)?', options: ['All real numbers', 'All real numbers except 3', 'x > 3', 'x < 3'], correctAnswer: 1, explanation: 'The function is undefined when the denominator is zero, i.e., when x = 3.', subject: 'Mathematics', topic: mathFunctions._id, topicName: 'Functions & Graphs', difficulty: 'intermediate' },
        { question: 'If f(x) = x² and g(x) = x + 1, what is f(g(2))?', options: ['5', '9', '4', '6'], correctAnswer: 1, explanation: 'g(2) = 2 + 1 = 3, then f(3) = 3² = 9.', subject: 'Mathematics', topic: mathFunctions._id, topicName: 'Functions & Graphs', difficulty: 'intermediate' },
        // Mathematics - Calculus
        { question: 'What is the derivative of f(x) = x³?', options: ['x²', '3x²', '3x', '3x³'], correctAnswer: 1, explanation: 'Using the power rule: d/dx(xⁿ) = nxⁿ⁻¹, so d/dx(x³) = 3x².', subject: 'Mathematics', topic: mathCalculus._id, topicName: 'Introduction to Calculus', difficulty: 'advanced' },
        { question: 'What does the limit lim(x→0) sin(x)/x equal?', options: ['0', '1', 'undefined', '∞'], correctAnswer: 1, explanation: 'This is a fundamental limit in calculus: lim(x→0) sin(x)/x = 1.', subject: 'Mathematics', topic: mathCalculus._id, topicName: 'Introduction to Calculus', difficulty: 'advanced' },
        // Physics - Units & Measurement
        { question: 'What is the SI unit of force?', options: ['Watt', 'Newton', 'Joule', 'Pascal'], correctAnswer: 1, explanation: 'The Newton (N) is the SI unit of force, defined as kg·m/s².', subject: 'Physics', topic: physUnits._id, topicName: 'Units & Measurement', difficulty: 'beginner' },
        { question: 'How many meters are in 1 kilometer?', options: ['10', '100', '1000', '10000'], correctAnswer: 2, explanation: 'The prefix "kilo" means 1000, so 1 km = 1000 m.', subject: 'Physics', topic: physUnits._id, topicName: 'Units & Measurement', difficulty: 'beginner' },
        // Physics - Motion & Kinematics
        { question: 'An object is thrown upward. At the highest point, its velocity is:', options: ['Maximum', 'Zero', 'Negative', 'Equal to initial velocity'], correctAnswer: 1, explanation: 'At the highest point, the object momentarily stops before falling back down, so velocity = 0.', subject: 'Physics', topic: physMotion._id, topicName: 'Motion & Kinematics', difficulty: 'beginner' },
        { question: 'What is the acceleration due to gravity on Earth?', options: ['9.8 m/s', '9.8 m/s²', '10 m/s²', '8.9 m/s²'], correctAnswer: 1, explanation: 'The standard acceleration due to gravity on Earth is approximately 9.8 m/s².', subject: 'Physics', topic: physMotion._id, topicName: 'Motion & Kinematics', difficulty: 'beginner' },
        // Physics - Newton's Laws
        { question: 'Newton\'s First Law is also known as the Law of:', options: ['Action-Reaction', 'Inertia', 'Acceleration', 'Gravity'], correctAnswer: 1, explanation: 'Newton\'s First Law (Law of Inertia) states that an object stays at rest or in uniform motion unless acted upon by a net force.', subject: 'Physics', topic: physNewton._id, topicName: "Newton's Laws", difficulty: 'intermediate' },
        { question: 'According to F = ma, if mass doubles and force stays the same, acceleration:', options: ['Doubles', 'Halves', 'Stays the same', 'Quadruples'], correctAnswer: 1, explanation: 'From F = ma, if F is constant and m doubles, then a = F/(2m), which is half the original acceleration.', subject: 'Physics', topic: physNewton._id, topicName: "Newton's Laws", difficulty: 'intermediate' },
        // Physics - Work & Energy
        { question: 'Work done is zero when the force is:', options: ['Large', 'Perpendicular to displacement', 'Parallel to displacement', 'Small'], correctAnswer: 1, explanation: 'Work = F·d·cos(θ). When θ = 90° (perpendicular), cos(90°) = 0, so work = 0.', subject: 'Physics', topic: physEnergy._id, topicName: 'Work & Energy', difficulty: 'intermediate' },
        // Chemistry - Atomic Structure
        { question: 'What is the charge of a proton?', options: ['Negative', 'Positive', 'Neutral', 'Variable'], correctAnswer: 1, explanation: 'Protons have a positive charge (+1), electrons have negative charge (-1), and neutrons are neutral.', subject: 'Chemistry', topic: chemAtomic._id, topicName: 'Atomic Structure', difficulty: 'beginner' },
        { question: 'Electrons are found in:', options: ['The nucleus', 'Electron shells/orbitals', 'Neutrons', 'Between atoms'], correctAnswer: 1, explanation: 'Electrons orbit the nucleus in shells (energy levels) or more precisely, in orbitals.', subject: 'Chemistry', topic: chemAtomic._id, topicName: 'Atomic Structure', difficulty: 'beginner' },
        // Chemistry - Periodic Table
        { question: 'Elements in the same group have:', options: ['Same number of protons', 'Similar chemical properties', 'Same atomic mass', 'Same number of neutrons'], correctAnswer: 1, explanation: 'Elements in the same group (column) have similar chemical properties because they have the same number of valence electrons.', subject: 'Chemistry', topic: chemPeriodic._id, topicName: 'Periodic Table', difficulty: 'beginner' },
        // Chemistry - Chemical Bonding
        { question: 'An ionic bond forms between:', options: ['Two nonmetals', 'A metal and a nonmetal', 'Two metals', 'Noble gases'], correctAnswer: 1, explanation: 'Ionic bonds form when a metal transfers electrons to a nonmetal, creating oppositely charged ions that attract.', subject: 'Chemistry', topic: chemBonding._id, topicName: 'Chemical Bonding', difficulty: 'intermediate' },
        { question: 'How many covalent bonds can carbon form?', options: ['2', '3', '4', '6'], correctAnswer: 2, explanation: 'Carbon has 4 valence electrons and can form 4 covalent bonds.', subject: 'Chemistry', topic: chemBonding._id, topicName: 'Chemical Bonding', difficulty: 'intermediate' },
        // Chemistry - Chemical Reactions
        { question: 'In a balanced chemical equation, what is conserved?', options: ['Volume', 'Mass', 'Temperature', 'Pressure'], correctAnswer: 1, explanation: 'The law of conservation of mass states that mass is conserved in chemical reactions - atoms are rearranged, not created or destroyed.', subject: 'Chemistry', topic: chemReactions._id, topicName: 'Chemical Reactions', difficulty: 'intermediate' },
        // English - Grammar
        { question: 'Which sentence uses the correct form of "their/there/they\'re"?', options: ['Their going to the store.', 'They\'re going to the store.', 'There going to the store.', 'Theyre going to the store.'], correctAnswer: 1, explanation: '"They\'re" is the contraction of "they are." "Their" shows possession, and "there" refers to a place.', subject: 'English', topic: engGrammar._id, topicName: 'Grammar Fundamentals', difficulty: 'beginner' },
        { question: 'Identify the subject in: "The quick brown fox jumps over the lazy dog."', options: ['quick brown', 'fox', 'jumps', 'dog'], correctAnswer: 1, explanation: 'The subject is "fox" - it performs the action (jumps). "The quick brown" are adjectives modifying the subject.', subject: 'English', topic: engGrammar._id, topicName: 'Grammar Fundamentals', difficulty: 'beginner' },
        // English - Reading Comprehension
        { question: 'What is the main purpose of a topic sentence?', options: ['To provide evidence', 'To state the main idea of a paragraph', 'To conclude the essay', 'To introduce the author'], correctAnswer: 1, explanation: 'A topic sentence states the main idea or central point of a paragraph, guiding the reader.', subject: 'English', topic: engReading._id, topicName: 'Reading Comprehension', difficulty: 'beginner' },
        // English - Essay Writing
        { question: 'A thesis statement should:', options: ['Ask a question', 'Present a clear, arguable position', 'Summarize every point', 'Be very long'], correctAnswer: 1, explanation: 'A thesis statement presents a clear, arguable position that the essay will defend with evidence.', subject: 'English', topic: engEssay._id, topicName: 'Essay Writing', difficulty: 'intermediate' },
        // English - Critical Analysis
        { question: 'Ethos, Pathos, and Logos are:', options: ['Greek gods', 'Rhetorical appeals', 'Literary genres', 'Grammar rules'], correctAnswer: 1, explanation: 'Ethos (credibility), Pathos (emotion), and Logos (logic) are the three rhetorical appeals used in persuasive writing.', subject: 'English', topic: engCritical._id, topicName: 'Critical Analysis', difficulty: 'advanced' },
        { question: 'What is an inference in reading comprehension?', options: ['A direct quote from the text', 'A logical conclusion based on evidence and reasoning', 'The title of a passage', 'A grammatical error'], correctAnswer: 1, explanation: 'An inference is a conclusion reached on the basis of textual evidence and reasoning rather than explicit statements.', subject: 'English', topic: engReading._id, topicName: 'Reading Comprehension', difficulty: 'beginner' },
        { question: 'Which transition word best signals a contrast?', options: ['Furthermore', 'However', 'Consequently', 'Similarly'], correctAnswer: 1, explanation: '"However" introduces a contrasting or opposing statement.', subject: 'English', topic: engEssay._id, topicName: 'Essay Writing', difficulty: 'intermediate' },
        { question: 'What is the kinetic energy of a 2 kg object moving at 3 m/s?', options: ['6 J', '9 J', '12 J', '18 J'], correctAnswer: 1, explanation: 'KE = ½mv² = ½(2)(3²) = 9 Joules.', subject: 'Physics', topic: physEnergy._id, topicName: 'Work & Energy', difficulty: 'intermediate' },
        { question: 'When light passes from air into water, it bends. This phenomenon is called:', options: ['Reflection', 'Refraction', 'Diffraction', 'Absorption'], correctAnswer: 1, explanation: 'Refraction is the bending of a wave when it enters a medium where its speed is different.', subject: 'Physics', topic: physWaves._id, topicName: 'Waves & Optics', difficulty: 'advanced' },
        { question: 'How does frequency relate to wavelength when wave speed is constant?', options: ['Directly proportional', 'Inversely proportional', 'Unrelated', 'Equal'], correctAnswer: 1, explanation: 'Since v = fλ, when wave speed v is constant, frequency f and wavelength λ are inversely proportional.', subject: 'Physics', topic: physWaves._id, topicName: 'Waves & Optics', difficulty: 'advanced' },
        { question: 'What is the atomic number of an element equal to?', options: ['Number of neutrons', 'Number of protons', 'Protons plus neutrons', 'Valence electrons'], correctAnswer: 1, explanation: 'The atomic number (Z) uniquely identifies an element by the number of protons in its nucleus.', subject: 'Chemistry', topic: chemAtomic._id, topicName: 'Atomic Structure', difficulty: 'beginner' },
        { question: 'Which group on the Periodic Table contains the Noble Gases?', options: ['Group 1', 'Group 2', 'Group 17', 'Group 18'], correctAnswer: 3, explanation: 'Group 18 contains the noble gases (He, Ne, Ar, etc.), which have full valence electron shells.', subject: 'Chemistry', topic: chemPeriodic._id, topicName: 'Periodic Table', difficulty: 'beginner' },
        { question: 'A reaction that releases heat to the surroundings is called:', options: ['Endothermic', 'Exothermic', 'Isothermal', 'Catalytic'], correctAnswer: 1, explanation: 'Exothermic reactions release energy (heat) to the surroundings, resulting in a negative enthalpy change (ΔH < 0).', subject: 'Chemistry', topic: chemReactions._id, topicName: 'Chemical Reactions', difficulty: 'intermediate' },
        { question: 'What is the vertex of the parabola y = (x - 2)² + 3?', options: ['(-2, 3)', '(2, 3)', '(2, -3)', '(-2, -3)'], correctAnswer: 1, explanation: 'In vertex form y = a(x - h)² + k, the vertex is (h, k) = (2, 3).', subject: 'Mathematics', topic: mathQuadratic._id, topicName: 'Quadratic Equations', difficulty: 'intermediate' },
        { question: 'What is the integral ∫ 2x dx?', options: ['2 + C', 'x² + C', '2x² + C', 'x + C'], correctAnswer: 1, explanation: 'The antiderivative of 2x with respect to x is x² + C.', subject: 'Mathematics', topic: mathCalculus._id, topicName: 'Introduction to Calculus', difficulty: 'advanced' },
    ]);
    console.log(`   ✅ Created ${questions.length} questions`);
    // ==================== RESOURCES ====================
    console.log('📖 Creating resources...');
    const resources = await Resource_1.Resource.insertMany([
        // CS Resources
        { title: 'Introduction to Programming - CS50', description: 'Harvard\'s renowned introduction to computer science and programming.', subject: 'Computer Science', topic: csProgramming._id, topicName: 'Programming Fundamentals', difficulty: 'beginner', type: 'video', url: 'https://cs50.harvard.edu', estimatedMinutes: 45, bandwidth: 'high', accessibilityFeatures: ['captions', 'transcript'] },
        { title: 'What is Programming? (Text Guide)', description: 'A beginner-friendly text explanation of programming concepts.', subject: 'Computer Science', topic: csProgramming._id, topicName: 'Programming Fundamentals', difficulty: 'beginner', type: 'article', url: 'https://www.freecodecamp.org/news/what-is-programming/', estimatedMinutes: 15, bandwidth: 'low', accessibilityFeatures: ['text-based'] },
        { title: 'Variables Explained', description: 'Interactive tutorial on variables and data types in Python.', subject: 'Computer Science', topic: csVariables._id, topicName: 'Variables & Data Types', difficulty: 'beginner', type: 'interactive', url: 'https://www.w3schools.com/python/python_variables.asp', estimatedMinutes: 20, bandwidth: 'low', accessibilityFeatures: ['text-based', 'interactive'] },
        { title: 'Data Types in Programming', description: 'Comprehensive video covering all major data types.', subject: 'Computer Science', topic: csVariables._id, topicName: 'Variables & Data Types', difficulty: 'beginner', type: 'video', url: 'https://www.youtube.com/watch?v=data-types', estimatedMinutes: 25, bandwidth: 'medium', accessibilityFeatures: ['captions'] },
        { title: 'Functions in Python - Real Python', description: 'In-depth guide to Python functions with examples.', subject: 'Computer Science', topic: csFunctions._id, topicName: 'Functions & Modules', difficulty: 'intermediate', type: 'article', url: 'https://realpython.com/defining-your-own-python-function/', estimatedMinutes: 30, bandwidth: 'low', accessibilityFeatures: ['text-based'] },
        { title: 'Understanding Recursion', description: 'Step-by-step visual guide to recursive thinking.', subject: 'Computer Science', topic: csRecursion._id, topicName: 'Recursion', difficulty: 'beginner', type: 'video', url: 'https://www.youtube.com/watch?v=recursion-basics', estimatedMinutes: 20, bandwidth: 'medium', accessibilityFeatures: ['captions', 'transcript'] },
        { title: 'Recursion Practice Problems', description: 'Collection of recursive programming exercises with solutions.', subject: 'Computer Science', topic: csRecursion._id, topicName: 'Recursion', difficulty: 'intermediate', type: 'practice', url: 'https://leetcode.com/tag/recursion/', estimatedMinutes: 60, bandwidth: 'low', accessibilityFeatures: ['text-based'] },
        { title: 'Recursion - A Visual Guide (PDF)', description: 'Downloadable PDF with visual explanations of recursive algorithms.', subject: 'Computer Science', topic: csRecursion._id, topicName: 'Recursion', difficulty: 'intermediate', type: 'pdf', url: 'https://example.com/recursion-guide.pdf', estimatedMinutes: 30, bandwidth: 'low', accessibilityFeatures: ['text-based'] },
        { title: 'Data Structures Full Course', description: 'Complete data structures course with implementations.', subject: 'Computer Science', topic: csDataStructures._id, topicName: 'Data Structures', difficulty: 'intermediate', type: 'video', url: 'https://www.youtube.com/watch?v=data-structures', estimatedMinutes: 90, bandwidth: 'high', accessibilityFeatures: ['captions'] },
        { title: 'Visualize Data Structures', description: 'Interactive visualizations of common data structures.', subject: 'Computer Science', topic: csDataStructures._id, topicName: 'Data Structures', difficulty: 'intermediate', type: 'interactive', url: 'https://visualgo.net/', estimatedMinutes: 30, bandwidth: 'medium', accessibilityFeatures: ['interactive'] },
        { title: 'Algorithms - Khan Academy', description: 'Free course on sorting, searching, and graph algorithms.', subject: 'Computer Science', topic: csAlgorithms._id, topicName: 'Algorithms', difficulty: 'advanced', type: 'interactive', url: 'https://www.khanacademy.org/computing/computer-science/algorithms', estimatedMinutes: 120, bandwidth: 'medium', accessibilityFeatures: ['captions', 'interactive'] },
        // Math Resources
        { title: 'Number Systems - Khan Academy', description: 'Interactive lessons on different number systems.', subject: 'Mathematics', topic: mathNumbers._id, topicName: 'Number Systems', difficulty: 'beginner', type: 'video', url: 'https://www.khanacademy.org/math/algebra/x2f8bb11595b61c86:foundation-algebra/x2f8bb11595b61c86:number-sets/v/number-sets-1', estimatedMinutes: 20, bandwidth: 'medium', accessibilityFeatures: ['captions', 'transcript'] },
        { title: 'Introduction to Algebra', description: 'Comprehensive text-based introduction to algebraic concepts.', subject: 'Mathematics', topic: mathAlgebra._id, topicName: 'Algebra Basics', difficulty: 'beginner', type: 'article', url: 'https://www.mathsisfun.com/algebra/', estimatedMinutes: 25, bandwidth: 'low', accessibilityFeatures: ['text-based'] },
        { title: 'Algebra Practice - Khan Academy', description: 'Interactive algebra exercises with instant feedback.', subject: 'Mathematics', topic: mathAlgebra._id, topicName: 'Algebra Basics', difficulty: 'beginner', type: 'interactive', url: 'https://www.khanacademy.org/math/algebra', estimatedMinutes: 30, bandwidth: 'medium', accessibilityFeatures: ['interactive', 'text-based'] },
        { title: 'Linear Equations - Video Course', description: 'Complete guide to solving and graphing linear equations.', subject: 'Mathematics', topic: mathLinear._id, topicName: 'Linear Equations', difficulty: 'intermediate', type: 'video', url: 'https://www.khanacademy.org/math/algebra/linear-equations', estimatedMinutes: 35, bandwidth: 'medium', accessibilityFeatures: ['captions'] },
        { title: 'Quadratic Equations Guide', description: 'Step-by-step guide to solving quadratic equations.', subject: 'Mathematics', topic: mathQuadratic._id, topicName: 'Quadratic Equations', difficulty: 'intermediate', type: 'article', url: 'https://www.purplemath.com/modules/quadform.htm', estimatedMinutes: 25, bandwidth: 'low', accessibilityFeatures: ['text-based'] },
        { title: 'Functions & Graphs - Interactive', description: 'Interactive graphing calculator and function explorer.', subject: 'Mathematics', topic: mathFunctions._id, topicName: 'Functions & Graphs', difficulty: 'intermediate', type: 'interactive', url: 'https://www.desmos.com/calculator', estimatedMinutes: 30, bandwidth: 'low', accessibilityFeatures: ['interactive'] },
        { title: 'Introduction to Calculus', description: 'Gentle introduction to limits and derivatives.', subject: 'Mathematics', topic: mathCalculus._id, topicName: 'Introduction to Calculus', difficulty: 'advanced', type: 'video', url: 'https://www.3blue1brown.com/topics/calculus', estimatedMinutes: 60, bandwidth: 'high', accessibilityFeatures: ['captions'] },
        // Physics Resources
        { title: 'Units and Measurement Basics', description: 'Foundation course on SI units and measurement.', subject: 'Physics', topic: physUnits._id, topicName: 'Units & Measurement', difficulty: 'beginner', type: 'article', url: 'https://www.physicsclassroom.com/class/1DKin/Lesson-1', estimatedMinutes: 20, bandwidth: 'low', accessibilityFeatures: ['text-based'] },
        { title: 'Kinematics - Physics Classroom', description: 'Interactive lessons on motion and kinematics.', subject: 'Physics', topic: physMotion._id, topicName: 'Motion & Kinematics', difficulty: 'beginner', type: 'interactive', url: 'https://www.physicsclassroom.com/class/1DKin', estimatedMinutes: 40, bandwidth: 'low', accessibilityFeatures: ['text-based', 'interactive'] },
        { title: "Newton's Laws Explained", description: "Video explaining Newton's three laws of motion with real-world examples.", subject: 'Physics', topic: physNewton._id, topicName: "Newton's Laws", difficulty: 'intermediate', type: 'video', url: 'https://www.youtube.com/watch?v=newtons-laws', estimatedMinutes: 25, bandwidth: 'medium', accessibilityFeatures: ['captions'] },
        { title: 'Work and Energy - Text Guide', description: 'Comprehensive text resource on work, energy, and conservation laws.', subject: 'Physics', topic: physEnergy._id, topicName: 'Work & Energy', difficulty: 'intermediate', type: 'article', url: 'https://www.physicsclassroom.com/class/energy', estimatedMinutes: 30, bandwidth: 'low', accessibilityFeatures: ['text-based'] },
        // Chemistry Resources
        { title: 'Atomic Structure Basics', description: 'Visual guide to atomic structure and electron configuration.', subject: 'Chemistry', topic: chemAtomic._id, topicName: 'Atomic Structure', difficulty: 'beginner', type: 'video', url: 'https://www.youtube.com/watch?v=atomic-structure', estimatedMinutes: 20, bandwidth: 'medium', accessibilityFeatures: ['captions'] },
        { title: 'Interactive Periodic Table', description: 'Explore elements, their properties, and trends.', subject: 'Chemistry', topic: chemPeriodic._id, topicName: 'Periodic Table', difficulty: 'beginner', type: 'interactive', url: 'https://ptable.com/', estimatedMinutes: 15, bandwidth: 'low', accessibilityFeatures: ['interactive', 'text-based'] },
        { title: 'Chemical Bonding - Article', description: 'Understanding ionic, covalent, and metallic bonds.', subject: 'Chemistry', topic: chemBonding._id, topicName: 'Chemical Bonding', difficulty: 'intermediate', type: 'article', url: 'https://www.chemguide.co.uk/atoms/bonding/bonding.html', estimatedMinutes: 30, bandwidth: 'low', accessibilityFeatures: ['text-based'] },
        { title: 'Balancing Chemical Equations', description: 'Practice balancing chemical equations interactively.', subject: 'Chemistry', topic: chemReactions._id, topicName: 'Chemical Reactions', difficulty: 'intermediate', type: 'practice', url: 'https://phet.colorado.edu/en/simulation/balancing-chemical-equations', estimatedMinutes: 25, bandwidth: 'medium', accessibilityFeatures: ['interactive'] },
        // English Resources
        { title: 'Grammar Essentials', description: 'Comprehensive grammar guide covering parts of speech and sentence structure.', subject: 'English', topic: engGrammar._id, topicName: 'Grammar Fundamentals', difficulty: 'beginner', type: 'article', url: 'https://www.grammarly.com/blog/grammar/', estimatedMinutes: 20, bandwidth: 'low', accessibilityFeatures: ['text-based'] },
        { title: 'Reading Strategies', description: 'Effective strategies for improving reading comprehension.', subject: 'English', topic: engReading._id, topicName: 'Reading Comprehension', difficulty: 'beginner', type: 'article', url: 'https://www.readingrockets.org/article/strategies-reading-comprehension', estimatedMinutes: 15, bandwidth: 'low', accessibilityFeatures: ['text-based'] },
        { title: 'Essay Writing Workshop', description: 'Step-by-step guide to writing effective essays.', subject: 'English', topic: engEssay._id, topicName: 'Essay Writing', difficulty: 'intermediate', type: 'pdf', url: 'https://example.com/essay-writing-guide.pdf', estimatedMinutes: 40, bandwidth: 'low', accessibilityFeatures: ['text-based'] },
        { title: 'Critical Analysis Techniques', description: 'Video course on analyzing texts and constructing arguments.', subject: 'English', topic: engCritical._id, topicName: 'Critical Analysis', difficulty: 'advanced', type: 'video', url: 'https://www.youtube.com/watch?v=critical-analysis', estimatedMinutes: 35, bandwidth: 'medium', accessibilityFeatures: ['captions'] },
    ]);
    console.log(`   ✅ Created ${resources.length} resources`);
    // ==================== DEMO STUDENT ====================
    console.log('👤 Creating demo student (Aarav)...');
    const salt = await bcryptjs_1.default.genSalt(10);
    const passwordHash = await bcryptjs_1.default.hash('demo123456', salt);
    const aarav = await User_1.User.create({
        name: 'Aarav',
        email: 'aarav@demo.nomad.edu',
        passwordHash,
        educationLevel: 'undergraduate',
        interests: ['Computer Science', 'Mathematics'],
        preferences: {
            resourceTypes: ['video', 'interactive'],
            studyTimePerDay: 60,
            difficultyProgression: 'moderate',
            learningStyle: 'visual',
        },
        goals: ['Master programming fundamentals', 'Build strong CS foundation'],
        onboardingCompleted: true,
        isDemo: true,
    });
    // ==================== DEMO PROGRESS ====================
    console.log('📊 Creating demo progress...');
    await Progress_1.Progress.insertMany([
        { userId: aarav._id, topicId: csProgramming._id, topicName: 'Programming Fundamentals', subject: 'Computer Science', masteryScore: 88, status: 'mastered', attempts: 2, scores: [78, 88], lastAttemptDate: new Date('2026-09-25') },
        { userId: aarav._id, topicId: csVariables._id, topicName: 'Variables & Data Types', subject: 'Computer Science', masteryScore: 85, status: 'mastered', attempts: 2, scores: [72, 85], lastAttemptDate: new Date('2026-09-26') },
        { userId: aarav._id, topicId: csFunctions._id, topicName: 'Functions & Modules', subject: 'Computer Science', masteryScore: 81, status: 'proficient', attempts: 2, scores: [68, 81], lastAttemptDate: new Date('2026-09-27') },
        { userId: aarav._id, topicId: csRecursion._id, topicName: 'Recursion', subject: 'Computer Science', masteryScore: 43, status: 'in_progress', attempts: 3, scores: [30, 38, 43], lastAttemptDate: new Date('2026-09-29') },
        { userId: aarav._id, topicId: csDataStructures._id, topicName: 'Data Structures', subject: 'Computer Science', masteryScore: 62, status: 'in_progress', attempts: 1, scores: [62], lastAttemptDate: new Date('2026-09-28') },
        { userId: aarav._id, topicId: mathNumbers._id, topicName: 'Number Systems', subject: 'Mathematics', masteryScore: 90, status: 'mastered', attempts: 1, scores: [90], lastAttemptDate: new Date('2026-09-20') },
        { userId: aarav._id, topicId: mathAlgebra._id, topicName: 'Algebra Basics', subject: 'Mathematics', masteryScore: 82, status: 'proficient', attempts: 2, scores: [70, 82], lastAttemptDate: new Date('2026-09-22') },
    ]);
    // ==================== DEMO ASSESSMENTS ====================
    console.log('📝 Creating demo assessments...');
    // Get some questions for assessments
    const csQuestions = await Question_1.Question.find({ subject: 'Computer Science' });
    // Assessment 1: Programming Fundamentals
    const progQuestions = csQuestions.filter(q => q.topicName === 'Programming Fundamentals');
    await Assessment_1.Assessment.create({
        userId: aarav._id,
        subject: 'Computer Science',
        type: 'initial',
        questions: progQuestions.map((q, i) => ({
            questionId: q._id,
            selectedAnswer: q.correctAnswer, // Got most right
            correct: true,
            timeTaken: 30 + i * 10,
        })),
        score: 88,
        totalQuestions: progQuestions.length,
        topicResults: [{ topicId: csProgramming._id, topicName: 'Programming Fundamentals', correct: progQuestions.length, total: progQuestions.length, percentage: 88 }],
        completedAt: new Date('2026-09-25'),
    });
    // Assessment 2: Functions + Recursion (mixed)
    const funcQuestions = csQuestions.filter(q => q.topicName === 'Functions & Modules');
    const recQuestions = csQuestions.filter(q => q.topicName === 'Recursion');
    await Assessment_1.Assessment.create({
        userId: aarav._id,
        subject: 'Computer Science',
        type: 'practice',
        questions: [
            ...funcQuestions.map(q => ({ questionId: q._id, selectedAnswer: q.correctAnswer, correct: true, timeTaken: 45 })),
            ...recQuestions.slice(0, 2).map((q, i) => ({ questionId: q._id, selectedAnswer: i === 0 ? q.correctAnswer : 0, correct: i === 0, timeTaken: 60 })),
        ],
        score: 65,
        totalQuestions: funcQuestions.length + 2,
        topicResults: [
            { topicId: csFunctions._id, topicName: 'Functions & Modules', correct: funcQuestions.length, total: funcQuestions.length, percentage: 81 },
            { topicId: csRecursion._id, topicName: 'Recursion', correct: 1, total: 2, percentage: 43 },
        ],
        completedAt: new Date('2026-09-27'),
    });
    // Assessment 3: Recent recursion attempt
    await Assessment_1.Assessment.create({
        userId: aarav._id,
        subject: 'Computer Science',
        type: 'practice',
        questions: recQuestions.slice(0, 4).map((q, i) => ({
            questionId: q._id,
            selectedAnswer: i < 2 ? q.correctAnswer : 0,
            correct: i < 2,
            timeTaken: 50 + i * 15,
        })),
        score: 43,
        totalQuestions: Math.min(4, recQuestions.length),
        topicResults: [{ topicId: csRecursion._id, topicName: 'Recursion', correct: 2, total: 4, percentage: 43 }],
        completedAt: new Date('2026-09-29'),
    });
    // Assessment 4: Data structures
    const dsQuestions = csQuestions.filter(q => q.topicName === 'Data Structures');
    await Assessment_1.Assessment.create({
        userId: aarav._id,
        subject: 'Computer Science',
        type: 'practice',
        questions: dsQuestions.map((q, i) => ({
            questionId: q._id,
            selectedAnswer: i < 2 ? q.correctAnswer : 0,
            correct: i < 2,
            timeTaken: 40,
        })),
        score: 62,
        totalQuestions: dsQuestions.length,
        topicResults: [{ topicId: csDataStructures._id, topicName: 'Data Structures', correct: 2, total: dsQuestions.length, percentage: 62 }],
        completedAt: new Date('2026-09-28'),
    });
    // Math assessment
    await Assessment_1.Assessment.create({
        userId: aarav._id,
        subject: 'Mathematics',
        type: 'initial',
        questions: [],
        score: 86,
        totalQuestions: 5,
        topicResults: [
            { topicId: mathNumbers._id, topicName: 'Number Systems', correct: 2, total: 2, percentage: 90 },
            { topicId: mathAlgebra._id, topicName: 'Algebra Basics', correct: 3, total: 3, percentage: 82 },
        ],
        completedAt: new Date('2026-09-22'),
    });
    // ==================== DEMO LEARNING PATH ====================
    console.log('🗺️  Creating demo learning path...');
    await LearningPath_1.LearningPath.create({
        userId: aarav._id,
        subject: 'Computer Science',
        nodes: [
            { topicId: csProgramming._id, topicName: 'Programming Fundamentals', status: 'completed', difficulty: 'beginner', estimatedTime: '3h', score: 88, reason: 'Mastered with 88% score', order: 1 },
            { topicId: csVariables._id, topicName: 'Variables & Data Types', status: 'completed', difficulty: 'beginner', estimatedTime: '2h', score: 85, reason: 'Mastered with 85% score', order: 2 },
            { topicId: csFunctions._id, topicName: 'Functions & Modules', status: 'completed', difficulty: 'intermediate', estimatedTime: '3h', score: 81, reason: 'Proficient with 81% score', order: 3 },
            { topicId: csRecursion._id, topicName: 'Recursion', status: 'current', difficulty: 'intermediate', estimatedTime: '4h', score: 43, reason: 'Your recursion performance is below the proficiency threshold. Recommended because this is a prerequisite for Data Structures.', order: 4 },
            { topicId: csDataStructures._id, topicName: 'Data Structures', status: 'available', difficulty: 'intermediate', estimatedTime: '5h', score: 62, reason: 'Available but recursion should be strengthened first.', order: 5 },
            { topicId: csAlgorithms._id, topicName: 'Algorithms', status: 'locked', difficulty: 'advanced', estimatedTime: '6h', reason: 'Requires mastery of Data Structures.', order: 6 },
        ],
        currentNodeIndex: 3,
    });
    // ==================== DEMO RECOMMENDATIONS ====================
    console.log('💡 Creating demo recommendations...');
    const recursionResources = await Resource_1.Resource.find({ topic: csRecursion._id });
    const dsResources = await Resource_1.Resource.find({ topic: csDataStructures._id });
    await Recommendation_1.Recommendation.insertMany([
        {
            userId: aarav._id,
            topicId: csRecursion._id,
            topicName: 'Recursion',
            subject: 'Computer Science',
            reason: 'Your recursion performance (43%) is significantly below the proficiency threshold. You\'ve attempted this topic 3 times. Try a different learning approach — start with visual explanations before practice problems.',
            resources: recursionResources.map(r => r._id),
            priority: 1,
            difficulty: 'beginner',
            status: 'pending',
        },
        {
            userId: aarav._id,
            topicId: csDataStructures._id,
            topicName: 'Data Structures',
            subject: 'Computer Science',
            reason: 'You\'re close to mastering Data Structures (62%). Focus on understanding stacks and queues before moving to trees.',
            resources: dsResources.map(r => r._id),
            priority: 2,
            difficulty: 'intermediate',
            status: 'pending',
        },
        {
            userId: aarav._id,
            topicId: mathAlgebra._id,
            topicName: 'Algebra Basics',
            subject: 'Mathematics',
            reason: 'You\'re doing well in Algebra (82%). A few more practice sessions could help you achieve mastery!',
            resources: [],
            priority: 3,
            difficulty: 'beginner',
            status: 'pending',
        },
    ]);
    console.log('\n✅ Seed complete!');
    console.log('📋 Summary:');
    console.log(`   • 25 topics across 5 subjects`);
    console.log(`   • ${questions.length} questions`);
    console.log(`   • ${resources.length} resources`);
    console.log(`   • 1 demo student (Aarav)`);
    console.log(`   • 5 assessment records`);
    console.log(`   • 7 progress records`);
    console.log(`   • 1 learning path`);
    console.log(`   • 3 recommendations`);
    console.log('\n🔑 Demo Login:');
    console.log('   Email: aarav@demo.nomad.edu');
    console.log('   Password: demo123456\n');
    process.exit(0);
}
seed().catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map