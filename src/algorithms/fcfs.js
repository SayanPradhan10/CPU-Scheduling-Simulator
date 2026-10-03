/**
 * First Come First Serve (FCFS)
 * Processes run in arrival order. For equal arrival times, input order wins.
 */
export function runFcfs(processes) {
  const sortedProcesses = processes
    .map((process, inputOrder) => ({ ...process, inputOrder }))
    .sort((first, second) => first.arrival - second.arrival || first.inputOrder - second.inputOrder);

  const timeline = [];
  const completionTimes = {};
  let currentTime = 0;

  sortedProcesses.forEach((process) => {
    // The CPU waits when the next process has not arrived yet.
    if (process.arrival > currentTime) {
      timeline.push({ processId: 'IDLE', start: currentTime, end: process.arrival, isIdle: true });
      currentTime = process.arrival;
    }

    const start = currentTime;
    currentTime += process.burst;
    timeline.push({ processId: process.id, start, end: currentTime, isIdle: false });
    completionTimes[process.id] = currentTime;
  });

  return {
    timeline,
    completionTimes,
    executionOrder: timeline.filter((segment) => !segment.isIdle).map((segment) => segment.processId),
  };
}

export default runFcfs;
