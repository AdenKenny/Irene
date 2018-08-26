import * as d3 from 'd3';
import * as React from 'react';
import { Component } from 'react';
import * as d3j from 'd3-jetpack';

import "./TeamTable.css";

class TeamTable extends Component<{ data }> {

    private tableElement;
    private first;
    private columns: { head: string, cl: string, html: string }[];

    constructor(props) {
        super(props);
        this.first = true;
    }

    componentDidMount() {
        this.renderTable();
    }

    componentDidUpdate() {
        this.renderTable();
    }

    renderTable() {
        if (this.first) {
            this.first = false;
        }

        else {
            d3.select('table').remove();
        }

        const data = this.props.data;

        this.columns = [
            { head: "Position", cl: "title", html: d3j.f('position') },
            { head: "Name", cl: "DSADs", html: d3j.f('name') },
            { head: "Played", cl: "center", html: d3j.f('played') },
            { head: "Won", cl: "center", html: d3j.f('won') },
            { head: "Lost", cl: "center", html: d3j.f('lost') },
            { head: "Goals For", cl: "center", html: d3j.f('goalsFor') },
            { head: "Goals Against", cl: "center", html: d3j.f('goalsAgainst') },
            { head: "Goal Difference", cl: "center", html: d3j.f('goalDifference') },
            { head: "Points", cl: "center", html: d3j.f('pts') }
        ];

        let table = d3.select(this.tableElement)
            .append('table')
            .attr('cellpadding', 10)
            .attr('cellspacing', 0);

        table.append('thead').append('tr')
            .selectAll('th')
            .data(this.columns).enter()
            .append('th')
            .attr('class', d3j.f('cl'))
            .text(d3j.f('head'));

        const parent = this;

        table.append('tbody')
            .selectAll('tr')
            .data(data).enter()
            .append('tr')
            .selectAll('td')
            .data(function (row, i) {
                return parent.columns.map(function (c) {
                    const cell = {};
                    d3.keys(c).forEach(function (k) {
                        cell[k] = typeof c[k] === 'function' ? c[k](row, i) : c[k];
                    });

                    return cell;
                });
            }).enter().append('td').html(d3j.f('html')).attr('class', d3j.f('cl'));
    }

    render() {

        return (
            <div className="Table" ref={el => { this.tableElement = el; }}></div>
        );
    }
}

export default TeamTable;