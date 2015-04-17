(function() {
  define([], function() {
    var Path;
    Path = function(init) {
      var areEqualPoints, instructions, plus, point, printInstrunction, push, round, trimZeros, verbosify;
      instructions = init || [];
      push = function(arr, el) {
        var copy;
        copy = arr.slice(0, arr.length);
        copy.push(el);
        return copy;
      };
      areEqualPoints = function(p1, p2) {
        return p1[0] === p2[0] && p1[1] === p2[1];
      };
      trimZeros = function(string, char) {
        var l;
        l = string.length;
        while (string.charAt(l - 1) === '0') {
          l -= 1;
        }
        if (string.charAt(l - 1) === '.') {
          l -= 1;
        }
        return string.substr(0, l);
      };
      round = function(number, digits) {
        var str;
        str = number.toFixed(digits);
        return trimZeros(str);
      };
      printInstrunction = function(arg) {
        var command, numbers, param, params;
        command = arg.command, params = arg.params;
        numbers = (function() {
          var i, len, results;
          results = [];
          for (i = 0, len = params.length; i < len; i++) {
            param = params[i];
            results.push(round(param, 6));
          }
          return results;
        })();
        return command + " " + (numbers.join(' '));
      };
      point = function(arg, arg1) {
        var command, params, prev_x, prev_y;
        command = arg.command, params = arg.params;
        prev_x = arg1[0], prev_y = arg1[1];
        switch (command) {
          case 'M':
            return [params[0], params[1]];
          case 'L':
            return [params[0], params[1]];
          case 'H':
            return [params[0], prev_y];
          case 'V':
            return [prev_x, params[0]];
          case 'Z':
            return null;
          case 'C':
            return [params[4], params[5]];
          case 'S':
            return [params[2], params[3]];
          case 'Q':
            return [params[2], params[3]];
          case 'T':
            return [params[0], params[1]];
          case 'A':
            return [params[5], params[6]];
        }
      };
      verbosify = function(keys, f) {
        return function(a) {
          var args;
          args = typeof a === 'object' ? keys.map(function(k) {
            return a[k];
          }) : arguments;
          return f.apply(null, args);
        };
      };
      plus = function(instruction) {
        return Path(push(instructions, instruction));
      };
      return {
        moveto: verbosify(['x', 'y'], function(x, y) {
          return plus({
            command: 'M',
            params: [x, y]
          });
        }),
        lineto: verbosify(['x', 'y'], function(x, y) {
          return plus({
            command: 'L',
            params: [x, y]
          });
        }),
        hlineto: verbosify(['x'], function(x) {
          return plus({
            command: 'H',
            params: [x]
          });
        }),
        vlineto: verbosify(['y'], function(y) {
          return plus({
            command: 'V',
            params: [y]
          });
        }),
        closepath: function() {
          return plus({
            command: 'Z',
            params: []
          });
        },
        curveto: verbosify(['x1', 'y1', 'x2', 'y2', 'x', 'y'], function(x1, y1, x2, y2, x, y) {
          return plus({
            command: 'C',
            params: [x1, y1, x2, y2, x, y]
          });
        }),
        smoothcurveto: verbosify(['x2', 'y2', 'x', 'y'], function(x2, y2, x, y) {
          return plus({
            command: 'S',
            params: [x2, y2, x, y]
          });
        }),
        qcurveto: verbosify(['x1', 'y1', 'x', 'y'], function(x1, y1, x, y) {
          return plus({
            command: 'Q',
            params: [x1, y1, x, y]
          });
        }),
        smoothqcurveto: verbosify(['x', 'y'], function(x, y) {
          return plus({
            command: 'T',
            params: [x, y]
          });
        }),
        arc: verbosify(['rx', 'ry', 'xrot', 'large_arc_flag', 'sweep_flag', 'x', 'y'], function(rx, ry, xrot, large_arc_flag, sweep_flag, x, y) {
          return plus({
            command: 'A',
            params: [rx, ry, xrot, large_arc_flag, sweep_flag, x, y]
          });
        }),
        print: function() {
          return instructions.map(printInstrunction).join(' ');
        },
        points: function() {
          var fn, i, instruction, len, prev, ps;
          ps = [];
          prev = [0, 0];
          fn = function() {
            var p;
            p = point(instruction, prev);
            prev = p;
            if (p) {
              return ps.push(p);
            }
          };
          for (i = 0, len = instructions.length; i < len; i++) {
            instruction = instructions[i];
            fn();
          }
          return ps;
        },
        instructions: function() {
          return instructions.slice(0, instructions.length);
        },
        connect: function(path) {
          var first, last, newInstructions;
          last = this.points().slice(-1)[0];
          first = path.points()[0];
          newInstructions = path.instructions().slice(1);
          if (!areEqualPoints(last, first)) {
            newInstructions.unshift({
              command: "L",
              params: first
            });
          }
          return Path(this.instructions().concat(newInstructions));
        }
      };
    };
    return function() {
      return Path();
    };
  });

}).call(this);
