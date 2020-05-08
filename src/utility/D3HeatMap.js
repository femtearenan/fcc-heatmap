import * as d3 from 'd3';

class D3HeatMap {
    constructor(data, selection = "#heatmap", heatAttribute = {x: "year", y: "month", heat: "variance"}, dimension = { height: 500, width: 800, padding: { x: 60, y: 40} }) {
        this.data = data;
        this.selection = selection;
        this.heatAttribute = heatAttribute;
        this.dimension = dimension;
        this.cell = {
            width: (dimension.width - dimension.padding.x * 2) / (d3.max(data, d => d[heatAttribute.x]) - d3.min(data, d => d[heatAttribute.x])),
            height: (dimension.height - (dimension.padding.y)) / (1 + d3.max(data, d => d[heatAttribute.y]) - d3.min(data, d => d[heatAttribute.y]))
        };
        this.attachHeatMap = this.attachHeatMap.bind(this);
        this.colors = ["#3F51B5", "#29B6F6", "#80DEEA", "#FFF59D", "#FDD835", "#F4511E", "#E53935"];
    }

    attachHeatMap(xFormat = "d", yFormat = (month) => { 
            return (new Date(1970, month, 0)).toLocaleString('default', { month: 'long'});
        }
        ){
        const xScale = this.getXScale(this.data, this.heatAttribute.x);
        const yScale = this.getYScale(this.data, this.heatAttribute.y);

        const xAxis = d3.axisBottom(xScale);
        if (typeof xFormat === "function") {
            xAxis.tickFormat(d => xFormat(d));
        } else if (xFormat) {
            xAxis.tickFormat(d3.format("d"))
        } else {
            console.log("xFormat is false")
        }

        const yAxis = d3.axisLeft(yScale);
        if (typeof yFormat === "function") {
            yAxis.tickFormat(d => yFormat(d));
        } else if (yFormat) {
            yAxis.tickFormat(d3.format(yFormat))
        }

        const svg = d3.select(this.selection)
                        .append("svg")
                        .attr("class", "map-content")
                        .attr("width", this.dimension.width)
                        .attr("height", this.dimension.height);
        const minHeat = d3.min(this.data, d => d[this.heatAttribute.heat]);
        const maxHeat = d3.max(this.data, d => d[this.heatAttribute.heat]);
        const info = d3.select(this.selection)
                        .append("div")
                        .attr("id", "tooltip")
                        .attr("class", "hide");
                        
        
        svg.selectAll('rect')
            .data(this.data)
            .enter()
            .append('rect')
            .attr('x', (d, i) => {
                return xScale(d[this.heatAttribute.x])}
            )
            .attr('y', (d, i) => yScale(d[this.heatAttribute.y]) - this.dimension.padding.y)
            .attr('height', this.cell.height)
            .attr('width', this.cell.width)
            .attr('class', 'cell')
            .attr('data-' + this.heatAttribute.x, d => d[this.heatAttribute.x])
            .attr('data-' + this.heatAttribute.y, d => d[this.heatAttribute.y]-1)
            .attr('data-temp', d => d[this.heatAttribute.heat])
            .attr('fill', d => getColorForScale(d[this.heatAttribute.heat], [minHeat, maxHeat]))
            .on('mouseover', d => {
                info.attr("class", "show")
                    .text(`${this.heatAttribute.x}: ${d[this.heatAttribute.x]}\n
                        ${this.heatAttribute.y}: ${d[this.heatAttribute.y]}\n
                        ${this.heatAttribute.heat}: ${d[this.heatAttribute.heat]}`)
                    .attr('data-year', d[this.heatAttribute.x])
            })
            .on('mouseout', d => info.attr("class", "hide"));

        svg.append('g')
            .attr('transform', 'translate(0,' + (this.dimension.height - this.dimension.padding.y - 2) + ')')
            .attr('id', 'x-axis')
            .call(xAxis);

        svg.append("g")
            .attr("transform", "translate(" + this.dimension.padding.x + ", -" + (this.dimension.padding.y/2) + ')')
            .attr("id", "y-axis")
            .call(yAxis);
    }

    attachLegend() {
        let width = 300;
        let height = 100;
        let rectWidth = 300 / this.colors.length
        let rectHeight = height / 2;
        const legend = d3.select("#heatmap")
                            .append("svg")
                            .attr("id", "legend")
                            .attr("class", "heat-legend")
                            .attr("width", width)
                            .attr("height", height);
        

        legend.selectAll('rect')
            .data(this.colors)
            .enter()
            .append('rect')
            .attr('x', (d, i) => rectWidth * i)
            .attr('y', 10)
            .attr('height', rectHeight)
            .attr('width', rectWidth)
            .attr('fill', (d) => d);

        const heatScale = d3.scaleLinear()
            .domain([8.66 + d3.min(this.data, d => d[this.heatAttribute.heat]), 8.66 + d3.max(this.data, d=> d[this.heatAttribute.heat])])
            .range([0, width]);
        const heatAxis = d3.axisBottom(heatScale);

        legend.append('g')
            .attr('transform', 'translate(0,' + (height - (height / 3)) + ')')
            .attr('id', 'heat-axis')
            .call(heatAxis);
        
        
    }

    getXScale(data, attribute) {
        return d3.scaleLinear()
            .domain([d3.min(data, d => d[attribute]), d3.max(data, d=> d[attribute])])
            .range([this.dimension.padding.x, this.dimension.width - this.dimension.padding.x]);
            
    }

    getYScale(data, attribute) {
        return d3.scaleLinear()
            .domain([d3.min(data, d => d[attribute]), d3.max(data, d=> d[attribute])])
            .range([this.dimension.padding.y, this.dimension.height - this.dimension.padding.y]);
    }
}
function getColorForScale(value, range = [-5, 5], colors = 
    ["#3F51B5", "#29B6F6", "#80DEEA", "#FFF59D", "#FDD835", "#F4511E", "#E53935"]) {
    const rangeLength = range[1] - range[0];
    const intervals = rangeLength / colors.length;
    let i = getIndex(value, range[0], intervals, 0, colors.length);

    return colors[i];
}

function getIndex(value, minValue, intervals, index, maxDepth) {
    if (value <= minValue + intervals * (index + 1)) {
        return index;
    } else if (index === maxDepth) {
        return maxDepth - 1;
    } else {
        return getIndex(value, minValue, intervals, ++index, maxDepth);
    }
}

export default D3HeatMap;