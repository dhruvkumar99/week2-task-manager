\# Interactive Task Manager (Week 2)



A feature-rich task management application built with \*\*vanilla JavaScript\*\*.

Includes CRUD operations, filtering, searching, drag \& drop reorder, dark/light mode, and \*\*localStorage persistence\*\*.



\## Features

\- Add / edit / delete tasks

\- Mark complete / incomplete

\- Filter: All / Active / Completed

\- Search tasks instantly

\- Task statistics: Total / Active / Completed

\- Data persistence using localStorage

\- Drag \& drop to reorder tasks

\- Dark / light mode toggle

\- Keyboard shortcuts:

&nbsp; - Enter: add task (when focused in input)

&nbsp; - Esc: cancel edit

&nbsp; - Ctrl + K: focus search



\## Project Structure



\## How to Run

1\. Download / clone this folder

2\. Open `index.html` in a browser (Chrome/Edge/Firefox)



\## Technical Details

\- Tasks stored in `localStorage` key: `tasks\_v1`

\- Theme stored in `localStorage` key: `theme\_v1`

\- Tasks are objects:

&nbsp; - id (number), text (string), completed (boolean)

&nbsp; - createdAt (ISO string), priority (low/medium/high)

&nbsp; - dueDate (YYYY-MM-DD string or empty)



\## Validation

\- Task cannot be empty

\- Max length: 120 characters

\- Due date (if provided) must be valid



\## Testing Evidence (sample cases)

\- Add 3 tasks, refresh page -> tasks still present

\- Mark one completed -> Completed count increases, Active decreases

\- Filter Completed -> only completed tasks appear

\- Search "portfolio" -> only matching tasks appear

\- Drag reorder -> refresh -> order persists

