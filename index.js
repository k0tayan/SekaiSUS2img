const fs = require('fs');
const path = require("path");
const {chart2svg} = require('./chart2svg/chart2svg.js')
const {convert}  = require('convert-svg-to-png');

const pixelsPerBeat = 100;

const getPNG = async (svg) => {
    return await convert(svg, {
        puppeteer: { args: ['--no-sandbox'] }
    });
}

const preprocessChart = (chart) => {
    // BPM定義を削除
    chart = chart.replace(/#BPM.*/g, "");
    // BPM変化を削除
    chart = chart.replace(/#\d+08:.*/g, "");
    //const newChart = chart.replace(/#(([1-9][0-9][0-9])|([0-9][1-9][0-9])|([0-9][0-9][1-9]))(08):(.*)/g, "").replace(/#(BPM)([0-9][2-9]):(.*)/g, "");
    return chart;
}

const svgChart2png = async (svgString) => {
    const png = await getPNG(svgString);
    return png;
}

const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept',
    );
    next();
  });

app.post("/", async(req, res) => {
    const chart = req.body.chart;
    const newChart = preprocessChart(chart);
    const url = `${req.protocol}://${req.headers.host}`;
    console.log(url);
    const svgString = chart2svg(newChart, `${url}/asset`, pixelsPerBeat);
    const response = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css">
        <style>
            body {
                background-color: #003040;
            }
        </style>
    </head>
    <body>
        <div id="chart">
            ${svgString}
        </div>
    </body>
    </html>`
    res.send(response);
});

app.post('/landscape', async(req, res) => {
    const chart = req.body.chart;
    const newChart = preprocessChart(chart);
    const url = `${req.protocol}://${req.headers.host}`;
    console.log(url);
    const svgString = chart2svg(newChart, `${url}/asset`, pixelsPerBeat);
    // 時間計測
    const start = new Date();
    const png = await svgChart2png(svgString);
    const end = new Date();
    console.log(end - start);
    const pngString = png.toString('base64');
    const response = `
    <!DOCTYPE html>
    <html lang="ja">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css">
        <script>
            var pixelsPerBeat = ${pixelsPerBeat};
            var pngString = "${pngString}";
        </script>
        <script src="landscape.js"></script>
        <script src="download.js"></script>
        <style>
            body {
                background-color: #003040;
            }
            .container {
                display:flex;
                padding: 10px;
                align-items: flex-start;

            }
            .landscape {
                background-color: #000000;
                display: flex;
                border: 8px solid #ba55d3;
                border-radius: 10px;
                margin-left: 10px;
            }
            .btn {
                background-color: DodgerBlue;
                border: none;
                color: white;
                cursor: pointer;
                font-size: 20px;
                postion: -webkit-sticky;
                position: sticky;
                top: 0;
                padding: 3px;
            }
            .btn:hover {
                background-color: RoyalBlue;
            }
            #chart {
                background-color: #000000;
                border: 8px solid #ba55d3;
                border-radius: 10px;
            }
            #chart-landscape {
                height: 600px;
            }
        </style>
    </head>
    <body>
        <div><font color="white">変換時間: ${end - start}ms</font></div>
        <div class="container">
            <div id="chart">
                ${svgString}
            </div>
            <div class="landscape">
                <div><button class="btn" onclick="download()"><i class="fa fa-download">DL</i></button></div>
                <canvas id="chart-landscape" width="160px" height="${pixelsPerBeat * 8}px"></canvas>
            </div>
        </div>
    </body>
    </html>`
    res.send(response);
});

app.get('/', (req, res) => {
    res.sendFile('/index.html');
});

app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`);
});