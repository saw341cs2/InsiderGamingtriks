const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'public', 'astuces.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

const total = data.astuces.length;

const dayIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24 * 2));
const pick1 = (dayIndex * 2) % total;

data.dailyPick = [data.astuces[pick1].id];
data.generatedAt = new Date().toISOString();

const reordered = [
  data.astuces[pick1],
  ...data.astuces.slice(0, pick1),
  ...data.astuces.slice(pick1 + 1),
];

data.astuces = reordered.map((a, i) => {
  if (i === 0) return { ...a, date: "Aujourd'hui" };
  if (i === 1) return { ...a, date: 'Il y a 2 jours' };
  return { ...a, date: `Il y a ${i * 2} jours` };
});

fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
console.log(`Astuce du jour mise à jour : #${data.astuces[0].id}`);
