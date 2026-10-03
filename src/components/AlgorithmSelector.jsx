const algorithms = [
  { id: 'fcfs', label: 'FCFS', detail: 'First Come First Serve' },
  { id: 'sjf', label: 'SJF', detail: 'Shortest Job First' },
  { id: 'roundRobin', label: 'Round Robin', detail: 'Time-sliced queue' },
  { id: 'priority', label: 'Priority', detail: 'Non-preemptive' },
];

export const algorithmDescriptions = {
  fcfs: {
    name: 'FCFS — First Come First Serve',
    text: 'Processes are executed in the order in which they arrive. Once a process starts, it runs until it finishes.',
    note: 'Tie-breaker: when arrivals match, the earlier row in the input table runs first.',
  },
  sjf: {
    name: 'SJF — Shortest Job First',
    text: 'The ready process with the shortest burst time is selected next. It is non-preemptive, so it runs to completion.',
    note: 'Tie-breaker: equal burst times use arrival time, then input order.',
  },
  roundRobin: {
    name: 'Round Robin',
    text: 'Each ready process gets a fixed CPU time called the time quantum. Unfinished processes return to the end of the queue.',
    note: 'New arrivals join the queue before the just-run process gets another turn.',
  },
  priority: {
    name: 'Priority Scheduling',
    text: 'The ready process with the highest priority is selected first. This simulator treats a smaller number as a higher priority.',
    note: 'Tie-breaker: equal priorities use arrival time, then input order. This version is non-preemptive.',
  },
};

export default function AlgorithmSelector({ selectedAlgorithm, onSelectAlgorithm, timeQuantum, onTimeQuantumChange }) {
  return (
    <section className="algorithm-selector" aria-labelledby="algorithm-heading">
      <div className="section-heading section-heading--compact">
        <div>
          <span className="section-kicker">Step 2</span>
          <h2 id="algorithm-heading">Choose an algorithm</h2>
        </div>
        <p>Each policy decides the next process in a different way.</p>
      </div>

      <div className="algorithm-options" role="radiogroup" aria-label="Scheduling algorithm">
        {algorithms.map((algorithm) => (
          <button
            key={algorithm.id}
            type="button"
            role="radio"
            aria-checked={selectedAlgorithm === algorithm.id}
            className={`algorithm-option ${selectedAlgorithm === algorithm.id ? 'algorithm-option--selected' : ''}`}
            onClick={() => onSelectAlgorithm(algorithm.id)}
          >
            <strong>{algorithm.label}</strong>
            <span>{algorithm.detail}</span>
          </button>
        ))}
      </div>

      {selectedAlgorithm === 'roundRobin' && (
        <label className="quantum-field">
          <span>Time quantum</span>
          <input
            aria-label="Time quantum"
            type="number"
            min="1"
            step="1"
            value={timeQuantum}
            onChange={(event) => onTimeQuantumChange(event.target.value)}
          />
          <small>How long each process can use the CPU before the next turn.</small>
        </label>
      )}
    </section>
  );
}
