import fs from 'fs';

const data = JSON.parse(fs.readFileSync('./times.json', 'utf8'));
const times = data.times;
let totalSeconds = 0;

times.forEach((time) => {
  const [minutes, seconds] = time
    .split(':')
    .map((value) => Number(value.trim()));
  totalSeconds += minutes * 60 + seconds;
});

const totalHours = Math.round(totalSeconds / 3600);

console.log(`Total Hours: ${totalHours}`);
