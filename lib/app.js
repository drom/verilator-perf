'use strict';

const onml = require('onml');

const dataPat = /^\s*([0-9.]+)\s+[0-9.]+\s+([0-9.]+)\s+([0-9.]+)\s+[^a-zA-Z_]*([a-zA-Z_].*)$/;
const modPat = /(.*)::eval(_step)?\(/;

const getFuncs = lines =>
  lines.reduce((res, line) => {
    const m = line.match(dataPat);
    if (m === null) {
      return res;
    }
    const pct   = Number(m[1]);
    const sec   = Number(m[2]);
    const calls = Number(m[3]);
    const func = m[4];

    const desc = res[func] = res[func] || {pct: 0, sec: 0, calls: 0};
    desc.pct += pct;
    desc.sec += sec;
    desc.calls += calls;
    return res;
  }, {});

const getMods = funcs => {
  const verilatedMods = {};
  Object.keys(funcs).map(funcName => {
    const m = funcName.match(modPat);
    if (m) {
      const prefix = m[1];
      verilatedMods[prefix] = new RegExp('^' + prefix);
    }
  });
  return verilatedMods;
};


const updateGroupd = (groups, type, design, mod, pct) => {
  groups.type[type] = groups.type[type] || 0;
  groups.type[type] += pct;

  groups.design[design] = groups.design[design] || 0;
  groups.design[design] += pct;

  groups.module[mod] = groups.module[mod] || 0;
  groups.module[mod] += pct;
};

const getGroups = (funcs, verilated_mods) => {
  const vfuncs = {};

  const groups = {
    type: {},
    design: {},
    module: {}
  };

  Object.keys(funcs).map(func => {
    const pct = funcs[func].pct;
    let vfunc = func;
    const funcarg = func.replace(/^.*\(/, '');
    let design;
    Object.keys(verilated_mods).some(vde => {
      if (func.match(verilated_mods[vde]) || funcarg.match(verilated_mods[vde])) {
        design = vde;
        return true;
      }
    });
    let vdesign = '-';
    const prof_match = vfunc.match(/__PROF__([a-zA-Z_0-9]+)__l?([0-9]+)\(/);
    if (design && prof_match) {
      const linefunc = prof_match[1];
      const lineno = Number(prof_match[2]);
      vfunc = `VBlock    ${linefunc}:${lineno}`;
      vdesign = design;
      updateGroupd(groups, 'Verilog Blocks under ' + design, design, linefunc, pct);
    } else if (design) {
      vfunc = 'VCommon   ' + func;
      vdesign = design;
      updateGroupd(groups, 'Common code under ' + design, design, design + ' common code', pct);
    } else if (vfunc.match(/(VL_[A-Z0-9_]+|_?vl_[a-zA-Z0-9_]+|Verilated)/)) {
      vfunc = 'VLib      ' + func;
      updateGroupd(groups, 'VLib', 'VLib', 'VLib', pct);
    } else if (vfunc.match(/^_mcount_private/)) {
      vfunc = 'Prof      ' + func;
      updateGroupd(groups, 'Prof', 'Prof', 'Prof', pct);
    } else {
      vfunc = 'C++       ' + func;
      updateGroupd(groups, 'C++', 'C++', 'C++', pct);
    }

    if (vfuncs[vfunc] === undefined) {
      vfuncs[vfunc] = funcs[func];
      vfuncs[vfunc].design = vdesign;
    } else {
      vfuncs[vfunc].pct += funcs[func].pct;
      vfuncs[vfunc].calls += funcs[func].calls;
      vfuncs[vfunc].sec += funcs[func].sec;
    }
  });
  return groups;
};

const parseLog = text => {
  const lines = text.split('\n');
  const funcs = getFuncs(lines);
  const mods = getMods(funcs);
  const groups = getGroups(funcs, mods);
  // console.log(mods);
  return groups;
};

const makeTable = groups => {
  const modo = groups.module;
  const res = ['table'];
  const arr = Object.keys(modo).map(key => ({name: key, val: modo[key]}));
  arr.sort((a, b) => b.val - a.val);
  const w = 300;
  const scale = w / arr[0].val;
  arr.map(e => {
    if (e.val > 0) {
      res.push(['tr',
        ['td', onml.gen.svg(w, 14).concat([
          ['rect', {
            class: 'bar',
            width: e.val * scale,
            height: 14
          }],
          ['text', {x: 2, y: 12}, e.val]
        ])],
        ['td', e.name]
      ]);
    }
  });
  return onml.stringify(['body', res]);
};

const getLog = async url => {
  const resp = await fetch(url);
  if (resp.status === 200) {
    const text = await resp.text();
    return parseLog(text);
  }
};

global.perf = async div => {
  if (typeof div === 'string') {
    div = document.getElementById(div);
  }
  const urlSearchParams = new URLSearchParams(window.location.search);
  for (const [key, value] of urlSearchParams) {
    if (key === 'local') {
      const dat = await getLog(value);
      div.innerHTML = makeTable(dat);
    }
  }
};

/* eslint-env browser */
