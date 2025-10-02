// not in use yet
const puppeteer = require('puppeteer');


(async () => {
    const url = process.argv[2] || process.env.MOCHA_RUNNER_URL;
    if (!url) {
        console.error('Usage: node scripts/run-mocha-in-chrome.js <runnerUrl>');
        process.exit(2);
    }

    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
    });

    try {
        const page = await browser.newPage();
        page.on('console', (msg) => console.log(msg.text()));

        await page.goto(url, {waitUntil: 'networkidle0'});

        // wait until mocha finished
        await page.waitForFunction(() => {
            const w = window;
            const m = w.mocha || w.Mocha || {};
            // a few common ways runners expose completion
            return Boolean(
                (m && m.stats && (m.stats.end || typeof m.stats.tests === 'number')) ||
                w.mochaResults
            );
        }, {timeout: 120000});

        const {passes, failures, tests} = await page.evaluate(() => {
            const w = window;
            const m = w.mocha || w.Mocha || {};
            const stats = (m && m.stats) || w.mochaResults || {};
            return {
                passes: stats.passes ?? stats.passed ?? 0,
                failures: stats.failures ?? stats.failed ?? 0,
                tests: stats.tests ?? stats.total ?? 0,
            };
        });

        console.log(`Mocha finished: ${passes}/${tests} passed, ${failures} failed`);
        process.exit(failures > 0 ? 1 : 0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    } finally {
        await browser.close();
    }
})();
