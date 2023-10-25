'use strict';

const d3 = require('d3/dist/d3.js');
const d3Hierarchy = require('d3-hierarchy/dist/d3-hierarchy.js');

const format = d3.format('.1f');
const color = d3.scaleOrdinal(d3.schemeCategory10);

console.log(d3Hierarchy, d3Hierarchy.treemap);



const appendTreeMap = (div, dat) => {
  const width = document.body.clientWidth;
  const height = document.body.clientHeight / 2;

  const tile =
    // d3.treemapBinary;
    d3.treemapSquarify;

  const treemap = data => d3.treemap()
    .tile(tile)
    .size([width, height])
    .padding(3)
    .round(true)(
      d3.hierarchy(data)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value)
    );

  const root = treemap(dat.cato);

  const svg = d3.create('svg')
    .attr('viewBox', [0, 0, width, height])
    .style('font', '14px sans-serif');

  const leaf = svg.selectAll('g')
    .data(root.leaves())
    .join('g')
    .attr('transform', d => `translate(${d.x0},${d.y0})`);

  leaf.append('title')
    .text(d => `${d.ancestors().reverse().map(d => d.data.name).join('/')}\n${format(d.value)}`);

  leaf.append('rect')
    // .attr('id', d => (d.leafUid = DOM.uid('leaf')).id)
    .attr('fill', d => { while (d.depth > 2) d = d.parent; return color(d.data.name); })
    .attr('fill-opacity', 0.6)
    .attr('width', d => d.x1 - d.x0)
    .attr('height', d => d.y1 - d.y0);

  // leaf.append('clipPath')
  //   .attr('id', d => (d.clipUid = DOM.uid('clip')).id)
  //   .append('use')
  //   .attr('xlink:href', d => d.leafUid.href);

  leaf.append('text')
    .attr('clip-path', d => d.clipUid)
    .selectAll('tspan')
    .data(d => d.data.name.split(/(?=[A-Z][a-z])|\s+/g).concat(format(d.value)))
    .join('tspan')
    .attr('x', 3)
    .attr('y', (d, i, nodes) => `${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`)
    .attr('fill-opacity', (d, i, nodes) => i === nodes.length - 1 ? 0.7 : null)
    .text(d => d);


  div.append(svg.node());
  console.log(svg.node());
};

module.exports = appendTreeMap;

/* eslint-env browser */
