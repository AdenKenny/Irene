import * as React from 'react';

import FadeText from '../FadeText/FadeText';

class Intro extends React.Component {

    state;

    private strings;

    constructor () {
        super(0);
        this.state = {value : 0};
        this.strings = [
            "Hi, I'm Irene",
            "I'm here to help you visualise data from the results of the ANZ Championship from 2008 through 2013.",
            "What can I do?",
            "You can ask me questions and I'll answer them and show you relevant data.",
            "Why don't you give it a try?"
        ];
        this.updateState();
    }

    private updateState() {
        setTimeout(() => {
            const newValue = this.state.value + 1;
            this.setState({
                value: newValue
            });
            if (newValue < 5) {
                this.updateState();
            }
        }, 1000);
    }

    public render(): JSX.Element {
        const text = [];
        for (let i = 0; i < 5; i++) {
            text.push(this.strings[i]);
        }
        // for (let i = this.state.value; i < 5; i++) {
        //     text.push("  ");
        // }
        return (
            <div className="Intro">
                <div className="Intro0">
                    <h2 className="SmallerHeader">{text[0]}</h2>
                </div>
                <div className="Intro1">
                    <FadeText value={text[1]}/>
                </div>
                <div className="Intro2">
                    <h1 className="SmallerHeader">{text[2]}</h1>
                </div>
                <div className="Intro3">
                    <FadeText value={text[3]}/>
                </div>
                <div className="Intro4">
                    <h1 className="SmallerHeader">{text[4]}</h1>
                </div>
            </div>
        );
    }
}

export default Intro;