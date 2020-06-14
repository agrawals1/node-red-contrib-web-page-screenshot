module.exports = function (RED) {
    function ScreenshotNode(config) {
        RED.nodes.createNode(this, config);
        let node = this;
        let path = config.path;
        let puppeteer = require('puppeteer');
        let option = {};
        
        if (path) {
            option.executablePath = path;
            option.args = ['--no-sandbox', '--disable-setuid-sandbox'];
        }

        node.on('input', function (msg) {
            let url;

            if (msg.url) {
                url = msg.url;
            } else if (config.url) {
                url = config.url;
            } else {
                // set to default.
                url = 'http://www.example.com/';
            }

            puppeteer.launch(option).then(async browser => {
                const option = {
                    type: 'png',
                    headless: true,
                    encoding: 'base64',
                    fullPage: true
                    
                };
                const page = await browser.newPage();
                await page.goto(url);
                const base64String = await page.screenshot(option);
                await browser.close();

                msg.payload = base64String;
                node.send(msg);
            });
        });
    }
    RED.nodes.registerType("screenshot", ScreenshotNode);
}
