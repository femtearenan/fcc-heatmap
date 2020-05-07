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
        const heatWidth = Math.abs(maxHeat - minHeat);
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
            .attr('fill', (d, i) => 'hsl(' + (Math.floor(360/heatWidth * d[this.heatAttribute.heat] )) + ', 100% , 50%)');

        svg.append('g')
            .attr('transform', 'translate(0,' + (this.dimension.height - this.dimension.padding.y - 2) + ')')
            .attr('id', 'x-axis')
            .call(xAxis);

        svg.append("g")
            .attr("transform", "translate(" + this.dimension.padding.x + ", -2)")
            .attr("id", "y-axis")
            .call(yAxis);
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

export default D3HeatMap;