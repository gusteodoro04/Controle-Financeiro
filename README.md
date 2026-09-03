# Financial Control (Controle Financeiro)

A simple, framework-free web app for tracking income and expenses, with data persisted in the browser's Local Storage. This is version 2 (v2), built on top of a v1 base with three usability and correctness improvements.

## Features

- Add transactions with a description and a value.
- Choose the transaction type (**Income** / **Expense**) through a segmented toggle — no need to type a negative number.
- Automatic calculation of **Balance**, **Total Income**, and **Total Expenses**.
- Transactions persist across page reloads via `localStorage`.
- Delete any transaction with a single click.

## Project Structure
├── index.html # Markup: balance summary, form, and transaction list
├── style.css # Styling, including the income/expense toggle
└── controle.js # App logic: state, calculations, and Local Storage sync
Aqui está o conteúdo do README (em Markdown), pronto para você copiar:

```markdown
# Financial Control (Controle Financeiro)

A simple, framework-free web app for tracking income and expenses, with data persisted in the browser's Local Storage. This is version 2 (v2), built on top of a v1 base with three usability and correctness improvements.

## Features

- Add transactions with a description and a value.
- Choose the transaction type (**Income** / **Expense**) through a segmented toggle — no need to type a negative number.
- Automatic calculation of **Balance**, **Total Income**, and **Total Expenses**.
- Transactions persist across page reloads via `localStorage`.
- Delete any transaction with a single click.

## Project Structure

```
├── index.html      # Markup: balance summary, form, and transaction list
├── style.css       # Styling, including the income/expense toggle
└── controle.js     # App logic: state, calculations, and Local Storage sync
```

## Improvements over v1

### 1. Incremental transaction IDs
Instead of a random id (`parseInt(Math.random() * 1000)`, which could collide), each transaction now gets a sequential id starting at `0`. A `proximoId` counter is initialized from the highest id already stored (or `0` if storage is empty) and increments by one on every new transaction, so ids are always unique and predictable — even after deletions.

### 2. No negative numbers in the form
The amount field now only accepts positive numbers (`min="0.01"`). Sign is no longer typed by the user — instead, a segmented toggle (**▲ Income** / **▼ Expense**), built with styled radio buttons, determines whether the value is treated as positive or negative. This removes a common source of user error and makes the intent explicit and visual.

### 3. Efficient deletion (no full reload)
Deleting a transaction used to clear the entire list and balances, then rebuild everything from the data in Local Storage. Now, `excluiTransacao` does three targeted things instead:
- Removes only the clicked `<li>` element from the DOM.
- Removes only that transaction from the in-memory array and updates Local Storage.
- Updates the balance and the income/expense totals by subtracting just the deleted transaction's value, rather than recalculating from scratch.

## How to Run

1. Download `index.html`, `style.css`, and `controle.js` into the same folder.
2. Open `index.html` in any modern browser.
3. Add transactions and watch the balance update — your data will still be there next time you open the page.

## Technologies

- HTML5
- CSS3 (Flexbox, custom radio/label toggle component)
- Vanilla JavaScript (DOM manipulation, `localStorage` API)
```
