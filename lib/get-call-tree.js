'use strict';

const rec = (node, callGraph, time) => {
  node.name = node.self.name;
  const selfTime = Number(node.self.self);
  const childrenTime = Number(node.self.children);
  node.duration = selfTime + childrenTime;
  if (node.duration < 0.001) {
    return 0;
  }
  node.start = time;
  node.children = [];
  (node.to || []).map(entry => {
    const childIndex = (Number(entry.ref) - 1);
    const child = callGraph[childIndex];
    const childTime = rec(child, callGraph, time + selfTime);
    if (childTime) {
      time += childTime;
      node.children.push(child);
    }
  });
  return node.duration;
};

const getCallTree = callGraph => {

  const callGrapho = {};
  callGraph.map(block => {
    const { index } = block;
    callGrapho[index] = block;
  });

  const root = callGraph[0];
  rec(root, callGraph, 0);
  console.log(root);

  return [root];
  // return [{
  //   name: 'foo',
  //   start: 300,
  //   duration: 200,
  //   // type: 'task',
  //   children: [{
  //     name: 'bar',
  //     start: 310,
  //     duration: 50,
  //     // type: 'sub-task'
  //   }]
  // }];
};

module.exports = getCallTree;
