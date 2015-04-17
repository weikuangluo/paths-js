(function() {
  define(['./linear', './ops', './sector'], function(Linear, O, Sector) {
    return function(arg) {
      var R, accessor, center, compute, curves, data, i, item, j, len, r, s, scale, t, value, values;
      data = arg.data, accessor = arg.accessor, center = arg.center, r = arg.r, R = arg.R, compute = arg.compute;
      values = (function() {
        var j, len, results;
        results = [];
        for (j = 0, len = data.length; j < len; j++) {
          item = data[j];
          results.push(accessor(item));
        }
        return results;
      })();
      s = O.sum(values);
      scale = Linear([0, s], [0, 2 * Math.PI]);
      curves = [];
      t = 0;
      for (i = j = 0, len = data.length; j < len; i = ++j) {
        item = data[i];
        value = values[i];
        curves.push(O.enhance(compute, {
          item: item,
          index: i,
          sector: Sector({
            center: center,
            r: r,
            R: R,
            start: scale(t),
            end: scale(t + value)
          })
        }));
        t += value;
      }
      return {
        curves: curves
      };
    };
  });

}).call(this);
