// Simple A* implementation on a grid (0 = walkable, 1 = blocked)
// Exports: findPath(grid, start, goal)

(function (global) {
  function key(p) { return p.x + "," + p.y; }

  function heuristic(a, b) {
    // Manhattan distance for grid
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  }

  function neighbors(grid, p) {
    const dirs = [
      { x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }
    ];
    const result = [];
    for (const d of dirs) {
      const nx = p.x + d.x, ny = p.y + d.y;
      if (ny >= 0 && ny < grid.length && nx >= 0 && nx < grid[0].length) {
        if (grid[ny][nx] === 0) result.push({ x: nx, y: ny });
      }
    }
    return result;
  }

  function findPath(grid, start, goal) {
    if (!grid || !grid.length) return [];
    const open = new Map();
    const came = new Map();
    const g = new Map();
    const f = new Map();

    function setG(p, val) { g.set(key(p), val); }
    function getG(p) { return g.get(key(p)) ?? Infinity; }
    function setF(p, val) { f.set(key(p), val); }
    function getF(p) { return f.get(key(p)) ?? Infinity; }

    open.set(key(start), start);
    setG(start, 0);
    setF(start, heuristic(start, goal));

    while (open.size) {
      // pick node with lowest f
      let current = null, currentKey = null, bestF = Infinity;
      for (const [k, p] of open) {
        const pf = getF(p);
        if (pf < bestF) { bestF = pf; current = p; currentKey = k; }
      }
      if (!current) break;
      if (current.x === goal.x && current.y === goal.y) {
        // reconstruct path
        const path = [current];
        let ck = key(current);
        while (came.has(ck)) {
          const prev = came.get(ck);
          path.push(prev);
          ck = key(prev);
        }
        path.reverse();
        return path;
      }
      open.delete(currentKey);

      for (const nb of neighbors(grid, current)) {
        const tentativeG = getG(current) + 1;
        if (tentativeG < getG(nb)) {
          came.set(key(nb), current);
          setG(nb, tentativeG);
          setF(nb, tentativeG + heuristic(nb, goal));
          if (!open.has(key(nb))) open.set(key(nb), nb);
        }
      }
    }
    return [];
  }

  global.Pathfinding = { findPath };
})(typeof window !== 'undefined' ? window : globalThis);
