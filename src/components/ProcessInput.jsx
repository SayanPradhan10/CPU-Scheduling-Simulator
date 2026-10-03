import { useState } from 'react';

const emptyDraft = { id: '', arrival: '0', burst: '1', priority: '1' };

export default function ProcessInput({ onAddProcess, suggestedId }) {
  const [draft, setDraft] = useState({ ...emptyDraft, id: suggestedId });

  const updateDraft = (field, value) => {
    setDraft((currentDraft) => ({ ...currentDraft, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextSuggestedId = onAddProcess({
      id: draft.id.trim(),
      arrival: Number(draft.arrival),
      burst: Number(draft.burst),
      priority: Number(draft.priority),
    });

    if (nextSuggestedId) {
      setDraft({ ...emptyDraft, id: nextSuggestedId });
    }
  };

  return (
    <form className="process-form" onSubmit={handleSubmit}>
      <div className="section-heading section-heading--compact">
        <div>
          <span className="section-kicker">Step 1</span>
          <h2>Add a process</h2>
        </div>
        <p>Every process needs an ID, arrival time, burst time, and priority.</p>
      </div>

      <div className="process-form__fields">
        <label>
          <span>Process ID</span>
          <input
            aria-label="Process ID"
            value={draft.id}
            onChange={(event) => updateDraft('id', event.target.value)}
            placeholder="P1"
            required
          />
        </label>
        <label>
          <span>Arrival time</span>
          <input
            aria-label="Arrival time"
            type="number"
            min="0"
            step="1"
            value={draft.arrival}
            onChange={(event) => updateDraft('arrival', event.target.value)}
            required
          />
        </label>
        <label>
          <span>Burst time</span>
          <input
            aria-label="Burst time"
            type="number"
            min="1"
            step="1"
            value={draft.burst}
            onChange={(event) => updateDraft('burst', event.target.value)}
            required
          />
        </label>
        <label>
          <span>Priority <small>(1 = highest)</small></span>
          <input
            aria-label="Priority"
            type="number"
            step="1"
            value={draft.priority}
            onChange={(event) => updateDraft('priority', event.target.value)}
            required
          />
        </label>
        <button className="button button--primary process-form__button" type="submit">
          <span aria-hidden="true">＋</span> Add process
        </button>
      </div>
    </form>
  );
}
