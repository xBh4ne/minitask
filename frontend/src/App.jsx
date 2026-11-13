import { useEffect, useMemo, useRef, useState } from "react";
import { apiRequest } from "./api";
import ActivityLog from "./components/ActivityLog";
import TaskCard from "./components/TaskCard";
import { PlusIcon, RefreshIcon, SparkIcon } from "./components/Icons";
import "./App.css";

const EMPTY_FORM = { title: "", description: "" };
const EMPTY_EDIT_FORM = { title: "", description: "" };

function makeLogId() {
	return typeof crypto !== "undefined" && crypto.randomUUID
		? crypto.randomUUID()
		: `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function App() {
	const [tasks, setTasks] = useState([]);
	const [loading, setLoading] = useState(true);
	const [busyId, setBusyId] = useState(null);
	const [online, setOnline] = useState(null);
	const [error, setError] = useState("");
	const [logs, setLogs] = useState([]);
	const [form, setForm] = useState(EMPTY_FORM);
	const [submitting, setSubmitting] = useState(false);
	const [editingId, setEditingId] = useState(null);
	const [editForm, setEditForm] = useState(EMPTY_EDIT_FORM);
	const didLoad = useRef(false);

	function addLog(result) {
		setLogs((current) =>
			[{ ...result, id: makeLogId(), at: new Date() }, ...current].slice(0, 8),
		);
		setOnline(result.status > 0);
	}

	async function loadTasks() {
		setLoading(true);
		const result = await apiRequest();
		addLog(result);

		if (result.ok) {
			setTasks(Array.isArray(result.data) ? result.data : []);
			setError("");
		} else {
			setError(result.error);
		}

		setLoading(false);
	}

	useEffect(() => {
		if (didLoad.current) return;
		didLoad.current = true;
		void loadTasks();
	}, []);

	async function handleCreate(event) {
		event.preventDefault();
		const title = form.title.trim();

		if (!title) {
			setError("Title is required.");
			return;
		}

		setSubmitting(true);
		const result = await apiRequest("", {
			method: "POST",
			body: JSON.stringify({
				title,
				description: form.description.trim(),
			}),
		});
		addLog(result);

		if (result.ok) {
			setTasks((current) => [...current, result.data]);
			setForm(EMPTY_FORM);
			setError("");
		} else {
			setError(result.error);
		}

		setSubmitting(false);
	}

	async function handleToggle(task) {
		setBusyId(task.id);

		const result = task.completed
			? await apiRequest(`/${task.id}`, {
					method: "PUT",
					body: JSON.stringify({ ...task, completed: false }),
				})
			: await apiRequest(`/${task.id}/complete`, { method: "PATCH" });

		addLog(result);

		if (result.ok) {
			setTasks((current) =>
				current.map((item) => (item.id === task.id ? result.data : item)),
			);
			setError("");
		} else {
			setError(result.error);
		}

		setBusyId(null);
	}

	async function handleDelete(task) {
		if (!window.confirm(`Delete "${task.title}"?`)) {
			return;
		}

		setBusyId(task.id);
		const result = await apiRequest(`/${task.id}`, { method: "DELETE" });
		addLog(result);

		if (result.ok) {
			setTasks((current) => current.filter((item) => item.id !== task.id));
			setError("");
		} else {
			setError(result.error);
		}

		setBusyId(null);
	}

	function startEdit(task) {
		setEditingId(task.id);
		setEditForm({
			title: task.title ?? "",
			description: task.description ?? "",
		});
	}

	function cancelEdit() {
		setEditingId(null);
		setEditForm(EMPTY_EDIT_FORM);
	}

	async function handleEditSave(event) {
		event.preventDefault();
		const title = editForm.title.trim();
		const currentTask = tasks.find((task) => task.id === editingId);

		if (!title) {
			setError("Title is required.");
			return;
		}

		if (!currentTask) {
			setEditingId(null);
			return;
		}

		setBusyId(editingId);
		const result = await apiRequest(`/${editingId}`, {
			method: "PUT",
			body: JSON.stringify({
				...currentTask,
				title,
				description: editForm.description.trim(),
			}),
		});
		addLog(result);

		if (result.ok) {
			setTasks((current) =>
				current.map((task) => (task.id === editingId ? result.data : task)),
			);
			cancelEdit();
			setError("");
		} else {
			setError(result.error);
		}

		setBusyId(null);
	}

	const completedCount = useMemo(
		() => tasks.filter((task) => task.completed).length,
		[tasks],
	);
	const openCount = tasks.length - completedCount;

	const connectionLabel =
		online === null
			? "Connecting..."
			: online
				? "Spring Boot connected"
				: "Backend offline";

	const connectionTone =
		online === null ? "pending" : online ? "online" : "offline";

	return (
		<div className="page">
			<div className="glow glow-one" aria-hidden="true" />
			<div className="glow glow-two" aria-hidden="true" />

			<div className="app">
				<header className="header">
					<div className="brand">
						<div className="brand-mark">
							<SparkIcon size={22} />
						</div>
						<div>
							<h1>MiniTask</h1>
							<p>
								React <span className="arrow">↔</span> Spring Boot
							</p>
						</div>
					</div>

					<div className={`connection ${connectionTone}`}>
						<span className="connection-dot" aria-hidden="true" />
						{connectionLabel}
					</div>
				</header>

				<main className="layout">
					<section className="primary">
						<div className="stats-row">
							<div className="stat-card">
								<span className="stat-label">Total</span>
								<strong>{tasks.length}</strong>
							</div>
							<div className="stat-card">
								<span className="stat-label">Open</span>
								<strong>{openCount}</strong>
							</div>
							<div className="stat-card accent">
								<span className="stat-label">Completed</span>
								<strong>{completedCount}</strong>
							</div>
						</div>

						<section className="card composer">
							<div className="card-heading">
								<div>
									<h2>New task</h2>
									<p>React sends a POST request with a JSON body to the backend.</p>
								</div>
								<span className="method-badge post">POST</span>
							</div>

							<form className="task-form" onSubmit={handleCreate}>
								<div className="field">
									<label htmlFor="title">Title</label>
									<input
										id="title"
										value={form.title}
										onChange={(event) =>
											setForm({ ...form, title: event.target.value })
										}
										placeholder="e.g. Review Spring Data JPA"
										maxLength={120}
										required
									/>
								</div>

								<div className="field">
									<label htmlFor="description">
										Description <span>(optional)</span>
									</label>
									<textarea
										id="description"
										value={form.description}
										onChange={(event) =>
											setForm({ ...form, description: event.target.value })
										}
										placeholder="Add a detail..."
										rows={2}
										maxLength={500}
									/>
								</div>

								<button
									type="submit"
									className="btn btn-primary"
									disabled={submitting}
								>
									<PlusIcon size={18} />
									{submitting ? "Sending..." : "Add task"}
								</button>
							</form>
						</section>

						{error && (
							<div className="alert" role="alert">
								{error}
							</div>
						)}

						<section className="tasks-section">
							<div className="section-heading">
								<div>
									<h2>Your tasks</h2>
									<p>
										{tasks.length === 0
											? "No tasks yet."
											: `${tasks.length} tasks in the list`}
									</p>
								</div>

								<button
									type="button"
									className="btn btn-ghost btn-sm"
									onClick={loadTasks}
									disabled={loading}
								>
									<RefreshIcon size={16} />
									{loading ? "Loading..." : "Reload"}
								</button>
							</div>

							{loading ? (
								<div className="skeleton-list">
									{[0, 1, 2].map((index) => (
										<div key={index} className="skeleton" />
									))}
								</div>
							) : tasks.length === 0 ? (
								<div className="empty-state">
									<div className="empty-icon">
										<SparkIcon size={24} />
									</div>
									<h3>Empty list</h3>
									<p>
										Create your first task above. React will send a POST and
										Spring Boot will save it to PostgreSQL.
									</p>
								</div>
							) : (
								<ul className="task-list">
									{tasks.map((task) => (
										<TaskCard
											key={task.id}
											task={task}
											isBusy={busyId === task.id}
											isEditing={editingId === task.id}
											editForm={editForm}
											onEditChange={setEditForm}
											onStartEdit={() => startEdit(task)}
											onCancelEdit={cancelEdit}
											onSaveEdit={handleEditSave}
											onToggle={() => handleToggle(task)}
											onDelete={() => handleDelete(task)}
										/>
									))}
								</ul>
							)}
						</section>
					</section>

					<aside className="sidebar">
						<ActivityLog logs={logs} />

						<section className="card hint-card">
							<div className="card-heading">
								<div>
									<h2>The full round trip</h2>
									<p>Every action in the UI maps to a route.</p>
								</div>
							</div>

							<ul className="endpoint-list">
								<li>
									<span className="method-badge get">GET</span>
									<code>/api/tasks</code>
									<span className="endpoint-desc">loads the list</span>
								</li>
								<li>
									<span className="method-badge post">POST</span>
									<code>/api/tasks</code>
									<span className="endpoint-desc">creates a task</span>
								</li>
								<li>
									<span className="method-badge patch">PATCH</span>
									<code>/api/tasks/:id/complete</code>
									<span className="endpoint-desc">marks as completed</span>
								</li>
								<li>
									<span className="method-badge put">PUT</span>
									<code>/api/tasks/:id</code>
									<span className="endpoint-desc">edits or reopens</span>
								</li>
								<li>
									<span className="method-badge delete">DELETE</span>
									<code>/api/tasks/:id</code>
									<span className="endpoint-desc">deletes</span>
								</li>
							</ul>
						</section>
					</aside>
				</main>

				<footer className="footer">
					<span>MiniTask</span>
					<span className="footer-dot" aria-hidden="true" />
					<span>
						API: <code>http://localhost:8080/api/tasks</code>
					</span>
				</footer>
			</div>
		</div>
	);
}

export default App;
