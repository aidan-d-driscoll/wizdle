import { BinarySearchTree } from "@/types/binaryTree";
import { CollisionBox } from "./collisionBox";

class CollisionManager extends BinarySearchTree<CollisionBox>{
    protected compare(nodeA: CollisionBox, nodeB: CollisionBox): boolean {
        return 
    }
}

export const collisions = BinarySearchTree<CollisionBox>