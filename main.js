function drawIndicator(type, content) {
    let newId = UUID();
    content.innerHTML = `
    <div class="novato-indicator-data">
        <div class="novato-indicator-data-flex">
            <div class="novato-indicator-data-value" id="value-${newId}">--</div>
            <div class="novato-indicator-data-type">${type}</div>    
        </div>
        <div class="novato-indicator-data-info">Detectados</div>
    </div>
    <svg viewBox="-10 -10 120 120" class="novato-indicator-svg">
        <defs>
            <linearGradient id="gradient" x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" stop-color="#87CEFA" />
                <stop offset="33%" stop-color="#7CFC00" />
                <stop offset="66%" stop-color="#FFFF00" />
                <stop offset="100%" stop-color="#FF4500" />
            </linearGradient>
        </defs>
        <path d="M 0 50 A 50 50 0 0 1 100 50" stroke="url(#gradient)" stroke-width="2" stroke-linecap="round"
            fill="none" />
            <circle cx="50" cy="0" r="3" fill="#fff" id="pivote-${newId}"/>
    </svg>
    `;
    return newId;
}

function indicator(x, id) {
    const pivote = document.querySelector(`#pivote-${id}`);
    pivote.setAttribute("cx", x);
    pivote.setAttribute("cy", f(x));
    document.querySelector(`#value-${id}`).innerText = x;
}

function indicatorAnimation(id, time) {
    let i = 0;
    setInterval(function() {
        if(i <= 100) {
            indicator(i++, id);
        }
    }, time * 1000);
}

function f(x) {
    return -Math.sqrt((50**2)-((x-50)**2))+50;
}

function UUID() {
    let d = new Date().getTime();
    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

function drawAreaChart(data, width, height, type, colors, content) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", width);
    svg.setAttribute("height", height);
    svg.setAttribute("class", "novato-area-chart-svg");
    svg.innerHTML = `
    <defs>
        <linearGradient id="gradiente" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="15%" style="stop-color: ${colors[0]};" />
        <stop offset="50%" style="stop-color: ${colors[1]};" />
        <stop offset="90%" style="stop-color: ${colors[2]};" />
        </linearGradient>
    </defs>
    <defs>
        <linearGradient id="gradiente2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color: ${colors[0]};" />
            <stop offset="100%" style="stop-color: ${colors[1]};" />
        </linearGradient>
    </defs>
    `;

    const max = Math.max(...data) + 1;
    const min = Math.min(...data) + 1;

    const xScale = width / (data.length - 1);
    const yScale = height / (max - min);

    let areaPoints = `0,${height} `;
    for (let i = 0; i < data.length-1; i++) {
        areaPoints += `${i * xScale},${height - ((data[i] - min) * yScale)} `;
    }
    areaPoints += `${width},${height} 0,${height}`;
    const area = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    area.setAttribute("points", areaPoints);
    area.setAttribute("fill", "url(#gradiente)");
    area.setAttribute("fill-opacity", "0.3")

    let curvePoints = "";
    for (let i = 1; i < data.length-1; i++) {
        curvePoints += `${i * xScale},${height - ((data[i] - min) * yScale)} `;
    }
    const curve = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    curve.setAttribute("points", curvePoints);
    curve.setAttribute("stroke-width", "5px");
    curve.setAttribute("stroke-linejoin", "round");
    curve.setAttribute("stroke-linecap", "round")
    curve.setAttribute("stroke", "url(#gradiente2)");
    curve.setAttribute("fill", "none");

    svg.appendChild(area);
    svg.appendChild(curve);
    content.innerHTML = "";
    dataAreaChart(data, width, height, type, content);
    content.appendChild(svg);
}

function dataAreaChart(data, width, height, type, content) {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const xScale = width / (data.length - 1);
    const yScale = height / (max - min);
    for (let i = 1; i < data.length-1; i++) {
        let interval = document.createElement("div");
        interval.classList.add("novato-area-chart-interval");
        interval.style.height = height + "px";
        interval.style.width = xScale + "px";
        interval.style.left = i * xScale + "px";
        interval.innerHTML = `<div class="novato-area-chart-interval-indicator" style="top: ${height - ((data[i] - min) * yScale) +30}px;">${data[i]}${type}</div>`;
        content.appendChild(interval);     
    }
}
