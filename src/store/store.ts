import { createStore } from "vuex";
import type {
  RootState,
  BaseNode,
  RootJson,
  NodeLevel,
  RootCat,
} from "@/types/tree";
import { findNodeAndPath } from "@/utils/treeHelpers";
import treeData from "@/data/data.json";

export const store = createStore<RootState>({
  state: {
    treeData: treeData,
    selectedNodeId: null,
    expandedNodes: new Set<string>(),
    selectedList: JSON.parse(
      localStorage.getItem("selectedList") || "[]"
    ) as BaseNode[],
  },

  mutations: {
    SET_TREE_DATA(state, data: RootJson) {
      state.treeData = data;
    },

    SET_SELECTED_NODE(state, nodeId: string | null) {
      state.selectedNodeId = nodeId;
      if (nodeId) {
        localStorage.setItem("selectedNode", nodeId);
      }
    },

    TOGGLE_EXPANDED_NODE(state, nodeId: string) {
      if (state.expandedNodes.has(nodeId)) {
        state.expandedNodes.delete(nodeId);
      } else {
        state.expandedNodes.add(nodeId);
      }
    },

    SET_EXPANDED_NODES(state, nodes: string[]) {
      state.expandedNodes = new Set(nodes);
    },

    ADD_TO_SELECTED_LIST(state, node: BaseNode) {
      const exists = state.selectedList.find(
        (item) => item._nodeId === node._nodeId
      );
      if (!exists) {
        state.selectedList.push(node);
        localStorage.setItem(
          "selectedList",
          JSON.stringify(state.selectedList)
        );
      }
    },

    REMOVE_FROM_SELECTED_LIST(state, nodeId: string) {
      state.selectedList = state.selectedList.filter(
        (item) => item._nodeId !== nodeId
      );
      if (state.selectedNodeId === nodeId) {
        state.selectedNodeId =
          state.selectedList.length > 0
            ? state.selectedList[state.selectedList.length - 1]._nodeId
            : "0";
        localStorage.setItem("selectedNode", state.selectedNodeId);
      }
      localStorage.setItem("selectedList", JSON.stringify(state.selectedList));
    },

    EXPAND_ALL_CHILDREN(state, nodeId: string) {
      const expandRecursively = (node: NodeLevel | RootCat) => {
        if (node._nodeId) {
          state.expandedNodes.add(node._nodeId);
        }
        if (node.cat) {
          const children = Array.isArray(node.cat) ? node.cat : [node.cat];
          children.forEach((child) => expandRecursively(child));
        }
      };

      const findAndExpand = (node: NodeLevel | RootCat): boolean => {
        if (node._nodeId === nodeId) {
          expandRecursively(node);
          return true;
        }
        if (node.cat) {
          const children = Array.isArray(node.cat) ? node.cat : [node.cat];
          return children.some((child) => findAndExpand(child));
        }
        return false;
      };

      const rootCat = Array.isArray(state.treeData.tree.cat)
        ? state.treeData.tree.cat
        : [state.treeData.tree.cat];
      rootCat.forEach((cat) => findAndExpand(cat));
    },

    COLLAPSE_ALL_CHILDREN(state, nodeId: string) {
      const collapseRecursively = (node: NodeLevel | RootCat) => {
        if (node._nodeId) {
          state.expandedNodes.delete(node._nodeId);
        }
        if (node.cat) {
          const children = Array.isArray(node.cat) ? node.cat : [node.cat];
          children.forEach((child) => collapseRecursively(child));
        }
      };

      const findAndCollapse = (node: NodeLevel | RootCat): boolean => {
        if (node._nodeId === nodeId) {
          collapseRecursively(node);
          return true;
        }
        if (node.cat) {
          const children = Array.isArray(node.cat) ? node.cat : [node.cat];
          return children.some((child) => findAndCollapse(child));
        }
        return false;
      };

      const rootCat = Array.isArray(state.treeData.tree.cat)
        ? state.treeData.tree.cat
        : [state.treeData.tree.cat];
      rootCat.forEach((cat) => findAndCollapse(cat));
    },
  },

  actions: {
    initTreeState({ commit, state }) {
      const savedSelected = localStorage.getItem("selectedNode");

      const rootCats = Array.isArray(state.treeData.tree.cat)
        ? state.treeData.tree.cat
        : [state.treeData.tree.cat];

      if (savedSelected) {
        for (const cat of rootCats) {
          const { node, path } = findNodeAndPath(cat, savedSelected);
          if (node) {
            commit("SET_SELECTED_NODE", savedSelected);
            commit("ADD_TO_SELECTED_LIST", node);
            commit("SET_EXPANDED_NODES", path);
            return;
          }
        }
      } else {
        const first = rootCats[0];
        if (first) {
          commit("SET_SELECTED_NODE", first._nodeId);
          commit("ADD_TO_SELECTED_LIST", first);
          commit("SET_EXPANDED_NODES", [first._nodeId]);
        }
      }
    },

    selectNode({ commit }, nodeId: string) {
      commit("SET_SELECTED_NODE", nodeId);
    },

    toggleExpanded({ commit }, nodeId: string) {
      commit("TOGGLE_EXPANDED_NODE", nodeId);
    },

    addToSelectedList({ commit }, node: BaseNode) {
      commit("ADD_TO_SELECTED_LIST", node);
    },

    removeFromSelectedList({ commit }, nodeId: string) {
      commit("REMOVE_FROM_SELECTED_LIST", nodeId);
    },

    expandAllChildren({ commit }, nodeId: string) {
      commit("EXPAND_ALL_CHILDREN", nodeId);
    },

    expandAllChildrenFromSelected({ state, commit }) {
      const selectedId = state.selectedNodeId;
      if (!selectedId) return;

      const rootCats = Array.isArray(state.treeData.tree.cat)
        ? state.treeData.tree.cat
        : [state.treeData.tree.cat];

      for (const cat of rootCats) {
        const { node } = findNodeAndPath(cat, selectedId);
        if (node) {
          commit("EXPAND_ALL_CHILDREN", node._nodeId);
          break;
        }
      }
    },

    collapseAllChildren({ commit }, nodeId: string) {
      commit("COLLAPSE_ALL_CHILDREN", nodeId);
    },

    collapseAllChildrenFromSelected({ state, commit }) {
      const selectedId = state.selectedNodeId;
      if (!selectedId) return;

      const rootCats = Array.isArray(state.treeData.tree.cat)
        ? state.treeData.tree.cat
        : [state.treeData.tree.cat];

      for (const cat of rootCats) {
        const { node } = findNodeAndPath(cat, selectedId);
        if (node) {
          commit("COLLAPSE_ALL_CHILDREN", node._nodeId);
          break;
        }
      }
    },
  },

  getters: {
    rootCategories: (state): RootCat[] => {
      const cat = state.treeData.tree.cat;
      return Array.isArray(cat) ? cat : [cat];
    },

    isNodeExpanded:
      (state) =>
      (nodeId: string): boolean => {
        return state.expandedNodes.has(nodeId);
      },

    isNodeSelected:
      (state) =>
      (nodeId: string): boolean => {
        return state.selectedNodeId === nodeId;
      },
  },
});
