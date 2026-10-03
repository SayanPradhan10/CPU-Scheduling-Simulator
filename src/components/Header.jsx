export default function Header() {
  return (
    <header className="hero">
      <div className="hero__eyebrow">
        <span className="status-dot" /> Interactive operating systems lab
      </div>
      <div className="hero__content">
        <div>
          <h1>CPU Scheduling Simulator</h1>
          <p>See exactly how an operating system decides which process gets the CPU next.</p>
        </div>
        <div className="hero__chip" aria-label="Runs entirely in your browser">
          <span aria-hidden="true">◉</span> Browser-based
        </div>
      </div>
    </header>
  );
}
