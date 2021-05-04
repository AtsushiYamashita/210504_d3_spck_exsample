export {
  hello,
  gameOfLife

  // as default
};

function hello(name) {
  alert(name + 'hello');
}



function gameOfLife(N, M) {
  var cells = d3.map(),
    life = 0;

  return {
    reset: reset,
    step: step,
    addRandom: addRandom
  };

  function reset(data) {
    cells.clear();
    data.forEach(function(d) {
      d = [+d.i, +d.j];
      cells.set(d, d);
    });
    life = 0;
  }

  function step() {
    var dead = [];

    if (life) {
      var num,
        alive = d3.map(),
        born = d3.map();

      cells.each(function(cell, key) {
        num = neighbours(cell, born);
        if (num > 1 && num < 4) {
          cell.isnew = false;
          alive.set(key, cell);
        } else {
          dead.push(cell);
        }
      });


      cells = alive;

      born.each(function(num, key) {
        if (num === 3) {
          key = key.split(',');
          var cell = [+key[0], +key[1]];
          cell.isnew = true;
          cells.set(key, cell);
        }
      });
    }
    life += 1;
    return { alive: cells.values(), dead: dead };
  }

  function addRandom(p) {
    var n = Math.floor((p || 0.05) * N * M),
      i = d3.randomUniform(0, N - 1),
      j = d3.randomUniform(1, M),
      d;
    for (var k = 0; k < n; ++k) {
      d = [Math.floor(i()) + 1, Math.floor(j()) + 1];
      cells.set(d, d);
    }
  }

  function add(cell, i, j, dead) {
    i = cell[0] + i;
    j = cell[1] + j;
    i = i <= N ? (i > 0 ? i : N) : 1;
    j = j <= M ? (j > 0 ? j : M) : 1;
    var index = '' + [i, j];

    if (cells.get(index)) return 1;

    var idx = dead.get(index) || 0;
    dead.set(index, idx + 1);
    return 0;
  }

  function neighbours(cell, dead) {
    return add(cell, -1, -1, dead) +
      add(cell, 0, -1, dead) +
      add(cell, 1, -1, dead) +
      add(cell, -1, 0, dead) +
      add(cell, 1, 0, dead) +
      add(cell, -1, 1, dead) +
      add(cell, 0, 1, dead) +
      add(cell, 1, 1, dead);
  }

}