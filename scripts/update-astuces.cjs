const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'public', 'astuces.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

const total = data.astuces.length;

const dayIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24 * 2));
const pick1 = (dayIndex * 2) % total;
const pick2 = (dayIndex * 2 + 1) % total;

data.dailyPick = [data.astuces[pick1].id, data.astuces[pick2].id];
data.generatedAt = new Date().toISOString();

data.astuces = data.astuces.map((a, i) => {
  if (i === pick1 || i === pick2) return { ...a, date: "Aujourd'hui" };
  const diff = ((i - pick1 + total) % total);
  if (diff === 1) return { ...a, date: 'Hier' };
  return { ...a, date: `Il y a ${diff} jours` };
});

fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
console.log(`Astuces du jour mises à jour : #${data.astuces[pick1].id} et #${data.astuces[pick2].id}`);
