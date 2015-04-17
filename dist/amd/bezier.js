(function() {
  define(['./path', './ops'], function(Path, O) {
    var reflect;
    reflect = function(p, q) {
      return O.minus(O.times(2, p), q);
    };
    return function(arg) {
      var c0, c1, control_points, diffs, i, j, k, l, m, p0, p1, path, points, ref, ref1, ref2, ref3, results, tension;
      points = arg.points, tension = arg.tension;
      if (tension == null) {
        tension = 0.3;
      }
      diffs = [];
      l = points.length;
      for (i = j = 1, ref = l - 1; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
        diffs.push(O.times(tension, O.minus(points[i], points[i - 1])));
      }
      control_points = [O.plus(points[0], reflect(diffs[0], diffs[1]))];
      for (i = k = 1, ref1 = l - 2; 1 <= ref1 ? k <= ref1 : k >= ref1; i = 1 <= ref1 ? ++k : --k) {
        control_points.push(O.minus(points[i], O.average([diffs[i], diffs[i - 1]])));
      }
      control_points.push(O.minus(points[l - 1], reflect(diffs[l - 2], diffs[l - 3])));
      c0 = control_points[0];
      c1 = control_points[1];
      p0 = points[0];
      p1 = points[1];
      path = (ref2 = Path()).moveto.apply(ref2, p0).curveto(c0[0], c0[1], c1[0], c1[1], p1[0], p1[1]);
      return {
        path: (function() {
          results = [];
          for (var m = 2, ref3 = l - 1; 2 <= ref3 ? m <= ref3 : m >= ref3; 2 <= ref3 ? m++ : m--){ results.push(m); }
          return results;
        }).apply(this).reduce((function(pt, i) {
          var c, p;
          c = control_points[i];
          p = points[i];
          return pt.smoothcurveto(c[0], c[1], p[0], p[1]);
        }), path),
        centroid: O.average(points)
      };
    };
  });

}).call(this);
