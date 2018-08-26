import React from 'react';
import FadeText from '../FadeText/FadeText';

import './Answers.css';

class Answers extends React.Component<{}, {element}> {

    constructor(props, state) {
        super(props, state);
        this.state = {
            element: this.original()
        };
    }

    render(): JSX.Element {
       return (
                <div className="Answer">
                    {this.state.element}
                </div>);
    }

    original(): JSX.Element {
        return (
            <div className="Intro">
                <div className="Intro0">
                    <h2 className="SmallerHeader">Hi, I'm Irene</h2>
                </div>
                <div className="Intro1">
                    <FadeText value="I'm here to help you visualise data from the the ANZ Championship from 2008 through 2013." />
                </div>
                <div className="Intro2">
                    <h1 className="SmallerHeader">What can I do?</h1>
                </div>
                <div className="Intro3">
                    <FadeText value="You can ask me questions and I'll answer them and show you relevant data." />
                </div>
                <div className="Intro4">
                    <h1 className="SmallerHeader">Why don't you give it a try?</h1>
                </div>
            </div>
        );
    }

    setElement(element: JSX.Element) {
        this.setState({element: (<div></div>)});
        this.setState({element: element});
    }
}

export default Answers;