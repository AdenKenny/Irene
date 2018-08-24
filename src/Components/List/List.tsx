import React, { Component } from 'react';
import ListItem from '../ListItem/ListItem';
import PredictionBar from '../PredictionBar/PredictionBar';
import Prediction from '../Prediction/Prediction';

class List extends React.Component<{}, {active: number}> {

    private predictions: string[];
    private parent: Prediction;
    private elements: JSX.Element[];


    constructor(props, state) {
        super(props, state);
        this.predictions = [];
        this.state = {
            active: 0
        };
    }

    setParent(parent) {
        this.parent = parent;
    }

    setPredictions(newPredictions) {
        this.predictions = newPredictions;
        this.forceUpdate();
    }

    pressed(i) {
        this.parent.pressed(this.predictions[i]);
    }

    dirKey(isUp) {
        var newState = this.state.active + (isUp ? -1 : 1);
        if (newState === this.elements.length) {
            newState = this.elements.length - 1;
        }
        else if (newState === -1) {
            newState = 0;
        }
        this.setState({
            active: newState
        });
    }

    getCurrent() {
        return this.predictions[this.state.active];
    }

    render() {
        var list = this;
        this.elements = this.predictions.map(function(item, i) {
            if (i === list.state.active) {
                return (
                    <ListItem key={i} className="autocomplete-active" value={item} onClick={() => list.pressed(i)}/>
                );
            }
            else {
                return (
                    <ListItem key={i} className="" value={item} onClick={() => list.pressed(i)}/>
                );
            }
        });

        return (
            <div id="auto-completelist" className="autocomplete-items">
                {this.elements} 
            </div>
        );
    }
}

export default List;