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
app.set('view engine', 'ejs')

app.post("/", async(req, res) => {
    const chart = req.body.chart;
    const newChart = preprocessChart(chart);
    const url = `${req.protocol}://${req.headers.host}`;
    console.log(url);
    const svgString = chart2svg(newChart, `${url}/asset`, pixelsPerBeat);
    res.render('portrait', {svgString: svgString})
});

app.post('/landscape', async(req, res) => {
    const chart = req.body.chart;
    const newChart = preprocessChart(chart);
    const url = `${req.protocol}://${req.headers.host}`;
    console.log(url);
    const svgString = chart2svg(newChart, `${url}/asset`, pixelsPerBeat);
    // vercelは横長に対応してないので縦長で生成
    if(process.env.VERCEL_URL){
        res.render('portrait', {svgString: svgString})
    } else {
        // 時間計測
        const start = new Date();
        const png = await svgChart2png(svgString);
        const end = new Date();
        console.log(end - start);
        const pngString = png.toString('base64');
        res.render('landscape', {pixelsPerBeat:pixelsPerBeat, svgString: svgString, pngString: pngString, elapsedTime: end-start});
    }
});

app.get('/', (req, res) => {
    res.sendFile('/index.html');
});

app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`);
});