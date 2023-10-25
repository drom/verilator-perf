'use strict';

const onml = require('onml');

const funcTable = groups => {
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


module.exports = funcTable;
