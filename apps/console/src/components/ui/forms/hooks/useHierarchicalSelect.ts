import { useState, useCallback, useEffect } from 'react';

import { useControlledState } from './useControlledState';
import { useHierarchicalData, HierarchicalNode } from './useHierarchicalData';

export interface HierarchicalSelectOptions {
  multiple?: boolean;
  allowParentSelection?: boolean;
}

export function useHierarchicalSelect<T = any>(
  nodes: HierarchicalNode<T>[],
  value: any | any[] | undefined,
  defaultValue: any | any[] = [],
  onChange?: (_value: any) => void,
  options: HierarchicalSelectOptions = {}
) {
  const { multiple = false, allowParentSelection = false } = options;

  // Initialize controlled state
  const [selectedValues, setSelectedValues] = useControlledState<any[]>(
    value === undefined
      ? undefined
      : multiple
        ? Array.isArray(value)
          ? value
          : value !== null
            ? [value]
            : []
        : Array.isArray(value)
          ? value.length > 0
            ? [value[0]]
            : []
          : value !== null
            ? [value]
            : [],
    multiple
      ? Array.isArray(defaultValue)
        ? defaultValue
        : defaultValue !== null
          ? [defaultValue]
          : []
      : Array.isArray(defaultValue)
        ? defaultValue.length > 0
          ? [defaultValue[0]]
          : []
        : defaultValue !== null
          ? [defaultValue]
          : []
  );

  // Process hierarchical data
  const { flattenedNodes, nodesMap, parentChildMap } = useHierarchicalData(nodes);

  // Track expanded nodes state
  const [expandedNodes, setExpandedNodes] = useState(new Set<string | number>());

  // Nodes structure changes
  useEffect(() => {
    // Auto-expand if we have few nodes
    if (nodes.length > 0 && nodes.length <= 10) {
      const rootNodes = nodes.filter(node => !node.parent).map(node => node.value);
      setExpandedNodes(new Set(rootNodes));
    }
  }, [nodes]);

  // Get all descendant values for a node
  const getAllDescendantValues = useCallback(
    (nodeValue: string | number): (string | number)[] => {
      const descendants: (string | number)[] = [];
      const children = parentChildMap[nodeValue] || [];

      // Add direct children
      descendants.push(...children);

      // Add descendants recursively
      children.forEach(childValue => {
        descendants.push(...getAllDescendantValues(childValue));
      });

      return descendants;
    },
    [parentChildMap]
  );

  // Get all parent values for a node
  const getAllParentValues = useCallback(
    (nodeValue: string | number): (string | number)[] => {
      const parents: (string | number)[] = [];
      const currentNodeValue = nodeValue;
      let currentNode = nodesMap[currentNodeValue];

      while (currentNode && currentNode.parent !== null && currentNode.parent !== undefined) {
        parents.push(currentNode.parent);
        currentNode = nodesMap[currentNode.parent];
      }

      return parents;
    },
    [nodesMap]
  );

  // Check if all children of a node are selected
  const areAllChildrenSelected = useCallback(
    (nodeValue: string | number): boolean => {
      const children = parentChildMap[nodeValue] || [];
      if (children.length === 0) return false;

      // Check each child and its descendants
      return children.every(childValue => {
        const isChildSelected = selectedValues.includes(childValue);
        const hasGrandchildren = (parentChildMap[childValue] || []).length > 0;

        if (!isChildSelected && !hasGrandchildren) {
          return false;
        }

        if (hasGrandchildren) {
          return areAllChildrenSelected(childValue);
        }

        return true;
      });
    },
    [parentChildMap, selectedValues]
  );

  // Check if any children of a node are selected
  const areAnyChildrenSelected = useCallback(
    (nodeValue: string | number): boolean => {
      const children = parentChildMap[nodeValue] || [];
      if (children.length === 0) return false;

      // Check each child and its descendants
      return children.some(childValue => {
        const isChildSelected = selectedValues.includes(childValue);
        const hasGrandchildren = (parentChildMap[childValue] || []).length > 0;

        if (isChildSelected) {
          return true;
        }

        if (hasGrandchildren) {
          return areAnyChildrenSelected(childValue);
        }

        return false;
      });
    },
    [parentChildMap, selectedValues]
  );

  // Check for indeterminate state
  const getIndeterminateState = useCallback(
    (nodeValue: string | number): boolean => {
      return areAnyChildrenSelected(nodeValue) && !areAllChildrenSelected(nodeValue);
    },
    [areAnyChildrenSelected, areAllChildrenSelected]
  );

  // Toggle node expansion
  const toggleNodeExpansion = useCallback(
    (nodeValue: string | number, event?: React.MouseEvent) => {
      if (event) {
        event.stopPropagation();
      }
      setExpandedNodes(prev => {
        const newExpanded = new Set(prev);
        if (newExpanded.has(nodeValue)) {
          newExpanded.delete(nodeValue);
        } else {
          newExpanded.add(nodeValue);
        }
        return newExpanded;
      });
    },
    []
  );

  // Toggle selection of a node
  const toggleNodeSelection = useCallback(
    (nodeValue: string | number) => {
      let newValues = [...selectedValues];
      const isSelected = selectedValues.includes(nodeValue);
      const hasChildren = (parentChildMap[nodeValue] || []).length > 0;

      if (multiple) {
        if (isSelected) {
          // Deselect this node
          newValues = newValues.filter(v => v !== nodeValue);

          // If this is a parent, also deselect all descendants
          if (hasChildren) {
            const descendants = getAllDescendantValues(nodeValue);
            newValues = newValues.filter(v => !descendants.includes(v));
          }

          // Update parent nodes - remove parents if needed
          const parents = getAllParentValues(nodeValue);
          parents.forEach(parent => {
            if (newValues.includes(parent)) {
              newValues = newValues.filter(v => v !== parent);
            }
          });
        } else {
          // If it's a parent node and parent selection is not allowed
          if (hasChildren && !allowParentSelection) {
            // Select all child nodes, but not the parent node itself
            const descendants = getAllDescendantValues(nodeValue);
            descendants.forEach(desc => {
              if (!newValues.includes(desc)) {
                newValues.push(desc);
              }
            });
          } else {
            // Parent selection is allowed, or this is a leaf node
            newValues.push(nodeValue);

            // If parent selection is allowed, check if all sibling nodes are selected
            if (allowParentSelection) {
              const parents = getAllParentValues(nodeValue);
              parents.forEach(parent => {
                const children = parentChildMap[parent] || [];
                const allChildrenSelected = children.every(
                  child =>
                    newValues.includes(child) ||
                    // Check if all child nodes of the child are selected
                    (parentChildMap[child]?.length > 0 &&
                      areAllChildrenSelected(child) &&
                      newValues.includes(child))
                );

                if (allChildrenSelected && !newValues.includes(parent)) {
                  newValues.push(parent);
                }
              });
            }
          }
        }
      } else {
        // Single select mode
        // If it's a parent node and parent selection is not allowed, do nothing
        if (hasChildren && !allowParentSelection) {
          return;
        }
        newValues = [nodeValue];
      }

      // Update state and call onChange callback
      setSelectedValues(newValues);
      if (onChange) {
        onChange(multiple ? newValues : newValues.length > 0 ? newValues[0] : null);
      }
    },
    [
      selectedValues,
      multiple,
      parentChildMap,
      getAllDescendantValues,
      getAllParentValues,
      allowParentSelection,
      onChange,
      areAllChildrenSelected
    ]
  );

  // Get filtered selected values for display (avoid showing redundant parent-child selections)
  const getFilteredSelectedValues = useCallback(() => {
    if (!multiple) return selectedValues;
    if (!allowParentSelection) return selectedValues;

    return selectedValues.filter(value => {
      // Get all parents of this value
      const parents = getAllParentValues(value);

      // If any parent is selected, don't show this child
      return !parents.some(parent => selectedValues.includes(parent));
    });
  }, [multiple, selectedValues, allowParentSelection, getAllParentValues]);

  // Get all nodes that should be visible based on expanded state and search term
  const getVisibleNodes = useCallback(
    (searchTerm = '') => {
      if (!searchTerm) {
        // Return nodes that should be visible based on expanded state
        return flattenedNodes.filter(node => {
          // Root nodes are always visible
          if (!node.parent) return true;

          // Check if all ancestor nodes are expanded
          let currentParent = node.parent;
          let isVisible = true;

          while (currentParent) {
            if (!expandedNodes.has(currentParent)) {
              isVisible = false;
              break;
            }
            currentParent = nodesMap[currentParent]?.parent;
          }

          return isVisible;
        });
      }

      // When searching, show all nodes that match or are in the path to matching nodes
      const nodesToShow = new Set<HierarchicalNode>();
      const matchingNodeValues = new Set<string | number>();

      // First collect all matching nodes
      flattenedNodes.forEach(node => {
        if (String(node.label).toLowerCase().includes(searchTerm.toLowerCase())) {
          matchingNodeValues.add(node.value);
          nodesToShow.add(node);
        }
      });

      // Then add all ancestors of matching nodes to keep the tree structure
      matchingNodeValues.forEach(nodeValue => {
        let currentParent = nodesMap[nodeValue]?.parent;
        while (currentParent) {
          const parentNode = nodesMap[currentParent];
          if (parentNode) {
            nodesToShow.add(parentNode);
            // Auto-expand ancestors when searching
            setExpandedNodes(prev => {
              const newExpanded = new Set(prev);
              newExpanded.add(currentParent as string | number);
              return newExpanded;
            });
          }
          currentParent = parentNode?.parent;
        }
      });

      // Then add all descendants of matching nodes
      const addDescendants = (nodeValue: string | number) => {
        const children = parentChildMap[nodeValue] || [];
        children.forEach(childValue => {
          const childNode = nodesMap[childValue];
          if (childNode) {
            nodesToShow.add(childNode);
            addDescendants(childValue);
          }
        });
      };

      matchingNodeValues.forEach(nodeValue => {
        addDescendants(nodeValue);
      });

      return Array.from(nodesToShow);
    },
    [flattenedNodes, expandedNodes, nodesMap, parentChildMap]
  );

  return {
    // Values
    selectedValues,
    filteredSelectedValues: getFilteredSelectedValues(),
    expandedNodes,
    flattenedNodes,
    nodesMap,
    parentChildMap,
    rootNodes: flattenedNodes.filter(node => !node.parent),

    // Methods
    setSelectedValues,
    toggleNodeSelection,
    toggleNodeExpansion,
    getAllDescendantValues,
    getAllParentValues,
    areAllChildrenSelected,
    areAnyChildrenSelected,
    getIndeterminateState,
    getVisibleNodes
  };
}
