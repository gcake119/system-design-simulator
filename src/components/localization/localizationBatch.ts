export function reduceToOutermostNodes<
  T extends { contains(other: T): boolean },
>(nodes: readonly T[]): T[] {
  const uniqueNodes = Array.from(new Set(nodes));

  return uniqueNodes.filter(
    (node) =>
      !uniqueNodes.some(
        (candidate) => candidate !== node && candidate.contains(node),
      ),
  );
}
