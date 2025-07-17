import type { BaseNode, NodeLevel, RootCat } from "@/types/tree";

export interface FindNodeResult {
  node: BaseNode | null;
  path: string[];
}

export function findNodeAndPath(
  node: NodeLevel | RootCat,
  targetId: string,
  currentPath: string[] = []
): FindNodeResult {
  const newPath = [...currentPath, node._nodeId];

  if (node._nodeId === targetId) {
    return { node, path: newPath };
  }

  if ("leaf" in node && Array.isArray(node.leaf)) {
    const found = node.leaf.find((leaf) => leaf._nodeId === targetId);
    if (found) {
      return { node: found, path: newPath };
    }
  }

  if (node.cat) {
    const children = Array.isArray(node.cat) ? node.cat : [node.cat];
    for (const child of children) {
      const result = findNodeAndPath(child, targetId, newPath);
      if (result.node) return result;
    }
  }

  return { node: null, path: [] };
}
