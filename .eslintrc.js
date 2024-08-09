module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto', // Controla a linha de fim de arquivo
        singleQuote: true, // Força o uso de aspas simples
        trailingComma: 'all', // Insere vírgula final onde possível
        printWidth: 80, // Controla a largura máxima da linha
        tabWidth: 2, // Define o tamanho da tabulação
        semi: true, // Usa ponto e vírgula no final de declarações
        bracketSpacing: true, // Insere espaços dentro de objetos
        arrowParens: 'always', // Insere parênteses em funções de seta com um argumento
        insertPragma: false, // Não insere pragma especial no início de arquivos
        requirePragma: false, // Não exige pragma especial para formatar arquivos
      },
    ],
    'no-console': 'warn', // Alerta para uso de console.log
    'no-unused-vars': 'warn', // Alerta para variáveis não utilizadas
    'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 1 }], // Controla linhas em branco extras
    'no-trailing-spaces': 'error', // Remove espaços em branco finais
    'eol-last': ['error', 'always'], // Exige uma linha em branco no final do arquivo
  },
};