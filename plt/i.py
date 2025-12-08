from collections import deque

class Node:
    """A node of the AVL tree."""
    def __init__(self, key):
        self.key = key
        self.left = None      # left subtree
        self.right = None     # right subtree
        self.height = 1       # a new node starts as a leaf → height = 1

    def __repr__(self):
        return f"Node({self.key})"


# ----------------------------
# Height helpers
# ----------------------------

def height(n: Node) -> int:
    """Return the height of a node (None → 0)."""
    return n.height if n is not None else 0


def update_height(n: Node) -> None:
    """Recompute a node's height from its children."""
    n.height = 1 + max(height(n.left), height(n.right))


def balance_factor(n: Node) -> int:
    """Balance factor = left_height - right_height."""
    return height(n.left) - height(n.right) if n is not None else 0


# ----------------------------
# Rotations
# ----------------------------

def rotate_right(z: Node) -> Node:
    """
    Right rotation – fixes LL cases.
    Before:
            z
           /
          y
         /
        x
    After:
            y
           / \
          x   z

    Steps:
      - y becomes the new subtree root
      - z's left child becomes y's right subtree (T3)
      - update heights: z first, then y
    """
    y = z.left
    T3 = y.right

    # Perform rotation
    y.right = z
    z.left = T3

    # Update heights (bottom-up)
    update_height(z)
    update_height(y)

    return y  # new subtree root


def rotate_left(z: Node) -> Node:
    """
    Left rotation – fixes RR cases.
    Before:
        z
         \
          y
           \
            x
    After:
            y
           / \
          z   x

    Steps:
      - y becomes the new subtree root
      - z's right child becomes y's left subtree (T2)
      - update heights: z first, then y
    """
    y = z.right
    T2 = y.left

    # Perform rotation
    y.left = z
    z.right = T2

    # Update heights
    update_height(z)
    update_height(y)

    return y  # new subtree root


# --------------------------------------
# Rebalancing (restore |BF| <= 1)
# --------------------------------------

def rebalance(node: Node) -> Node:
    """
    Locally rebalance a node using its BF.
    Four cases:
      - LL: BF>1 and left child BF>=0   → rotate_right(node)
      - LR: BF>1 and left child BF<0    → node.left = rotate_left(node.left); rotate_right(node)
      - RR: BF<-1 and right child BF<=0 → rotate_left(node)
      - RL: BF<-1 and right child BF>0  → node.right = rotate_right(node.right); rotate_left(node)
    """
    bf = balance_factor(node)

    # Left-heavy (+2)
    if bf > 1:
        # LR case: left child is right-heavy → fix child first
        if balance_factor(node.left) < 0:
            node.left = rotate_left(node.left)   # LR first step
        return rotate_right(node)                # LL or LR second step

    # Right-heavy (-2)
    if bf < -1:
        # RL case: right child is left-heavy → fix child first
        if balance_factor(node.right) > 0:
            node.right = rotate_right(node.right)  # RL first step
        return rotate_left(node)                   # RR or RL second step

    # Already balanced
    return node


# ----------------------------
# Insertion (insert)
# ----------------------------

def insert(node: Node, key) -> Node:
    """
    Standard BST insertion + height update + rebalance.
    Duplicate keys are ignored (not inserted again).
    """
    if node is None:
        return Node(key)

    if key < node.key:
        node.left = insert(node.left, key)
    elif key > node.key:
        node.right = insert(node.right, key)
    else:
        # duplicate → do nothing
        return node

    # Update height and rebalance on the way back up
    update_height(node)
    return rebalance(node)


# ----------------------------
# Deletion (delete)
# ----------------------------

def min_value_node(node: Node) -> Node:
    """Return the node with the smallest key in this subtree (leftmost)."""
    current = node
    while current.left is not None:
        current = current.left
    return current


def delete(node: Node, key) -> Node:
    """
    Standard BST deletion + height update + rebalance.
    Cases:
      - key < node.key  → delete from left
      - key > node.key  → delete from right
      - key == node.key → three sub-cases:
          1) no child (leaf) → remove
          2) one child       → return the child
          3) two children    → copy inorder successor (min of right),
                               then delete that successor
    Then update height and rebalance on the way back up.
    """
    if node is None:
        return None

    # BST direction
    if key < node.key:
        node.left = delete(node.left, key)
    elif key > node.key:
        node.right = delete(node.right, key)
    else:
        # Found the node to delete
        # 1) 0 or 1 child
        if node.left is None:
            return node.right
        elif node.right is None:
            return node.left
        else:
            # 2) Two children: use inorder successor (min of right subtree)
            successor = min_value_node(node.right)
            node.key = successor.key
            # Delete the successor from the right subtree
            node.right = delete(node.right, successor.key)

    # If the subtree became empty
    if node is None:
        return None

    # Update height and rebalance
    update_height(node)
    return rebalance(node)


# ----------------------------
# Visualization (ASCII)
# ----------------------------

def print_tree(root: Node) -> None:
    """
    Print the tree sideways.
    Right subtree goes on top, left subtree at the bottom.
    Each node shows: key [h=?, bf=?]
    """
    def _print(node: Node, indent: str, is_right: bool):
        if node is None:
            return
        # Print right subtree first (so it appears on top)
        _print(node.right, indent + ("    " if is_right else "│   "), True)

        # Current node
        bf = balance_factor(node)
        print(f"{indent}{'└── ' if is_right else '┌── '}{node.key} [h={node.height}, bf={bf}]")

        # Print left subtree (bottom)
        _print(node.left, indent + ("    " if not is_right else "│   "), False)

    if root is None:
        print("(empty tree)")
    else:
        _print(root, "", True)


def inorder_list(root: Node):
    """Useful helper: inorder (left-root-right) key list — always sorted."""
    res = []
    def _in(n):
        if n is None:
            return
        _in(n.left)
        res.append(n.key)
        _in(n.right)
    _in(root)
    return res


# ----------------------------
# DEMO
# ----------------------------

if __name__ == "__main__":
    root = None

    # Insertions – triggers a variety of rotations
    for x in [10, 20, 30, 40, 50, 25]:
        root = insert(root, x)

    print("AVL after insertions:")
    print_tree(root)
    print("Inorder (sorted):", inorder_list(root))
    print()

    # Deletions – observe rebalancing after each removal
    for x in [50, 40, 10]:
        root = delete(root, x)
        print(f"AVL after deleting {x}:")
        print_tree(root)
        print("Inorder (sorted):", inorder_list(root))
        print()