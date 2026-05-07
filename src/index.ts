import pkg from 'pg';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import fs from 'node:fs/promises';
import path from 'node:path';
import chalk from 'chalk';

const { Client } = pkg;

async function main() {
  const db = new Client({
    host: 'localhost',
    port: 5432,
    user: 'demo',
    password: 'demo',
    database: 'ia_sql_demo',
  });

  await db.connect();

  const schemaPath = path.resolve('database/schema.sql');
  const instructionsPath = path.resolve('instructions.md');
  const databaseSchema = await fs.readFile(schemaPath, 'utf-8');
  const instructions = await fs.readFile(instructionsPath, 'utf-8');

  const schema = `
  ${instructions}
  Você pode usar somente este schema PostgreSQL:
  ${databaseSchema}
`;

  async function askOllama(question: string): Promise<string> {
    const response = await fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3',
        stream: false,
        messages: [
          {
            role: 'system',
            content: `
            Você é um gerador de SQL PostgreSQL.

            Regras:
            - Gere apenas SQL puro
            - Não use markdown
            - Não explique
            - Apenas SELECT
            - Não invente colunas
            - Use JOIN corretamente

            ${schema}`,
          },
          {
            role: 'user',
            content: question,
          },
        ],
      }),
    });

    const data: any = await response.json();

    return data.message.content.trim();
  }

function validateSql(sql: string): void {
  const normalized = sql.trim().toLowerCase();

  if (!normalized.startsWith('select')) {
    throw new Error('Apenas SELECT é permitido.');
  }

  const forbidden = [
    'insert',
    'update',
    'delete',
    'drop',
    'alter',
    'truncate',
    'create',
    'replace',
  ];

  for (const word of forbidden) {
    const pattern = new RegExp(`\\b${word}\\b`, 'i');

    if (pattern.test(normalized)) {
      throw new Error(`SQL bloqueado: contém comando "${word}".`);
    }
  }

  const semicolonCount = (normalized.match(/;/g) ?? []).length;

  if (semicolonCount > 1 || (semicolonCount === 1 && !normalized.endsWith(';'))) {
    throw new Error('Múltiplas queries não são permitidas.');
  }
}

  async function explainResult(question: string, sql: string, rows: any): Promise<string> {
    const response = await fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3',
        stream: false,
        messages: [
          {
            role: 'system',
            content: 'Você é um analista de dados. Responda em português de forma curta e objetiva.',
          },
          {
            role: 'user',
            content: `
            Pergunta:
            ${question}

            SQL:
            ${sql}

            Resultado:
            ${JSON.stringify(rows)}
            `,
          },
        ],
      }),
    });

    const data: any = await response.json();

    return data.message.content.trim();
  }

  const rl = readline.createInterface({ input, output });

  while (true) {
  let question: string;

  try {
    question = await rl.question('\nPergunta: ');
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.log('\nEncerrando...');
      break;
    }

    throw error;
  }

  if (question === 'sair') {
    break;
  }

  try {
    const sql = await askOllama(question);

    console.log(chalk.cyan('\nSQL gerado:'));
    console.log(chalk.cyanBright(sql));

    validateSql(sql);

    const result = await db.query(sql);

    console.log(chalk.gray('\nResultado bruto:'));
    console.table(result.rows);

    const answer = await explainResult(question, sql, result.rows);

    console.log(chalk.green('\nResposta:'));
    console.log(chalk.greenBright(answer));
  } catch (error: any) {
    console.error('\nErro:', error.message);
  }
}

  await db.end();
  rl.close();
}

main().catch((error) => {
  console.error('Erro fatal:', error);
  process.exit(1);
});