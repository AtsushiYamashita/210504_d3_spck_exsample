export {
  styleTrail
}

function styleTrail(trail, squares, delta) {
  trail.selectAll('rect')
    .data(squares.values())
    .enter()
    .append('rect')
    .attr('x', function(d) { return delta * (d[0] - 1); })
    .attr('y', function(d) { return delta * (d[1] - 1); })
    .attr('height', delta)
    .attr('width', delta)
    .style('fill', '#e31a1c')
    .style('fill-opacity', 0.1);
}