'use strict';

// const getCallGraph = require('./get-call-graph.js');
// const getCallTree = require('./get-call-tree.js');
const getFuncs = require('./get-funcs.js');
const getMods = require('./get-mods.js');
const getGroups = require('./get-groups.js');
const funcTable = require('./func-table.js');
const getCategories = require('./get-categories.js');
const appendTreeMap = require('./append-tree-map.js');

const appendTable = (div, dat) => {
  const leaf = document.createElement('div');
  leaf.innerHTML = funcTable(dat.groups);
  div.append(leaf);
};

const parseLog = text => {
  const res = {};
  res.lines = text.split('\n');
  getFuncs(res);
  // const callGraph = getCallGraph(lines);
  // const tree = getCallTree(callGraph);
  res.mods = getMods(res.funcs);
  res.groups = getGroups(res.funcs, res.mods);
  getCategories(res);
  // console.log(mods);
  // return groups;
  return res;
};

global.perf = async div => {
  if (typeof div === 'string') {
    div = document.getElementById(div);
  }
  const urlSearchParams = new URLSearchParams(window.location.search);
  for (const [key, value] of urlSearchParams) {
    if (key === 'local') {
      const resp = await fetch(value);
      if (resp.status === 200) {
        const text = await resp.text();
        const dat = await parseLog(text);
        console.log(dat);
        // appendFlameChart(div, dat);
        appendTreeMap(div, dat);
        appendTable(div, dat);
      }
    }
  }
};

/* eslint-env browser */
