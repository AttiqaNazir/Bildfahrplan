import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const Bildfahrplan = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const margin = { top: 20, right: 30, bottom: 30, left: 60 };
    const width = svg.attr('width') - margin.left - margin.right;
    const height = svg.attr('height') - margin.top - margin.bottom;
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand().domain(data.locations).range([0, width]).padding(0.1);
    const y = d3
      .scaleTime()
      .domain([
        d3.min(data.stops, (d) => new Date(`2022-01-01T${d.departureTime}`)),
        d3.max(data.stops, (d) => new Date(`2022-01-01T${d.arrivalTime}`))
      ])
      .range([height, 0]);

    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-0.8em')
      .attr('dy', '0.15em')
      .attr('transform', 'rotate(-45)');
    g.append('g').call(d3.axisLeft(y).ticks(10).tickFormat(d3.timeFormat('%H:%M')));

    for (let i = 0; i < data.stops.length - 1; i++) {
      const currentStop = data.stops[i];
      const nextStop = data.stops[i + 1];

      g.append('line')
        .attr('x1', x(currentStop.stopName) + x.bandwidth() / 2)
        .attr('y1', y(new Date(`2022-01-01T${currentStop.departureTime}`)))
        .attr('x2', x(nextStop.stopName) + x.bandwidth() / 2)
        .attr('y2', y(new Date(`2022-01-01T${nextStop.arrivalTime}`)))
        .attr('stroke', 'green')
        .attr('stroke-width', 2);
    }

    for (let i = 0; i < data.locations.length - 1; i++) {
      const currentStopX = x(data.locations[i]) + x.bandwidth() / 2;
      const nextStopX = x(data.locations[i + 1]) + x.bandwidth() / 2;

      g.append('line')
        .attr('x1', currentStopX)
        .attr('y1', 0)
        .attr('x2', currentStopX)
        .attr('y2', height)
        .attr('stroke', 'black')
        .attr('stroke-width', 1);

      if (i !== data.locations.length - 2) {
        g.append('line')
          .attr('x1', nextStopX)
          .attr('y1', 0)
          .attr('x2', nextStopX)
          .attr('y2', height)
          .attr('stroke', 'black')
          .attr('stroke-width', 1);
      }
    }
  }, [data]);

  return <svg className="frame" ref={svgRef} width={1500} height={600}></svg>;
};

export default Bildfahrplan;
