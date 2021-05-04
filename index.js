// console.log('hell 00')
import * as Inbox from "./src/inbox.js";
import * as Style from "./src/style.js";
// console.log('hell 01')
// Inbox.hello('main');


d3.select('#svg')
  .on('click', function() {
    draw('svg');
  });

d3.select('select')
  .on('change.pattern', function() {
    pattern = d3.select(this).property('value');
    load();
  });

d3.select('button')
  .on('click.randomise', function() {
    game.addRandom();
  });

var example = d3.select("#example"),
  width = window.innerWidth,
  height = window.innerHeight,
  delta = 20,
  speed = 200,
  Ny = Math.floor(height / delta),
  Nx = Math.floor(width / delta),
  game = Inbox.gameOfLife(Nx, Ny),
  pattern = 'gosper',
  radius = delta / 2,
  squares = d3.map(),
  alive, dead, trail, squares,
  currentType,
  currentRes;

draw('svg');
load();
d3.timeout(redraw);

function load() {
  const base = [
    'fluidily-public.s3.amazonaws.com',
    'fluidily',
    'life',
    pattern
    ].join('/');
  const url = `https://${base}.csv`;
  d3.csv(url)
    .then(function(data) {
      delete data.columns;
      squares = d3.map();
      game.reset(data);
      draw(currentType, currentRes);
    });
}

function redraw() {
  var cells = game.step(),
    stylet = false,
    current = alive
    .selectAll('circle')
    .data(cells.alive);

  current
    .enter()
    .append('circle')
    .attr('r', radius)
    .merge(current)
    .style('fill', function(d) {
      return d.isnew ? '#1d91c0' : '#333';
    })
    .attr('cx', function(d) {
      return delta * d[0] - radius;
    })
    .attr('cy', function(d) {
      return delta * d[1] - radius;
    });

  current.exit().remove();

  current = dead
    .selectAll('circle')
    .data(cells.dead);

  current
    .enter()
    .append('circle')
    .attr('r', radius)
    .merge(current)
    .style('fill', '#e31a1c')
    .attr('cx', function(d) {
      return delta * d[0] - radius;
    })
    .attr('cy', function(d) {
      return delta * d[1] - radius;
    })
    .transition()
    .duration(speed - 20)
    .style('fill', '#fff')
    .transition()
    .duration(10)
    .each(function(d) {
      if (!squares.get(d)) {
        squares.set(d, d);
        stylet = true;
      }
    }).remove();

  if (stylet) Style.styleTrail(trail, squares, delta);

  d3.timeout(redraw, speed);
}

function draw(type, r) {
  example.select('.paper').remove();
  var paper = example
    .append(type)
    .classed('paper', true)
    .attr('width', width).attr('height', height)
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 " + width + " " + height)
    .style('stroke', '#999')
    .style('stroke-width', 0.5);

  currentType = type;
  currentRes = r;
  const fDiff = diff(delta);

  paper.append('g')
    .selectAll('line')
    .data(d3.range(Ny + 1))
    .enter()
    .append('line')
    .attr('x1', 0)
    .attr('y1', fDiff)
    .attr('x2', Nx * delta)
    .attr('y2', fDiff);

  paper.append('g')
    .selectAll('line')
    .data(d3.range(Nx + 1))
    .enter()
    .append('line')
    .attr('y1', 0)
    .attr('x1', fDiff)
    .attr('y2', Ny * delta)
    .attr('x2', fDiff);

  alive = paper.append('g')
    .classed('alive', true)
    .style('stroke', 'none');
  dead = paper.append('g')
    .classed('dead', true)
    .style('stroke', 'none');
  trail = paper.append('g')
    .classed('trail', true)
    .style('stroke', 'none');

  Style.styleTrail(trail, squares, delta);

  function diff(delta) {
    return (d, i) => delta * i;
  }

}