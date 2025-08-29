const config = {
  // Type checking para archivos TypeScript - verifica tipos sin compilar
  '**/*.ts': () => 'tsc --noEmit',

  // Linting, formateo y testing para archivos de código
  '*.{js,ts}': ['eslint --fix', 'prettier --write', 'jest --findRelatedTests --passWithNoTests'],
  '*.{js,ts}': ['eslint --fix', 'prettier --write'],

  // Solo formateo para archivos de configuración y documentación
  '*.{json,md,yml,yaml}': 'prettier --write',
};

module.exports = config;
