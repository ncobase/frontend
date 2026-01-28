import { useMemo } from 'react';

export type HierarchicalNode<T = any> = {
  value: string | number;
  label: string;
  level?: number;
  parent?: string | number | null;
  children?: HierarchicalNode<T>[];
  [key: string]: any;
};

export interface HierarchicalDataResult<T = any> {
  flattenedNodes: HierarchicalNode<T>[];
  nodesMap: Record<string | number, HierarchicalNode<T>>;
  parentChildMap: Record<string | number, (string | number)[]>;
  rootNodes: HierarchicalNode<T>[];
}

/**
 * A hook for processing hierarchical data structures
 * @param nodes The hierarchical data
 * @returns Processed data structure
 */
export function useHierarchicalData<T = any>(
  nodes: HierarchicalNode<T>[]
): HierarchicalDataResult<T> {
  return useMemo(() => {
    const nodesMap: Record<string | number, HierarchicalNode<T>> = {};
    const flattenedNodes: HierarchicalNode<T>[] = [];
    const parentChildMap: Record<string | number, (string | number)[]> = {};
    const rootNodes: HierarchicalNode<T>[] = [];

    // Process nodes recursively
    const processNode = (
      node: HierarchicalNode<T>,
      level = 0,
      parent: HierarchicalNode<T> | null = null
    ) => {
      const processedNode = {
        ...node,
        level,
        parent: parent ? parent.value : null
      };

      // Add to maps
      nodesMap[node.value] = processedNode;
      flattenedNodes.push(processedNode);

      // Setup parent-child relationship
      if (parent) {
        if (!parentChildMap[parent.value]) {
          parentChildMap[parent.value] = [];
        }
        parentChildMap[parent.value].push(node.value);
      } else {
        rootNodes.push(processedNode);
      }

      // Process children recursively
      if (node.children && node.children.length > 0) {
        node.children.forEach(child => processNode(child, level + 1, node));
      }
    };

    // Process all nodes
    nodes.forEach(node => processNode(node));

    return {
      flattenedNodes,
      nodesMap,
      parentChildMap,
      rootNodes
    };
  }, [nodes]);
}
