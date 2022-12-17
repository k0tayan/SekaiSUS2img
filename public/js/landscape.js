window.onload = () => {
    const canvas = document.getElementById('chart-landscape');
    canvas.height = pixelsPerBeat * 8;
    const ctx = canvas.getContext("2d");
    const chartImage = new Image();
    chartImage.src = "data:image/png;base64," + pngString;
    chartImage.onload = () => {
        const width = chartImage.width;
        const height = chartImage.height;
        const m = Math.floor(height / (pixelsPerBeat * 8));
        let totalLeft = 0;
        canvas.width = width * (m + 1);
        for (let i = 0; i < m; i++) {
            const top = height - (i + 1) * pixelsPerBeat * 8;
            const left = totalLeft;
            totalLeft += width;
            ctx.drawImage(chartImage, 0, top, width, pixelsPerBeat * 8, left, 0, width, pixelsPerBeat * 8);
        }
        ctx.drawImage(chartImage, 0, 0, width, height % (pixelsPerBeat * 8), totalLeft, pixelsPerBeat * 8 - height % (pixelsPerBeat * 8), width, height % (pixelsPerBeat * 8));
    }
}