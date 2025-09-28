import { PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="app-shell">
      <header className="app-header">
        <Link to="/" className="brand">
          PlanKit
        </Link>
        <nav>
          <Link to="/">Projects</Link>
        </nav>
      </header>
      <main className="app-main">{children}</main>
    </div>
  );
}
