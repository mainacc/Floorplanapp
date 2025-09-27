import { useState } from 'react';
import { saveAs } from '../../lib/exporters/saveAs';
import { exportAsSvg } from '../../lib/exporters/svg';
import { exportAsCsv } from '../../lib/exporters/csv';
import { exportAsPdf } from '../../lib/exporters/pdf';
import { exportAsDxf } from '../../lib/exporters/dxf';
import { useProjectsStore } from '../../store/useProjectsStore';

export function ExportPanel() {
  const { currentPlan } = useProjectsStore();
  const [status, setStatus] = useState('Select an export format.');

  if (!currentPlan) {
    return <p>No plan selected.</p>;
  }

  async function handleExport(kind: 'svg' | 'pdf' | 'dxf' | 'csv') {
    try {
      setStatus(`Exporting ${kind.toUpperCase()}…`);
      const blob =
        kind === 'svg'
          ? await exportAsSvg(currentPlan)
          : kind === 'csv'
          ? await exportAsCsv(currentPlan)
          : kind === 'pdf'
          ? await exportAsPdf(currentPlan)
          : await exportAsDxf(currentPlan);
      saveAs(blob, `${currentPlan.label ?? 'plan'}-${kind}.${kind === 'pdf' ? 'pdf' : kind}`);
      setStatus(`Exported ${kind.toUpperCase()} successfully.`);
    } catch (error) {
      console.error(error);
      setStatus('Export failed. Please check the console for details.');
    }
  }

  return (
    <section className="card export-panel">
      <h2>Export</h2>
      <p>Generate deliverables with preset layers and metadata.</p>
      <div className="actions">
        <button className="primary" onClick={() => handleExport('pdf')}>
          PDF
        </button>
        <button className="secondary" onClick={() => handleExport('svg')}>
          SVG
        </button>
        <button className="secondary" onClick={() => handleExport('dxf')}>
          DXF
        </button>
        <button className="secondary" onClick={() => handleExport('csv')}>
          CSV Schedules
        </button>
      </div>
      <p className="status">{status}</p>
    </section>
  );
}
