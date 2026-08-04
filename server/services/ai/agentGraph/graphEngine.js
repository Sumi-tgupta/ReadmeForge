/**
 * Directed Acyclic Graph (DAG) Multi-Agent Orchestration Engine
 * Coordinates parallel agent execution, state transitions, memory propagation, and event broadcasting.
 */

import { EventEmitter } from 'events';

export default class GraphEngine extends EventEmitter {
  constructor(graphId = 'readme-graph') {
    super();
    this.graphId = graphId;
    this.nodes = new Map();
    this.state = {};
    this.executionLogs = [];
  }

  addNode(nodeId, { name, role, execute, dependencies = [] }) {
    this.nodes.set(nodeId, {
      id: nodeId,
      name,
      role,
      execute,
      dependencies,
      status: 'idle',
      result: null,
      error: null
    });
  }

  async run(initialState = {}) {
    this.state = { ...initialState };
    this.emitEvent('graph_start', { graphId: this.graphId, timestamp: new Date().toISOString() });

    const completed = new Set();
    const running = new Set();
    const nodeIds = Array.from(this.nodes.keys());

    while (completed.size < nodeIds.length) {
      const executableNodes = nodeIds.filter(id => {
        if (completed.has(id) || running.has(id)) return false;
        const node = this.nodes.get(id);
        return node.dependencies.every(dep => completed.has(dep));
      });

      if (executableNodes.length === 0 && running.size === 0) {
        throw new Error('Graph execution deadlocked: missing or unresolvable node dependencies.');
      }

      const promises = executableNodes.map(async id => {
        const node = this.nodes.get(id);
        node.status = 'running';
        running.add(id);

        this.emitEvent('node_start', {
          nodeId: id,
          name: node.name,
          role: node.role
        });

        const startTime = Date.now();
        try {
          const nodeOutput = await node.execute(this.state, (logMessage) => {
            this.emitEvent('node_thinking', {
              nodeId: id,
              name: node.name,
              message: logMessage
            });
          });

          node.status = 'completed';
          node.result = nodeOutput;
          
          Object.assign(this.state, nodeOutput);

          const durationMs = Date.now() - startTime;
          this.emitEvent('node_complete', {
            nodeId: id,
            name: node.name,
            durationMs,
            outputKeys: Object.keys(nodeOutput || {})
          });
        } catch (err) {
          node.status = 'failed';
          node.error = err.message;
          this.emitEvent('node_error', {
            nodeId: id,
            name: node.name,
            error: err.message
          });
          throw err;
        } finally {
          running.delete(id);
          completed.add(id);
        }
      });

      await Promise.all(promises);
    }

    this.emitEvent('graph_complete', {
      graphId: this.graphId,
      finalState: this.state
    });

    return this.state;
  }

  emitEvent(type, payload) {
    const logEntry = { type, payload, timestamp: new Date().toISOString() };
    this.executionLogs.push(logEntry);
    this.emit('event', logEntry);
  }
}
