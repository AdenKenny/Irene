import * as d3 from 'd3';
import * as React from 'react';
import { Component } from 'react';
import * as Chart from 'react-d3-core';
import * as LineChart from 'react-d3-basic';
import ParseData from '../../Util/ParseData';

import './TheLineChart.css';

class TheLineChart extends Component<{ data }> {

    private chartElement;
    private first;

    constructor(props) {
        super(props);
        this.first = true;
    }

    componentDidMount() {
        this.renderChart();
    }

    componentDidUpdate() {
        this.renderChart();
    }

    renderChart() {
        interface teamObject {
            name: string;
            position: [number, number][];
        }

        const width = window.screen.width / 2,
            height = window.screen.height / 2;

        const margins: any = {
            top: 10,
            bottom: 70,
            left: 50,
            right: 300
        };

        const rawData = this.props.data;

        function onePerformance(team: string, round: number): number {
            let thePosition = -1;
            rawData[round].getRows().some(row => {
                if (row.name === team) {
                    thePosition = row.position;
                    return true;
                }
                return false;
            });
            return thePosition;
        };

        let teams = rawData[0].getRows().map(function (d, index) {
            return d.name;
        });

        const data: teamObject[] = teams.map(function (d, i) {
            return {
                name: d,
                position: rawData.map(function (item, index) {
                    const rank = onePerformance(d, index);
                    return [index + 1, rank];
                })
            };
        });

        const rounds = data[0].position.length;

        if (this.first) {
            this.first = false;
        }
        else {
            d3.select('svg').remove();
        }

        /* COMMENT */
        const svg = d3.select(this.chartElement)
            .append('svg')
            .attr('width', width)
            .attr('height', height);

        const x = d3.scaleLinear().domain([1, rounds]).range([0, width - margins.right]),
            y = d3.scaleLinear().domain([11, 1]).range([height - margins.bottom, margins.top]),
            z = d3.scaleOrdinal(d3.schemeCategory10);

        const line = d3.line()
            .x(function (d) {
                return x(d[0]);
            })
            .y(function (d) {
                return y(d[1]);
            });

        let g = svg.append('g')
            .attr("transform", "translate(" + margins.left + "," + margins.top + ")");

        const team = g.selectAll(".team")
            .data(data)
            .enter().append("g")
            .attr("class", "team")

        team.append("path")
            .attr("class", "line")
            .attr("fill", "none")
            .attr("d", function (d) { return line(d.position); })
            .on("click", function(item){
                const sel = d3.select(this);
            })
            .on("mouseover",function(item){
                const sel = d3.select(this);
                sel.style("stroke-width", "5");
            })
            .on("mouseout",function(item){
                const sel = d3.select(this);
                sel.style("stroke-width", "3");
            })
            .style("stroke", function (d) { return z(d.name); })
            .style("stroke-width", "3");

        team.append("text")
            .datum(function (d) { return { id: d.name, value: d.position[d.position.length - 1] }; })
            .attr("transform", function (d) { return "translate(" + x(d.value[0]) + "," + y(d.value[1]) + ")"; })
            .attr("x", 5)
            .attr("dy", "0.35em")
            .text(function (d) { return d.id; });

        g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + (height - margins.bottom) + ")")
            .call(d3.axisBottom(x));

        g.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(y))
            .select('.tick').remove();

        svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("x", (width  - margins.left) / 2)
            .attr("y", height - 8)
            .text("Round");

        svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("x", -(height - margins.top - margins.bottom) / 2)
            .attr("dy", ".75em")
            .attr("transform", "rotate(-90)")
            .text("Position");
    }



    render() {

        return (
            <div className="LineChart" ref={el => { this.chartElement = el; }}></div>
        )

    }
}

export default TheLineChart;