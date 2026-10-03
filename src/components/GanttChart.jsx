import { useEffect, useState } from 'react';

const colors = ['violet', 'blue', 'teal', 'orange', 'pink', 'indigo', 'green'];

function processColor(processId) {
  if (processId === 'IDLE') return 'idle';
  let value = 0;
  for (let index = 0; index < processId.length; index += 1) value += processId.charCodeAt(index);
  return colors[value % colors.length];
}

export default function GanttChart({ timeline, shouldAnimate, runId }) {
  const [visibleCount, setVisibleCount] = useState(timeline.length);

  useEffect(() => {
    if (!shouldAnimate || timeline.length === 0) {
      setVisibleCount(timeline.length);
      return undefined;
    }

    setVisibleCount(0);
    const intervalId = window.setInterval(() => {
      setVisibleCount((currentCount) => {
        if (currentCount >= timeline.length) {
          window.clearInterval(intervalId);
          return timeline.length;
        }
        return currentCount + 1;
      });
    }, 560);

    return () => window.clearInterval(intervalId);
  }, [runId, shouldAnimate, timeline.length]);

  if (timeline.length === 0) {
    return (
      <div className="chart-placeholder">
        <span aria-hidden="true">▱</span>
        <strong>Your execution timeline will appear here.</strong>
        <p>Add processes, choose an algorithm, then run the simulation.</p>
      </div>
    );
  }

  const displayedSegments = timeline.slice(0, visibleCount);

  return (
    <div className="gantt-wrapper">
      <div className="gantt-legend" aria-label="Gantt chart legend">
        <span><i className="legend-dot legend-dot--process" /> Process executing</span>
        <span><i className="legend-dot legend-dot--idle" /> CPU idle</span>
      </div>
      <div className="gantt-scroll">
        <div className="gantt-chart" aria-label="Execution Gantt chart">
          {displayedSegments.map((segment, index) => {
            const active = shouldAnimate && index === visibleCount - 1 && visibleCount < timeline.length;
            return (
              <div
                key={`${segment.processId}-${segment.start}-${index}`}
                className={`gantt-block gantt-block--${processColor(segment.processId)} ${active ? 'gantt-block--active' : ''}`}
                style={{ flexGrow: Math.max(segment.end - segment.start, 1) }}
                aria-label={`${segment.processId}, from ${segment.start} to ${segment.end}`}
              >
                <span className="gantt-block__process">{segment.processId}</span>
                <span className="gantt-block__time">{segment.start} → {segment.end}</span>
                {active && <span className="gantt-block__running">Running</span>}
              </div>
            );
          })}
        </div>
      </div>
      {shouldAnimate && visibleCount < timeline.length && (
        <p className="animation-status" aria-live="polite">Building timeline… {visibleCount} of {timeline.length} CPU segments</p>
      )}
    </div>
  );
}
