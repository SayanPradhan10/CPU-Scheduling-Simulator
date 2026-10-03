export default function ProcessTable({ processes, onUpdateProcess, onDeleteProcess }) {
  if (processes.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-state__icon" aria-hidden="true">◌</span>
        <strong>No processes yet</strong>
        <p>Add a process above or load the example data to begin.</p>
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table className="process-table">
        <thead>
          <tr>
            <th>Process</th>
            <th>Arrival time</th>
            <th>Burst time</th>
            <th>Priority</th>
            <th><span className="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody>
          {processes.map((process, index) => (
            <tr key={`${process.id}-${index}`}>
              <td>
                <input
                  aria-label={`Process ID for row ${index + 1}`}
                  value={process.id}
                  onChange={(event) => onUpdateProcess(index, 'id', event.target.value)}
                />
              </td>
              <td>
                <input
                  aria-label={`Arrival time for ${process.id}`}
                  type="number"
                  min="0"
                  step="1"
                  value={process.arrival}
                  onChange={(event) => onUpdateProcess(index, 'arrival', event.target.value)}
                />
              </td>
              <td>
                <input
                  aria-label={`Burst time for ${process.id}`}
                  type="number"
                  min="1"
                  step="1"
                  value={process.burst}
                  onChange={(event) => onUpdateProcess(index, 'burst', event.target.value)}
                />
              </td>
              <td>
                <input
                  aria-label={`Priority for ${process.id}`}
                  type="number"
                  step="1"
                  value={process.priority}
                  onChange={(event) => onUpdateProcess(index, 'priority', event.target.value)}
                />
              </td>
              <td className="process-table__action">
                <button
                  type="button"
                  className="icon-button icon-button--danger"
                  onClick={() => onDeleteProcess(index)}
                  aria-label={`Delete ${process.id}`}
                  title={`Delete ${process.id}`}
                >
                  ×
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
