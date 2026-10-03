/**
 * Round Robin
 * Ready processes take turns. Each gets at most one time quantum per turn.
 */
export function runRoundRobin(processes, timeQuantum) {
  const sortedProcesses = processes
    .map((process, inputOrder) => ({ ...process, inputOrder, remainingBurst: process.burst }))
    .sort((first, second) => first.arrival - second.arrival || first.inputOrder - second.inputOrder);

  const timeline = [];
  const completionTimes = {};
  const readyQueue = [];
  let nextProcessIndex = 0;
  let currentTime = 0;

  const addArrivedProcesses = () => {
    while (
      nextProcessIndex < sortedProcesses.length &&
      sortedProcesses[nextProcessIndex].arrival <= currentTime
    ) {
      readyQueue.push(sortedProcesses[nextProcessIndex]);
      nextProcessIndex += 1;
    }
  };

  while (readyQueue.length > 0 || nextProcessIndex < sortedProcesses.length) {
    addArrivedProcesses();

    if (readyQueue.length === 0) {
      // The ready queue is empty, so the CPU is idle until the next arrival.
      const nextArrival = sortedProcesses[nextProcessIndex].arrival;
      timeline.push({ processId: 'IDLE', start: currentTime, end: nextArrival, isIdle: true });
      currentTime = nextArrival;
      addArrivedProcesses();
    }

    const currentProcess = readyQueue.shift();
    const start = currentTime;
    const executionTime = Math.min(currentProcess.remainingBurst, timeQuantum);
    currentTime += executionTime;
    currentProcess.remainingBurst -= executionTime;

    timeline.push({ processId: currentProcess.id, start, end: currentTime, isIdle: false });

    // New arrivals go in the queue before a process that needs another turn.
    addArrivedProcesses();
    if (currentProcess.remainingBurst > 0) {
      readyQueue.push(currentProcess);
    } else {
      completionTimes[currentProcess.id] = currentTime;
    }
  }

  return {
    timeline,
    completionTimes,
    executionOrder: timeline.filter((segment) => !segment.isIdle).map((segment) => segment.processId),
  };
}

export default runRoundRobin;
