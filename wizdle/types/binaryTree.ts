export class TreeNode<T> {
  value: T;
  left = -1;
  right = -1;
  parent = -1;

  index: number;
  nextFree = -1;

  constructor(value: T, index: number = -1) {
    this.value = value;
    this.index = index;
  }

  get isLeaf(): boolean {return (this.left == -1)}

  get numChildren(): number {
    let count = 0;

    if (this.left >= 0)
        count++;
    if (this.right >= 0)
        count++;

    return count;
  }

  clear(): void{
    this.left = -1;
    this.right = -1;
    this.parent = -1;
  }
}

export abstract class BinarySearchTree<T> {
  nodes: TreeNode<T>[];
  freeHead = -1;
  rootIndex = 0;

  constructor() {
    this.nodes = [];
  }

  // Insert a new value into the tree
  insert(value: T): void {
    if (this.nodes[this.rootIndex] === null) {
      this.nodes[this.rootIndex] = new TreeNode<T>(value, 0)
      return;
    }

    const newNodeIndex = this.freeHead;
    this.freeHead = this.nodes[this.freeHead].nextFree;
    const newNode = new TreeNode<T>(value, newNodeIndex)
    if (newNodeIndex == -1) this.nodes.push(newNode);
    else this.nodes[newNodeIndex] = newNode;

    this.insertNode(this.nodes[this.rootIndex], newNode);
  }

  private insertNode(node: TreeNode<T>, newNode: TreeNode<T>): void {
    if (this.compare(newNode.value, node.value) < 0) {
      if (node.left == -1) {
        node.left = newNode.index;
        newNode.parent = node.index
      } else {
        this.insertNode(this.nodes[node.left], newNode);
      }
    } else {
      if (node.right == -1) {
        node.right = newNode.index;
        newNode.parent = node.index;
      } else {
        this.insertNode(this.nodes[node.right], newNode);
      }
    }
  }

  /**
   * Search for a value in the tree
   * @param value The value being searched for
   * @returns The index of the value or -1 if the value is not present
   */
  find(value: T): number {
    return this.searchNode(this.nodes[0], value);
  }

  private searchNode(node: TreeNode<T>, value: T): number {
    if (this.compare(value, node.value) === 0) return node.index;

    if (this.compare(node.value, value) > 0) {
        if (node.left == -1) return -1;
        else return this.searchNode(this.nodes[node.left], value);
    } else {
        if (node.right == -1) return -1;
        else return this.searchNode(this.nodes[node.right], value);
    }
  }

  removeNodeByIndex(index: number): void{
    if(index < this.nodes.length){
        const nodeToRemove = this.nodes[index];

        //manage freeHead pointer
        this.nodes[index].nextFree = this.freeHead;
        this.freeHead = index;

        if(nodeToRemove.parent === -1){
            nodeToRemove.clear()
            this.rootIndex = this.freeHead
            return
        }

        const parent = this.nodes[nodeToRemove.parent]

        switch (nodeToRemove.numChildren) {
            case 0:
                nodeToRemove.clear()
            case 1:
                let child: TreeNode<T>;
                if (nodeToRemove.left !== -1) child = this.nodes[nodeToRemove.left]
                else child = this.nodes[nodeToRemove.right]

                if (parent.left === index) {
                    parent.left = child.index;
                    child.parent = 
                }
            case 2:

        }

    }
  }

  rotateFromInsertion(insertNode: TreeNode<T>){

  }

  protected abstract compare(nodeA: T, nodeB: T): number;
}