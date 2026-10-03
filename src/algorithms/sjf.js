/**
 * Shortest Job First (non-preemptive)
 * Among arrived processes, pick the smallest burst time. A selected job finishes before another can run.
 */
export function runSjf(processes) {
  const waitingProcesses = processes
    .map((process, inputOrder) => ({ ...process, inputOrder }))
    .sort((first, second) => first.arrival - second.arrival || first.inputOrder - second.inputOrder);

  const timeline = [];
  const completionTimes = {};
  let currentTime = 0;

  while (waitingProcesses.length > 0) {
    const readyProcesses = waitingProcesses.filter((process) => process.arrival <= currentTime);

    if (readyProcesses.length === 0) {
      // Nothing is ready, so show the CPU's idle period before jumping ahead.
      const nextArrival = waitingProcesses[0].arrival;
      timeline.push({ processId: 'IDLE', start: currentTime, end: nextArrival, isIdle: true });
      currentTime = nextArrival;
      continue;
    }

    // Ties are resolved by arrival time, then the process's original input order.
    readyProcesses.sort(
      (first, second) =>
        first.burst - second.burst ||
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

export default runSjf;
