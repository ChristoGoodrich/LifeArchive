/* RealityGit — the "Reality Diff" engine.
   Two independent comparisons that complement each other:
     1. imageDiff()  -> a visual heatmap of what physically moved/changed.
     2. itemDiff()   -> the semantic "什么少了 / 什么多了" list comparison.
   The photo tells you WHERE it changed; the item list tells you WHAT changed. */
(function (global) {
  'use strict';

  /* Load a dataURL into an Image and resolve once decoded. */
  function loadImage(src) {
    return new Promise(function (resolve, reject) {
      if (!src) { resolve(null); return; }
      var img = new Image();
      img.onload = function () { resolve(img); };
      img.onerror = reject;
      img.src = src;
    });
  }

  /* Draw an image into an offscreen canvas at a fixed size and return pixels. */
  function pixelsAt(img, w, h) {
    var c = document.createElement('canvas');
    c.width = w; c.height = h;
    var ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0, w, h);
    return ctx.getImageData(0, 0, w, h);
  }

  /* Compare two photos and paint a red heatmap of the changed regions onto
     `outCanvas`. Returns { changedPct, blocks } where blocks describe roughly
     where the largest changes are (top/bottom/left/right) for human hints. */
  function imageDiff(srcA, srcB, outCanvas, opts) {
    opts = opts || {};
    var W = opts.width || 480;
    var threshold = opts.threshold || 38; // per-channel sensitivity

    return Promise.all([loadImage(srcA), loadImage(srcB)]).then(function (imgs) {
      var a = imgs[0], b = imgs[1];
      if (!a || !b) return { changedPct: 0, blocks: [], ok: false };

      // keep aspect ratio of the "after" image
      var ratio = b.height / b.width;
      var H = Math.round(W * ratio);
      var pa = pixelsAt(a, W, H), pb = pixelsAt(b, W, H);
      var da = pa.data, db = pb.data;

      var ctx = outCanvas.getContext('2d');
      outCanvas.width = W; outCanvas.height = H;
      // start from the "after" image, slightly dimmed
      ctx.drawImage(b, 0, 0, W, H);
      ctx.fillStyle = 'rgba(8,12,24,0.45)';
      ctx.fillRect(0, 0, W, H);

      var overlay = ctx.getImageData(0, 0, W, H);
      var od = overlay.data;
      var changed = 0, total = W * H;

      // 3x3 grid heat accumulation for directional hints
      var grid = [0, 0, 0, 0, 0, 0, 0, 0, 0];

      for (var i = 0; i < da.length; i += 4) {
        var dr = Math.abs(da[i] - db[i]);
        var dg = Math.abs(da[i + 1] - db[i + 1]);
        var dbl = Math.abs(da[i + 2] - db[i + 2]);
        var delta = (dr + dg + dbl) / 3;
        if (delta > threshold) {
          changed++;
          // paint a warm marker where it changed
          var strength = Math.min(1, delta / 160);
          od[i] = 255;
          od[i + 1] = Math.round(90 * (1 - strength));
          od[i + 2] = Math.round(60 * (1 - strength));
          od[i + 3] = Math.round(120 + 120 * strength);

          var px = (i / 4) % W;
          var py = Math.floor((i / 4) / W);
          var gx = Math.min(2, Math.floor(px / (W / 3)));
          var gy = Math.min(2, Math.floor(py / (H / 3)));
          grid[gy * 3 + gx]++;
        }
      }
      ctx.putImageData(overlay, 0, 0);

      var changedPct = total ? (changed / total) * 100 : 0;

      // turn the hottest grid cells into human-readable hints
      var cellNames = [
        'top-left', 'top', 'top-right',
        'left', 'center', 'right',
        'bottom-left', 'bottom', 'bottom-right'
      ];
      var cellNamesZh = [
        '左上', '上方', '右上',
        '左侧', '中间', '右侧',
        '左下', '下方', '右下'
      ];
      var blocks = grid.map(function (v, idx) {
        return { zone: cellNames[idx], zoneZh: cellNamesZh[idx], heat: v };
      }).filter(function (g) { return g.heat > total * 0.01; })
        .sort(function (x, y) { return y.heat - x.heat; })
        .slice(0, 3);

      return { changedPct: changedPct, blocks: blocks, ok: true };
    });
  }

  /* Compare two item lists. Items look like { name, qty }.
     Returns added / removed / changed / kept arrays. */
  function itemDiff(itemsBefore, itemsAfter) {
    var before = indexItems(itemsBefore);
    var after = indexItems(itemsAfter);
    var added = [], removed = [], changed = [], kept = [];

    Object.keys(after).forEach(function (name) {
      if (!before[name]) {
        added.push({ name: name, qty: after[name] });
      } else if (before[name] !== after[name]) {
        changed.push({ name: name, from: before[name], to: after[name] });
      } else {
        kept.push({ name: name, qty: after[name] });
      }
    });
    Object.keys(before).forEach(function (name) {
      if (!after[name]) removed.push({ name: name, qty: before[name] });
    });

    return { added: added, removed: removed, changed: changed, kept: kept };
  }

  function indexItems(items) {
    var map = {};
    (items || []).forEach(function (it) {
      var name = (it.name || '').trim();
      if (!name) return;
      map[name] = (map[name] || 0) + (it.qty || 1);
    });
    return map;
  }

  global.RG_DIFF = {
    imageDiff: imageDiff,
    itemDiff: itemDiff
  };
})(window);
