'use strict';

const modPat = /(.*)::eval(_step)?\(/;

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

module.exports = getMods;
