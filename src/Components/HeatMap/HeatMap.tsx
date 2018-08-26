import * as d3 from 'd3';
import * as React from 'react';
import { Component } from 'react';

import './HeatMap.css';

class HeatMap extends Component<{data}> {

    private mapElement;
    private first;

    constructor(props) {
        super(props);
        this.first = true;
    }

    componentDidMount() {
        this.renderMap();
    }

    componentDidUpdate() {
        this.renderMap();
    }

    renderMap() {
        const width = window.screen.width / 2,
            height = window.screen.height / 2,
            cellSize = 50;

        const margin = {
            top: 10,
            bottom: 20,
            left: 50,
            right: 10
        };

        const allResults: boolean[][] = this.props.data;

        if (this.first) {
            this.first = false;
        }
        
        else {
            d3.select('svg').remove();
        }

        let svg = d3.select(this.mapElement)
            .append('svg')
            .attr('width', width)
            .attr('height', height);

        svg.selectAll('.rect-group')
            .data(allResults)
            .enter().append('g')
            .attr('class', 'rect-group')
            .attr('transform', function (d, i) {
                return 'translate(' + cellSize + ',' + (i * cellSize + cellSize) + ')';
            })

            .selectAll('rect')
            .data(function (d) {
                return d;
            })
            .enter()
            .append('rect')
            .attr('fill', function (d) {
                if (d)
                    return 'green';
                else
                    return 'red';
            })
            .attr('width', cellSize - 1)
            .attr('height', cellSize - 1)
            .attr('transform', function (d, i) {
                return 'translate(' + (i * cellSize + cellSize) + ',0)';
            })
            .on("mouseover", function (item, index) {
                d3.select(this).attr('fill', function (d) {
                    if (d)
                        return 'SEAGREEN';
                    else
                        return 'TOMATO';
                });
            })
            .on("mouseout", function (item, index) {
                d3.select(this).attr('fill', function (d) {
                    if (d) {
                        return 'green';
                    }
                    else {
                        return 'red';

                    }
                });
            });


        let rounds = 0;

        allResults.forEach(year => {
            if (year.length > rounds) {
                rounds = year.length;
            }
        });

        const x = d3.scaleLinear().domain([0, rounds]).range([0, cellSize * (rounds)]);
        const y = d3.scaleLinear().domain([2014, 2008]).range([cellSize * allResults.length, 0]);

        svg.append('g')
            .attr("class", "axis axis--x")
            .attr("transform", "translate(" + (cellSize * 2 - 2) + "," + (height / 2 + cellSize * 1.5 + 5) + ")")
            .call(d3.axisBottom(x));

        svg.append("text")
            .attr("transform",
                "translate(" + (margin.left + cellSize * rounds / 2) + " ," +
                (height - cellSize * 2) + ")")
            .style("text-anchor", "middle")
            .text("Match Number");

        svg.append('g')
            .attr("class", "axis axis--y")
            .attr("transform", "translate(" + (cellSize * 2 - 2) + "," + (cellSize) + ")")
            .call(d3.axisLeft(y))
            .selectAll('.tick text').text(t => {
                const text = String(t);
                if (text.endsWith(".5")) {
                    return text.substring(0, text.length - 2);
                }
                return "";
            });

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 20)
            .attr("x", -cellSize * 4)
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Year");
    }

    render() {

        return (
            <div className="HeatMap" ref={el => { this.mapElement = el; }}></div>
        );

    }
}

export default HeatMap;