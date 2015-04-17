(function() {
  define(['./path', './ops'], function(Path, O) {
    return function(arg) {
      var a, b, c, d, end, length, mid1, mid2, ref, ref1, ref2, start, tension;
      start = arg.start, end = arg.end, tension = arg.tension;
      if (tension == null) {
        tension = 0.05;
      }
      a = start[0], b = start[1];
      c = end[0], d = end[1];
      length = (c - a) * tension;
      mid1 = [a + length, b];
      mid2 = [c - length, d];
      return {
        path: (ref = (ref1 = (ref2 = Path()).moveto.apply(ref2, start)).lineto.apply(ref1, mid1).curveto(a + 5 * length, b, c - 5 * length, d, c - length, d)).lineto.apply(ref, end),
        centroid: O.average([start, end])
      };
    };
  });

}).call(this);
