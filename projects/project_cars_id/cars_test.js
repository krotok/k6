
import http from 'k6/http';
import { check, sleep } from 'k6';
import { SharedArray } from 'k6/data';

export let options = {
    vus: 1,
    duration: '10s',
};

let cars = Array.from({ length: 20 }, (_, i) => i + 1);

let successResponses = [];
let totalTime = 0;
let totalOk = 0;

export default function () {
    let index = Math.floor(Math.random() * cars.length);
    let carNumber = cars[index];
    //let res = http.get(`http://127.0.0.1/app/car_${carNumber}`);
    let res = http.get(`http://localhost/app/car_11`);

    console.log(`RAW body: ${res.body}`);
    if (res.status === 200 && res.body && res.body !== '{}') {
        let status = res.json('status');
        let returnedCarNumber = res.json('car_number');
        console.log(`car_number: ${returnedCarNumber}, status: ${status}`);

        if (status === true) {
            successRT.add(res.timings.duration);
            okCount.add(1);
        }
    }

    sleep(0.1); // контроль паузы между запросами, можно удалить
}

export function handleSummary(data) {
    const avg = totalOk > 0 ? totalTime / totalOk : 0;
    return {
        stdout: `\nAverage response time  for satus:true: ${avg.toFixed(2)} ms from ${totalOk} succed requests\n`,
        'results.json': JSON.stringify(data),
    };
}