#!/usr/bin/env node

const PARIS_TIME_ZONE = 'Europe/Paris';

function parisTimeParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: PARIS_TIME_ZONE,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  return Object.fromEntries(parts.filter(part => part.type !== 'literal').map(part => [part.type, part.value]));
}

function isParisPublicationTime(date = new Date()) {
  const { hour, minute } = parisTimeParts(date);
  return hour === '05' && minute === '30';
}

const publish = process.env.ALLOW_MANUAL === 'true' || isParisPublicationTime();
console.log(`publish=${publish}`);
if (!publish) console.log('Publication ignorée: le créneau Europe/Paris est 05:30.');

module.exports = { isParisPublicationTime, parisTimeParts };
