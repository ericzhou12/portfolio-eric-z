on a new session, do not fully read the codebase; here is the summary:

portfolio is broken into 3 pages.
home: status line (swaps to last.fm now-playing w/ purple blob glow while listening), a mini graph of the neural network for work exp, and also some other data
experience: has interactable neural network for work exp and list view
background: recognition (honors, education, certs) and skills, just text.

code is organized by feature:
src/features/{home,experience,background,music}/ — components + their own lib files, colocated
src/components/ — shared chrome (header, footer, social rail, theme) and primitives (reveal, section)
src/lib/ — content.ts (all site copy, single source of truth), utils.ts
src/app/ — routes only; globals.css holds all css incl. feature-specific keyframes

minimize comments, comment lines only on logically complex or complicated changes.

do not run shell cmds unless specified to do so, summarize what was completed once finished