var dataT = [0];
var dataH = [0];
var t = 0;
var h = 0;

var indicatorTemperature = drawIndicator("°C", document.getElementById("indicatorTemperature"));
drawAreaChart(dataT, 600, 400, "°C", ["#ca269f", "#fe4e35", "#202020"], document.getElementById("graphTemperature"));

setInterval(() => {
    fetch('/temperature')
        .then(response => response.json())
        .then(data => {
            t = data.temperature;
            dataT.push(data.temperature);
            indicator(t, indicatorTemperature);
            drawAreaChart(dataT, 600, 400, "°C", ["#ca269f", "#fe4e35", "#202020"], document.getElementById("graphTemperature"));
        })
        .catch(error => console.error(error));

    fetch('/humidity')
        .then(response => response.json())
        .then(data => {
            h = data.humidity;
            dataH.push(data.humidity);
        })
        .catch(error => console.error(error));
}, 1000);
