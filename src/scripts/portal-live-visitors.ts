export {};

interface LiveSession {
  sessionId: string;
  firstSeen: string;
  lastSeen: string;
  pageviews: number;
  paths: string[];
  country: string | null;
  city: string | null;
  locale: string | null;
  referrer: string | null;
}

const root = document.querySelector<HTMLElement>('#live-visitors-root');
const countLabel = document.querySelector<HTMLElement>('#live-visitors-count');
if (root) {
  const ONLINE_WINDOW_MS = 2 * 60 * 1000;

  const escapeHtml = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const relativeTime = (iso: string): string => {
    const diffMs = Date.now() - new Date(iso).getTime();
    const seconds = Math.max(0, Math.round(diffMs / 1000));
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.round(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.round(minutes / 60);
    return `${hours}h ago`;
  };

  const render = (sessions: LiveSession[]) => {
    if (countLabel) countLabel.textContent = `${sessions.length} in the last hour`;

    if (sessions.length === 0) {
      root.innerHTML = '<p class="portal-empty">No visitor activity in the last hour.</p>';
      return;
    }

    const table = document.createElement('table');
    table.className = 'portal-table';
    table.innerHTML = `<thead><tr><th></th><th>From</th><th>Path</th><th>Pages</th><th>Source</th><th>First seen</th><th>Last seen</th></tr></thead>`;
    const tbody = document.createElement('tbody');

    sessions.forEach((session) => {
      const isOnline = Date.now() - new Date(session.lastSeen).getTime() < ONLINE_WINDOW_MS;
      const where = [session.city, session.country].filter(Boolean).join(', ') || '—';
      const trail = session.paths.map((p) => escapeHtml(p)).join(' <span style="color:#c9cfd5">→</span> ');
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><span class="portal-status${isOnline ? ' portal-status-delivered' : ''}" style="border-radius:50%;width:9px;height:9px;padding:0;display:inline-block" title="${isOnline ? 'Online now' : 'Recently active'}"></span></td>
        <td>${escapeHtml(where)}${session.locale ? ` <span style="color:#9aa1a8">(${escapeHtml(session.locale)})</span>` : ''}</td>
        <td style="max-width:420px">${trail}</td>
        <td>${session.pageviews}</td>
        <td>${session.referrer ? escapeHtml(session.referrer) : 'Direct'}</td>
        <td>${relativeTime(session.firstSeen)}</td>
        <td>${relativeTime(session.lastSeen)}</td>
      `;
      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    root.innerHTML = '';
    root.appendChild(table);
  };

  const load = async () => {
    try {
      const response = await fetch('/portal-actions/live-visitors');
      if (!response.ok) return;
      const data = (await response.json()) as { ok: boolean; sessions: LiveSession[] };
      if (data.ok) render(data.sessions);
    } catch {
      // Keep showing the last successful render rather than clearing it on a transient network error.
    }
  };

  load();
  setInterval(load, 5000);
}
