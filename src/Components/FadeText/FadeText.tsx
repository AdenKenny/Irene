import * as React from 'react';

class FadeText extends React.Component<{value: string}> {

    render() {
        return (
            <p>{this.props.value}</p>
        );
    }
}

export default FadeText;