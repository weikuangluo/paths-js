(function() {
  define(['./connector', './linear', './tree_utils'], function(Connector, Linear, u) {
    return function(arg) {
      var child_nodes, children, connectors, data, height, hscale, hspace, i, j, levels, max_heights, position, ref, results, root_node, tension, tree, vscales, width;
      data = arg.data, width = arg.width, height = arg.height, children = arg.children, tension = arg.tension;
      if (children == null) {
        children = function(x) {
          return x.children;
        };
      }
      tree = u.build_tree(data, children);
      levels = u.tree_height(tree);
      max_heights = u.set_height(tree);
      hspace = width / (levels - 1);
      hscale = Linear([0, levels - 1], [0, width]);
      vscales = (function() {
        results = [];
        for (var j = 0, ref = levels - 1; 0 <= ref ? j <= ref : j >= ref; 0 <= ref ? j++ : j--){ results.push(j); }
        return results;
      }).apply(this).map(function(level) {
        var available_height, bottom, max_height, top;
        available_height = Math.sqrt(level / (levels - 1)) * height;
        top = (height - available_height) / 2;
        bottom = top + available_height;
        max_height = level > 0 ? max_heights[level] + max_heights[level - 1] : max_heights[level];
        if (max_height === 0) {
          return function(x) {
            return height / 2;
          };
        } else {
          return Linear([0, max_height], [top, bottom]);
        }
      });
      position = function(node) {
        var level, vscale;
        level = node.level;
        vscale = vscales[level];
        return [hscale(level), vscale(node.height_)];
      };
      i = -1;
      connectors = u.collect(tree, function(parent, child) {
        i += 1;
        child.height_ = child.height + parent.height;
        return {
          connector: Connector({
            start: position(parent),
            end: position(child),
            tension: tension
          }),
          index: i,
          item: {
            start: parent.item,
            end: child.item
          }
        };
      });
      child_nodes = u.collect(tree, function(parent, child) {
        return {
          point: position(child),
          item: child.item
        };
      });
      root_node = {
        point: position(tree),
        item: tree.item
      };
      return {
        curves: connectors,
        nodes: [root_node].concat(child_nodes)
      };
    };
  });

}).call(this);
