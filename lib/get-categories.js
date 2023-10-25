'use strict';

const update = (object, path, value) => {
  // console.log(object, path, value);
  if (path.length === 0) {
    object.self = object.self || [];
    object.self.push(value);
  } else {
    const name = path[0];
    const kido = object.kido = object.kido || {};
    const kid = kido[name] = kido[name] || {name};
    update(kid, path.slice(1), value);
  }
};

const growup = (node, root) => {
  const { kido, self } = node;
  if (self) {
    node.value = self.reduce((res, o) => res + o.func.selfSec, 0) / root.totalSelfSec * 100;
  }
  if (kido) {
    const children = node.children = [];
    for (const kidName of Object.keys(kido)) {
      const kid = kido[kidName];
      children.push(kid);
      growup(kid, root);
    }
  }

};

const getCategories = (obj, categories) => {
  const { funcs } = obj;
  const cato = {name: 'root'};
  const funcNames = Object.keys(funcs);
  for (const funcName of funcNames) {
    for (const o of categories) {
      const m = funcName.match(o.m);
      if (m) {
        update(cato, o.path, {funcName, func: funcs[funcName]});
        // cato[o.name] = cato[o.name] || {};
        // cato[o.name][funcName] = funcs[funcName];
        break;
      }
    }
  }
  growup(cato, obj);
  // const res = Object.keys(cato)
  //   .map(catName => {
  //     const funco = cato[catName];
  //     const keys = Object.keys(funco);
  //     const selfSec = keys.reduce((res, key) => res + funco[key].selfSec, 0);
  //     return {
  //       name: catName,
  //       length: keys.length,
  //       pct: selfSec / obj.totalSelfSec * 100
  //     };
  //   })
  //   .sort((a, b) => a.pct < b.pct);

  console.log(cato);
  obj.cato = cato;
};

module.exports = getCategories;
