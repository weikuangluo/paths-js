(function() {
  var slice = [].slice;

  define(['./path', './ops'], function(Path, O) {
    return function(arg) {
      var R, a, b, c, center, centroid, d, end, large, mid_angle, mid_radius, path, r, ref, ref1, ref2, ref3, start;
      center = arg.center, r = arg.r, R = arg.R, start = arg.start, end = arg.end;
      a = O.plus(center, O.on_circle(R, start));
      b = O.plus(center, O.on_circle(R, end));
      c = O.plus(center, O.on_circle(r, end));
      d = O.plus(center, O.on_circle(r, start));
      large = end - start > Math.PI ? 1 : 0;
      path = (ref = (ref1 = (ref2 = (ref3 = Path()).moveto.apply(ref3, a)).arc.apply(ref2, [R, R, 0, large, 1].concat(slice.call(b)))).lineto.apply(ref1, c)).arc.apply(ref, [r, r, 0, large, 0].concat(slice.call(d))).closepath();
      mid_angle = (start + end) / 2;
      mid_radius = (r + R) / 2;
      centroid = O.plus(center, O.on_circle(mid_radius, mid_angle));
      return {
        path: path,
        centroid: centroid
      };
    };
  });

}).call(this);
