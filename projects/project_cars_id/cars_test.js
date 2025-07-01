
import http from 'k6/http';
import { check, sleep } from 'k6';
import { SharedArray } from 'k6/data';

export let options = {
    vus: 50,
    duration: '20s',
};

let cars = Array.from({ length: 1500 }, (_, i) => i + 1);

let successResponses = [];
let totalTime = 0;
let totalOk = 0;

export default function () {
    let index = Math.floor(Math.random() * cars.length);
    let carNumber = cars[index];
    let res = http.get(`https://host.com/api/car_${carNumber}`);

    if (res.status === 200 && res.body && res.body !== '{}' && res.json('status') === true) {
        successResponses.push(res.timings.duration);
        totalTime += res.timings.duration;
        totalOk += 1;
    }

    sleep(0.1); // контроль паузы между запросами, можно удалить
}

export function handleSummary(data) {
    const avg = totalOk > 0 ? totalTime / totalOk : 0;
    return {
        stdout: `\nСреднее время отклика для status:true: ${avg.toFixed(2)} ms из ${totalOk} успешных запросов\n`,
        'results.json': JSON.stringify(data),
    };
}