import type { ScheduleEntry } from "../features/types/modelTypes";

const calculatePositionsForEntries = (
  entries: ScheduleEntry[],
  rowsPerHour: number
) => {
  const entryNodes = entries.map((entry: ScheduleEntry) => ({
    id: entry.id,
    dayOfWeek: entry.dayOfWeek,
    scheduleOptionId: entry.scheduleOptionId,
    startRow:
      (parseInt(entry.startTime.split(":")[0]) +
        parseInt(entry.startTime.split(":")[1]) / 60) *
      rowsPerHour,
    endRow:
      (parseInt(entry.endTime.split(":")[0]) +
        parseInt(entry.endTime.split(":")[1]) / 60) *
      rowsPerHour,
    rowSpan: entry.durationInHours * rowsPerHour,
    duration: entry.durationInHours,
    columnIndex: 0,
    totalColumns: 0,
  }));

  const graph: Map<string, typeof entryNodes> = new Map();
  for (const entryNode of entryNodes) {
    // O(N^2 FIX)
    graph.set(
      entryNode.id,
      entryNodes.filter(
        (node) =>
          node.id !== entryNode.id &&
          node.dayOfWeek === entryNode.dayOfWeek &&
          node.startRow < entryNode.endRow &&
          node.endRow > entryNode.startRow
      )
    );
  }

  const clusters: (typeof entryNodes)[] = [];
  const visited = new Set<string>();

  for (const [nodeId] of graph) {
    if (!visited.has(nodeId)) {
      const cluster: typeof entryNodes = [];
      const queue = [nodeId];

      while (queue.length > 0) {
        const current = queue.shift()!;
        if (visited.has(current)) continue;

        visited.add(current);
        const node = entryNodes.find((e) => e.id === current);
        if (node) {
          cluster.push(node);
        }
        const neighbors = graph.get(current) || [];
        for (const neighbor of neighbors) {
          if (!visited.has(neighbor.id)) {
            queue.push(neighbor.id);
          }
        }
      }

      clusters.push(cluster);
    }
  }

  for (const cluster of clusters) {
    const columns: (typeof entryNodes)[] = [];

    for (const entry of cluster.sort((a, b) => a.startRow - b.startRow)) {
      let placed = false;
      for (let i = 0; i < columns.length; i++) {
        const last = columns[i][columns[i].length - 1];
        if (last.endRow <= entry.startRow) {
          columns[i].push(entry);
          entry.columnIndex = i;
          placed = true;
          break;
        }
      }

      if (!placed) {
        columns.push([entry]);
        entry.columnIndex = columns.length - 1;
      }
    }

    for (const entry of cluster) {
      entry.totalColumns = columns.length;
    }
  }

  return entryNodes;
};

export default calculatePositionsForEntries;
