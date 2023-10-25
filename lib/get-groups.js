'use strict';

const updateGroupd = (groups, type, design, mod, pct) => {
  groups.type[type] = groups.type[type] || 0;
  groups.type[type] += pct;

  groups.design[design] = groups.design[design] || 0;
  groups.design[design] += pct;

  groups.module[mod] = groups.module[mod] || 0;
  groups.module[mod] += pct;
};

const m1 = /__PROF__([a-zA-Z_0-9]+)__l?([0-9]+)\(/;
const m2 = /(VL_[A-Z0-9_]+|_?vl_[a-zA-Z0-9_]+|Verilated)/;

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
    const prof_match = vfunc.match(m1);
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
    } else if (vfunc.match(m2)) {
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

module.exports = getGroups;
