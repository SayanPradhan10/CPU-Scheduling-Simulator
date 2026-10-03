/**
 * Priority Scheduling (non-preemptive)
 * Lower numeric values mean higher priority: priority 1 runs before priority 2.
 */
export function runPriority(processes) {
  const waitingProcesses = processes
    .map((process, inputOrder) => ({ ...process, inputOrder }))
    .sort((first, second) => first.arrival - second.arrival || first.inputOrder - second.inputOrder);

  const timeline = [];
  const completionTimes = {};
  let currentTime = 0;

  while (waitingProcesses.length > 0) {
    const readyProcesses = waitingProcesses.filter((process) => process.arrival <= currentTime);

    if (readyProcesses.length === 0) {
      const nextArrival = waitingProcesses[0].arrival;
      timeline.push({ processId: 'IDLE', start: currentTime, end: nextArrival, isIdle: true });
      currentTime = nextArrival;
      continue;
    }

    // Ties use arrival time, then input order, so results are always predictable.
    readyProcesses.sort(
      (first, second) =>
        first.priority - second.priority ||
        first.arrival - second.arrival ||
        first.inputOrder - second.inputOrder,
    );
    const nextProcess = readyProcesses[0];
    const processIndex = waitingProcesses.findIndex((process) => process.id === nextProcess.id);
    waitingProcesses.splice(processIndex, 1);

    const start = currentTime;
    currentTime += nextProcess.burst;
    timeline.push({ processId: nextProcess.id, start, end: currentTime, isIdle: false });
    completionTimes[nextProcess.id] = currentTime;
  }

  return {
    timeline,
    completionTimes,
    executionOrder: timeline.filter((segment) => !segment.isIdle).map((segment) => segment.processId),
  };
}

export default runPriority;
