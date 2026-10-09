# CLAUDE.md

## Project Rules

### Documentation

Always save any generated documentation as files inside the project repository.

Never leave plans only in the chat.

Use these locations:

- docs/plans/        -> implementation plans
- docs/design/       -> design documents
- docs/tasks/        -> task breakdowns
- docs/notes/        -> research notes

Create directories if they do not already exist.

### File Naming

Use descriptive filenames and created order number .

Examples:

docs/plans/01-authentication-refactor.md
docs/plans/02-payment-api-plan.md
docs/tasks/01-user-profile-checklist.md

### When I ask for a plan

Instead of only replying in chat:

1. Create a markdown file under `docs/plans/`.
2. Then summarize the contents in chat.
3. If updating an existing plan, modify the existing file instead of creating duplicates.