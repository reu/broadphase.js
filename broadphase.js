window.BroadPhase = {};
(function() {
  /**
   * The BruteForce collision detector class.
   * @class BruteForce
   */
  function BruteForce() {
  }

  /**
   * The most basic implementation of collision detection,
   * although it is suitable for lots of cases, specially
   * if you have few particles (< 100) in yout system.
   *
   * @method check
   * @param {Array} particles thie list of particles to check collisions.
   * @param {Function) resolver the collision resolver which will receive
   *     each collision pair.
   */
  BruteForce.prototype.check = function(particles, resolver) {
    var length = particles.length;

    for (var i = 0; i < length; i++) {
      var p1 = particles[i];

      for (var j = i + 1; j < length; j++) {
        var p2 = particles[j];

        if (p1.intersects(p2)) resolver(p1, p2);
      }
    }
  }

  window.BroadPhase.BruteForce = BruteForce;
})();
(function() {
  /**
   * Implements the space partitioning algorithim for better performance.
   * @see http://en.wikipedia.org/wiki/Space_partitioning
   * @class HashGrid
   */
  function HashGrid(width, height, cellWidth, cellHeight) {
    this.width = width;
    this.height = height;

    this.cellWidth = cellWidth || this.width / 10;
    this.cellHeight = cellHeight || this.height / 10;

    this.rows = Math.ceil(this.height / this.cellHeight);
    this.cols = Math.ceil(this.width / this.cellWidth);

    // We will need to use bruteforce check for each item inside a cell
    this.bruteForce = new BroadPhase.BruteForce;

    this.grid = [];
  }

  /**
   * Cleans the partitioning grid.
   *
   * @method resetGrid
   * @private
   */
  HashGrid.prototype.resetGrid = function() {
    for (var y = 0; y < this.rows; y++) {
      if (!this.grid[y]) continue;
      this.grid[y].length = 0;
    }
  }

  /**
   * @method check
   * @param {Array} particles thie list of particles to check collisions.
   * @param {Function) resolver the collision resolver which will receive
   *     each collision pair.
   */
  HashGrid.prototype.check = function(particles, resolver) {
    var length = particles.length;

    this.resetGrid();

    for (var i = 0; i < length; i++) {
      var particle = particles[i];

      var xMin = Math.floor((particle.x - particle.radius) / this.cellWidth);
      var xMax = Math.floor((particle.x + particle.radius) / this.cellWidth);
      var yMin = Math.floor((particle.y - particle.radius) / this.cellHeight);
      var yMax = Math.floor((particle.y + particle.radius) / this.cellHeight);

      for (var y = yMin; y <= yMax; y++) {
        var row = this.grid[y];
        if (!row) row = this.grid[y] = [];

        for (var x = xMin; x <= xMax; x++) {
          var col = row[x];
          if (!col) col = this.grid[y][x] = [];
          col.push(particle);
        }
      }
    }

    for (var y = 0; y < this.rows; y++) {
      var row = this.grid[y];
      if (!row) continue;

      for (var x = 0; x < this.cols; x++) {
        var col = row[x];
        if (!col) continue;

        this.bruteForce.check(col, resolver);
      }
    }
  }

  BroadPhase.HashGrid = HashGrid;
})();
