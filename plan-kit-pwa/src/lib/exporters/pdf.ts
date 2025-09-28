import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { FloorPlan } from '../../types/models';
import { applyTransformToRoom } from '../geometry/transforms';

export async function exportAsPdf(plan: FloorPlan) {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([842, 595]); // A4 landscape
  const { height } = page.getSize();
  const font = await pdf.embedFont(StandardFonts.Helvetica);

  page.drawText('PlanKit Floor Plan', {
    x: 40,
    y: height - 40,
    size: 18,
    font,
    color: rgb(0.1, 0.1, 0.1)
  });

  page.drawText(`Project: ${plan.label ?? plan.id}`, { x: 40, y: height - 70, size: 12, font });
  page.drawText(`Updated: ${new Date(plan.meta.updatedAt).toLocaleString()}`, {
    x: 40,
    y: height - 90,
    size: 10,
    font
  });

  const rooms = plan.rooms.map((room) => {
    const transform = plan.transforms[room.id];
    return transform ? applyTransformToRoom(room, transform) : room;
  });

  let offsetY = height - 130;
  rooms.forEach((room) => {
    page.drawText(`${room.name ?? room.id} · walls: ${room.walls.length}`, {
      x: 40,
      y: offsetY,
      size: 10,
      font
    });
    offsetY -= 16;
  });

  const pdfBytes = await pdf.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}
