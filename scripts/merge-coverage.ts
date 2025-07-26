import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const REPORTS_PATH = path.resolve(process.cwd(), '.nyc_output');
const COVERAGE_PATH = path.resolve(process.cwd(), 'coverage');

// Recrear el directorio (equivalente a emptyDirSync)
if (fs.existsSync(REPORTS_PATH)) {
  fs.rmSync(REPORTS_PATH, { recursive: true, force: true });
}
fs.mkdirSync(REPORTS_PATH, { recursive: true });

fs.copyFileSync(`${COVERAGE_PATH}/unit/coverage-final.json`, `${REPORTS_PATH}/unit-coverage.json`);
fs.copyFileSync(`${COVERAGE_PATH}/e2e/coverage-final.json`, `${REPORTS_PATH}/e2e-coverage.json`);
execSync(`nyc report --report-dir ${COVERAGE_PATH}/merge`, {
  stdio: 'inherit',
});
