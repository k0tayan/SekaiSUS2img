import { Canvg } from 'https://cdn.skypack.dev/canvg';
let v = null;
window.onload = ()=>{
    const tmpCanvas = document.createElement("canvas");
    const tmpCtx = tmpCanvas.getContext("2d");
    const svg = document.querySelector("svg");
    v = Canvg.fromString(tmpCtx, svg.outerHTML.replace(/NS[0-9]+:href/g, "xlink:href"));
    const render = v.render();
    render.then( () => {
        const canvas = document.getElementById('chart-landscape');
        const ctx = canvas.getContext("2d");
        const width = tmpCanvas.width;
        const height = tmpCanvas.height;
        const m = Math.floor(height/ (pixelsPerBeat * 8));
        let totalLeft = 0;
        canvas.width = width * (m+1);
        for (let i = 0; i < m; i++) {
            const top = height - (i + 1) * pixelsPerBeat * 8;
            const left = totalLeft;
            totalLeft += width;
            ctx.drawImage(tmpCanvas, 0, top, width, pixelsPerBeat *8, left, 0, width, pixelsPerBeat * 8);
        }
        ctx.drawImage(tmpCanvas, 0, 0, width, height % (pixelsPerBeat * 8), totalLeft, pixelsPerBeat * 8 - height % (pixelsPerBeat * 8), width, height % (pixelsPerBeat * 8));
    });
    //v.start();
    /*const svg = document.querySelector("svg");
    const img = new Image();
    const canvas = document.getElementById('chart-landscape');
    const ctx = canvas.getContext("2d");
    img.src = 'http://www.w3.org/Icons/SVG/svg-logo-v.svg'
    img.onload = () => {
        ctx.drawImage(img, 0, 0, svg.width, svg.height)
    };*/
    /*const canvas = document.getElementById('chart-landscape');
    const ctx = canvas.getContext("2d");
    const chartImage = new Image();
    chartImage.src = "data:image/png;base64," + pngString;
    chartImage.onload = ()=>{
        const width = chartImage.width;
        const height = chartImage.height;
        const m = Math.floor(height/ (pixelsPerBeat * 8));
        let totalLeft = 0;
        canvas.width = width * (m+1);
        for (let i = 0; i < m; i++) {
            const top = height - (i + 1) * pixelsPerBeat * 8;
            const left = totalLeft;
            totalLeft += width;
            ctx.drawImage(chartImage, 0, top, width, pixelsPerBeat *8, left, 0, width, pixelsPerBeat * 8);
        }
        ctx.drawImage(chartImage, 0, 0, width, height % (pixelsPerBeat * 8), totalLeft, pixelsPerBeat * 8 - height % (pixelsPerBeat * 8), width, height % (pixelsPerBeat * 8));
    }*/

}