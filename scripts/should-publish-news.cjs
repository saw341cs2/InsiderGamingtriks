#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const PARIS_TIME_ZONE = 'Europe/Paris';

// Publication prévue à 05:30 heure de Paris. GitHub déclenche en UTC : on
// n'autorise la publication qu'à partir de 05:30 heure locale, ce qui donne
// exactement le créneau voulu hiver comme été.
const PUBLISH_MINUTE = 5 * 60 + 30;

function parisDateKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: PARIS_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const values = Object.fromEntries(parts.filter(part => part.type !== 'literal').map(part => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function parisMinuteOfDay(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: PARIS_TIME_ZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(date);
  const values = Object.fromEntries(parts.filter(part => part.type !== 'literal').map(part => [part.type, part.value]));
  return Number(values.hour) * 60 + Number(values.minute);
}

function shouldPublishNews({ date = new Date(), generatedAt = null, allowManual = false } = {}) {
  if (allowManual) return true;
  if (parisMinuteOfDay(date) < PUBLISH_MINUTE) return false;
  if (!generatedAt) return true;

  const lastPublication = new Date(generatedAt);
  if (Number.isNaN(lastPublication.getTime())) {
    throw new Error(`Date generatedAt invalide dans public/news.json: ${generatedAt}`);
  }

  return parisDateKey(date) !== parisDateKey(lastPublication);
}

function getLatestGeneratedAt() {
  const newsPath = path.join(__dirname, '..', 'public', 'news.json');
  if (!fs.existsSync(newsPath)) return null;

  const data = JSON.parse(fs.readFileSync(newsPath, 'utf8'));
  return data.generatedAt || null;
}

if (require.main === module) {
  const publish = shouldPublishNews({
    generatedAt: getLatestGeneratedAt(),
    allowManual: process.env.ALLOW_MANUAL === 'true',
  });
  console.log(`publish=${publish}`);
  if (!publish) {
    console.error(`News déjà publiées pour le ${parisDateKey()}; publication ignorée.`);
  } else if (process.env.ALLOW_MANUAL !== 'true') {
    console.error(`Publication quotidienne autorisée pour le ${parisDateKey()} (Europe/Paris).`);
  }
}

module.exports = { parisDateKey, shouldPublishNews, getLatestGeneratedAt };
