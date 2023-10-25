'use strict';

/*
 %         the percentage of the total running time of the
time       program used by this function.

cumulative a running sum of the number of seconds accounted
 seconds   for by this function and those listed above it.

 self      the number of seconds accounted for by this
seconds    function alone.  This is the major sort for this
           listing.

calls      the number of times this function was invoked, if
           this function is profiled, else blank.

 self      the average number of milliseconds spent in this
ms/call    function per call, if this function is profiled,
	   else blank.

 total     the average number of milliseconds spent in this
ms/call    function and its descendents per call, if this
	   function is profiled, else blank.

name       the name of the function.  This is the minor sort
           for this listing. The index shows the location of
	   the function in the gprof listing. If the index is
	   in parenthesis it shows where it would appear in
	   the gprof listing if it were to be printed.
*/

const startLine = /time   seconds   seconds    calls  ms\/call  ms\/call  name/;

const stopLine = /%         the percentage of the total running time of the/;

//  %   cumulative   self              self     total
// time   seconds   seconds    calls  ms/call  ms/call  name
//  0.92      0.16     0.01   604758     0.00     0.00  VL_SHIFTRS_WWI(int, int, int, unsigned int*, unsigned int const*, unsigned int)

//                       %      cumulative     self                    self         total
//                      time      seconds     seconds      calls      ms/call      ms/call       name
const dataPat1 = /^\s*(?<pct>[0-9.]+)\s+(?<cumSec>[0-9.]+)\s+(?<selfSec>[0-9.]+)\s+(?<calls>[0-9]+)\s+(?<selfMsPcall>[0-9.]+)\s+(?<totalMsPcall>[0-9.]+)\s+(?<func>[a-zA-Z_].*)$/;

//  %   cumulative   self              self     total
// time   seconds   seconds    calls  ms/call  ms/call  name
//  3.67      0.09     0.04                             sc_dt::sc_unsigned::set(int, bool)

//                       %      cumulative     self
//                      time      seconds     seconds        name
const dataPat2 = /^\s*(?<pct>[0-9.]+)\s+(?<cumSec>[0-9.]+)\s+(?<selfSec>[0-9.]+)\s+(?<func>[a-zA-Z_].*)$/;


const getFuncs = obj => {
  const { lines } = obj;
  const ilen = Math.min(lines.length, 500000);
  const res = {};
  let totalSelfSec = 0;
  let mLines = 0;

  let i = 0;
  for (i = 0; i < ilen; i++) {
    if (lines[i].match(startLine)) {
      break;
    }
  }
  for (; i < ilen; i++) {
    const line = lines[i];
    if (line.match(stopLine)) {
      break;
    }
    {
      const m = line.match(dataPat1);
      if (m) {
        const g = m.groups;
        const pct   = Number(g.pct);
        const selfSec  = Number(g.selfSec);
        const calls = Number(g.calls);
        const func = g.func;

        const desc = res[func] = res[func] || {pct: 0, selfSec: 0, calls: 0};
        desc.pct += pct;
        desc.selfSec += selfSec;
        desc.calls += calls;
        totalSelfSec += selfSec;
        mLines += 1;
        continue;
      }
    }
    {
      const m = line.match(dataPat2);
      if (m) {
        const g = m.groups;
        const pct   = Number(g.pct);
        const selfSec  = Number(g.selfSec);
        const func = g.func;

        const desc = res[func] = res[func] || {pct: 0, selfSec: 0};
        desc.pct += pct;
        desc.selfSec += selfSec;
        totalSelfSec += selfSec;
        mLines += 1;
      }
    }
  }
  console.log(totalSelfSec, mLines);
  obj.totalSelfSec = totalSelfSec;
  obj.funcs = res;
};

module.exports = getFuncs;
