function download() {
    const canvas = document.getElementById("chart-landscape");
    const dlLink = document.createElement('a');
    dlLink.href = canvas.toDataURL("image/png");
    dlLink.download = "image";
    document.body.appendChild(dlLink);
    dlLink.click();
    document.body.removeChild(dlLink);
}