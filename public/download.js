function download() {
    const svg = document.querySelector("svg");
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    canvas.width = svg.width.baseVal.value;
    canvas.height = svg.height.baseVal.value;

    const ctx = canvas.getContext("2d");
    const image = new Image;
    image.src = "data:image/svg+xml;charset=utf-8;base64," +  window.btoa(svgData);
    ctx.drawImage(image, 0, 0 );

    var imgURL = canvas.toDataURL("image/png");


    var dlLink = document.createElement('a');
    dlLink.download = "image";
    dlLink.href = imgURL;
    dlLink.dataset.downloadurl = ["image/png", dlLink.download, dlLink.href].join(':');

    document.body.appendChild(dlLink);
    dlLink.click();
    document.body.removeChild(dlLink);
}