import React, { Component } from 'react';

class ListItem extends React.Component<{className: string, onClick: any, value:string}> {

    render() {
        return (
            <div className={this.props.className} onClick={this.props.onClick}>{this.props.value}</div>
        );
    }
}

export default ListItem;