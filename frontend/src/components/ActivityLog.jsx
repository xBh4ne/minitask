export default function ActivityLog({ logs }) {
  return (
    <section className="card log-card">
      <div className="card-heading">
        <div>
          <h2>API activity</h2>
          <p>Every action is a real HTTP request to Spring Boot.</p>
        </div>
        <span className="live-dot" aria-hidden="true" />
      </div>

      {logs.length === 0 ? (
        <p className="log-empty">Requests will appear here.</p>
      ) : (
        <ol className="log-list">
          {logs.map((log) => {
            const tone =
              log.status === 0
                ? "offline"
                : log.status >= 500
                  ? "error"
                  : log.status >= 400
                    ? "warn"
                    : "ok";

            return (
              <li key={log.id} className="log-entry">
                <span className={`method-badge ${log.method.toLowerCase()}`}>
                  {log.method}
                </span>
                <div className="log-body">
                  <code>{log.path}</code>
                  <span className="log-meta">
                    <span className={`status-code ${tone}`}>
                      {log.status === 0 ? "offline" : log.status}
                    </span>
                    <span>{log.duration} ms</span>
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
