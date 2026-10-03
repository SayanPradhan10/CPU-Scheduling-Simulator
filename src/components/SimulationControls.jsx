export default function SimulationControls({ onRunSimulation, shouldAnimate, onAnimationChange, disabled }) {
  return (
    <section className="simulation-controls" aria-labelledby="simulation-heading">
      <div>
        <span className="section-kicker">Step 3</span>
        <h2 id="simulation-heading">Run the simulation</h2>
      </div>
      <div className="simulation-controls__actions">
        <label className="toggle">
          <input
            type="checkbox"
            checked={shouldAnimate}
            onChange={(event) => onAnimationChange(event.target.checked)}
          />
          <span className="toggle__track" aria-hidden="true"><span /></span>
          <span>Animate execution</span>
        </label>
        <button className="button button--run" type="button" onClick={onRunSimulation} disabled={disabled}>
          <span aria-hidden="true">▶</span> Run simulation
        </button>
      </div>
    </section>
  );
}
