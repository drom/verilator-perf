'use strict';

/*
 This table describes the call tree of the program, and was sorted by
 the total amount of time spent in each function and its children.

 Each entry in this table consists of several lines.  The line with the
 index number at the left hand margin lists the current function.
 The lines above it list the functions that called this function,
 and the lines below it list the functions this one called.
 This line lists:
     index	A unique number given to each element of the table.
		Index numbers are sorted numerically.
		The index number is printed next to every function name so
		it is easier to look up where the function is in the table.

     % time	This is the percentage of the `total' time that was spent
		in this function and its children.  Note that due to
		different viewpoints, functions excluded by options, etc,
		these numbers will NOT add up to 100%.

     self	This is the total amount of time spent in this function.

     children	This is the total amount of time propagated into this
		function by its children.

     called	This is the number of times the function was called.
		If the function called itself recursively, the number
		only includes non-recursive calls, and is followed by
		a `+' and the number of recursive calls.

     name	The name of the current function.  The index number is
		printed after it.  If the function is a member of a
		cycle, the cycle number is printed between the
		function's name and the index number.


 For the function's parents, the fields have the following meanings:

     self	This is the amount of time that was propagated directly
		from the function into this parent.

     children	This is the amount of time that was propagated from
		the function's children into this parent.

     called	This is the number of times this parent called the
		function `/' the total number of times the function
		was called.  Recursive calls to the function are not
		included in the number after the `/'.

     name	This is the name of the parent.  The parent's index
		number is printed after it.  If the parent is a
		member of a cycle, the cycle number is printed between
		the name and the index number.

 If the parents of the function cannot be determined, the word
 `<spontaneous>' is printed in the `name' field, and all the other
 fields are blank.

 For the function's children, the fields have the following meanings:

     self	This is the amount of time that was propagated directly
		from the child into the function.

     children	This is the amount of time that was propagated from the
		child's children to the function.

     called	This is the number of times the function called
		this child `/' the total number of times the child
		was called.  Recursive calls by the child are not
		listed in the number after the `/'.

     name	This is the name of the child.  The child's index
		number is printed after it.  If the child is a
		member of a cycle, the cycle number is printed
		between the name and the index number.

 If there are any cycles (circles) in the call graph, there is an
 entry for the cycle-as-a-whole.  This entry shows who called the
 cycle (as parents) and the members of the cycle (as children.)
 The `+' recursive calls entry shows the number of function calls that
 were internal to the cycle, and the calls entry for each member shows,
 for that member, how many times it was called from other members of
 the cycle.

*/
const callGraphStart = 'index % time    self  children    called     name';
const callGraphSeparator = '-----------------------------------------------';

// index % time    self  children    called     name
//                 0.00    0.94    5095/5095        sc_core::sc_method_process::run_process() [2]
//                 0.00    0.00       4/225         non-virtual thunk to sc_core::sc_signal_t<sc_dt::sc_bv<1024>, (sc_core::sc_writer_policy)0>::write(sc_dt::sc_bv<1024> const&) [53172]
//                                    4             axi::pe::axi_target_pe_b::operation_resp(tlm::tlm_generic_payload&, unsigned int) <cycle 2> [51989]
const callGraphChild1 = /^\s+(?<self>[0-9.]+)\s+(?<children>[0-9.]+)\s+(?<called>[0-9]+([/+][0-9]+)?)\s+(?<name>\w.+)\s+\[(?<ref>\d+)\]$/;
const callGraphChild2 =                                          /^\s+(?<called>[0-9]+)\s+(?<name>\w.+)\s+\[(?<ref>\d+)\]$/;

// [1]     86.2    0.00    0.94    5095         Vx390::eval_step() [1]
// [2]     86.2    0.00    0.94                 sc_core::sc_method_process::run_process() [2]
// [71557   0.0    0.00    0.00       1         non-virtual thunk to sc_core::sc_signal_t<sc_dt::sc_uint<32>, (sc_core::sc_writer_policy)0>::update() [71557]
const callGraphSelf = /^\s*\[(?<index>\d+)\]?\s+(?<time>[0-9.]+)\s+(?<self>[0-9.]+)\s+(?<children>[0-9.]+)\s+(?<called>[0-9]+)?\s+(?<name>\w.+)\s+\[(?<ref>\d+)\]$/;

//                                                 <spontaneous>
const callGraphSpontaneous = /^\s+(?<label><spontaneous>)/;

const getCallGraph = lines => {
  const res = [];
  let i = 0;
  while (true) {
    if (lines[i] === callGraphStart) {
      i++;
      break;
    }
    i++;
  }
  // blocks
  for (let j = 0; j < 1e6; j++) {
  // while (true) {
    const block = {from: [], to: []};

    // from
    while (true) {
      const line = lines[i];
      {
        const m = line.match(callGraphSpontaneous); if (m) {
          block.from.push(m.groups);
          i++;
          continue;
        }
      }
      {
        const m = line.match(callGraphChild1); if (m) {
          block.from.push(m.groups);
          i++;
          continue;
        }
      }
      {
        const m = line.match(callGraphChild2); if (m) {
          block.from.push(m.groups);
          i++;
          continue;
        }
      }
      {
        const m = line.match(callGraphSelf); if (m) {
          if (m.groups.index !== m.groups.ref) {
            console.log(m.groups);
          }
          block.name = m.groups.name;
          block.self = m.groups;
          i++;
          break;
        }
      }
      console.log('unexpected line of block from:', line);
    }

    // to
    while (true) {
      const line = lines[i];
      {
        const m = line.match(callGraphChild1); if (m) {
          block.to.push(m.groups);
          i++;
          continue;
        }
      }
      {
        const m = line.match(callGraphChild2); if (m) {
          block.to.push(m.groups);
          i++;
          continue;
        }
      }
      if (line === callGraphSeparator) {
        res.push(block);
        i++;
        break;
      }
      console.log('unexpected line of block to:', line);
    }

    if (lines[i] === '') {
      break;
    }
  }
  return res;
};

module.exports = getCallGraph;
