/**
 * Converts an algorithm's completion times into the scheduling values shown to the user.
 * TAT = CT - arrival time, and WT = TAT - burst time.
 */
export function calculateMetrics(processes, schedule) {
  const results = processes.map((process) => {
    const completionTime = schedule.completionTimes[process.id];
    const turnaroundTime = completionTime - process.arrival;
    const waitingTime = turnaroundTime - process.burst;

    return {
      ...process,
      completionTime,
      turnaroundTime,
      waitingTime,
    };
  });

  const totals = results.reduce(
    (currentTotals, process) => ({
      waitingTime: currentTotals.waitingTime + process.waitingTime,
      turnaroundTime: currentTotals.turnaroundTime + process.turnaroundTime,
    }),
    { waitingTime: 0, turnaroundTime: 0 },
  );

  const totalBusyTime = schedule.timeline
    .filter((segment) => !segment.isIdle)
    .reduce((sum, segment) => sum + (segment.end - segment.start), 0);
  const totalElapsedTime = schedule.timeline.length > 0 ? schedule.timeline.at(-1).end : 0;

  return {
    results,
    averageWaitingTime: results.length ? totals.waitingTime / results.length : 0,
    averageTurnaroundTime: results.length ? totals.turnaroundTime / results.length : 0,
    cpuUtilization: totalElapsedTime ? (totalBusyTime / totalElapsedTime) * 100 : 0,
    totalElapsedTime,
  };
}
