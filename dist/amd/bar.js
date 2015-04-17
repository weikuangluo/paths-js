(function() {
  define(['./ops', './linear', './rectangle'], function(O, Linear, Rectangle) {
    return function(arg) {
      var accessor, bottom, compute, curves, d, data, el, g, group_width, groups, gutter, height, i, j, k, l, left, len, len1, len2, len3, line, m, max, min, n, o, right, scale, shift, top, val, w, width;
      data = arg.data, accessor = arg.accessor, width = arg.width, height = arg.height, gutter = arg.gutter, compute = arg.compute;
      if (accessor == null) {
        accessor = function(x) {
          return x;
        };
      }
      if (gutter == null) {
        gutter = 0;
      }
      groups = [];
      min = 0;
      max = 0;
      for (i = k = 0, len = data.length; k < len; i = ++k) {
        d = data[i];
        for (j = l = 0, len1 = d.length; l < len1; j = ++l) {
          el = d[j];
          val = accessor(el);
          if (val < min) {
            min = val;
          }
          if (val > max) {
            max = val;
          }
          if (groups[j] == null) {
            groups[j] = [];
          }
          groups[j][i] = val;
        }
      }
      n = groups.length;
      group_width = (width - gutter * (n - 1)) / n;
      curves = [];
      scale = Linear([min, max], [height, 0]);
      for (i = m = 0, len2 = groups.length; m < len2; i = ++m) {
        g = groups[i];
        w = group_width / g.length;
        shift = (group_width + gutter) * i;
        for (j = o = 0, len3 = g.length; o < len3; j = ++o) {
          el = g[j];
          left = shift + w * j;
          right = left + w;
          bottom = scale(0);
          top = scale(el);
          line = Rectangle({
            left: left,
            right: right,
            bottom: bottom,
            top: top
          });
          curves.push(O.enhance(compute, {
            item: data[j][i],
            line: line,
            index: j
          }));
        }
      }
      return {
        curves: curves,
        scale: scale
      };
    };
  });

}).call(this);
