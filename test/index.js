

const { remote } = require('webdriverio');
const axios = require('axios')
const express = require('express');
const { server } = require('websocket');
const port = 3000
const baseurl = `http://localhost:${port}`;
const InstanceTesting = require('./instance').default;

(async () => {
    let server_on;
    // check if server already running
    try {
        await axios.get(baseurl)
        server_on = true
    } catch (e) {
        server_on = false
    }
    console.log(server_on)
    if (server_on) {
        const { searchParams } = new URL(process.argv[process.argv.length - 1])
        const page = searchParams.get('page')
        let methods = searchParams.get('methods')
        methods = methods ? methods.split(',') : methods
        await axios.get(baseurl, { params: { page, methods } })

    } else {
        // generate wdio
        const browser = await remote({
            logLevel: 'info',
            capabilities: {
                browserName: 'chrome',
            },
        })
        await browser.setWindowSize(1500, 680)
        await browser.url('http://localhost:8080')

        // generate server
        const app = express()
        let instance = new InstanceTesting(browser)
        let instancepage
        app.get('/', async (req, res) => {
            const { page, method, methods } = req.query
            if (page) {
                instancepage = instance[page]
            }
            if (methods) {
                for (const m of methods) {
                    instancepage = await instancepage[m]()
                }
            }

            res.send('Hello World!')
        })

        app.listen(port, () => {

            console.log(`Example app listening at http://localhost:${port}`)
        })

        app.on('exit', () => {
            browser.closeApp()
        })
    }

})()
