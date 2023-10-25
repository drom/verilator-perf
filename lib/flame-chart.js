'use strict';

// import FlameChart from 'flame-chart-js';

const FlameChart = require('./flame-chart-js/flame-chart.js').default;

const appendFlameChart = (div, dat) => {
  const canvas = document.createElement('canvas');
  div.append(canvas);
  canvas.width = document.body.clientWidth;
  canvas.height = document.body.clientHeight;
  // console.log(canvas);
  new FlameChart({
    canvas, // mandatory
    data: dat.tree,
    colors: {
      'task': '#FFFFFF',
      'sub-task': '#000000'
    },
    settings: {
      options: {
        // tooltip: () => {
        //   /*...*/ }, // see section "Custom Tooltip" below
        timeUnits: 's'
      }
      // styles: customStyles // see section "Styles" below
    }
  });
};


exports.append = appendFlameChart;

/* eslint-env browser */
