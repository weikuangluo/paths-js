(function() {
  define(['./semi-regular-polygon', './ops'], function(SemiRegularPolygon, O) {
    var collect_keys, global_max, key_accessor;
    collect_keys = function(objects) {
      var j, key, keys, keysets, l, len, len1, o, object, ref;
      keys = [];
      keysets = (function() {
        var j, len, results;
        results = [];
        for (j = 0, len = objects.length; j < len; j++) {
          o = objects[j];
          results.push(Object.keys(o));
        }
        return results;
      })();
      for (j = 0, len = objects.length; j < len; j++) {
        object = objects[j];
        ref = Object.keys(object);
        for (l = 0, len1 = ref.length; l < len1; l++) {
          key = ref[l];
          if (keys.indexOf(key) === -1) {
            keys.push(key);
          }
        }
      }
      return keys;
    };
    key_accessor = function(keys) {
      var a, fn, j, key, len;
      a = {};
      fn = function(k) {
        return a[k] = function(o) {
          return o[k];
        };
      };
      for (j = 0, len = keys.length; j < len; j++) {
        key = keys[j];
        fn(key);
      }
      return a;
    };
    global_max = function(data, accessor) {
      var keys, maxs;
      keys = Object.keys(accessor);
      maxs = data.map(function(d) {
        var vals;
        vals = keys.map(function(k) {
          return accessor[k](d);
        });
        return O.max(vals);
      });
      return O.max(maxs);
    };
    return function(arg) {
      var accessor, angle, center, compute, data, i, j, keys, max, polygons, r, results, ring_paths, rings, sides;
      data = arg.data, accessor = arg.accessor, center = arg.center, r = arg.r, max = arg.max, rings = arg.rings, compute = arg.compute;
      if (rings == null) {
        rings = 3;
      }
      if (accessor == null) {
        accessor = key_accessor(collect_keys(data));
      }
      keys = Object.keys(accessor);
      sides = keys.length;
      angle = 2 * Math.PI / sides;
      i = -1;
      if (max == null) {
        max = global_max(data, accessor);
      }
      ring_paths = (function() {
        results = [];
        for (var j = 1; 1 <= rings ? j <= rings : j >= rings; 1 <= rings ? j++ : j--){ results.push(j); }
        return results;
      }).apply(this).map(function(n) {
        var j, radius, ref, results;
        radius = r * n / rings;
        return SemiRegularPolygon({
          center: center,
          radii: (function() {
            results = [];
            for (var j = 0, ref = sides - 1; 0 <= ref ? j <= ref : j >= ref; 0 <= ref ? j++ : j--){ results.push(j); }
            return results;
          }).apply(this).map(function(s) {
            return radius;
          })
        });
      });
      polygons = data.map(function(d) {
        i += 1;
        return O.enhance(compute, {
          polygon: SemiRegularPolygon({
            center: center,
            radii: keys.map(function(k) {
              return r * accessor[k](d) / max;
            })
          }),
          item: d,
          index: i
        });
      });
      return {
        curves: polygons,
        rings: ring_paths
      };
    };
  });

}).call(this);
