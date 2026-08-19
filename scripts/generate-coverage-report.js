import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const workspaceRoot = path.resolve(__dirname, '..');
const summaryPath = path.join(workspaceRoot, 'packages', 'common', 'coverage', 'coverage-summary.json');
const artifactDir = 'C:\\Users\\User\\.gemini\\antigravity\\brain\\b4497720-21b6-49ab-93fc-0275e66a5f77';

function getProgressColor(pct) {
  if (pct >= 80) return '#10b981'; // Green
  if (pct >= 50) return '#f59e0b'; // Yellow/Orange
  return '#ef4444'; // Red
}

function getProgressEmojiBar(pct) {
  const filledCount = Math.round(pct / 10);
  const emptyCount = 10 - filledCount;
  return '█'.repeat(filledCount) + '░'.repeat(emptyCount);
}

function getCoverageBadge(pct) {
  if (pct >= 80) return '🟢 High';
  if (pct >= 50) return '🟡 Medium';
  return '🔴 Low';
}

function main() {
  console.log('Generating coverage reports...');

  if (!fs.existsSync(summaryPath)) {
    console.error(`Coverage summary not found at: ${summaryPath}`);
    console.error('Make sure you have run the coverage tests first (e.g. pnpm run test:unit:coverage).');
    process.exit(1);
  }

  const rawData = fs.readFileSync(summaryPath, 'utf-8');
  const summary = JSON.parse(rawData);

  const total = summary.total;
  if (!total) {
    console.error('Invalid coverage summary format (total missing).');
    process.exit(1);
  }

  // Get file entries (excluding total)
  const files = Object.entries(summary)
    .filter(([key]) => key !== 'total')
    .map(([filepath, data]) => {
      // make path relative to workspace root and normalize slashes
      const relPath = path.relative(workspaceRoot, filepath).replace(/\\/g, '/');
      return {
        filepath: relPath,
        lines: data.lines.pct,
        statements: data.statements.pct,
        functions: data.functions.pct,
        branches: data.branches.pct,
        data: data
      };
    });

  // --- 1. Generate Markdown Report ---
  let md = `# Unit Test Coverage Report

Generated on: ${new Date().toLocaleString()}

## 📊 Overall Summary

| Category | Coverage | Progress | Covered / Total |
| :--- | :---: | :---: | :---: |
| **Lines** | **${total.lines.pct}%** | \`${getProgressEmojiBar(total.lines.pct)}\` | ${total.lines.covered} / ${total.lines.total} |
| **Statements** | **${total.statements.pct}%** | \`${getProgressEmojiBar(total.statements.pct)}\` | ${total.statements.covered} / ${total.statements.total} |
| **Functions** | **${total.functions.pct}%** | \`${getProgressEmojiBar(total.functions.pct)}\` | ${total.functions.covered} / ${total.functions.total} |
| **Branches** | **${total.branches.pct}%** | \`${getProgressEmojiBar(total.branches.pct)}\` | ${total.branches.covered} / ${total.branches.total} |

## 📁 File Coverage Breakdown

| File Path | Lines | Statements | Functions | Branches | Status |
| :--- | :---: | :---: | :---: | :---: | :---: |
`;

  files.forEach(f => {
    md += `| [${path.basename(f.filepath)}](file:///${path.resolve(workspaceRoot, f.filepath).replace(/\\/g, '/')}) | ${f.lines}% | ${f.statements}% | ${f.functions}% | ${f.branches}% | ${getCoverageBadge(f.lines)} |\n`;
  });

  md += `
> [!NOTE]
> Coverage calculations are powered by Vitest and v8 coverage provider. Keep writing tests to improve branch coverage!
`;

  const mdOutputPath = path.join(workspaceRoot, 'coverage_report.md');
  fs.writeFileSync(mdOutputPath, md, 'utf-8');
  console.log(`Markdown report written to: ${mdOutputPath}`);

  // Write markdown to Gemini artifact directory if it exists
  if (fs.existsSync(artifactDir)) {
    const artifactMdPath = path.join(artifactDir, 'coverage_report.md');
    fs.writeFileSync(artifactMdPath, md, 'utf-8');
    console.log(`Artifact Markdown report written to: ${artifactMdPath}`);
  }

  // --- 2. Generate HTML Report ---
  const html = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AllCLL Frontend Test Coverage Dashboard</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&family=Noto+Sans+KR:wght@300;400;500;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-gradient: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
      --card-bg: rgba(30, 41, 59, 0.7);
      --card-border: rgba(255, 255, 255, 0.08);
      --text-main: #f8fafc;
      --text-muted: #94a3b8;
      --primary: #6366f1;
      --primary-glow: rgba(99, 102, 241, 0.15);
      
      --color-high: #10b981;
      --color-medium: #f59e0b;
      --color-low: #ef4444;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Outfit', 'Noto Sans KR', sans-serif;
      background: var(--bg-gradient);
      color: var(--text-main);
      min-height: 100vh;
      padding: 2.5rem 1.5rem;
      line-height: 1.5;
    }

    .container {
      max-width: 1100px;
      margin: 0 auto;
    }

    header {
      margin-bottom: 2.5rem;
      text-align: center;
      position: relative;
    }

    header h1 {
      font-size: 2.5rem;
      font-weight: 700;
      background: linear-gradient(to right, #818cf8, #c084fc);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 0.5rem;
    }

    header p {
      color: var(--text-muted);
      font-size: 1.1rem;
    }

    .grid-summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }

    .card {
      background: var(--card-bg);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid var(--card-border);
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .card:hover {
      transform: translateY(-4px);
      box-shadow: 0 15px 35px rgba(99, 102, 241, 0.15);
      border-color: rgba(99, 102, 241, 0.3);
    }

    .summary-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .summary-card .title {
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.75rem;
    }

    .radial-progress {
      position: relative;
      width: 120px;
      height: 120px;
      margin-bottom: 1rem;
    }

    .radial-progress svg {
      width: 100%;
      height: 100%;
      transform: rotate(-90deg);
    }

    .radial-progress circle {
      fill: none;
      stroke-width: 8;
    }

    .radial-progress .bg {
      stroke: rgba(255, 255, 255, 0.05);
    }

    .radial-progress .val {
      stroke-linecap: round;
      transition: stroke-dashoffset 1s ease-in-out;
    }

    .radial-progress .percentage {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 1.5rem;
      font-weight: 700;
    }

    .summary-card .stats {
      font-size: 0.85rem;
      color: var(--text-muted);
    }

    .section-title {
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 1.25rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .section-title::before {
      content: '';
      display: inline-block;
      width: 4px;
      height: 1.5rem;
      background: var(--primary);
      border-radius: 2px;
    }

    .file-table-container {
      overflow-x: auto;
      border-radius: 16px;
      border: 1px solid var(--card-border);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    }

    table {
      width: 100%;
      border-collapse: collapse;
      background: var(--card-bg);
      backdrop-filter: blur(12px);
      text-align: left;
    }

    th, td {
      padding: 1rem 1.25rem;
      border-bottom: 1px solid var(--card-border);
    }

    th {
      background: rgba(15, 23, 42, 0.6);
      color: var(--text-muted);
      font-weight: 600;
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    tr:last-child td {
      border-bottom: none;
    }

    tr:hover td {
      background: rgba(255, 255, 255, 0.02);
    }

    .file-name {
      font-weight: 600;
      color: #e2e8f0;
      text-decoration: none;
      display: flex;
      flex-direction: column;
      transition: color 0.2s ease;
    }

    .file-name:hover {
      color: #818cf8;
    }

    .file-name span {
      font-size: 0.75rem;
      color: var(--text-muted);
      font-weight: 400;
      margin-top: 0.25rem;
    }

    .progress-bar-container {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      min-width: 140px;
    }

    .progress-bar {
      flex: 1;
      height: 8px;
      background: rgba(255, 255, 255, 0.08);
      border-radius: 4px;
      overflow: hidden;
    }

    .progress-bar-fill {
      height: 100%;
      border-radius: 4px;
      transition: width 0.8s ease;
    }

    .pct-val {
      font-size: 0.9rem;
      font-weight: 600;
      width: 2.5rem;
      text-align: right;
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      gap: 0.35rem;
    }

    .status-badge::before {
      content: '';
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
    }

    .status-high {
      background: rgba(16, 185, 129, 0.12);
      color: #34d399;
    }
    .status-high::before {
      background: #10b981;
    }

    .status-medium {
      background: rgba(245, 158, 11, 0.12);
      color: #fbbf24;
    }
    .status-medium::before {
      background: #f59e0b;
    }

    .status-low {
      background: rgba(239, 68, 68, 0.12);
      color: #f87171;
    }
    .status-low::before {
      background: #ef4444;
    }

    footer {
      margin-top: 3rem;
      text-align: center;
      font-size: 0.85rem;
      color: var(--text-muted);
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>AllCLL Test Coverage Dashboard</h1>
      <p>개발 브랜치 (PoC) 단위 테스트 커버리지 현황 • 생성일시: ${new Date().toLocaleString()}</p>
    </header>

    <div class="grid-summary">
      <!-- Lines Summary -->
      <div class="card summary-card">
        <span class="title">Lines</span>
        <div class="radial-progress">
          <svg>
            <circle class="bg" cx="60" cy="60" r="50"></circle>
            <circle class="val" cx="60" cy="60" r="50" 
                    stroke="${getProgressColor(total.lines.pct)}" 
                    stroke-dasharray="314.16" 
                    stroke-dashoffset="${314.16 - (314.16 * total.lines.pct) / 100}"></circle>
          </svg>
          <div class="percentage">${total.lines.pct}%</div>
        </div>
        <span class="stats">${total.lines.covered} / ${total.lines.total} 라인</span>
      </div>

      <!-- Statements Summary -->
      <div class="card summary-card">
        <span class="title">Statements</span>
        <div class="radial-progress">
          <svg>
            <circle class="bg" cx="60" cy="60" r="50"></circle>
            <circle class="val" cx="60" cy="60" r="50" 
                    stroke="${getProgressColor(total.statements.pct)}" 
                    stroke-dasharray="314.16" 
                    stroke-dashoffset="${314.16 - (314.16 * total.statements.pct) / 100}"></circle>
          </svg>
          <div class="percentage">${total.statements.pct}%</div>
        </div>
        <span class="stats">${total.statements.covered} / ${total.statements.total} 구문</span>
      </div>

      <!-- Functions Summary -->
      <div class="card summary-card">
        <span class="title">Functions</span>
        <div class="radial-progress">
          <svg>
            <circle class="bg" cx="60" cy="60" r="50"></circle>
            <circle class="val" cx="60" cy="60" r="50" 
                    stroke="${getProgressColor(total.functions.pct)}" 
                    stroke-dasharray="314.16" 
                    stroke-dashoffset="${314.16 - (314.16 * total.functions.pct) / 100}"></circle>
          </svg>
          <div class="percentage">${total.functions.pct}%</div>
        </div>
        <span class="stats">${total.functions.covered} / ${total.functions.total} 함수</span>
      </div>

      <!-- Branches Summary -->
      <div class="card summary-card">
        <span class="title">Branches</span>
        <div class="radial-progress">
          <svg>
            <circle class="bg" cx="60" cy="60" r="50"></circle>
            <circle class="val" cx="60" cy="60" r="50" 
                    stroke="${getProgressColor(total.branches.pct)}" 
                    stroke-dasharray="314.16" 
                    stroke-dashoffset="${314.16 - (314.16 * total.branches.pct) / 100}"></circle>
          </svg>
          <div class="percentage">${total.branches.pct}%</div>
        </div>
        <span class="stats">${total.branches.covered} / ${total.branches.total} 분기</span>
      </div>
    </div>

    <h2 class="section-title">대상 파일별 상세 커버리지</h2>
    <div class="file-table-container">
      <table>
        <thead>
          <tr>
            <th>파일명</th>
            <th>라인 커버리지</th>
            <th>구문</th>
            <th>함수</th>
            <th>분기</th>
            <th>상태</th>
          </tr>
        </thead>
        <tbody>
          ${files.map(f => {
            const statusClass = f.lines >= 80 ? 'status-high' : f.lines >= 50 ? 'status-medium' : 'status-low';
            const statusText = f.lines >= 80 ? 'High' : f.lines >= 50 ? 'Medium' : 'Low';
            return `
            <tr>
              <td>
                <a class="file-name" href="file:///${path.resolve(workspaceRoot, f.filepath).replace(/\\/g, '/')}" target="_blank">
                  ${path.basename(f.filepath)}
                  <span>${f.filepath}</span>
                </a>
              </td>
              <td>
                <div class="progress-bar-container">
                  <div class="progress-bar">
                    <div class="progress-bar-fill" style="width: ${f.lines}%; background: ${getProgressColor(f.lines)};"></div>
                  </div>
                  <span class="pct-val" style="color: ${getProgressColor(f.lines)};">${f.lines}%</span>
                </div>
              </td>
              <td>${f.statements}%</td>
              <td>${f.functions}%</td>
              <td>${f.branches}%</td>
              <td>
                <span class="status-badge ${statusClass}">${statusText}</span>
              </td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>

    <footer>
      <p>ChecllFrontend Test Automation Script © 2026</p>
    </footer>
  </div>
</body>
</html>
`;

  const htmlOutputPath = path.join(workspaceRoot, 'coverage_report.html');
  fs.writeFileSync(htmlOutputPath, html, 'utf-8');
  console.log(`HTML report written to: ${htmlOutputPath}`);
}

main();
