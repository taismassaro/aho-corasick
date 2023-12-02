# Aho-Corasick

An example implementation of the algorithm to search for patterns in a string.

```ts
const patterns = ["cat", "car", "cargo", "dog", "door"];

const trie = buildTrie(patterns);

searchTrie(trie, "The cat chased the dog through the door with its car");

// [ "cat", "dog", "car" ]
```
