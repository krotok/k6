
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Counter } from 'k6/metrics';

export let options = {
    vus: 50,
    duration: '5m',
};

// Глобальные метрики
let successRT = new Trend('successful_response_time', true); // true = рассчитывать stats
let okCount = new Counter('successful_requests');

let cars = Array.from({ length: 1500 }, (_, i) => i + 1);

export default function () {
    let index = Math.floor(Math.random() * cars.length);
    let carNumber = cars[index];
    let res = http.get(`https://host.com/api/car_${carNumber}`);

    if (res.status === 200 && res.body && res.body !== '{}' && res.json('status') === true) {
        successRT.add(res.timings.duration);
        okCount.add(1);
    }

    sleep(0.1);
}

export function handleSummary(data) {
    return {
        stdout: `\nСреднее время отклика (avg): ${data.metrics.successful_response_time.avg.toFixed(2)} ms\n` +
                `95-й процентиль (p(95)): ${data.metrics.successful_response_time['p(95)'].toFixed(2)} ms\n` +
                `Успешных запросов: ${data.metrics.successful_requests.count}\n`,
        'results.json': JSON.stringify(data, null, 2),
    };
}