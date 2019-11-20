class Graph {
  constructor() {
    this.adjacencyList = {};
  }

  addVertex(vertex) {
    this.adjacencyList[vertex] = [];
  }

  addEdge(source, destination, weight = 1) {
    this.adjacencyList[source].push({vertex: destination, weight});
  }

  getAdjacencyList() {
    return this.adjacencyList;
  }
}