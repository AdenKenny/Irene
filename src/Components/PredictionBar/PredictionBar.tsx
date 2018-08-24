import React from 'react';
import ReactDOM from 'react-dom';
import Prediction from '../Prediction/Prediction';

class PredictionBar extends React.Component<{}, {inputValue: string}> {

    private parent: Prediction;
    private field;

    constructor(props, state) {
        super(props, state);
        this.state = {
            inputValue: ''
        };
    }

    setParent(parent) {
        this.parent = parent;
    }

    inputListener(event) {
        let input: string = event.target.value;
        this.setInput(input);
        this.parent.inputListener(input);
    }

    keyPress(key) {
        const code = key.keyCode;
        if (code === 13) {
            this.parent.enter();
        }
        else if (code === 38) {
            this.parent.dirKey(true);
            key.preventDefault();
        }
        else if (code === 40) {
            this.parent.dirKey(false);
            key.preventDefault();
        }
    }

    setInput(input) {
        this.setState({
            inputValue: input
        });

        const k: any = ReactDOM.findDOMNode(this.refs.bar);
        k.focus();
    }

    render(): JSX.Element {
         return (<input type="text" placeholder="Type your question here" ref="bar" size={80} value={this.state.inputValue} 
                        onChange={(e) => this.inputListener(e)}
                        onKeyDown={(e) => this.keyPress(e)}
                        onClick={(e) => this.inputListener(e)}/>);
    }
}

export default PredictionBar;