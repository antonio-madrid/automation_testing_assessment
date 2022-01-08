const Sequencer = require('@jest/test-sequencer').default;

/** It sorts tets alphabetically by its path */
class CustomSequencer extends Sequencer {
  sort(tests) {
    const copyTest = Array.from(tests);
    return copyTest.sort((testA, testB) => (testA.path > testB.path ? 1 : -1));
  }
}

module.exports = CustomSequencer;
