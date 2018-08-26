import React from 'react';

import './Tooltip.css';

export default class Tooltip extends React.Component<{}, {visible, lines, x, y}> {

    public isOver: boolean; // Is over an element?

    constructor(props, state) {
        super(props, state);
        this.state = {
            visible: false,
            lines: [],
            x: 0,
            y: 0
        };

        this.enter = this.enter.bind(this); // Entered an element.
        this.leave = this.leave.bind(this); // Left an element.
    }

    render(): JSX.Element {
        if (this.state.visible === false) {
            return (<div></div>);
        }

        const lines = this.state.lines.map((line, i) => {
            return (
                <div key={i}>{line}<br/></div>
            );
        });

        return (
            <div className="tooltip" onMouseEnter={this.enter} onMouseLeave={this.leave}>
                <style>{"\
                    .tooltip {\
                        left: " + (this.state.x + 20) + "px;\
                        top: " + (this.state.y + 20) + "px;\
                    }\
                "}</style>
                {lines}
            </div>
        );
    }

    update(lines, x, y) {
        this.setState({
            visible: true,
            lines: lines,
            x: x,
            y: y
        });
    }

    enter() {
        this.isOver = true;
    }

    leave() {
        this.isOver = false;
        this.setState({visible: false});
    }
}