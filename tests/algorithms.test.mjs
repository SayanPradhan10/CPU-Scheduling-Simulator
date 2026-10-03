import test from 'node:test';
import assert from 'node:assert/strict';
import { runFcfs } from '../src/algorithms/fcfs.js';
import { runSjf } from '../src/algorithms/sjf.js';
import { runRoundRobin } from '../src/algorithms/roundRobin.js';
import { runPriority } from '../src/algorithms/priority.js';
import { calculateMetrics } from '../src/utils/metrics.js';

const example = [
  { id: 'P1', arrival: 0, burst: 5, priority: 2 },
  { id: 'P2', arrival: 1, burst: 3, priority: 1 },
  { id: 'P3', arrival: 2, burst: 4, priority: 3 },
  { id: 'P4', arrival: 4, burst: 2, priority: 2 },
];

test('FCFS follows arrival order and calculates metrics', () => {
  const schedule = runFcfs(example);
  assert.deepEqual(schedule.executionOrder, ['P1', 'P2', 'P3', 'P4']);
  assert.deepEqual(schedule.completionTimes, { P1: 5, P2: 8, P3: 12, P4: 14 });

  const metrics = calculateMetrics(example, schedule);
  assert.equal(metrics.averageWaitingTime, 4.5);
  assert.equal(metrics.averageTurnaroundTime, 8);
  assert.equal(metrics.cpuUtilization, 100);
});

test('SJF selects the shortest ready job without preempting', () => {
  const schedule = runSjf(example);
  assert.deepEqual(schedule.executionOrder, ['P1', 'P4', 'P2', 'P3']);
  assert.deepEqual(schedule.completionTimes, { P1: 5, P4: 7, P2: 10, P3: 14 });
});

test('Round Robin cycles processes and adds arrivals before re-queueing', () => {
  const schedule = runRoundRobin(example, 2);
  assert.deepEqual(schedule.executionOrder, ['P1', 'P2', 'P3', 'P1', 'P4', 'P2', 'P3', 'P1']);
  assert.deepEqual(schedule.completionTimes, { P4: 10, P2: 11, P3: 13, P1: 14 });
});

test('Priority runs the smallest numerical priority first', () => {
  const schedule = runPriority(example);
  assert.deepEqual(schedule.executionOrder, ['P1', 'P2', 'P4', 'P3']);
  assert.deepEqual(schedule.completionTimes, { P1: 5, P2: 8, P4: 10, P3: 14 });
});

test('algorithms include CPU idle time when nothing has arrived', () => {
  const schedule = runFcfs([{ id: 'P1', arrival: 3, burst: 2, priority: 1 }]);
  assert.deepEqual(schedule.timeline, [
    { processId: 'IDLE', start: 0, end: 3, isIdle: true },
    { processId: 'P1', start: 3, end: 5, isIdle: false },
  ]);
  assert.equal(calculateMetrics([{ id: 'P1', arrival: 3, burst: 2, priority: 1 }], schedule).cpuUtilization, 40);
});
