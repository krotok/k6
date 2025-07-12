
import http from 'k6/http';
import { check, sleep } from 'k6';
import { SharedArray } from 'k6/data';
import { Trend, Counter } from 'k6/metrics';

export let options = {
    vus: 10,
    duration: '10s',
};

// Глобальные метрики
let successRT = new Trend('successful_response_time', true); // true = рассчитывать stats
let okCount = new Counter('successful_requests');

let cars = Array.from({ length: 30 }, (_, i) => i + 1);

let successResponses = [];
let totalTime = 0;
let totalOk = 0;

export default function () {
    let index = Math.floor(Math.random() * cars.length);
    let carNumber = cars[index];
    let res = http.get(`http://127.0.0.1:8000/app/car_${carNumber}`);
    //let res = http.get(`http://localhost:8000/app/car_11`);

    //console.log(`RAW body: ${res.body}`);
    if (res.status === 200 && res.body && res.body !== '{}') {
        let status = res.json('status');
        let returnedCarNumber = res.json('car_number');
        //console.log(`car_number: ${returnedCarNumber}, status: ${status}`);

        if (status === true) {
            successRT.add(res.timings.duration);
            okCount.add(1);
        }
    }

    sleep(0.1); // контроль паузы между запросами, можно удалить
}

export function handleSummary(data) {
    return {
        stdout: `\nAVG (avg): ${data.metrics.successful_response_time.avg.toFixed(2)} ms\n` +
                `Percent 95 (p(95)): ${data.metrics.successful_response_time['p(95)'].toFixed(2)} ms\n` +
                `Success responces: ${data.metrics.successful_requests.count}\n`,
        'results.json': JSON.stringify(data, null, 2),
    };
}