import { Component } from "react";
import * as React from 'react';
import * as d3 from 'd3';
import Radar from 'react-d3-radar';

import './TeamRadarChart.css';
import App from "../../App";
import Tooltip from "src/Components/Tooltip/Tooltip";

class TeamRadarChart extends Component<{data, country}> {

    radar: any;
    tooltip: Tooltip;

    // Constants.
    private static readonly WIDTH: number = 500;
    private static readonly HEIGHT: number = 500;

    private baseline: number = 50; // The base value against which we'll scale.

    private els;

    private finalData;

    private current;

    constructor(props) {
        super(props);
        this.els = [];
        this.finalData = [];
    }

    // This function scales the data so that our chart fits properly.
    // Unfortunately the scaling means that some data is not actually accurate.
    // This was a conscious choice in order to allow the area of the team to represent 
    // their performance.
    private scaleData(data) {
        const newData = data.map(d => {
            return JSON.parse(JSON.stringify(d));
        });
        
        const goalDifferences: number[] = []; // Store all goal differences.
        newData.forEach(e => {
            goalDifferences.push(e.goalDifference);
        });
        // Get the lowest goal difference.
        const gdFactor: number = Math.min(...goalDifferences);
        // Lets avoid negative goal differences.
        newData.forEach(e => {
            e.goalDifference += -gdFactor; // Apply the factor.
        });

        const pts: number[] = []; // Store all pts.
        newData.forEach(e => {
            pts.push(e.pts);
        });
        this.baseline = Math.max(...pts); // The baseline against which we scale.

        const goalsFor: number[] = [];
        newData.forEach(e => {
            goalsFor.push(e.goalsFor);
        });
        const maxGf = Math.max(...goalsFor); // Get the max goals for.
        const gfScaleFactor = this.baseline / maxGf; // Value to scale all gfs.
        newData.forEach(e => { // Scale all gfs.
            e.goalsFor = Math.round(e.goalsFor * gfScaleFactor);
        });

        const lost: number[] = []; // We need to make 1 lost better than 5 lost on chart.
        newData.forEach(e => { // Get all the gas.
            lost.push(e.lost);
        });
        const maxLost = Math.max(...lost); // Get max val.
        const scaleLosses: number[] = [];
        
        let additionFactor = 2;
        if (this.props.country) {
            additionFactor = 4;
        }
        
        newData.forEach(e => {
            e.lost = Math.round(-(e.lost - maxLost) + additionFactor);
            scaleLosses.push(e.lost);
        });

        const goalsAgainst: number[] = []; // We need to make 0 ga better than 20 ga on chart.
        newData.forEach(e => { // Get all the gas.
            goalsAgainst.push(e.goalsAgainst);
        });
        const maxGa = Math.max(...goalsAgainst); // Get max val.
        const halfScaledGa: number[] = [];
        newData.forEach(e => {
            e.goalsAgainst = -(e.goalsAgainst - maxGa);
            halfScaledGa.push(e.goalsAgainst);
        });
        const scaledMaxGa: number = Math.max(...halfScaledGa);
        const gaScaleFactor: number = (this.baseline / scaledMaxGa) / 2; // Ga scale factor.
        newData.forEach(e => {
            e.goalsAgainst += Math.round(this.baseline) * 2;
            e.goalsAgainst = Math.round(e.goalsAgainst * gaScaleFactor);
        });

        const goalDifferences2: number[] = [];
        newData.forEach(e => {
            goalDifferences2.push(e.goalDifference);
        });
        const maxGd = Math.max(...goalDifferences2);
        const gdScaleFactor: number = (this.baseline / maxGd) / 2; // Gd scale factor.
        newData.forEach(e => {
            e.goalDifference += Math.round(this.baseline) * 2;
            e.goalDifference = Math.round(e.goalDifference * gdScaleFactor);
        });

        return newData;
    }

    private redoData(teamName: string) { // Call this if we remove a team.

        if (this.props.country) {
            
        }

        else { // If we're dealing with teams.
            const teams: string[] = App.teams;

            const k = this.props.data; // Lets mutate.
            
            let obj: {};

            k.forEach(e => { // Find the object we're looking for.
                if (e.name === teamName) {
                    obj = e;
                }
            });


            if (k.length > 2) { // If there are less than 2 teams it'll break the graph.
                for (let i = 0, n = k.length; i < n; ++i) {
                    if (this.props.data[i] === obj) {
                        this.props.data.splice(i, 1);
                    }
                }    
            }

            this.forceUpdate(); // Rerender with new data.
        }
    }

    render() {
        const newData = []; // To hold the properly structured data.

        const intermediateData: {}[] = [];

        let array: string[]; // Hold the names for our buttons.

        if (this.props.country) { // Is this showing countries?.
            intermediateData.push(this.props.data.pop()); // If so, we can just pop() the two items.
            intermediateData.push(this.props.data.pop());

            this.scaleData(intermediateData).forEach(e => { // Scale data.

                const obj = { // Modify the data to the structure we need.
                    key: e.name,
                    label: e.name,
                    values: {
                        Won: e.won,
                        Lost: e.lost,
                        GoalsFor: e.goalsFor,
                        GoalsAgainst: e.goalsAgainst,
                        GoalDifference: e.goalDifference,
                        Pts: e.pts
                    }
                };
                newData.push(obj);
            });

            array = ["New Zealand", "Australia"]; // Fill button names.
        }

        else { // We're viewing clubs.
            array = [];

            this.props.data.forEach(e => { // Get the data.
                intermediateData.push(e);
            });

            this.props.data.forEach(e => {
                array.push(e.name); // Get the names.
            });

            this.scaleData(intermediateData).forEach(e => { // Scale the data.

                const obj = { // Modify the data to the structure we need.
                    key: e.name,
                    label: e.name,
                    values: {
                        Won: e.won,
                        Lost: e.lost,
                        GoalsFor: e.goalsFor,
                        GoalsAgainst: e.goalsAgainst,
                        GoalDifference: e.goalDifference,
                        Pts: e.pts
                    }
                };
                newData.push(obj);
            });


        }
        
        this.finalData = newData; // Set the data.

        this.els = array.map((a, i) => { // Create the buttons.
            return (<button key={i} type="button" className="NameButton" onClick={() => { this.redoData(a) }}>{a}</button>);
        });

        return (
            <div className="WithButtons">
                <div className="Chart">
                    <Tooltip ref={child => {if (child !== null) {this.tooltip = child;}}}/>
                    <div
                        ref={child => {if (child !== null) {this.radar = child;}}}
                        onMouseEnter={() => {if (this.current !== undefined) {this.tooltip.setState({visible: true})}}}
                        onMouseLeave={() => {this.tooltip.setState({visible: false});}}
                    >
                        <Radar
                            width={TeamRadarChart.WIDTH}
                            height={TeamRadarChart.HEIGHT}
                            padding={70}
                            domainMax={this.baseline * 1.2}
                            highlighted={null}
                            onHover={(point, other) => {
                                if (point) {
                                    const team = point.setKey;
                                    if (team !== this.current) {
                                        this.current = team;
                                        const bounds = this.radar.getBoundingClientRect();
                                        this.tooltip.update([team], bounds.x, bounds.y);
                                    }
                                }
                                else {
                                    this.tooltip.setState({visible: false});
                                }
                            }}
                            data={{
                                variables: [
                                    { key: 'Pts', label: 'Points' },
                                    { key: 'Lost', label: 'Losses' },
                                    { key: 'GoalsFor', label: 'Goals Scored' },
                                    { key: 'GoalsAgainst', label: 'Goals Conceded' },
                                    { key: 'GoalDifference', label: 'Goal Difference' },
                                    { key: 'Won', label: 'Wins' },
                                ],
                                sets: this.finalData,
                            }}
                        />
                    </div>
                </div>
                <div className="KeysBox">
                    {this.els}
                </div>
                <div className="Clear"></div>
            </div>
        )
    }
}

export default TeamRadarChart;