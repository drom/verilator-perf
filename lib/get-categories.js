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

const ms = [
  // {name: 'SiFive_TLToAXI4_*', m: /__PROF__SiFive_TLToAXI4_/},

  // p470 / p670

  {m: /__PROF__SiFive_Tile_PL2Cache/,         path: ['SiFive', 'PL2']},

  {m: /__PROF__SiFive_Tile_ROB/,              path: ['SiFive', 'Tile', 'ROB']},
  {m: /__PROF__SiFive_Tile_IssQ/,             path: ['SiFive', 'Tile', 'IssQ*']},
  {m: /__PROF__SiFive_Tile_LsIssQ/,           path: ['SiFive', 'Tile', 'LsIssQ*']},
  {m: /__PROF__SiFive_Tile_LdQ/,              path: ['SiFive', 'Tile', 'LdQ*']},
  {m: /__PROF__SiFive_Tile_MSHR/,             path: ['SiFive', 'Tile', 'MSHR*']},
  {m: /__PROF__SiFive_Tile_RDU/,              path: ['SiFive', 'Tile', 'RDU']},
  {m: /__PROF__SiFive_Tile_LSTPipe/,          path: ['SiFive', 'Tile', 'LSTPipe']},
  {m: /__PROF__SiFive_Tile_CSRFile/,          path: ['SiFive', 'Tile', 'CSRFile']},

  {m: /__PROF__SiFive_Tile_/,                 path: ['SiFive', 'Tile', 'Tile*']},


  {m: /__PROF__SiFive_TLAPLIC/,               path: ['SiFive', 'uncore', 'TLAPLIC']},
  {m: /__PROF__SiFive_TL/,                    path: ['SiFive', 'uncore', 'TL*']},
  {m: /__PROF__SiFive_OrderObliterator/,      path: ['SiFive', 'uncore', 'OrderObliterator']},
  {m: /__PROF__SiFive_/,                      path: ['SiFive', 'uncore', '*']},

  {m: /^axi::/,                               path: ['*', 'sim', 'axi::']},
  // {m: /^scc::/,                               path: ['*', 'sim', 'scc::']},
  {m: /^sc_core::/,                           path: ['*', 'sim', 'sc_core::']},
  {m: /^sc_dt::/,                             path: ['*', 'sim', 'sc_dt::']},
  {m: /___eval__/,                            path: ['*', 'sim', 'V-eval']},
  {m: /^_init/,                               path: ['*', 'sim', 'V-init']},


  {m: /./,                                    path: ['*', '*']},


  /* x280
  {m: /__PROF__SiFive_Mod_4/,                 path: ['SiFive', 'VU', 'AS', 'AS_Mod_4']},
  {m: /__PROF__SiFive_Mod_5/,                 path: ['SiFive', 'VU', 'AS', 'AS_Mod_5']},
  {m: /__PROF__SiFive_Mod_6/,                 path: ['SiFive', 'VU', 'AS', 'AS_Mod_6']},
  {m: /__PROF__SiFive_Mod_7/,                 path: ['SiFive', 'VU', 'AS', 'AS_Mod_7']},
  {m: /__PROF__SiFive_Mod_8/,                 path: ['SiFive', 'VU', 'AS', 'AS_Mod_8']},
  {m: /__PROF__SiFive_VectorALU/,             path: ['SiFive', 'VU', 'AS', 'AS_VectorALU']},
  {m: /__PROF__SiFive_GatherXbar/,            path: ['SiFive', 'VU', 'AS', 'AS_GatherXbar']},
  {m: /__PROF__SiFive_ArithmeticSequencer_/,  path: ['SiFive', 'VU', 'AS', 'AS$']},
  {m: /__PROF__SiFive_LoadSequencer_/,        path: ['SiFive', 'VU', 'LoadSequencer', 'LoadSequencer$']},
  {m: /__PROF__SiFive_StoreSequencer_/,       path: ['SiFive', 'VU', 'StoreSequencer', 'StoreSequencer$']},
  {m: /__PROF__SiFive_VectorRegisterFile_/,   path: ['SiFive', 'VU', 'VRF', 'VRF$']},
  {m: /__PROF__SiFive_VectorHazardDetector_/, path: ['SiFive', 'VU', 'VectorHazardDetector', 'VectorHazardDetector$']},

  {m: /__PROF__SiFive_CCache_MSHR_/,          path: ['SiFive', 'CChache', 'CCache_MSHR']},
  {m: /__PROF__SiFive_CCache_Scheduler_/,     path: ['SiFive', 'CChache', 'CCache_Scheduler']},
  {m: /__PROF__SiFive_CCache_BankedStore_/,   path: ['SiFive', 'CChache', 'CCache_BankedStore']},
  {m: /__PROF__SiFive_CCache_/,               path: ['SiFive', 'CChache', 'CCache_*']},

  {m: /__PROF__SiFive_PL2Cache_MSHREntry_/,   path: ['SiFive', 'PL2Cache', 'PL2Cache_MSHREntry']},
  {m: /__PROF__SiFive_PL2Cache_GlobalArb_/,       path: ['SiFive', 'PL2Cache', 'PL2Cache_GlobalArb']},
  {m: /__PROF__SiFive_PL2Cache_DepMatrix_/,       path: ['SiFive', 'PL2Cache', 'PL2Cache_DepMatrix']},
  {m: /__PROF__SiFive_PL2Cache_WrReqQ_/,          path: ['SiFive', 'PL2Cache', 'PL2Cache_WrReqQ']},
  {m: /__PROF__SiFive_PL2Cache_EvictAddrEntry_/,  path: ['SiFive', 'PL2Cache', 'PL2Cache_EvictAddrEntry']},
  {m: /__PROF__SiFive_PL2Cache_Directory_4_/,     path: ['SiFive', 'PL2Cache', 'PL2Cache_Directory_4']},
  {m: /__PROF__SiFive_PL2Cache_DataStore_/,       path: ['SiFive', 'PL2Cache', 'PL2Cache_DataStore']},
  {m: /__PROF__SiFive_PL2Cache_/,             path: ['SiFive', 'PL2Cache', 'PL2Cache_*']},

  {m: /__PROF__SiFive_DCache/,                path: ['SiFive', 'misc', 'DCache']},
  {m: /__PROF__SiFive_Bullet/,                path: ['SiFive', 'misc', 'Bullet']},
  {m: /__PROF__SiFive_FormMicroOps/,          path: ['SiFive', 'misc', 'FormMicroOps']},
  {m: /__PROF__SiFive_FetchUnit/,             path: ['SiFive', 'misc', 'FetchUnit']},


  {m: /__PROF__SiFive_TLB/,                   path: ['SiFive', 'misc', 'TLB*']},
  {m: /__PROF__SiFive_TL/,                    path: ['SiFive', 'misc', 'TL*']},
  {m: /__PROF__SiFive_AXI4/,                  path: ['SiFive', 'misc', 'AXI4*']},
  {m: /__PROF__SiFive_ram_combMem_/,          path: ['SiFive', 'misc', 'combMem_*']},
  {m: /__PROF__SiFive_Mod_/,                  path: ['SiFive', 'misc', 'Mod_*']},
  {m: /__PROF__SiFive_Queue_/,                path: ['SiFive', 'misc', 'Queue_*']},
  {m: /__PROF__SiFive_OrderObliterator_/,     path: ['SiFive', 'misc', 'SiFive_OrderObliterator']},
  {m: /__PROF__SiFive_/,                      path: ['SiFive', 'misc', 'SiFive_*']},

  {m: /^axi::/,                               path: ['*', 'sim', 'axi::']},
  // {m: /^scc::/,                               path: ['*', 'sim', 'scc::']},
  {m: /^sc_core::/,                           path: ['*', 'sim', 'sc_core::']},
  {m: /^sc_dt::/,                             path: ['*', 'sim', 'sc_dt::']},
  {m: /___eval__/,                            path: ['*', 'sim', 'V-eval']},
  {m: /^_init/,                               path: ['*', 'sim', 'V-init']},


  // {name: 'VL', m: /^VL_\w+/},
  // {name: 'boost::', m: /^boost::/},
  // {name: 'qt', m: /^sc_dt::/},

  {m: /./,                                    path: ['*', '*']},

  // {name: 'Vx390___024root', m: /^Vx390___024root/},
  // {name: 'Vx390', m: /^Vx390/},
  */
];

const getCategories = obj => {
  const { funcs } = obj;
  const cato = {name: 'root'};
  const funcNames = Object.keys(funcs);
  for (const funcName of funcNames) {
    for (const o of ms) {
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
