import { CheckIcon, PenIcon, TrashIcon } from "./Icons";

export default function TaskCard({
  task,
  isBusy,
  isEditing,
  editForm,
  onEditChange,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onToggle,
  onDelete,
}) {
  if (isEditing) {
    return (
      <li className="task-card editing">
        <form className="edit-form" onSubmit={onSaveEdit}>
          <div className="field">
            <label htmlFor={`edit-title-${task.id}`}>Title</label>
            <input
              id={`edit-title-${task.id}`}
              value={editForm.title}
              onChange={(event) =>
                onEditChange({ ...editForm, title: event.target.value })
              }
              maxLength={120}
              autoFocus
              required
            />
          </div>

          <div className="field">
            <label htmlFor={`edit-description-${task.id}`}>Description</label>
            <textarea
              id={`edit-description-${task.id}`}
              value={editForm.description}
              onChange={(event) =>
                onEditChange({ ...editForm, description: event.target.value })
              }
              rows={2}
              maxLength={500}
            />
          </div>

          <div className="edit-actions">
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={isBusy}
            >
              Save
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={onCancelEdit}
            >
              Cancel
            </button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className={`task-card ${task.completed ? "is-completed" : ""}`}>
      <button
        type="button"
        className="check-button"
        onClick={onToggle}
        disabled={isBusy}
        aria-pressed={task.completed}
        aria-label={
          task.completed ? "Mark as open" : "Mark as completed"
        }
        title={task.completed ? "Mark as open" : "Mark as completed"}
      >
        {task.completed && <CheckIcon size={15} />}
      </button>

      <div className="task-content">
        <div className="task-title-row">
          <h3>{task.title}</h3>
          <span className="task-id">#{task.id}</span>
        </div>

        {task.description ? (
          <p>{task.description}</p>
        ) : (
          <p className="task-empty">No description</p>
        )}

        <span className={`status-pill ${task.completed ? "done" : "todo"}`}>
          {task.completed ? "Completed" : "Open"}
        </span>
      </div>

      <div className="task-actions">
        <button
          type="button"
          className="icon-button"
          onClick={onStartEdit}
          aria-label={`Edit ${task.title}`}
          title="Edit"
        >
          <PenIcon size={17} />
        </button>
        <button
          type="button"
          className="icon-button danger"
          onClick={onDelete}
          disabled={isBusy}
          aria-label={`Delete ${task.title}`}
          title="Delete"
        >
          <TrashIcon size={17} />
        </button>
      </div>
    </li>
  );
}
