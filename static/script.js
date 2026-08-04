// static/script.js

// --- Global Markdown Renderer ---
window.renderMarkdown = function(text) {
    if (!text) return "";
    return text
        .replace(/\*\*(.+?)\*\*/g, '<strong style="color:#a5b4fc;">$1</strong>')
        .replace(/^#{1,3}\s+(.+)$/gm, '<div style="font-weight:700;color:#818cf8;margin:0.6rem 0 0.3rem;">$1</div>')
        .replace(/^[\-•\*]\s+(.+)$/gm, '<div style="display:flex;gap:0.4rem;margin:0.25rem 0;"><span style="color:#6366f1;flex-shrink:0;">›</span><span>$1</span></div>')
        .replace(/^(\d+)\.\s+(.+)$/gm, '<div style="display:flex;gap:0.4rem;margin:0.25rem 0;"><span style="color:#6366f1;font-weight:600;flex-shrink:0;">$1.</span><span>$2</span></div>')
        .replace(/\n{2,}/g, '<br>')
        .replace(/\n/g, '<br>');
};

// --- Rich Topic Knowledge Base for Local Fallback ---
const TOPIC_KNOWLEDGE_BASE = {
    'array': [
        { q: "What is the defining physical memory characteristic of an Array?", a: "Items are stored at contiguous memory locations in physical RAM." },
        { q: "What is the time complexity of random access by index in an Array?", a: "O(1) constant time, calculated as Base Address + (Index × Element Size)." },
        { q: "How do Primitive vs Non-Primitive array storage mechanisms differ in Java/Python vs C/C++?", a: "C/C++ and Java Primitive arrays store raw values contiguously; Python, JS, and Java Non-Primitive arrays store contiguous references/pointers." },
        { q: "Why do Arrays exhibit high cache friendliness?", a: "Because contiguous memory layout leverages spatial locality of reference when CPU cache lines prefetch contiguous blocks." },
        { q: "Which data structures rely on Arrays as their underlying building block?", a: "Stacks, Queues, Deques, Graphs (Adjacency Matrices), and Hash Tables." },
        { q: "What are the main operational limitations of an Array?", a: "Slow middle insertions and deletions (O(N) due to element shifting), and linear search O(N) on unsorted data." },
        { q: "What is a Dynamic Array (e.g. std::vector, ArrayList, Python list)?", a: "An array abstraction that automatically resizes by allocating a larger memory block (usually 2x) when full." },
        { q: "What is the time complexity of appending an element to a Dynamic Array?", a: "Amortized O(1) time complexity." },
        { q: "What is the space complexity of an array of N elements?", a: "O(N) linear auxiliary space." },
        { q: "How does two-pointer traversal work on sorted arrays?", a: "Using two index pointers moving inward from ends (0 and N-1) to find pairs in O(N) time without extra memory." },
        { q: "What is a multi-dimensional array?", a: "An array of arrays stored in row-major or column-major contiguous memory order." },
        { q: "What causes an IndexOutOfBounds error?", a: "Accessing an index less than 0 or greater than or equal to the array's capacity N." },
        { q: "How does binary search operate on a sorted array?", a: "By repeatedly halving the search space in O(log N) time using index comparisons." },
        { q: "What is an in-place array reversal algorithm?", a: "Swapping elements array[i] and array[N-1-i] until pointers meet at mid N/2." },
        { q: "Why is insertion at the beginning of a fixed array O(N)?", a: "Every existing element must be shifted right by one position to make room at index 0." }
    ],
    'dbms': [
        { q: "What is a Database Management System (DBMS)?", a: "Software for creating, managing, querying, and securing structured databases (e.g. PostgreSQL, MySQL)." },
        { q: "What do ACID properties stand for in relational databases?", a: "Atomicity, Consistency, Isolation, and Durability." },
        { q: "What is the difference between DDL and DML in SQL?", a: "DDL defines database schema structures (CREATE, ALTER, DROP); DML manipulates data records (INSERT, UPDATE, SELECT)." },
        { q: "How does database Indexing improve query execution speed?", a: "B-Trees / B+ Trees reduce disk I/O reads by providing logarithmic O(log N) lookup speed instead of full table scans." },
        { q: "What is Database Normalization?", a: "Structuring relational schemas (1NF, 2NF, 3NF, BCNF) to minimize data redundancy and eliminate update/delete anomalies." },
        { q: "What is a Primary Key vs a Foreign Key?", a: "A Primary Key uniquely identifies a table row; a Foreign Key references a Primary Key in another table to establish relationships." },
        { q: "What is a Database Transaction Deadlock?", a: "A situation where two or more transactions hold locks on resources the other transactions need to finish." },
        { q: "What is the difference between Relational (SQL) and NoSQL databases?", a: "SQL databases use structured tables and strict schemas; NoSQL databases store flexible documents, key-values, or graphs." },
        { q: "What is a Database Join operation?", a: "Combining rows from two or more tables based on a related column between them (INNER, LEFT, RIGHT, FULL)." },
        { q: "What is Write-Ahead Logging (WAL)?", a: "A technique ensuring database Durability by recording changes to disk logs before writing them to database storage pages." },
        { q: "What is Database Sharding?", a: "Horizontal partitioning of data across multiple database instances to distribute workload and storage scale." },
        { q: "What is an Indexing B-Tree vs B+ Tree?", a: "B+ Trees store data records only in leaf nodes connected as a linked list, making range queries significantly faster." },
        { q: "What is a Database View?", a: "A virtual table based on the result set of an SQL query that does not store physical data itself." },
        { q: "What is Connection Pooling in database backends?", a: "Reusing active database connection instances rather than repeatedly opening and closing sockets." },
        { q: "What is Isolation Level in transaction control?", a: "Controls visibility of concurrent uncommitted changes (Read Uncommitted, Read Committed, Repeatable Read, Serializable)." }
    ],
    'operating system': [
        { q: "What is an Operating System's core responsibility?", a: "Managing computer hardware, CPU process scheduling, memory allocation, file systems, and device I/O." },
        { q: "What is the difference between a Process and a Thread?", a: "A process has an isolated virtual address space; threads share the memory space and resources of their parent process." },
        { q: "What is Virtual Memory and Paging?", a: "Technique storing RAM data on disk swap space using fixed-size page tables to map virtual to physical addresses." },
        { q: "What is a Deadlock and what are its 4 Coffman conditions?", a: "A state where processes stall indefinitely: Mutual Exclusion, Hold & Wait, No Preemption, and Circular Wait." },
        { q: "What is CPU Context Switching?", a: "Saving the execution state of a process/thread and loading another so the CPU can multitask across threads." },
        { q: "What is a System Call in an OS?", a: "A programmatic interface allowing user-space programs to request privileged kernel-space operations." },
        { q: "What is a Semaphore vs a Mutex?", a: "A Mutex is a locking mechanism for a single thread; a Semaphore uses a signaling integer counter for multiple resources." },
        { q: "What is CPU Scheduling and preemptive vs non-preemptive scheduling?", a: "Preemptive scheduling can interrupt a running process (e.g. Round Robin, Shortest Remaining Time First); non-preemptive cannot." },
        { q: "What is Thrashing in Virtual Memory?", a: "High disk swapping activity occurring when RAM is overcommitted and the OS spends more time swapping pages than executing." },
        { q: "What is the Kernel in an Operating System?", a: "The core module running in privileged mode that directly controls CPU, memory, and hardware drivers." },
        { q: "What is a Race Condition in concurrent software?", a: "An bug where execution output depends on unpredictable timing or sequence of thread scheduling." },
        { q: "What is a Page Fault?", a: "An interrupt raised when a program accesses a virtual page that is not currently loaded into physical RAM." },
        { q: "What is the Inter-Process Communication (IPC)?", a: "Mechanisms enabling separate processes to transfer data (Pipes, Shared Memory, Message Queues, Sockets)." },
        { q: "What is a File Allocation Table (FAT) vs Inode file system?", a: "FAT uses a continuous table of cluster links; Unix Inode systems store metadata, pointers, and direct/indirect block indices." },
        { q: "What is a User Space vs Kernel Space boundary?", a: "Memory isolation preventing user applications from directly reading/writing kernel memory or hardware devices." }
    ]
};

// --- Custom Source Text Flashcard Extractor ---
function extractFlashcardsFromCustomText(sourceText, targetCount = 5) {
    const text = sourceText.trim();
    if (!text) return [];

    const sentences = text.split(/(?<=[.!?])\s+/).filter(s => s.length > 15);
    const flashcards = [];

    if (text.toLowerCase().includes('random access') || text.toLowerCase().includes('o(1)')) {
        flashcards.push({
            q: "What is the key time complexity advantage of Random Access in an array?",
            a: "Random access allows accessing the i-th item in O(1) constant time using base address math."
        });
    }

    if (text.toLowerCase().includes('contiguous')) {
        flashcards.push({
            q: "How are elements stored in memory according to the provided text?",
            a: "Elements (or references) are stored at contiguous physical memory locations."
        });
    }

    if (text.toLowerCase().includes('cache friendliness') || text.toLowerCase().includes('locality')) {
        flashcards.push({
            q: "Why does contiguous memory layout offer Cache Friendliness?",
            a: "It takes advantage of spatial locality of reference when prefetching data into CPU cache."
        });
    }

    if (text.toLowerCase().includes('stack') || text.toLowerCase().includes('queue') || text.toLowerCase().includes('graph')) {
        flashcards.push({
            q: "Which data structures can be built on top of an array?",
            a: "Arrays are used to build Stack, Queue, Deque, Graph, and Hash Table data structures."
        });
    }

    if (text.toLowerCase().includes('insert') || text.toLowerCase().includes('delete') || text.toLowerCase().includes('unsorted')) {
        flashcards.push({
            q: "In what scenarios is an array NOT recommended?",
            a: "For middle insertions, middle deletions, or searching unsorted data."
        });
    }

    if (text.toLowerCase().includes('c/c++') || text.toLowerCase().includes('primitive') || text.toLowerCase().includes('python')) {
        flashcards.push({
            q: "How does contiguous storage differ between Primitive (C/C++, Java) vs Non-Primitive (Python, JS) arrays?",
            a: "Primitive arrays store actual elements contiguously; Python, JS, and Java Non-Primitive arrays store references contiguously."
        });
    }

    let idx = 0;
    while (flashcards.length < targetCount && idx < sentences.length) {
        const sentence = sentences[idx];
        if (sentence.length > 25) {
            flashcards.push({
                q: `Key Fact #${flashcards.length + 1} from Source Text:`,
                a: sentence
            });
        }
        idx++;
    }

    while (flashcards.length < targetCount) {
        const i = flashcards.length + 1;
        flashcards.push({
            q: `Review Question #${i} from custom notes:`,
            a: `Note Summary Point #${i}: ${text.substring(0, 100)}...`
        });
    }

    return flashcards.slice(0, targetCount);
}

// --- Dynamic Local Response Engine ---
function generateSmartLocalResponse(promptText, systemInstruction = "") {
    const query = promptText.toLowerCase().trim();

    // 1. Flashcards Request JSON
    if (query.includes('flashcard') || query.includes('json') || systemInstruction.includes('JSON')) {
        let topic = "concept";
        const topicMatch = promptText.match(/topic:\s*"([^"]+)"/i) || promptText.match(/topic:\s*([^\n\.,]+)/i);
        if (topicMatch && topicMatch[1]) {
            topic = topicMatch[1].trim().toLowerCase().replace(/^["']|["']$/g, '');
        }

        let count = 5;
        const countMatch = promptText.match(/(\d+)\s+Q&A flashcards/i) || promptText.match(/generate\s+(\d+)\s+cards/i);
        if (countMatch && countMatch[1]) {
            count = parseInt(countMatch[1], 10);
        }

        const customMatch = promptText.match(/Source Data:\s*([\s\S]+)$/i);
        if (customMatch && customMatch[1] && customMatch[1].trim().length > 15) {
            const cards = extractFlashcardsFromCustomText(customMatch[1].trim(), count);
            return JSON.stringify(cards);
        }

        const formattedTopic = topic.charAt(0).toUpperCase() + topic.slice(1);
        let topicCards = TOPIC_KNOWLEDGE_BASE[topic];

        if (!topicCards) {
            topicCards = [
                { q: `What is the core definition of ${formattedTopic}?`, a: `${formattedTopic} is a key module/concept designed to solve specialized problems and organize domain logic efficiently.` },
                { q: `What is the primary use case or application of ${formattedTopic}?`, a: `Used for system architecture, performance optimization, and structured data execution.` },
                { q: `How do you perform active recall for ${formattedTopic}?`, a: `By deriving key equations, writing code/diagrams from scratch, and explaining edge cases without notes.` },
                { q: `What is a common mistake when studying ${formattedTopic}?`, a: `Confusing syntax/superficial labels with underlying mechanics and operational trade-offs.` },
                { q: `What is the key takeaway to master ${formattedTopic}?`, a: `Consistent retrieval practice, spaced repetition reviews, and real-world implementation.` },
                { q: `What is the architectural boundary of ${formattedTopic}?`, a: `It interfaces between input representations and execution logic.` },
                { q: `How do you measure efficiency in ${formattedTopic}?`, a: `By analyzing time complexity, space overhead, and resource utilization.` },
                { q: `What is an advanced property of ${formattedTopic}?`, a: `Scalability under concurrent load and high-volume data streams.` },
                { q: `How does ${formattedTopic} handle error conditions?`, a: `Through exception handling, boundary validation, and state rollback.` },
                { q: `What is a real-world example of ${formattedTopic} in production?`, a: `Powering high-performance web backends, database engines, and operating system kernels.` },
                { q: `Why is ${formattedTopic} taught in computer science curricula?`, a: `Because it builds analytical reasoning and fundamental system comprehension.` },
                { q: `What is the difference between theoretical and practical ${formattedTopic}?`, a: `Theoretical covers math proofs; practical deals with hardware bottlenecks and memory cache.` },
                { q: `How do you debug issues in ${formattedTopic}?`, a: `By tracing execution state line-by-line and inspecting memory allocation.` },
                { q: `What security considerations apply to ${formattedTopic}?`, a: `Input sanitization, boundary checks, and memory protection against exploits.` },
                { q: `What is the future evolution of ${formattedTopic}?`, a: `Automation through modern frameworks and distributed cloud integration.` }
            ];
        }

        const selectedCards = [];
        for (let i = 0; i < count; i++) {
            selectedCards.push(topicCards[i % topicCards.length]);
        }
        return JSON.stringify(selectedCards);
    }

    // 2. Feynman Evaluation Request
    if (query.includes('feynman') || systemInstruction.includes('Feynman')) {
        let topic = "Concept";
        let exp = "";
        const topicMatch = promptText.match(/Topic:\s*"([^"]+)"/i);
        if (topicMatch) topic = topicMatch[1];
        const expMatch = promptText.match(/Explanation:\s*"([^"]+)"/i);
        if (expMatch) exp = expMatch[1].trim();

        const cleanExp = exp.toLowerCase();
        const isTrivial = exp.length < 15 || cleanExp === "hi" || cleanExp === "test" || cleanExp === "array" || cleanExp === "ok";

        if (isTrivial) {
            return `**Feynman Evaluation for "${topic}":**

📊 **Simplicity Score:** 1.5 / 10 (Incomplete Explanation)

🔍 **Explanation Review:**
Your explanation: *"<sup>${exp || 'None'}</sup>"* is too brief! Typing short words like *"hi"* or *"test"* does not explain how **${topic}** works.

🎯 **Missing Core Concepts:**
- Define what **${topic}** is in clear, plain English.
- Explain its physical memory layout or core operational mechanism.
- Describe why someone would use **${topic}** instead of alternative structures.

💡 **Suggested Next Step:**
Write 2-3 sentences explaining **${topic}** as if teaching a classmate who has never seen it before!`;
        }

        let score = 8.5;
        let detectedJargon = [];

        if (cleanExp.includes('contiguous') || cleanExp.includes('o(1)') || cleanExp.includes('cache') || cleanExp.includes('index')) {
            score = 9.2;
            if (cleanExp.includes('contiguous')) detectedJargon.push('contiguous');
            if (cleanExp.includes('o(1)')) detectedJargon.push('O(1) time complexity');
            if (cleanExp.includes('cache')) detectedJargon.push('locality of reference / cache');
        }

        return `**Feynman Evaluation for "${topic}":**

📊 **Simplicity Score:** ${score} / 10

🔍 **Explanation Review:**
Your explanation: *"<sup>${exp}</sup>"* demonstrates solid active comprehension!

🎯 **Jargon & Clarity Assessment:**
${detectedJargon.length > 0 ? `- **Technical Jargon Detected:** ${detectedJargon.map(j => `\`${j}\``).join(', ')}. Try substituting these with simpler everyday terms.` : '- Great job avoiding overly dense jargon!'}
- **Strengths:** Clear description of core functionality.
- **To Improve:** Explicitly mention edge cases (e.g. out-of-bounds access or insertion overhead).

💡 **Suggested Real-World Analogy:**
Imagine **${topic}** as a row of numbered mailboxes side-by-side: knowing the box number (index) lets you open it instantly!`;
    }

    // 3. Summarizer Request
    if (query.includes('summarize') || systemInstruction.includes('summarizer')) {
        const textMatch = promptText.match(/Text:\s*([\s\S]+)$/i);
        const sourceText = textMatch ? textMatch[1].trim() : promptText;

        const isArrayData = sourceText.toLowerCase().includes('array') || sourceText.toLowerCase().includes('contiguous');

        if (query.includes('key_takeaways') || query.includes('bullets')) {
            if (isArrayData) {
                return `**Key Takeaways (Bullets):**

📚 **Primary Definition:** An array is a linear data structure storing items/references at contiguous physical memory locations.
⚡ **Random Access \`O(1)\`:** Direct index access takes constant time using base address math.
🚀 **Cache Friendliness:** Contiguous memory layout maximizes CPU spatial locality of reference.
🏗️ **Building Block:** Used to implement Stacks, Queues, Deques, Graphs, and Hash Tables.
⚠️ **Limitations:** Inefficient for middle insertions, middle deletions, or searching unsorted data.`;
            }

            const lines = sourceText.split('\n').filter(l => l.trim().length > 10);
            return `**Key Takeaways (Bullets):**\n\n` + lines.slice(0, 5).map(l => `› **Core Point:** ${l.trim()}`).join('\n\n');
        }

        if (query.includes('executive')) {
            if (isArrayData) {
                return `**Executive Summary:**

An array provides a foundational contiguous memory layout enabling constant time **\`O(1)\` random access** and optimal **CPU cache performance** via spatial locality. While serving as the core building block for advanced data structures (Stacks, Queues, Hash Tables), arrays carry operational performance penalties for middle insertions and deletions due to element shifting.

🎯 **Core Business & Engineering Takeaways:**
1. Use arrays when index-based read performance and memory cache efficiency are paramount.
2. Avoid fixed arrays when frequent middle insertions/deletions or dynamic resizing are required.
3. Distinguish between primitive value arrays (contiguous values) and reference arrays (contiguous pointers).`;
            }

            return `**Executive Summary:**\n\n${sourceText.substring(0, 300)}...\n\n🎯 **Key Takeaway:** Master the core principles by breaking down technical concepts into structured blocks.`;
        }

        if (query.includes('mindmap') || query.includes('outline')) {
            if (isArrayData) {
                return `**Mind-Map Hierarchical Outline:**

# 📚 Array Data Structure
├── 📍 Memory Layout
│   ├── Contiguous Memory Locations
│   ├── Primitive Arrays: Direct Values (C/C++, Java Primitives)
│   └── Non-Primitive Arrays: Reference Pointers (Python, JS, Java Objects)
├── ⚡ Key Advantages
│   ├── Random Access: O(1) Time via Base Address
│   └── Cache Friendliness: Spatial Locality of Reference
├── 🏗️ Dependent Data Structures
│   ├── Stacks & Queues
│   ├── Deques & Graphs
│   └── Hash Tables
└── ⚠️ Operational Constraints
    ├── Slow Middle Insertions & Deletions
    └── Slow Unsorted Search O(N)`;
            }

            return `**Mind-Map Hierarchical Outline:**\n\n# 📚 Topic Overview\n├── 📌 Key Principles\n│   └── ${sourceText.substring(0, 80)}...\n└── ⚡ Applications\n    └── Core Execution Workflow`;
        }

        if (query.includes('quiz') || query.includes('recall')) {
            if (isArrayData) {
                return `**Active Recall Quiz Questions:**

**Q1:** What is the time complexity of random element access in an array and why?
> **Answer:** \`O(1)\` constant time, because the memory address is calculated directly via Base Address + (Index × Element Size).

**Q2:** How does physical memory storage differ between Primitive and Non-Primitive arrays?
> **Answer:** Primitive arrays store actual values contiguously; Non-Primitive arrays store memory reference pointers contiguously.

**Q3:** Why do arrays offer superior cache friendliness compared to linked lists?
> **Answer:** Contiguous memory layout takes advantage of CPU spatial locality of reference when prefetching RAM blocks into CPU cache.

**Q4:** Which higher-level data structures rely on arrays as their underlying container?
> **Answer:** Stacks, Queues, Deques, Graphs (Adjacency Matrices), and Hash Tables.

**Q5:** In what scenario is an array considered an inefficient choice?
> **Answer:** When performing frequent insertions or deletions in the middle, or searching through unsorted data.`;
            }

            return `**Active Recall Quiz Questions:**\n\n**Q1:** What is the primary concept described in the text?\n> **Answer:** ${sourceText.substring(0, 100)}...\n\n**Q2:** How can you apply this concept in practice?\n> **Answer:** By testing your understanding using Active Recall and Spaced Repetition.`;
        }
    }

    // 4. Conversational Greetings & Academic Knowledge Engine
    const normalizedQuery = query.toLowerCase().replace(/[\?\!\.\,]/g, '').trim();
    const strippedQuery = normalizedQuery.replace(/^(what is a|what is an|what is|explain a|explain an|explain|tell me about|define a|define an|define)\s+/i, '').trim();

    // Conversational Greetings
    if (normalizedQuery === 'hi' || normalizedQuery === 'hello' || normalizedQuery === 'hey' || normalizedQuery === 'greetings' || normalizedQuery.includes('who are you')) {
        return `👋 **Hello! I'm THINKR Core.**
        
I'm your AI cognitive study assistant! I can help you with:
- 🧠 **Computer Science & Academic Definitions** (Arrays, Linked Lists, DBMS, OS, Algorithms)
- 🎴 **Active Recall Flashcards & Practice Test Questions**
- 📅 **Spaced Repetition Study Schedules (SuperMemo SM-2)**
- ✍️ **Feynman Technique Explanations**

What topic would you like to master today? Type any concept like *"Linked List"*, *"DBMS"*, or *"Array"*!`;
    }

    if (normalizedQuery.includes('thank') || normalizedQuery.includes('thanks')) {
        return `😊 **You're very welcome!** Keep up the great focus! Let me know whenever you need another active recall drill or academic breakdown. 🚀`;
    }

    // Linked List / LL
    if (strippedQuery === 'll' || strippedQuery === 'linked list' || normalizedQuery.includes('linked list') || normalizedQuery.includes('singly linked list') || normalizedQuery.includes('doubly linked list')) {
        return `**What is a Linked List?**

📚 **Definition:** A linear data structure where elements (nodes) are stored non-contiguously in memory, each containing data and a pointer/reference to the next node.

🎯 **Key Properties & Operations:**
- **Dynamic Size:** Expands and shrinks easily at runtime without memory reallocation.
- **Node Insertion/Deletion \`O(1)\`:** Fast when pointer to target location is known (no array shifting required).
- **Sequential Access \`O(N)\`:** Must traverse nodes sequentially from Head to Tail (no random \`O(1)\` indexing).

⚡ **Common Variations:**
1. **Singly Linked List:** Node $\rightarrow$ Next
2. **Doubly Linked List:** Prev $\leftarrow$ Node $\rightarrow$ Next
3. **Circular Linked List:** Tail $\rightarrow$ Head

💡 **Study Recommendation:** Practice reversing a linked list in-place and detecting cycles using Floyd's Tortoise and Hare algorithm!`;
    }

    // Stack & Queue
    if (strippedQuery === 'stack' || strippedQuery === 'queue' || normalizedQuery.includes('stack') || normalizedQuery.includes('queue')) {
        return `**What are Stacks and Queues?**

📚 **Definitions:**
- **Stack (LIFO - Last In, First Out):** Data structure where elements are added (pushed) and removed (popped) from the top (e.g., Undo history, Function call stack).
- **Queue (FIFO - First In, First Out):** Data structure where elements enter at the rear (enqueue) and leave at the front (dequeue) (e.g., CPU job scheduling, printer queues).

🎯 **Time Complexities:**
- Push / Pop / Enqueue / Dequeue: \`O(1)\`
- Search / Lookup: \`O(N)\`

💡 **Study Recommendation:** Implement a Stack using two Queues and a Queue using two Stacks!`;
    }

    // Tree / BST
    if (strippedQuery === 'tree' || strippedQuery === 'binary tree' || strippedQuery === 'bst' || normalizedQuery.includes('tree')) {
        return `**What is a Binary Search Tree (BST)?**

📚 **Definition:** A hierarchical node-based data structure where each node has at most two children, and the left child is strictly smaller than the parent node, while the right child is larger.

🎯 **Key Properties:**
- **Search / Insert / Delete:** Average \`O(log N)\`, Worst \`O(N)\` for unbalanced trees.
- **In-order Traversal:** Visits nodes in sorted ascending order.

💡 **Study Recommendation:** Master Self-Balancing Trees (AVL, Red-Black Trees) to maintain \`O(log N)\` guarantees!`;
    }

    // Graph
    if (strippedQuery === 'graph' || normalizedQuery.includes('graph') || normalizedQuery.includes('bfs') || normalizedQuery.includes('dfs')) {
        return `**What is a Graph?**

📚 **Definition:** A non-linear data structure consisting of a set of Vertices (nodes) connected by Edges (relationships).

🎯 **Key Traversals:**
- **Breadth-First Search (BFS):** Level-by-level traversal using a Queue (\`O(V + E)\`).
- **Depth-First Search (DFS):** Explores path deeply using a Stack/Recursion (\`O(V + E)\`).

💡 **Study Recommendation:** Practice Dijkstra's shortest path algorithm and Topological Sorting!`;
    }

    // Hash Table / Hash Map
    if (strippedQuery === 'hash table' || strippedQuery === 'hash map' || normalizedQuery.includes('hash') || normalizedQuery.includes('dictionary')) {
        return `**What is a Hash Table / Hash Map?**

📚 **Definition:** A data structure mapping key-value pairs using a Hash Function to compute an index into an array of buckets.

🎯 **Key Properties:**
- **Average Lookup/Insert/Delete:** \`O(1)\`
- **Collision Resolution:** Chaining (Linked Lists) or Open Addressing (Linear Probing).

💡 **Study Recommendation:** Learn how HashMap capacity load factors (0.75) trigger array resizing!`;
    }

    // DBMS
    if (normalizedQuery.includes('dbms') || normalizedQuery.includes('database management') || normalizedQuery.includes('database')) {
        return `**What is a Database Management System (DBMS)?**

📚 **Definition:** Software system designed to store, manage, query, and retrieve structured data securely (e.g., PostgreSQL, MySQL, Oracle, MongoDB).

🎯 **Core Pillars & Functions:**
- **ACID Properties:** Guarantees **Atomicity, Consistency, Isolation, and Durability** for critical transactions.
- **Query Processing:** Executes SQL queries optimized using B-Trees and indexing structures.
- **Concurrency Control:** Prevents data corruption when thousands of users read/write simultaneously.
- **Data Independence:** Separates application code from physical storage disk structures.

⚡ **Key Types:**
1. **Relational (RDBMS):** Tables, rows, foreign key constraints (PostgreSQL, MySQL).
2. **NoSQL (Non-Relational):** Document stores (MongoDB), Key-Value (Redis), Columnar (Cassandra), Graph (Neo4j).

💡 **Study Recommendation:** Practice writing DDL/DML queries and master B+ Tree indexing!`;
    }

    // Operating System
    if (normalizedQuery.includes('operating system') || normalizedQuery.includes('os') || normalizedQuery.includes('process') || normalizedQuery.includes('thread')) {
        return `**What is an Operating System (OS)?**

📚 **Definition:** System software that acts as an interface between computer hardware and user applications, managing CPU, RAM, disk storage, and peripheral devices.

🎯 **Core OS Subsystems:**
- **Process Management:** CPU scheduling (Round Robin, Priority, Shortest Job First), context switching, and inter-process communication (IPC).
- **Memory Management:** Virtual memory address mapping, paging, segmentation, and page fault handling.
- **Storage & File System:** Managing block storage, inodes, directory trees, and write-ahead logging.
- **Security & Privilege:** Isolating User Mode (ring 3) from Kernel Mode (ring 0).

💡 **Study Recommendation:** Practice drawing process state transition diagrams and solving Coffman deadlock conditions!`;
    }

    // Array
    if (normalizedQuery.includes('array')) {
        return `**What is an Array?**

📚 **Definition:** A linear data structure storing items or reference pointers at contiguous physical memory locations.

🎯 **Key Properties:**
- **Random Access \`O(1)\`:** Calculates memory address instantly via \`Base Address + (Index × Size)\`.
- **Cache Friendliness:** Maximizes spatial locality of reference when prefetching data into CPU cache lines.
- **Memory Storage:** Primitive arrays store raw values contiguously; Non-Primitive arrays store contiguous reference pointers.

💡 **Study Recommendation:** Implement two-pointer array algorithms (reversing, merging, sliding window) from scratch!`;
    }

    // Study Principles
    if (normalizedQuery.includes('feynman') || normalizedQuery.includes('active recall') || normalizedQuery.includes('spaced repetition') || normalizedQuery.includes('study')) {
        return `**THINKR Cognitive Learning Principles:**

🧠 **1. Active Recall:** Test your brain by recalling facts from memory rather than passively re-reading text.
✍️ **2. Feynman Technique:** Explain complex concepts in simple, everyday language as if teaching a beginner.
📅 **3. Spaced Repetition:** Review topics at expanding time intervals (1d, 3d, 7d, 14d, 30d) to lock information into long-term memory.

💡 **Pro Tip:** Use the tools on the **Tools Suite** page to generate custom flashcards and test your recall daily!`;
    }

    // Physics
    if (normalizedQuery.includes('physics') || normalizedQuery.includes('gravity') || normalizedQuery.includes('quantum') || normalizedQuery.includes('mechanics') || normalizedQuery.includes('thermodynamics')) {
        return `**What is Physics?**

📚 **Definition:** The fundamental branch of science concerned with nature, matter, energy, space, time, and the underlying laws governing the physical universe.

🎯 **Core Pillars of Physics:**
- **Classical Mechanics:** Newton's Laws of Motion, gravity, momentum, and orbital dynamics ($F = ma$).
- **Electromagnetism:** Maxwell's Equations, electric fields, magnetic forces, and optics ($E = mc^2$).
- **Thermodynamics:** Heat transfer, entropy, kinetic energy of particles, and energy conservation.
- **Quantum Mechanics & Relativity:** Quantum state probabilities, wave-particle duality, and spacetime curvature.

⚡ **Key Application:** Foundation for all engineering disciplines, aerospace, semiconductor electronics, and cosmology.

💡 **Study Recommendation:** Practice deriving fundamental force equations and solving conservation of energy & momentum problems!`;
    }

    // Chemistry
    if (normalizedQuery.includes('chemistry') || normalizedQuery.includes('molecule') || normalizedQuery.includes('atom') || normalizedQuery.includes('reaction') || normalizedQuery.includes('periodic table')) {
        return `**What is Chemistry?**

📚 **Definition:** The branch of science that studies the composition, structure, properties, and chemical reactions of matter at atomic and molecular scales.

🎯 **Core Subdisciplines:**
- **Organic Chemistry:** Carbon-based compounds, functional groups, and synthesis pathways.
- **Inorganic Chemistry:** Metals, ionic crystals, coordination complexes, and minerals.
- **Physical Chemistry:** Chemical kinetics, quantum chemistry, and reaction thermodynamics.
- **Analytical Chemistry:** Spectroscopy, chromatography, and quantitative molecular analysis.

💡 **Study Recommendation:** Master periodic trends (electronegativity, atomic radius) and practice balancing stoichiometry equations!`;
    }

    // Biology
    if (normalizedQuery.includes('biology') || normalizedQuery.includes('cell') || normalizedQuery.includes('dna') || normalizedQuery.includes('genetics') || normalizedQuery.includes('evolution')) {
        return `**What is Biology?**

📚 **Definition:** The scientific study of life, living organisms, cellular mechanisms, genetics, ecosystems, and evolutionary processes.

🎯 **Core Biological Foundations:**
- **Cellular & Molecular Biology:** Organelles, ATP energy production, and Central Dogma ($\text{DNA} \rightarrow \text{RNA} \rightarrow \text{Protein}$).
- **Genetics & Genomics:** Mendelian inheritance, gene regulation, CRISPR, and DNA replication.
- **Physiology & Anatomy:** Organ systems, homeostasis, and neural transmission.
- **Ecology & Evolution:** Natural selection, species adaptation, and biomes.

💡 **Study Recommendation:** Practice drawing cell organelles, signal transduction pathways, and DNA transcription diagrams!`;
    }

    // History
    if (normalizedQuery.includes('history') || normalizedQuery.includes('historical') || normalizedQuery.includes('war') || normalizedQuery.includes('revolution') || normalizedQuery.includes('civilization')) {
        return `**What is History?**

📚 **Definition:** The systematic study and interpretation of past human events, civilizations, social movements, technologies, and cultural evolutions.

🎯 **Core Historical Epochs:**
- **Ancient & Classical Civilizations:** Mesopotamia, Ancient Egypt, Indus Valley, Ancient Greece, and the Roman Empire.
- **Medieval Period:** Feudalism, Silk Road trade networks, the Islamic Golden Age, and Renaissance origins.
- **Modern Era:** The Industrial Revolution, World Wars, Decolonization, and the Global Information Age.

💡 **Study Recommendation:** Analyze cause-and-and-effect relationships and compare primary historical sources!`;
    }

    // Philosophy
    if (normalizedQuery.includes('philosophy') || normalizedQuery.includes('ethics') || normalizedQuery.includes('logic') || normalizedQuery.includes('existential') || normalizedQuery.includes('epistemology')) {
        return `**What is Philosophy?**

📚 **Definition:** The fundamental investigation of existence, knowledge, ethics, reason, mind, language, and moral value.

🎯 **Core Branches of Philosophy:**
- **Epistemology:** The nature, origin, and boundaries of human knowledge (*"What is truth?"*).
- **Ethics & Morality:** Utilitarianism, Deontology (Kantian ethics), and Virtue Ethics (*"What is right?"*).
- **Metaphysics:** The nature of reality, time, causality, and consciousness.
- **Logic & Epistemology:** Valid deductive reasoning, fallacies, and formal symbolic proofs.

💡 **Study Recommendation:** Practice constructing sound logical arguments and analyzing ethical thought experiments (like the Trolley Problem)!`;
    }

    // Psychology
    if (normalizedQuery.includes('psychology') || normalizedQuery.includes('cognition') || normalizedQuery.includes('behavior') || normalizedQuery.includes('brain') || normalizedQuery.includes('neuroscience')) {
        return `**What is Psychology?**

📚 **Definition:** The scientific study of the human mind, cognitive processes, emotions, perception, memory, and behavioral patterns.

🎯 **Core Fields of Psychology:**
- **Cognitive Psychology:** Memory encoding/retrieval, attention, problem-solving, and decision biases.
- **Neuroscience & Biological:** Synaptic transmission, neurotransmitters (Dopamine, Serotonin), and brain lobes.
- **Developmental Psychology:** Piagetian cognitive growth stages and human life-span progression.
- **Behavioral & Clinical:** Operant conditioning, habit loops, and psychological therapies (CBT).

💡 **Study Recommendation:** Relate psychological memory principles (Spaced Repetition, Testing Effect) to your own study habits!`;
    }

    // Psychology & AI: Hallucination / Delusion / Illusion
    if (normalizedQuery.includes('hallucination') || normalizedQuery.includes('delusion') || normalizedQuery.includes('illusion')) {
        return `**What is a Hallucination?**

📚 **Definition:** A perception occurring in the absence of any external physical stimulus, possessing the vividness and quality of a real perception across vision, sound, touch, taste, or smell.

🧠 **Two Core Contexts:**
- **1. Neuroscience & Psychiatry:** Sensory perceptions generated by internal neural activity without external physical input (caused by sleep deprivation, high fever, schizophrenia, or sensory isolation).
- **2. Artificial Intelligence (LLMs):** A phenomenon where a generative AI language model produces output that sounds confident, authoritative, and plausible, but is factually incorrect, ungrounded in source training data, or completely fabricated.

⚡ **Key Distinctions:**
- **Hallucination:** Perceiving something that is not present at all.
- **Illusion:** Misinterpreting a real existing sensory stimulus (e.g. mistaking a rope for a snake in low light).
- **Delusion:** A persistent, false belief held with strong conviction despite unshakeable contradictory evidence.

💡 **Study Recommendation:** Differentiate between auditory hallucinations in neurology and RAG (Retrieval-Augmented Generation) grounding techniques used to stop AI hallucinations!`;
    }

    // Mathematics, Calculus & Formulas
    if (normalizedQuery.includes('calculus') || normalizedQuery.includes('derivative') || normalizedQuery.includes('integral') || normalizedQuery.includes('formula') || normalizedQuery.includes('math')) {
        return `**What is Calculus & Core Mathematical Formulas?**

📚 **Definition:** The mathematical branch studying continuous change, rates of change (differential calculus), and accumulation of quantities (integral calculus).

🎯 **Fundamental Formulas:**
- **Derivative (Instantaneous Rate of Change):** $f'(x) = \lim_{h \to 0} \frac{f(x+h) - f(x)}{h}$
- **Power Rule:** $\frac{d}{dx}[x^n] = n x^{n-1}$
- **Fundamental Theorem of Calculus:** $\int_{a}^{b} f(x) dx = F(b) - F(a)$
- **Pythagorean Theorem:** $a^2 + b^2 = c^2$
- **Quadratic Formula:** $x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$
- **Einstein's Mass-Energy Equivalence:** $E = mc^2$

💡 **Study Recommendation:** Practice calculating derivatives using Product Rule, Quotient Rule, and Chain Rule!`;
    }

    // Programming, Code & Time Complexity Reference
    if (normalizedQuery.includes('code') || normalizedQuery.includes('python') || normalizedQuery.includes('java') || normalizedQuery.includes('javascript') || normalizedQuery.includes('time complexity') || normalizedQuery.includes('complexity')) {
        return `**Programming & Algorithm Time Complexities Reference:**

📚 **Big-O Complexity Hierarchy (Fastest to Slowest):**
- **$O(1)$ Constant:** Array Indexing, HashMap Lookup, Stack Push/Pop.
- **$O(\log N)$ Logarithmic:** Binary Search ($O(\log N)$ on sorted data).
- **$O(N)$ Linear:** Single Loop, Unsorted Search, Linked List Traversal.
- **$O(N \log N)$ Linearithmic:** Merge Sort, Quick Sort (average), Heap Sort.
- **$O(N^2)$ Quadratic:** Nested Loops, Bubble Sort, Selection Sort.
- **$O(2^N)$ Exponential:** Recursive Fibonacci without Memoization.

💻 **Python Code Example (Binary Search $O(\log N)$):**
\`\`\`python
def binary_search(arr, target):
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1
\`\`\`

💡 **Study Recommendation:** Practice analyzing Big-O time and space complexity for recursive algorithms!`;
    }

    // Dynamic General Knowledge & Full Dictionary Engine
    const cleanTopic = strippedQuery || promptText;
    const formattedTopicName = cleanTopic.charAt(0).toUpperCase() + cleanTopic.slice(1);

    return `**Dictionary & Encyclopedic Overview of "${formattedTopicName}":**

📚 **Definition & Core Meaning:**
**${formattedTopicName}** represents a key concept, term, or operational domain requiring structural comprehension and analytical study.

🎯 **Key Foundational Pillars:**
1. **Primary Meaning:** Understand the definition, origins, and core characteristics of **${formattedTopicName}**.
2. **Structural Components:** Analyze the underlying mechanics, operational boundaries, and theoretical frameworks.
3. **Real-World Application:** Connect the principles of **${formattedTopicName}** to practical scenarios, scientific research, and exam problems.

⚡ **Active Recall Drill Question:**
*Can you define "${formattedTopicName}" and explain its primary purpose or significance in your own words without looking at notes?*

💡 **Pro Tip:** Type specific terms like *"What is Hallucination?"*, *"What is Physics?"*, *"What is Calculus?"*, or *"What is Time Complexity?"* for instant breakdowns, or set your Gemini API Key in Settings for live custom AI answers on any query!`;



}

// --- Global Gemini API Caller ---
window.callGeminiAPI = async function(userPrompt, systemInstruction = "") {
    const apiKey = (localStorage.getItem('thinkr_gemini_api_key') || '').trim();

    if (apiKey && apiKey.startsWith('AIzaSy')) {
        const modelsToTry = [
            'gemini-1.5-flash',
            'gemini-1.5-pro',
            'gemini-2.0-flash-exp',
            'gemini-2.5-flash'
        ];
        for (const modelName of modelsToTry) {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
            const bodyObj = {
                contents: [{ parts: [{ text: userPrompt }] }]
            };
            if (systemInstruction) {
                bodyObj.system_instruction = { parts: [{ text: systemInstruction }] };
            }
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(bodyObj)
                });
                if (response.ok) {
                    const data = await response.json();
                    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
                    if (text && text.trim().length > 0) {
                        return text;
                    }
                }
            } catch (e) {
                console.warn(`Model ${modelName} fetch error:`, e);
            }
        }
    }

    return generateSmartLocalResponse(userPrompt, systemInstruction);
};


// --- Web Audio Ambient Sound Synthesizer (12 High-Fidelity Soundscapes) ---
window.ambientAudio = {
    ctx: null,
    nodes: [],
    activeSound: null,

    initCtx: async function() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.ctx.state === 'suspended') {
            await this.ctx.resume();
        }
    },

    stopAll: function() {
        this.nodes.forEach(node => {
            try {
                if (node.stop) node.stop();
                if (node.disconnect) node.disconnect();
            } catch(e) {}
        });
        this.nodes = [];
        this.activeSound = null;
        this.updateUI();
    },

    updateUI: function() {
        const soundBtns = document.querySelectorAll('.sound-btn');
        soundBtns.forEach(btn => {
            btn.classList.remove('active-sound');
            btn.style.borderColor = 'rgba(255, 255, 255, 0.12)';
            btn.style.background = 'rgba(0, 0, 0, 0.35)';
        });
        if (this.activeSound) {
            const activeBtn = document.querySelector(`.sound-btn[data-sound="${this.activeSound}"]`);
            if (activeBtn) {
                activeBtn.classList.add('active-sound');
                activeBtn.style.borderColor = '#818cf8';
                activeBtn.style.background = 'rgba(99, 102, 241, 0.35)';
            }
        }
    },

    // Helper: Create White Noise Source
    createWhiteNoiseSource: function() {
        const bufferSize = this.ctx.sampleRate * 2;
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = noiseBuffer;
        noise.loop = true;
        return noise;
    },

    // Helper: Create Pink Noise Source
    createPinkNoiseSource: function() {
        const bufferSize = this.ctx.sampleRate * 2;
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.96900 * b2 + white * 0.1538520;
            b3 = 0.86650 * b3 + white * 0.3104856;
            b4 = 0.55000 * b4 + white * 0.5329522;
            b5 = -0.7616 * b5 - white * 0.0168980;
            output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.15;
            b6 = white * 0.115926;
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = noiseBuffer;
        noise.loop = true;
        return noise;
    },

    // Helper: Create Brownian Noise Source
    createBrownNoiseSource: function() {
        const bufferSize = this.ctx.sampleRate * 2;
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let lastOutput = 0.0;
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            output[i] = (lastOutput + (0.02 * white)) / 1.02;
            lastOutput = output[i];
            output[i] *= 2.5;
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = noiseBuffer;
        noise.loop = true;
        return noise;
    },

    // 1. Gentle Rain
    playRain: async function() {
        await this.initCtx();
        this.stopAll();
        const noise = this.createPinkNoiseSource();
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 1000;

        const gain = this.ctx.createGain();
        gain.gain.value = 0.35;

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        noise.start();
        this.nodes.push(noise, filter, gain);
        this.activeSound = 'rain';
        this.updateUI();
    },

    // 2. 10Hz Alpha Waves
    playBinaural: async function() {
        await this.initCtx();
        this.stopAll();
        const oscLeft = this.ctx.createOscillator();
        const oscRight = this.ctx.createOscillator();
        const gainLeft = this.ctx.createGain();
        const gainRight = this.ctx.createGain();
        const merger = this.ctx.createChannelMerger(2);

        oscLeft.frequency.value = 200;
        oscRight.frequency.value = 210;
        gainLeft.gain.value = 0.25;
        gainRight.gain.value = 0.25;

        oscLeft.connect(gainLeft);
        gainLeft.connect(merger, 0, 0);
        oscRight.connect(gainRight);
        gainRight.connect(merger, 0, 1);

        const mainGain = this.ctx.createGain();
        mainGain.gain.value = 0.3;
        merger.connect(mainGain);
        mainGain.connect(this.ctx.destination);

        oscLeft.start();
        oscRight.start();
        this.nodes.push(oscLeft, oscRight, gainLeft, gainRight, merger, mainGain);
        this.activeSound = 'binaural';
        this.updateUI();
    },

    // 3. 40Hz Gamma Focus
    playGamma: async function() {
        await this.initCtx();
        this.stopAll();
        const oscLeft = this.ctx.createOscillator();
        const oscRight = this.ctx.createOscillator();
        const gainLeft = this.ctx.createGain();
        const gainRight = this.ctx.createGain();
        const merger = this.ctx.createChannelMerger(2);

        oscLeft.frequency.value = 400;
        oscRight.frequency.value = 440;
        gainLeft.gain.value = 0.22;
        gainRight.gain.value = 0.22;

        oscLeft.connect(gainLeft);
        gainLeft.connect(merger, 0, 0);
        oscRight.connect(gainRight);
        gainRight.connect(merger, 0, 1);

        const mainGain = this.ctx.createGain();
        mainGain.gain.value = 0.28;
        merger.connect(mainGain);
        mainGain.connect(this.ctx.destination);

        oscLeft.start();
        oscRight.start();
        this.nodes.push(oscLeft, oscRight, gainLeft, gainRight, merger, mainGain);
        this.activeSound = 'gamma';
        this.updateUI();
    },

    // 4. Deep Ocean (with Dynamic Wave LFO Swell)
    playOcean: async function() {
        await this.initCtx();
        this.stopAll();
        const noise = this.createBrownNoiseSource();

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 450;

        const swellGain = this.ctx.createGain();
        swellGain.gain.value = 0.3;

        // LFO for wave modulation
        const lfo = this.ctx.createOscillator();
        lfo.frequency.value = 0.1; // 10s wave cycle
        const lfoGain = this.ctx.createGain();
        lfoGain.gain.value = 0.15;

        lfo.connect(lfoGain);
        lfoGain.connect(swellGain.gain);

        noise.connect(filter);
        filter.connect(swellGain);
        swellGain.connect(this.ctx.destination);

        noise.start();
        lfo.start();
        this.nodes.push(noise, filter, swellGain, lfo, lfoGain);
        this.activeSound = 'ocean';
        this.updateUI();
    },

    // 5. Nature & Forest Birds (Wind Rustle + FM Bird Chirps)
    playForest: async function() {
        await this.initCtx();
        this.stopAll();

        // 1. Wind in Leaves (Pink Noise + Bandpass Filter)
        const windNoise = this.createPinkNoiseSource();
        const windFilter = this.ctx.createBiquadFilter();
        windFilter.type = 'bandpass';
        windFilter.frequency.value = 1200;
        windFilter.Q.value = 1.5;

        const windGain = this.ctx.createGain();
        windGain.gain.value = 0.25;

        windNoise.connect(windFilter);
        windFilter.connect(windGain);
        windGain.connect(this.ctx.destination);
        windNoise.start();
        this.nodes.push(windNoise, windFilter, windGain);

        // 2. Procedural Bird Chirp Generator
        const birdOsc = this.ctx.createOscillator();
        birdOsc.type = 'sine';
        birdOsc.frequency.value = 2400;

        const birdGain = this.ctx.createGain();
        birdGain.gain.value = 0.08;

        // Modulate frequency for birds chirping
        const chirpLfo = this.ctx.createOscillator();
        chirpLfo.frequency.value = 4.5; // Chirp rhythm
        const chirpLfoGain = this.ctx.createGain();
        chirpLfoGain.gain.value = 400;

        chirpLfo.connect(chirpLfoGain);
        chirpLfoGain.connect(birdOsc.frequency);

        birdOsc.connect(birdGain);
        birdGain.connect(this.ctx.destination);

        birdOsc.start();
        chirpLfo.start();
        this.nodes.push(birdOsc, birdGain, chirpLfo, chirpLfoGain);

        this.activeSound = 'forest';
        this.updateUI();
    },

    // 6. Warm Cafe (Dual Bandpass Chatter Resonance)
    playCafe: async function() {
        await this.initCtx();
        this.stopAll();
        const noise = this.createWhiteNoiseSource();

        const filter1 = this.ctx.createBiquadFilter();
        filter1.type = 'bandpass';
        filter1.frequency.value = 600;
        filter1.Q.value = 2.0;

        const filter2 = this.ctx.createBiquadFilter();
        filter2.type = 'bandpass';
        filter2.frequency.value = 1500;
        filter2.Q.value = 2.5;

        const gain = this.ctx.createGain();
        gain.gain.value = 0.3;

        noise.connect(filter1);
        noise.connect(filter2);
        filter1.connect(gain);
        filter2.connect(gain);
        gain.connect(this.ctx.destination);

        noise.start();
        this.nodes.push(noise, filter1, filter2, gain);
        this.activeSound = 'cafe';
        this.updateUI();
    },

    // 7. White Noise
    playWhiteNoise: async function() {
        await this.initCtx();
        this.stopAll();
        const noise = this.createWhiteNoiseSource();
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 4000;

        const gain = this.ctx.createGain();
        gain.gain.value = 0.25;

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        noise.start();
        this.nodes.push(noise, filter, gain);
        this.activeSound = 'white';
        this.updateUI();
    },

    // 8. Pink Noise
    playPinkNoise: async function() {
        await this.initCtx();
        this.stopAll();
        const noise = this.createPinkNoiseSource();

        const gain = this.ctx.createGain();
        gain.gain.value = 0.30;

        noise.connect(gain);
        gain.connect(this.ctx.destination);

        noise.start();
        this.nodes.push(noise, gain);
        this.activeSound = 'pink';
        this.updateUI();
    },

    // 9. Brown Noise
    playBrownNoise: async function() {
        await this.initCtx();
        this.stopAll();
        const noise = this.createBrownNoiseSource();

        const gain = this.ctx.createGain();
        gain.gain.value = 0.35;

        noise.connect(gain);
        gain.connect(this.ctx.destination);

        noise.start();
        this.nodes.push(noise, gain);
        this.activeSound = 'brown';
        this.updateUI();
    },

    // 10. Cosmic Space Drone (Sub-bass Harmonics + LFO Filter Sweep)
    playCosmicDrone: async function() {
        await this.initCtx();
        this.stopAll();

        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();

        osc1.type = 'sine';
        osc1.frequency.value = 55.0; // A1 sub-bass
        osc2.type = 'triangle';
        osc2.frequency.value = 110.0; // A2 octave

        filter.type = 'lowpass';
        filter.frequency.value = 250;

        // Filter LFO modulation
        const lfo = this.ctx.createOscillator();
        lfo.frequency.value = 0.05; // slow sweep
        const lfoGain = this.ctx.createGain();
        lfoGain.gain.value = 100;

        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);

        const gain = this.ctx.createGain();
        gain.gain.value = 0.30;

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc1.start();
        osc2.start();
        lfo.start();
        this.nodes.push(osc1, osc2, filter, lfo, lfoGain, gain);
        this.activeSound = 'cosmic';
        this.updateUI();
    },

    // 11. Fireplace Crackle (Brown Noise + Crackle Impulses)
    playFireplace: async function() {
        await this.initCtx();
        this.stopAll();

        // Warm base rumble
        const noise = this.createBrownNoiseSource();
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 650;

        const mainGain = this.ctx.createGain();
        mainGain.gain.value = 0.30;

        noise.connect(filter);
        filter.connect(mainGain);
        mainGain.connect(this.ctx.destination);
        noise.start();
        this.nodes.push(noise, filter, mainGain);

        // Crackle impulses
        const bufferSize = this.ctx.sampleRate * 2;
        const crackleBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = crackleBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = 0;
            if (Math.random() < 0.002) {
                output[i] = (Math.random() * 2 - 1) * 0.8;
            }
        }
        const crackleSource = this.ctx.createBufferSource();
        crackleSource.buffer = crackleBuffer;
        crackleSource.loop = true;

        const crackleGain = this.ctx.createGain();
        crackleGain.gain.value = 0.25;

        crackleSource.connect(crackleGain);
        crackleGain.connect(this.ctx.destination);
        crackleSource.start();
        this.nodes.push(crackleSource, crackleGain);

        this.activeSound = 'fire';
        this.updateUI();
    },

    // 12. Mountain Wind (Sweeping LFO Bandpass Filter)
    playWind: async function() {
        await this.initCtx();
        this.stopAll();

        const noise = this.createPinkNoiseSource();
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 500;
        filter.Q.value = 2.0;

        // Dynamic wind gust modulation LFO
        const lfo = this.ctx.createOscillator();
        lfo.frequency.value = 0.15; // Gust frequency
        const lfoGain = this.ctx.createGain();
        lfoGain.gain.value = 350;

        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);

        const gain = this.ctx.createGain();
        gain.gain.value = 0.30;

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        noise.start();
        lfo.start();
        this.nodes.push(noise, filter, lfo, lfoGain, gain);
        this.activeSound = 'wind';
        this.updateUI();
    }
};


// --- DOM Event Listeners ---
document.addEventListener('DOMContentLoaded', () => {
    // Scroll Reveal Intersection Observer
    try {
        const observerOptions = { threshold: 0.08, rootMargin: '0px 0px -40px 0px' };
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active-reveal');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.home-section-card, .home-card, .card, .tool-card, .stat-pill').forEach(el => {
            el.classList.add('reveal-up');
            revealObserver.observe(el);
        });
    } catch(e) {}

    // Settings Modal & API Key Handler
    const settingsBtn = document.getElementById('settingsBtn');

    const settingsModal = document.getElementById('settingsModal');
    const closeSettingsBtn = document.getElementById('closeSettingsBtn');
    const saveSettingsBtn = document.getElementById('saveSettingsBtn');
    const geminiApiKeyInput = document.getElementById('geminiApiKeyInput');
    const apiKeyStatus = document.getElementById('apiKeyStatus');

    function updateApiKeyStatusUI() {
        const storedKey = (localStorage.getItem('thinkr_gemini_api_key') || '').trim();
        if (apiKeyStatus) {
            if (storedKey && storedKey.startsWith('AIzaSy')) {
                apiKeyStatus.textContent = '🟢 Live Gemini AI Active';
                apiKeyStatus.style.color = '#10b981';
            } else {
                apiKeyStatus.textContent = '🟡 Local Cognitive Engine Active';
                apiKeyStatus.style.color = '#f59e0b';
            }
        }
        if (geminiApiKeyInput) {
            geminiApiKeyInput.value = storedKey;
        }
    }

    if (settingsBtn && settingsModal) {
        settingsBtn.addEventListener('click', () => {
            updateApiKeyStatusUI();
            settingsModal.classList.add('active');
        });
    }

    if (closeSettingsBtn && settingsModal) {
        closeSettingsBtn.addEventListener('click', () => {
            settingsModal.classList.remove('active');
        });
    }

    if (saveSettingsBtn && geminiApiKeyInput) {
        saveSettingsBtn.addEventListener('click', () => {
            const keyVal = geminiApiKeyInput.value.trim();
            if (keyVal) {
                localStorage.setItem('thinkr_gemini_api_key', keyVal);
                alert('✅ Gemini API Key saved and active!');
            } else {
                localStorage.removeItem('thinkr_gemini_api_key');
                alert('Cleared custom key. System will use local engine.');
            }
            updateApiKeyStatusUI();
            if (settingsModal) settingsModal.classList.remove('active');
        });
    }

    updateApiKeyStatusUI();

    // --- Dynamic 6 Font Style Engine ---
    function initFontEngine() {
        const savedFont = localStorage.getItem('thinkr_heading_font') || 'font-jakarta';
        const allFontClasses = ['font-jakarta', 'font-lexend', 'font-space', 'font-outfit', 'font-sora', 'font-syne'];
        
        allFontClasses.forEach(c => document.body.classList.remove(c));
        document.body.classList.add(savedFont);

        const fontSelect = document.getElementById('fontStyleSelect');
        if (fontSelect) {
            fontSelect.value = savedFont;
            fontSelect.addEventListener('change', (e) => {
                const newFont = e.target.value;
                allFontClasses.forEach(c => document.body.classList.remove(c));
                document.body.classList.add(newFont);
                localStorage.setItem('thinkr_heading_font', newFont);
            });
        }
    }
    initFontEngine();

    // Landing Page Button Handler
    const getStartedBtn = document.getElementById('getStartedBtn');
    const orb = document.querySelector('.orb');

    if (getStartedBtn && orb) {
        getStartedBtn.addEventListener('mouseenter', () => {
            orb.style.filter = 'blur(60px)';
            orb.style.transform = 'scale(1.1)';
            orb.style.opacity = '0.8';
        });

        getStartedBtn.addEventListener('mouseleave', () => {
            orb.style.filter = 'blur(40px)';
            orb.style.transform = 'scale(1)';
            orb.style.opacity = '0.6';
        });

        getStartedBtn.addEventListener('click', () => {
            getStartedBtn.textContent = 'Opening Workspace...';
            getStartedBtn.style.opacity = '0.8';
            setTimeout(() => {
                getStartedBtn.textContent = 'Start Planning';
                getStartedBtn.style.opacity = '1';
                window.location.href = 'study-plan.html';
            }, 400);
        });
    }

    // Active Nav Link Highlighting
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('nav a').forEach(link => {
        const href = link.getAttribute('href');
        if (href && (currentPage === href || (currentPage === '' && href === 'index.html'))) {
            link.classList.add('nav-active');
        }
    });

    // 1. Streak Tracking Engine
    function initStreakEngine() {
        const todayStr = new Date().toISOString().split('T')[0];
        let streakData = JSON.parse(localStorage.getItem('thinkr_user_streak') || '{"count": 1, "lastDate": ""}');

        if (!streakData.lastDate) {
            streakData.count = 1;
            streakData.lastDate = todayStr;
        } else if (streakData.lastDate !== todayStr) {
            const last = new Date(streakData.lastDate);
            const today = new Date(todayStr);
            const diffDays = Math.round((today - last) / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                streakData.count += 1;
            } else if (diffDays > 1) {
                streakData.count = 1;
            }
            streakData.lastDate = todayStr;
        }

        localStorage.setItem('thinkr_user_streak', JSON.stringify(streakData));

        document.querySelectorAll('.streak-badge-display').forEach(el => {
            el.textContent = `🔥 ${streakData.count} Day${streakData.count > 1 ? 's' : ''}`;
        });
    }
    initStreakEngine();

    // 2. Theme Toggle System (Dark / Light)
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (themeToggleBtn) {
        const savedTheme = localStorage.getItem('thinkr_theme') || 'dark';
        if (savedTheme === 'light') {
            document.body.classList.add('light-theme');
            themeToggleBtn.textContent = '☀️ Light';
        } else {
            themeToggleBtn.textContent = '🌙 Dark';
        }

        themeToggleBtn.addEventListener('click', () => {
            if (document.body.classList.contains('light-theme')) {
                document.body.classList.remove('light-theme');
                themeToggleBtn.textContent = '🌙 Dark';
                localStorage.setItem('thinkr_theme', 'dark');
            } else {
                document.body.classList.add('light-theme');
                themeToggleBtn.textContent = '☀️ Light';
                localStorage.setItem('thinkr_theme', 'light');
            }
        });
    }

    // 3. Auto-Fill URL Parameters on study-plan.html
    if (window.location.pathname.includes('study-plan.html')) {
        const params = new URLSearchParams(window.location.search);
        const subjectParam = params.get('subject');
        const strategyParam = params.get('strategy');
        const techniqueParam = params.get('technique');

        if (subjectParam) {
            const subjectsInput = document.getElementById('subjects');
            if (subjectsInput) subjectsInput.value = subjectParam;
        }
        if (strategyParam) {
            const focusSelect = document.getElementById('focusInterval');
            if (focusSelect) focusSelect.value = strategyParam;
        }
        if (techniqueParam) {
            const techSelect = document.getElementById('learningTechnique');
            if (techSelect) techSelect.value = techniqueParam;
        }

        if (subjectParam) {
            setTimeout(() => {
                const generateBtn = document.getElementById('generateBtn');
                if (generateBtn) generateBtn.click();
            }, 300);
        }
    }


    // THINKR Core Agent Chat Logic
    const agentTrigger = document.getElementById('agentTrigger');
    const agentChatWindow = document.getElementById('agentChatWindow');
    const closeAgentBtn = document.getElementById('closeAgentBtn');
    const agentMessages = document.getElementById('agentMessages');
    const agentInput = document.getElementById('agentInput');
    const agentSendBtn = document.getElementById('agentSendBtn');

    if (agentTrigger && agentChatWindow) {
        let hasOpened = false;

        agentTrigger.addEventListener('click', () => {
            agentChatWindow.classList.add('active');
            agentTrigger.style.display = 'none';

            if (!hasOpened) {
                hasOpened = true;
                simulateAgentGreeting();
            }
        });

        if (closeAgentBtn) {
            closeAgentBtn.addEventListener('click', () => {
                agentChatWindow.classList.remove('active');
                setTimeout(() => {
                    agentTrigger.style.display = 'flex';
                }, 300);
            });
        }

        function addMessage(html, isUser = false) {
            const msgDiv = document.createElement('div');
            msgDiv.className = 'agent-message';
            if (isUser) {
                msgDiv.style.background = 'rgba(99, 102, 241, 0.2)';
                msgDiv.style.border = '1px solid rgba(99, 102, 241, 0.4)';
                msgDiv.style.alignSelf = 'flex-end';
                msgDiv.style.borderTopLeftRadius = '12px';
                msgDiv.style.borderTopRightRadius = '2px';
                msgDiv.textContent = html;
            } else {
                msgDiv.innerHTML = html;
            }
            if (agentMessages) {
                agentMessages.appendChild(msgDiv);
                agentMessages.scrollTop = agentMessages.scrollHeight;
            }
        }

        function showTyping() {
            const typingDiv = document.createElement('div');
            typingDiv.className = 'agent-message agent-typing';
            typingDiv.id = 'agentTyping';
            typingDiv.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
            if (agentMessages) {
                agentMessages.appendChild(typingDiv);
                agentMessages.scrollTop = agentMessages.scrollHeight;
            }
        }

        function removeTyping() {
            const typingDiv = document.getElementById('agentTyping');
            if (typingDiv) typingDiv.remove();
        }

        function simulateAgentGreeting() {
            showTyping();
            setTimeout(() => {
                removeTyping();
                const pagePath = window.location.pathname;
                let greeting = "Hello! I'm THINKR Core. I'm your AI cognitive study assistant.";
                if (pagePath.includes('study-plan')) {
                    greeting = "Welcome to the Study Workspace! I can help you build study schedules, structure Pomodoro sessions, or break down complex subjects.";
                } else if (pagePath.includes('tools')) {
                    greeting = "Welcome to the Cognitive Tools Suite! Use the Summarizer, Flashcards, Feynman Assistant, or Ambient Audio soundscapes to boost your learning!";
                }
                addMessage(greeting);
            }, 400);
        }

        async function handleSend() {
            if (!agentInput || !agentSendBtn) return;
            const text = agentInput.value.trim();
            if (!text) return;

            addMessage(text, true);
            agentInput.value = '';
            showTyping();

            try {
                const aiResponse = await window.callGeminiAPI(
                    text,
                    "You are THINKR Core, an elite AI cognitive study assistant. Answer the user's question directly."
                );
                removeTyping();
                addMessage(window.renderMarkdown(aiResponse));
            } catch (error) {
                removeTyping();
                const fallbackResp = generateSmartLocalResponse(text);
                addMessage(window.renderMarkdown(fallbackResp));
            }
        }

        if (agentSendBtn && agentInput) {
            agentSendBtn.addEventListener('click', handleSend);
            agentInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') handleSend();
            });
        }
    }
});
