interface TrieNode {
  children: Map<string, TrieNode>;
  isEndOfWord: boolean;
  failureLink?: TrieNode;
  // stores which patterns end at this node for easier retrieval
  output: string[];
}

function createTrie(): TrieNode {
  return {
    children: new Map(),
    isEndOfWord: false,
    output: [],
  };
}

function insertPattern(root: TrieNode, pattern: string) {
  // create a copy so that we can traverse down the tree
  let rootNode = root;

  // iterate over each character of a pattern
  for (const char of pattern) {
    // if the current character is not a child of the current node
    if (!rootNode.children.has(char)) {
      // create a new node and add it as a child of the current node
      rootNode.children.set(char, createTrie());
    }

    // point to the next node in the trie before the following iteration
    rootNode = rootNode.children.get(char)!;
  }

  // if the pattern already exists in the trie, but it didn't end
  // at the same character, mark this point as the end of a word
  if (!rootNode.isEndOfWord) {
    rootNode.isEndOfWord = true;
    rootNode.output.push(pattern);
  }
}

function addFailureLinks(root: TrieNode) {
  const queue: TrieNode[] = [];

  // initialize failure links for first level nodes
  for (const child of root.children.values()) {
    child.failureLink = root;
    queue.push(child);
  }

  // breadth-first search to add failure links
  while (queue.length > 0) {
    const currentNode = queue.shift();

    if (!currentNode) {
      break;
    }

    for (const [char, child] of currentNode.children) {
      queue.push(child);

      let failureNode = currentNode.failureLink;

      // if the current child is not a child of the node's failure link
      // then continue traversing to the next failure link
      while (failureNode !== root && !failureNode?.children.has(char)) {
        failureNode = failureNode?.failureLink;
      }

      if (failureNode.children.has(char)) {
        child.failureLink = failureNode.children.get(char);
        child.output = child.failureLink?.output
          ? [...child.output, ...child.failureLink.output]
          : child.output;
      } else {
        child.failureLink = root;
      }
    }
  }
}

function buildTrie(patterns: string[]) {
  const root = createTrie();

  for (const pattern of patterns) {
    insertPattern(root, pattern);
  }

  addFailureLinks(root);

  return root;
}

function searchTrie(root: TrieNode, text: string) {
  const matches: string[] = [];

  let currentNode = root;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    // if the current node's children do not contain the current character
    // we're looking for, jump to the failure link
    while (currentNode !== root && !currentNode.children.has(char)) {
      if (currentNode.failureLink) {
        currentNode = currentNode.failureLink;
      }
    }

    if (currentNode.children.has(char)) {
      currentNode = currentNode.children.get(char)!;

      if (currentNode.output.length > 0) {
        matches.push(...currentNode.output);
      }
    }
  }

  return matches;
}

const patterns = ["cat", "car", "cargo", "dog", "door"];
console.time("buildTrie");
const trie = buildTrie(patterns);
console.timeEnd("buildTrie");

console.time("search");
console.log(
  searchTrie(trie, "The cat chased the dog through the door with its car")
);
console.timeEnd("search");

const patternsBig = [
  "apple",
  "book",
  "cat",
  "car",
  "dog",
  "elephant",
  "flower",
  "guitar",
  "house",
  "ice cream",
  "jacket",
  "key",
  "lamp",
  "moon",
  "notebook",
  "orange",
  "pencil",
  "quilt",
  "rose",
  "shoe",
  "tree",
  "umbrella",
  "vase",
  "watch",
  "xylophone",
  "yogurt",
  "zebra",
  "ball",
  "cloud",
  "door",
  "fish",
  "globe",
  "hat",
  "island",
  "juice",
  "kite",
  "lemon",
  "map",
  "nest",
  "ocean",
  "pear",
  "queen",
  "robot",
  "sock",
  "teapot",
  "unicorn",
  "volcano",
  "waterfall",
  "xylograph",
  "yacht",
  "zipper",
];
console.time("buildNewTrie");
const trieBig = buildTrie(patternsBig);
console.timeEnd("buildNewTrie");

console.time("newSearch");
console.log(
  searchTrie(trieBig, "The cat chased the dog through the door with its car")
);
console.timeEnd("newSearch");
