import React, { Component } from 'react'
import { scaleBand, scaleLinear } from 'd3-scale'

import Axes from '../Axes/Axes';
import Bars from '../Bars/Bars';
import Tooltip from '../Tooltip/Tooltip';
import './Chart.css';

class Chart extends Component<{data: {name, played, won}[]}> {

    private xScale;
    private yScale;
    private tooltip;

    constructor(props) {
        super(props);
        this.xScale = scaleBand();
        this.yScale = scaleLinear();
    }

    render() {
        const data = this.props.data;

        const margins = { top: 50, right: 20, bottom: 270, left: 170 };
        const svgDimensions = {
            width: 1000,
            height: 550
        };
        if (this.props.data. length < 8) {
            svgDimensions.width = this.props.data.length * (svgDimensions.width - margins.left - margins.right) /
                8 + margins.left + margins.right;
        }

        const maxValue = 100;

        const xScale = this.xScale
            .padding(0.1)
            .domain(data.map(d => d.name))
            .range([margins.left, svgDimensions.width - margins.right]);

        const yScale = this.yScale
            .domain([0, maxValue])
            .range([svgDimensions.height - margins.bottom, margins.top]);

        return (
            <div>
                <Tooltip ref={child => {if (child !== null) {this.tooltip = child;}}}/>
                <svg width={svgDimensions.width} height={svgDimensions.height}>
                    <Axes
                        scales={{ xScale, yScale }}
                        margins={margins}
                        svgDimensions={svgDimensions}
                    />
                    <Bars
                        scales={{ xScale, yScale }}
                        margins={margins}
                        data={data}
                        maxValue={maxValue}
                        svgDimensions={svgDimensions}
                        ref={child => {if (child !== null) {child.setTooltip(this.tooltip);}}}
                    />
                    <g>
                        <text className="Label" x={svgDimensions.width / 2} y={svgDimensions.height - 30}>Venue</text>
                    </g>
                    <g>
                        <text className="Label y" y={120} x={-(svgDimensions.height + margins.top - margins.bottom) / 2}>Winrate (%)</text>
                    </g>
                </svg>
            </div>
        );
    }
}

export default Chart;