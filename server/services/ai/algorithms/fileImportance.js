/**
 * PageRank-inspired File Importance & Centrality Algorithm
 * Ranks project files based on cross-imports, export usage, directory depth, and key file heuristics.
 */

export function calculateFileImportance(filesTree, importMap = {}) {
  if (!Array.isArray(filesTree) || filesTree.length === 0) {
    return [];
  }

  // Normalize string file paths or file objects
  const fileNodes = filesTree.map(f => {
    if (typeof f === 'string') return { path: f, type: 'blob' };
    return f || { path: '', type: 'blob' };
  }).filter(f => f.path && (f.type === 'blob' || !f.isDir));

  const scores = new Map();

  fileNodes.forEach(file => {
    const filePath = (file.path || '').toLowerCase();
    let initialScore = 1.0;

    if (/^(index|app|server|main|cli|core|api|readme|package\.json|cargo\.toml|pyproject\.toml)/.test(filePath.split('/').pop())) {
      initialScore += 3.0;
    }

    const depth = filePath.split('/').length;
    initialScore += Math.max(0, (5 - depth) * 0.4);

    if (/(test|spec|__tests__|e2e)/.test(filePath)) {
      initialScore *= 0.2;
    }

    scores.set(file.path, initialScore);
  });

  if (Object.keys(importMap).length > 0) {
    const d = 0.85;
    const iterations = 3;

    for (let iter = 0; iter < iterations; iter++) {
      const newScores = new Map(scores);

      fileNodes.forEach(targetFile => {
        let incomingWeight = 0;
        
        Object.entries(importMap).forEach(([sourceFile, imports]) => {
          if (Array.isArray(imports) && imports.some(imp => imp.includes(targetFile.path) || targetFile.path.includes(imp))) {
            const sourceScore = scores.get(sourceFile) || 1.0;
            const outboundCount = imports.length || 1;
            incomingWeight += sourceScore / outboundCount;
          }
        });

        const currentScore = scores.get(targetFile.path) || 1.0;
        newScores.set(targetFile.path, (1 - d) * currentScore + d * incomingWeight);
      });

      scores.clear();
      newScores.forEach((v, k) => scores.set(k, v));
    }
  }

  const ranked = fileNodes.map(f => ({
    ...f,
    score: parseFloat((scores.get(f.path) || 1.0).toFixed(2))
  })).sort((a, b) => b.score - a.score);

  return ranked;
}
