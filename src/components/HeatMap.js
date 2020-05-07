import React from 'react';
import { connect } from 'react-redux';
import * as d3 from 'd3';
import D3HeatMap from '../utility/D3HeatMap';

class HeatMap extends React.Component {
    constructor(props) {
        super(props);
        this.width = this.props.width;
        this.height = this.props.height;
        this.padding = this.props.padding;
        this.drawHeatMap = this.drawHeatMap.bind(this);
    }

    drawHeatMap() {
        console.log("Loaded");
        if (this.props.appReducer.hasData) {
            console.log("Drawing");
            const data = this.props.appReducer.data;
            const heatMap = new D3HeatMap(data);
            heatMap.attachHeatMap();
        }
    }

    

    render() {
        if (this.props.appReducer.hasData) {
            return (
                <div id="heatmap">
                    <p id="description">This is a heat map</p>
                    { this.drawHeatMap() }
                </div>
            );
        } else {
            return (
                <div id="heatmap">
                    <p id="description">This is a heat map</p>
                </div>
            );
        }
    }
}

const mapStateToProps = state => ({
    ...state
});

export default connect(mapStateToProps)(HeatMap);