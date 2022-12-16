function download() {
    const dlLink = document.createElement('a');
    const pngString = document.getElementById("chart-landscape").src;
    dlLink.href = encodeURI(pngString);
    dlLink.download = "image";
    document.body.appendChild(dlLink);
    dlLink.click();
    document.body.removeChild(dlLink);
}