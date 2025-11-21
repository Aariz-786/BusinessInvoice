

import PptxGenJS from 'pptxgenjs';
import { Invoice, InvoiceStatus } from '../types';

// NOTE: Removed invalid module augmentation.
// Usage will rely on existing types or any fallback.

interface DashboardStats {
    totalBilled: number;
    totalOutstanding: number;
    activeTenants: number;
    anomalyCount: number;
}

interface AiContent {
    title: string;
    summaryPoints: string[];
}

export const generateDashboardPPT = async (
    stats: DashboardStats,
    invoices: Invoice[],
    aiContent: AiContent
) => {
    const pres = new PptxGenJS();

    // --- Slide 1: Title Slide ---
    let slide1 = pres.addSlide();
    // Background shape
    slide1.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 1.5, fill: { color: '1E40AF' } }); // Blue header
    
    slide1.addText(aiContent.title, { 
        x: 0.5, y: 2.5, w: '90%', 
        fontSize: 32, color: '363636', align: 'center', bold: true 
    });
    slide1.addText(`Generated: ${new Date().toLocaleDateString()}`, { 
        x: 0.5, y: 3.5, w: '90%', 
        fontSize: 14, color: '888888', align: 'center' 
    });
    slide1.addText("BusinessInvoice Platform", { 
        x: 0.5, y: 0.5, 
        fontSize: 20, color: 'FFFFFF', bold: true 
    });

    // --- Slide 2: Executive Summary ---
    let slide2 = pres.addSlide();
    slide2.addText("Executive Summary", { x: 0.5, y: 0.5, fontSize: 24, color: '1E40AF', bold: true });
    slide2.addShape(pres.ShapeType.line, { x: 0.5, y: 1.0, w: '90%', h: 0, line: { color: 'E5E7EB', width: 2 } });

    const bullets = aiContent.summaryPoints.map(point => ({ 
        text: point, 
        options: { fontSize: 16, bullet: true, breakLine: true, color: '4B5563', paraSpaceAfter: 10 } 
    }));
    
    slide2.addText(bullets, { x: 0.5, y: 1.5, w: '90%', h: 4 });

    // --- Slide 3: Financial Snapshot ---
    let slide3 = pres.addSlide();
    slide3.addText("Financial Snapshot", { x: 0.5, y: 0.5, fontSize: 24, color: '1E40AF', bold: true });
    slide3.addShape(pres.ShapeType.line, { x: 0.5, y: 1.0, w: '90%', h: 0, line: { color: 'E5E7EB', width: 2 } });

    // Metric cards simulation
    slide3.addShape(pres.ShapeType.rect, { x: 0.5, y: 1.5, w: 4, h: 2, fill: { color: 'F3F4F6' }, line: { color: 'D1D5DB' } });
    slide3.addText("Total Billed", { x: 0.7, y: 1.7, fontSize: 14, color: '6B7280' });
    slide3.addText(`$${stats.totalBilled.toFixed(2)}`, { x: 0.7, y: 2.5, fontSize: 28, color: '111827', bold: true });

    slide3.addShape(pres.ShapeType.rect, { x: 5.0, y: 1.5, w: 4, h: 2, fill: { color: 'FEF2F2' }, line: { color: 'FCA5A5' } });
    slide3.addText("Outstanding", { x: 5.2, y: 1.7, fontSize: 14, color: 'B91C1C' });
    slide3.addText(`$${stats.totalOutstanding.toFixed(2)}`, { x: 5.2, y: 2.5, fontSize: 28, color: '991B1B', bold: true });

    // --- Slide 4: Recent Invoices ---
    let slide4 = pres.addSlide();
    slide4.addText("Recent Invoices", { x: 0.5, y: 0.5, fontSize: 24, color: '1E40AF', bold: true });
    slide4.addShape(pres.ShapeType.line, { x: 0.5, y: 1.0, w: '90%', h: 0, line: { color: 'E5E7EB', width: 2 } });

    const tableRows: (string | number)[][] = invoices.slice(0, 6).map(inv => [
        inv.id,
        inv.dueDate,
        `$${inv.totalAmount.toFixed(2)}`,
        inv.status
    ]);

    // Header row
    const headerRow = [
        { text: "ID", options: { bold: true, fill: 'F3F4F6' } },
        { text: "Due Date", options: { bold: true, fill: 'F3F4F6' } },
        { text: "Amount", options: { bold: true, fill: 'F3F4F6' } },
        { text: "Status", options: { bold: true, fill: 'F3F4F6' } }
    ];

    slide4.addTable([headerRow, ...tableRows], {
        x: 0.5,
        y: 1.5,
        w: '90%',
        colW: [2, 2, 2, 2],
        border: { pt: 1, color: "D1D5DB" },
        fontSize: 12
    });

    // Save
    await pres.writeFile({ fileName: `BusinessInvoice_Report_${new Date().toISOString().split('T')[0]}.pptx` });
};