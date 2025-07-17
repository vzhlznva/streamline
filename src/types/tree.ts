// common fields for all nodes
export interface BaseNode {
  _nodeId: string;
  _name: string;
  _fgs: string;
  _state: string;
  _overstock: string;
  _stockout: string;
  _nodeFlags: string;
}

export interface LeafNode extends BaseNode {}

export interface NodeLevel extends BaseNode {
  leaf?: LeafNode[];
  cat?: NodeLevel[] | NodeLevel;
}

export interface RootCat extends BaseNode {
  cat: NodeLevel[];
}

export interface Tree {
  _treeId: string;
  cat: RootCat | RootCat[];
}

export interface RootJson {
  tree: Tree;
}

export interface RootState {
  treeData: RootJson;
  selectedNodeId: string | null;
  expandedNodes: Set<string>;
  selectedList: BaseNode[];
}
