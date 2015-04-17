(function() {
  define(['./ops', './linear', './rectangle'], function(O, Linear, Rectangle) {
    return function(arg) {
      var M, absolute, accessor, bar_width, bottom, compute, curves, d, data, data_, gutter, height, high, i, j, k, last, left, len, len1, line, low, m, max, min, n, ref, ref1, right, scale, top, value, width;
      data = arg.data, accessor = arg.accessor, width = arg.width, height = arg.height, gutter = arg.gutter, compute = arg.compute, min = arg.min, max = arg.max;
      if (accessor == null) {
        accessor = function(x) {
          return x;
        };
      }
      if (gutter == null) {
        gutter = 0;
      }
      if (min == null) {
        min = 0;
      }
      if (max == null) {
        max = 0;
      }
      last = 0;
      data_ = [];
      for (j = 0, len = data.length; j < len; j++) {
        d = data[j];
        ref = accessor(d), value = ref.value, absolute = ref.absolute;
        ref1 = absolute ? [0, value || last] : [last, last + value], low = ref1[0], high = ref1[1];
        m = Math.min(low, high);
        M = Math.max(low, high);
        min = Math.min(min, m);
        max = Math.max(max, M);
        last = high;
        data_.push({
          item: d,
          low: low,
          high: high,
          value: value != null ? value : high
        });
      }
      n = data_.length;
      bar_width = (width - gutter * (n - 1)) / n;
      curves = [];
      scale = Linear([min, max], [height, 0]);
      for (i = k = 0, len1 = data_.length; k < len1; i = ++k) {
        d = data_[i];
        left = i * (bar_width + gutter);
        right = left + bar_width;
        bottom = scale(d.low);
        top = scale(d.high);
        line = Rectangle({
          left: left,
          right: right,
          bottom: bottom,
          top: top
        });
        curves.push(O.enhance(compute, {
          item: d.item,
          line: line,
          value: d.value,
          index: i
        }));
      }
      return {
        curves: curves,
        scale: scale
      };
    };
  });

}).call(this);
