# CPU Scheduling Simulator

A beginner-friendly, browser-based CPU Scheduling Simulator. It lets students enter processes, choose a scheduling algorithm, and immediately see the execution order, a visual Gantt chart, and the calculated scheduling metrics.

There is no backend: every calculation happens in the browser.

## Contents

- [What is CPU scheduling?](#what-is-cpu-scheduling)
- [Tech stack](#tech-stack)
- [Features](#features)
- [How to run the project](#how-to-run-the-project)
- [How to use the website](#how-to-use-the-website)
- [Algorithms and tie-breaking](#algorithms-and-tie-breaking)
- [Metrics and formulas](#metrics-and-formulas)
- [Example data](#example-data)
- [Architecture](#architecture)
- [Project structure](#project-structure)
- [Testing](#testing)
- [Interview explanation](#interview-explanation)

## What is CPU scheduling?

When multiple programs are ready to run, an operating system needs a rule for deciding which process gets CPU time next. That decision is called **CPU scheduling**.

Each process in this project has:

| Field | Meaning | Example |
| --- | --- | --- |
| Process ID | A unique name for the process | `P1` |
| Arrival Time | Time at which the process becomes ready | `0` |
| Burst Time | Total CPU time required by the process | `5` |
| Priority | Importance level used by Priority Scheduling | `1` (highest) |

Different scheduling algorithms make different choices. For example, FCFS favors arrival order, SJF favors short jobs, Round Robin favors fair turns, and Priority Scheduling favors important jobs.

## Tech stack

| Technology | How it is used |
| --- | --- |
| **React** | Builds the interactive UI from reusable components. |
| **JavaScript and JSX** | Contains the scheduling logic and React components. |
| **HTML** | Provides the root page in `index.html`. |
| **CSS** | Creates the responsive dashboard, cards, tables, Gantt chart, and simple animation. |
| **Vite** | Local development server and production build tool. |
| **Node.js** | Runs the development, build, and test commands. |

The project deliberately does **not** use a backend, database, authentication, Tailwind CSS, or extra scheduling libraries. The algorithms are written in plain, readable JavaScript so they are easy to explain in an operating systems interview.

## Features

- Add, edit, delete, clear, and load example processes.
- Validate process IDs, arrival times, burst times, and priorities.
- Simulate exactly four algorithms:
  - FCFS
  - SJF (non-preemptive)
  - Round Robin
  - Priority Scheduling (non-preemptive)
- Show the Time Quantum input only for Round Robin.
- Display CPU idle periods when no process is ready.
- Show the execution timeline as a color-coded, responsive Gantt chart.
- Show process-level completion, turnaround, and waiting times.
- Show average waiting time, average turnaround time, CPU utilization, and total elapsed time.
- Optional left-to-right Gantt chart animation.
- Show a short explanation and deterministic tie-breaking rule for the selected algorithm.

## How to run the project

### Prerequisites

Install [Node.js](https://nodejs.org/) version 18 or newer. Node.js includes `npm`.

### Install and start

Open a terminal in the project folder and run:

```bash
npm install
npm run dev
```

Vite prints a local address such as `http://localhost:5173`. Open that address in a browser.

### Other commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Starts the local development website. |
| `npm run build` | Creates an optimized production build in `dist/`. |
| `npm run preview` | Opens the previously created production build locally. Run `npm run build` first. |
| `npm test` | Runs automated checks for the scheduling algorithms. |

## How to use the website

### Quick start with the built-in example

1. Open the website after running `npm run dev`.
2. The default process table already contains the example data. You can also click **Load example data** at any time to restore it.
3. Choose an algorithm: **FCFS**, **SJF**, **Round Robin**, or **Priority**.
4. If you choose **Round Robin**, enter a positive **Time Quantum**. The example uses `2`.
5. Optionally enable **Animate execution** to reveal the Gantt chart one CPU segment at a time.
6. Click **Run simulation**.
7. Read the Gantt chart from left to right, then review the process table and performance summary below it.

### Add a process

In the **Add a process** area:

1. Enter a unique Process ID, such as `P5`.
2. Enter its Arrival Time. It must be `0` or greater.
3. Enter its Burst Time. It must be greater than `0`.
4. Enter its Priority. Any valid number is accepted; a smaller number means a higher priority.
5. Click **Add process**.

### Edit or remove a process

- Edit any value directly in the process table.
- Click the `×` button on a row to delete that process.
- Click **Clear all** to remove every process.
- Click **Load example data** to bring back the supplied sample and reset the Round Robin quantum to `2`.

Changing process data or changing the selected algorithm clears old results. Run the simulation again to calculate fresh results.

### Input validation

The simulator prevents a run and displays a message when:

- The process list is empty.
- A Process ID is empty or repeated.
- Arrival Time is negative or not a number.
- Burst Time is zero, negative, or not a number.
- Priority is not a valid number.
- Round Robin Time Quantum is zero, negative, or not a number.

## Reading the results

### Gantt chart

The Gantt chart is the visual execution timeline.

- Each colored block is a process using the CPU.
- The label inside a block gives the Process ID.
- `start → end` shows the CPU time used by that segment.
- A striped **IDLE** block means no process was ready, so the CPU had nothing to execute.
- In Round Robin, the same process can appear multiple times because it can receive multiple time slices.

For example:

```text
0          5        8         12       14
|    P1    |   P2   |    P3    |   P4   |
```

This means P1 ran from time 0 to 5, P2 ran from 5 to 8, and so on.

### Process results table

After a simulation, the table contains:

| Column | Meaning |
| --- | --- |
| Process | Process ID |
| Arrival Time | Time when the process becomes ready |
| Burst Time | Total CPU time needed by the process |
| Priority | Shown for Priority Scheduling only |
| Completion Time | Time when the process finishes completely |
| Turnaround Time | Total time from arrival to completion |
| Waiting Time | Time spent waiting in the ready queue |

### Performance summary

The metric cards show:

- **Average Waiting Time:** average time processes wait for CPU access.
- **Average Turnaround Time:** average time from process arrival until completion.
- **CPU Utilization:** percentage of total elapsed time that the CPU was running a process instead of being idle.
- **Total Elapsed Time:** time from `0` to the final process completion.

## Algorithms and tie-breaking

Only the following four algorithms are implemented.

| Algorithm | How it chooses the next process | Important behavior |
| --- | --- | --- |
| **FCFS** | Earliest arriving process runs first. | Non-preemptive: once it starts, it finishes before the next process starts. |
| **SJF** | Among ready processes, chooses the smallest Burst Time. | Non-preemptive. A shorter process that arrives later cannot interrupt the current process. |
| **Round Robin** | Takes the first process from a ready queue. | Each turn runs for at most the Time Quantum, then unfinished work returns to the queue. |
| **Priority** | Among ready processes, chooses the smallest numeric Priority value. | `1` is the highest priority. This version is non-preemptive. |

### Deterministic tie-breaking

Using deterministic rules means the same input always gives the same output.

- **FCFS:** when Arrival Times are equal, the process entered earlier in the input table runs first.
- **SJF:** when Burst Times are equal, use Arrival Time, then input-table order.
- **Priority:** when Priorities are equal, use Arrival Time, then input-table order.
- **Round Robin:** processes arriving while a time slice is running enter the ready queue before the unfinished current process is added back to the end.

## Metrics and formulas

```text
Completion Time (CT) = time at which a process finishes

Turnaround Time (TAT) = CT - Arrival Time

Waiting Time (WT) = TAT - Burst Time

Average WT = sum of all waiting times / number of processes

Average TAT = sum of all turnaround times / number of processes

CPU Utilization = total busy CPU time / total elapsed time × 100
```

### Small metric example

If a process arrives at time `1`, needs a burst time of `3`, and completes at time `8`:

```text
TAT = 8 - 1 = 7
WT  = 7 - 3 = 4
```

So the process spent 7 total time units in the system and 4 of those units waiting for the CPU.

## Example data

Click **Load example data** to use this workload:

| Process | Arrival Time | Burst Time | Priority |
| --- | ---: | ---: | ---: |
| P1 | 0 | 5 | 2 |
| P2 | 1 | 3 | 1 |
| P3 | 2 | 4 | 3 |
| P4 | 4 | 2 | 2 |

For Round Robin, use a Time Quantum of `2`.

Expected execution orders for this example:

| Algorithm | Execution order |
| --- | --- |
| FCFS | `P1 → P2 → P3 → P4` |
| SJF | `P1 → P4 → P2 → P3` |
| Priority | `P1 → P2 → P4 → P3` |
| Round Robin (`q = 2`) | `P1 → P2 → P3 → P1 → P4 → P2 → P3 → P1` |

## Architecture

```text
User Input
   ↓
Algorithm Selection
   ↓
Scheduling Engine
   ↓
Execution Timeline
   ↓
Metrics Calculator
   ↓
Gantt Chart + Results
```

### How data moves through the app

1. `App.jsx` stores processes, the selected algorithm, the time quantum, and the simulation result.
2. It validates user input before a run.
3. It sends clean process data to one pure scheduling function in `src/algorithms/`.
4. That algorithm returns a standard result with `timeline`, `completionTimes`, and `executionOrder`.
5. `src/utils/metrics.js` uses completion times to calculate CT, TAT, WT, averages, and CPU utilization.
6. React components render the returned data as the Gantt chart, results table, and metric cards.

Keeping algorithms separate from UI components makes the operating-system logic easy to understand, test, and explain.

## Project structure

```text
src/
├── algorithms/
│   ├── fcfs.js              # First Come First Serve logic
│   ├── sjf.js               # Non-preemptive Shortest Job First logic
│   ├── roundRobin.js        # Round Robin queue and time-slice logic
│   └── priority.js          # Non-preemptive Priority logic
│
├── components/
│   ├── Header.jsx           # Page title area
│   ├── ProcessInput.jsx     # Add-process form
│   ├── ProcessTable.jsx     # Editable process table
│   ├── AlgorithmSelector.jsx  # Algorithm choices and quantum input
│   ├── SimulationControls.jsx # Run button and animation option
│   ├── GanttChart.jsx       # Visual execution timeline
│   └── MetricsCard.jsx      # Summary metric card
│
├── utils/
│   └── metrics.js           # CT, TAT, WT, averages, and utilization
│
├── App.jsx                  # Main state, validation, and dashboard layout
├── main.jsx                 # React application entry point
└── index.css                # Responsive styles and animation

tests/
└── algorithms.test.mjs      # Automated algorithm and idle-time checks
```

## Testing

Run:

```bash
npm test
```

The automated tests use the included example dataset and verify:

- FCFS execution order and metrics.
- SJF execution order.
- Round Robin time-slice order and completion times.
- Priority execution order.
- CPU idle timeline handling and utilization.

You can also test manually in the website:

1. Click **Load example data**.
2. Run each of the four algorithms.
3. Compare the displayed execution order with the expected orders in the [Example data](#example-data) section.
4. Enable **Animate execution** and run Round Robin to see one time slice appear at a time.
5. Try a first process with Arrival Time greater than `0` to see an `IDLE` chart block.


