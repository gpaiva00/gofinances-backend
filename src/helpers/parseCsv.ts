/* eslint-disable @typescript-eslint/class-name-casing */
import csvParse from 'csv-parse';
import fs from 'fs';

interface csvTransaction {
  title: string;

  type: 'income' | 'outcome';

  value: number;

  category: string;
}

interface loadReturn {
  transactions: csvTransaction[];

  categories: string[];
}

async function loadCSV(filePath: string): Promise<loadReturn> {
  const readStream = fs.createReadStream(filePath);

  const parseStream = csvParse({
    from_line: 2,
    ltrim: true,
    rtrim: true,
  });

  // passando a informacao do read para o parse
  const parseCSV = readStream.pipe(parseStream);

  const transactions: csvTransaction[] = [];
  const categories: string[] = [];

  parseCSV.on('data', async line => {
    const [title, type, value, category] = line.map((cell: string) =>
      cell.trim(),
    );

    if (!title || !type || !value) return;

    categories.push(category);

    transactions.push({ title, type, value, category });
  });

  await new Promise(resolve => parseCSV.on('end', resolve));

  return { transactions, categories };
}

export default loadCSV;
