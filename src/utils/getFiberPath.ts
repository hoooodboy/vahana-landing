export default function getFiberPath(element: Element) {
  try {
    const rootElement = document.getElementById("root");
    if (rootElement) {
      const fiberTree = new TreeNode(getFiber(rootElement));

      return findNodePath(element, fiberTree)
        ?.filter((p) => typeof p.value.elementType === "function")
        .map((p) => p.value.elementType.name)
        .join("/");
    }
  } catch (err) {
    console.error(err);
  }
}

function findNodePath(
  element: Element,
  treeNode: TreeNode | null,
  path: TreeNode[] = []
): TreeNode[] | null {
  if (!treeNode) return null;
  path.push(treeNode);

  if (treeNode.value.stateNode === element) {
    return path;
  }

  for (const node of treeNode.children) {
    const foundPath = findNodePath(element, node, path.slice());
    if (foundPath) {
      return foundPath;
    }
  }

  return null;
}

interface FiberNode {
  child?: FiberNode | null;
  return?: FiberNode | null;
  sibling?: FiberNode | null;
  stateNode: any;
  elementType: any;
  memoizedProps: any;
  pendingProps: any;
}

class TreeNode {
  parent?: TreeNode;
  name?: string;
  props?: any;
  value: FiberNode;
  children: TreeNode[] = [];

  constructor(fiberNode: FiberNode, parent?: TreeNode["parent"]) {
    this.parent = parent;
    this.value = fiberNode;
    this.props = this.value.pendingProps ?? this.value.memoizedProps;

    switch (typeof this.value.elementType) {
      case "function":
        this.name = this.value.elementType.name;
        break;
    }

    if (this.parent) {
      if (fiberNode.sibling) {
        this.parent.children.unshift(
          new TreeNode(fiberNode.sibling, this.parent)
        );
      }
    }

    if (this.value.child) {
      this.children.unshift(new TreeNode(this.value.child, this));
    }
  }
}

function getFiber(node?: Node) {
  const propsKey =
    Object.keys(node ?? {}).find(
      (key) =>
        key.startsWith("__reactContainer") || key.startsWith("__reactFiber")
    ) ?? "";
  return node ? (node as any)[propsKey] : {};
}
