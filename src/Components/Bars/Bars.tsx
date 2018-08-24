import React, { Component } from 'react';
import { scaleLinear } from 'd3-scale';
import { interpolateLab } from 'd3-interpolate';

export default class Bars extends Component<{maxValue, scales, margins, data, svgDimensions}> {

  private tooltip;

  constructor(props) {
    super(props);
    this.enter = this.enter.bind(this);
    this.leave = this.leave.bind(this);
  }

  render() {
    const { scales, margins, data, svgDimensions } = this.props;
    const { xScale, yScale } = scales;
    const { height } = svgDimensions;

    const bars = [];
    data.forEach((datum, i) => {
      const winRate = datum.won * 100 / datum.played;
      bars.push(
        <rect
          id={i}
          key={i * 2}
          x={xScale(datum.name)}
          y={yScale(winRate)}
          height={height - margins.bottom - scales.yScale(winRate)}
          width={xScale.bandwidth()}
          fill={'#1c821e'}
          onMouseEnter={this.enter}
          onMouseLeave={this.leave}
        />
      );
      bars.push(
        <rect
          id={i}
          key={i * 2 + 1}
          x={xScale(datum.name)}
          y={yScale(100)}
          height={height - margins.bottom - scales.yScale(100 - winRate)}
          width={xScale.bandwidth()}
          fill={'#c91414'}
          onMouseEnter={this.enter}
          onMouseLeave={this.leave}
        />
      );
    });

    return (
        <g>{bars}</g>
    );
  }

  setTooltip(tooltip) {
    this.tooltip = tooltip;
  }

  enter(event) {
    const rect = event.target;

    const entry = this.props.data[event.target.id];
    const winP = Bars.round(entry.won * 100 / entry.played);
    const lost = entry.played - entry.won;
    const lostP = Bars.round(lost * 100 / entry.played);
    const lines = [
      entry.name, 
      "Played: " + entry.played,
      "Won: " + entry.won + " (" + winP + "%)",
      "Lost: " + lost + " (" + lostP + "%)"
    ];

    const bounds = rect.getBoundingClientRect();
    this.tooltip.update(lines, bounds.x, bounds.y);
  }

  static round(num) {
    return Math.round((num + 0.00001) * 100) / 100;
  }

  leave(event) {
    const bounds = event.target.getBoundingClientRect();
    if (!(event.pageX >= bounds.left && event.pageX <= bounds.right && 
            event.pageY >= bounds.top && event.pageY <= bounds.bottom) && !this.tooltip.isOver) {
      this.tooltip.setState({
        visible: false
      });
    }
  }
}