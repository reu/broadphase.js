(function() {
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
   * @method resetGrid
   * @private
   */
  HashGrid.prototype.resetGrid = function() {
    for (var y = 0; y < this.rows; y++) {
      if (!this.grid[y]) continue;
      this.grid[y].length = 0;
    }
  }

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
