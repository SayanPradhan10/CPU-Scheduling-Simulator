import { useMemo, useState } from 'react';
import Header from './components/Header';
import ProcessInput from './components/ProcessInput';
import ProcessTable from './components/ProcessTable';
import AlgorithmSelector, { algorithmDescriptions } from './components/AlgorithmSelector';
import SimulationControls from './components/SimulationControls';
import GanttChart from './components/GanttChart';
import MetricsCard from './components/MetricsCard';
import { runFcfs } from './algorithms/fcfs';
import { runSjf } from './algorithms/sjf';
import { runRoundRobin } from './algorithms/roundRobin';
import { runPriority } from './algorithms/priority';
import { calculateMetrics } from './utils/metrics';

const exampleProcesses = [
  { id: 'P1', arrival: 0, burst: 5, priority: 2 },
  { id: 'P2', arrival: 1, burst: 3, priority: 1 },
  { id: 'P3', arrival: 2, burst: 4, priority: 3 },
  { id: 'P4', arrival: 4, burst: 2, priority: 2 },
];

function getSuggestedId(processes) {
  let nextNumber = processes.length + 1;
  while (processes.some((process) => process.id === `P${nextNumber}`)) nextNumber += 1;
  return `P${nextNumber}`;
}

function validateProcesses(processes) {
  if (processes.length === 0) return { error: 'Add at least one process before running the simulation.' };

  const seenIds = new Set();
  const cleanProcesses = [];

  for (const [index, process] of processes.entries()) {
    const id = String(process.id).trim();
    const arrival = Number(process.arrival);
    const burst = Number(process.burst);
    const priority = Number(process.priority);
    const rowName = `Row ${index + 1}`;

    if (!id) return { error: `${rowName}: Process ID is required.` };
    if (seenIds.has(id)) return { error: `${rowName}: “${id}” is a duplicate Process ID. IDs must be unique.` };
    if (!Number.isFinite(arrival) || arrival < 0) return { error: `${rowName}: Arrival time must be 0 or greater.` };
    if (!Number.isFinite(burst) || burst <= 0) return { error: `${rowName}: Burst time must be greater than 0.` };
    if (!Number.isFinite(priority)) return { error: `${rowName}: Priority must be a valid number.` };

    seenIds.add(id);
    cleanProcesses.push({ id, arrival, burst, priority });
  }

  return { cleanProcesses };
}

function formatNumber(number) {
  return Number(number).toFixed(2).replace(/\.00$/, '');
}

export default function App() {
  const [processes, setProcesses] = useState(exampleProcesses);
  const [algorithm, setAlgorithm] = useState('fcfs');
  const [timeQuantum, setTimeQuantum] = useState('2');
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [simulation, setSimulation] = useState(null);
  const [message, setMessage] = useState('');
  const [runId, setRunId] = useState(0);

  const suggestedId = useMemo(() => getSuggestedId(processes), [processes]);
  const selectedDescription = algorithmDescriptions[algorithm];

  const resetResults = () => setSimulation(null);

  const addProcess = (newProcess) => {
    const validation = validateProcesses([...processes, newProcess]);
    if (validation.error) {
      setMessage(validation.error);
      return null;
    }

    setProcesses(validation.cleanProcesses);
    setMessage('');
    resetResults();
    return getSuggestedId(validation.cleanProcesses);
  };

  const updateProcess = (index, field, value) => {
    setProcesses((currentProcesses) =>
      currentProcesses.map((process, processIndex) =>
        processIndex === index ? { ...process, [field]: value } : process,
      ),
    );
    setMessage('');
    resetResults();
  };

  const deleteProcess = (index) => {
    setProcesses((currentProcesses) => currentProcesses.filter((_, processIndex) => processIndex !== index));
    setMessage('');
    resetResults();
  };

  const loadExampleData = () => {
    setProcesses(exampleProcesses.map((process) => ({ ...process })));
    setTimeQuantum('2');
    setMessage('Example data loaded. It uses a Round Robin time quantum of 2.');
    resetResults();
  };

  const clearProcesses = () => {
    setProcesses([]);
    setMessage('');
    resetResults();
  };

  const runSimulation = () => {
    const validation = validateProcesses(processes);
    if (validation.error) {
      setMessage(validation.error);
      resetResults();
      return;
    }

    const cleanProcesses = validation.cleanProcesses;
    const quantum = Number(timeQuantum);
    if (algorithm === 'roundRobin' && (!Number.isFinite(quantum) || quantum <= 0)) {
      setMessage('Time quantum must be a number greater than 0 for Round Robin.');
      resetResults();
      return;
    }

    let schedule;
    if (algorithm === 'fcfs') schedule = runFcfs(cleanProcesses);
    if (algorithm === 'sjf') schedule = runSjf(cleanProcesses);
    if (algorithm === 'roundRobin') schedule = runRoundRobin(cleanProcesses, quantum);
    if (algorithm === 'priority') schedule = runPriority(cleanProcesses);

    const metrics = calculateMetrics(cleanProcesses, schedule);
    setProcesses(cleanProcesses);
    setSimulation({ ...schedule, metrics });
    setMessage('Simulation complete. Read the Gantt chart from left to right to follow CPU execution.');
    setRunId((currentRun) => currentRun + 1);
  };

  return (
    <main className="app-shell">
      <Header />

      <div className="dashboard-grid">
        <section className="panel input-panel" aria-labelledby="processes-heading">
          <div className="section-heading">
            <div>
              <span className="section-kicker">Setup</span>
              <h2 id="processes-heading">Processes</h2>
            </div>
            <p>Use the table to update a process at any time.</p>
          </div>

          <ProcessTable
            processes={processes}
            onUpdateProcess={updateProcess}
            onDeleteProcess={deleteProcess}
          />

          <div className="table-controls">
            <button className="button button--secondary" type="button" onClick={loadExampleData}>
              <span aria-hidden="true">↻</span> Load example data
            </button>
            <button className="button button--ghost-danger" type="button" onClick={clearProcesses} disabled={!processes.length}>
              Clear all
            </button>
          </div>

          <ProcessInput onAddProcess={addProcess} suggestedId={suggestedId} />
        </section>

        <aside className="side-stack">
          <section className="panel">
            <AlgorithmSelector
              selectedAlgorithm={algorithm}
              onSelectAlgorithm={(nextAlgorithm) => {
                setAlgorithm(nextAlgorithm);
                setMessage('');
                resetResults();
              }}
              timeQuantum={timeQuantum}
              onTimeQuantumChange={setTimeQuantum}
            />
          </section>

          <section className="panel panel--accent">
            <SimulationControls
              onRunSimulation={runSimulation}
              shouldAnimate={shouldAnimate}
              onAnimationChange={setShouldAnimate}
              disabled={processes.length === 0}
            />
          </section>
        </aside>
      </div>

      {message && (
        <p className={`notice ${simulation ? 'notice--success' : ''}`} role="status">
          <span aria-hidden="true">{simulation ? '✓' : '!'}</span> {message}
        </p>
      )}

      <section className="panel explanation-panel" aria-labelledby="how-it-works-heading">
        <div className="explanation-panel__icon" aria-hidden="true">?</div>
        <div>
          <span className="section-kicker">How it works</span>
          <h2 id="how-it-works-heading">{selectedDescription.name}</h2>
          <p>{selectedDescription.text}</p>
          <small>{selectedDescription.note}</small>
        </div>
        <div className="formula-list" aria-label="Scheduling formulas">
          <span><b>TAT</b> = Completion Time − Arrival Time</span>
          <span><b>WT</b> = Turnaround Time − Burst Time</span>
        </div>
      </section>

      <section className="panel results-panel" aria-labelledby="gantt-heading">
        <div className="section-heading">
          <div>
            <span className="section-kicker">Execution timeline</span>
            <h2 id="gantt-heading">Gantt chart</h2>
          </div>
          {simulation && <p>{simulation.executionOrder.join(' → ')}</p>}
        </div>
        <GanttChart timeline={simulation?.timeline ?? []} shouldAnimate={shouldAnimate} runId={runId} />
      </section>

      <section className="panel results-panel" aria-labelledby="results-heading">
        <div className="section-heading">
          <div>
            <span className="section-kicker">Calculated values</span>
            <h2 id="results-heading">Process results</h2>
          </div>
          <p>Completion time is when a process finishes.</p>
        </div>

        {simulation ? (
          <div className="table-wrap">
            <table className="results-table">
              <thead>
                <tr>
                  <th>Process</th>
                  <th>Arrival time</th>
                  <th>Burst time</th>
                  {algorithm === 'priority' && <th>Priority</th>}
                  <th>Completion time</th>
                  <th>Turnaround time</th>
                  <th>Waiting time</th>
                </tr>
              </thead>
              <tbody>
                {simulation.metrics.results.map((process) => (
                  <tr key={process.id}>
                    <td><span className="process-pill">{process.id}</span></td>
                    <td>{formatNumber(process.arrival)}</td>
                    <td>{formatNumber(process.burst)}</td>
                    {algorithm === 'priority' && <td>{formatNumber(process.priority)}</td>}
                    <td>{formatNumber(process.completionTime)}</td>
                    <td className="results-table__highlight">{formatNumber(process.turnaroundTime)}</td>
                    <td className="results-table__highlight results-table__highlight--waiting">{formatNumber(process.waitingTime)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="chart-placeholder chart-placeholder--small">
            <span aria-hidden="true">⊞</span>
            <strong>Run a simulation to calculate each process’s metrics.</strong>
          </div>
        )}
      </section>

      <section className="performance-section" aria-labelledby="performance-heading">
        <div className="section-heading">
          <div>
            <span className="section-kicker">At a glance</span>
            <h2 id="performance-heading">Performance summary</h2>
          </div>
          <p>Lower waiting and turnaround time are usually better.</p>
        </div>
        <div className="metrics-grid">
          <MetricsCard
            label="Average waiting time"
            value={simulation ? formatNumber(simulation.metrics.averageWaitingTime) : '—'}
            description="Average time spent waiting for the CPU"
            accent="violet"
          />
          <MetricsCard
            label="Average turnaround time"
            value={simulation ? formatNumber(simulation.metrics.averageTurnaroundTime) : '—'}
            description="Average time from arrival until finish"
            accent="blue"
          />
          <MetricsCard
            label="CPU utilization"
            value={simulation ? `${formatNumber(simulation.metrics.cpuUtilization)}%` : '—'}
            description="Percentage of elapsed time the CPU was busy"
            accent="teal"
          />
          <MetricsCard
            label="Total elapsed time"
            value={simulation ? formatNumber(simulation.metrics.totalElapsedTime) : '—'}
            description="From time 0 through the last completion"
            accent="orange"
          />
        </div>
      </section>

      <footer className="app-footer">
        Built to make operating system scheduling concepts easier to see, test, and explain.
      </footer>
    </main>
  );
}
