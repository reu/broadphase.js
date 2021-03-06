window.BroadPhase = {};
(function(BroadPhase) {
  /**
   * The BruteForce collision detector class.
   * @class BruteForce
   */
  function BruteForce() {
  }

  /**
   * The most basic implementation of collision detection, although it is suitable for lots of cases,
   * specially if your system has few particles (< 100).
   *
   * @method check
   * @param {Array} particles thie list of particles to check collisions.
   * @param {Function} comparator the function that, given two objects, return if they are
   *     colliding or not.
   * @param {Function} resolver the collision resolver which will receive each collision pair
   *     occurence.
   */
  BruteForce.prototype.check = function(particles, comparator, resolver) {
    var length = particles.length,
        collisions = [];

    if (length < 2) return;

    for (var i = 0; i < length; i++) {
      var p1 = particles[i];

      for (var j = i + 1; j < length; j++) {
        var p2 = particles[j];

        if (comparator(p1, p2)) {
          if (resolver) resolver(p1, p2);
          collisions.push([p1, p2]);
        }
      }
    }

    return collisions;
  }

  BroadPhase.BruteForce = BruteForce;
})(window.BroadPhase);
(function(BroadPhase, BruteForce) {
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
    this.bruteForce = new BruteForce;

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
   * Checks for collision using spatial grid hashing.
   *
   * @method check
   * @param {Array} particles thie list of particles to check collisions.
   * @param {Function} comparator the function that, given two objects, return if they are
   *     colliding or not.
   * @param {Function} resolver the collision resolver which will receive each collision pair
   *     occurence.
   */
  HashGrid.prototype.check = function(particles, comparator, resolver) {
    var length = particles.length,
        collisions = [];

    this.resetGrid();

    for (var i = 0; i < length; i++) {
      var particle = particles[i];

      var xMin = ((particle.x - particle.radius) / this.cellWidth) << 0;
      var xMax = ((particle.x + particle.radius) / this.cellWidth) << 0;
      var yMin = ((particle.y - particle.radius) / this.cellHeight) << 0;
      var yMax = ((particle.y + particle.radius) / this.cellHeight) << 0;

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

        collisions.concat(this.bruteForce.check(col, comparator, resolver));
      }
    }

    return collisions;
  }

  BroadPhase.HashGrid = HashGrid;
})(window.BroadPhase, window.BroadPhase.BruteForce);
(function(BroadPhase, BruteForce) {
  /**
   * Implements a quad-tree structure to partition the space. You will want to use this when your
   * particles are heavly grouped in certain areas.
   * @class QuadTree
   * @property {Rectangle} bounds
   * @property {Number} maxDepth how many levels the tree will keep dividing the space.
   * @property {Number} maxParticles how many particles each node can store before dividing up.
   */
  function QuadTree(bounds, maxDepth, maxParticles) {
    this.bounds = bounds;
    this.maxDepth = maxDepth;
    this.maxParticles = maxParticles;

    this.particles = [];
    this.nodes = [];
  }

  QuadTree.TOP_LEFT = 0;
  QuadTree.TOP_RIGHT = 1;
  QuadTree.BOTTOM_LEFT = 2;
  QuadTree.BOTTOM_RIGHT = 3;

  // We will need to brute force check each particle in each node
  QuadTree.prototype.bruteForce = new BroadPhase.BruteForce;

  /**
   * Clears the tree.
   * @method @clear
   * @private
   */
  QuadTree.prototype.clear = function() {
    this.particles.length = 0;

    for (var i = 0; i < this.nodes.length; i++) {
      this.nodes[i].clear();
    }

    this.nodes.length = 0;
  }

  /**
   * Subdivides the space in four areas.
   *
   * @method subDivide
   * @pricate
   */
  QuadTree.prototype.subDivide = function() {
    var subTreeWidth = this.bounds.width / 2,
        subTreeHeight = this.bounds.height / 2,
        x = this.bounds.x,
        y = this.bounds.y,
        subTreeMaxDepth = this.maxDepth - 1,
        subTreeMaxParticles = this.maxParticles;

    function createSubTree(x, y) {
      return new QuadTree({
        x: x,
        y: y,
        width: subTreeWidth,
        height: subTreeHeight
      }, subTreeMaxDepth, subTreeMaxParticles);
    }

    this.nodes[QuadTree.TOP_LEFT] = createSubTree(x, y);
    this.nodes[QuadTree.TOP_RIGHT] = createSubTree(x + subTreeWidth, y);
    this.nodes[QuadTree.BOTTOM_LEFT] = createSubTree(x, y + subTreeHeight);
    this.nodes[QuadTree.BOTTOM_RIGHT] = createSubTree(x + subTreeWidth, y + subTreeHeight);
  }

  /**
   * Finds which quadrant a specific particle should belong.
   * @method findQuadrant
   * @private
   */
  QuadTree.prototype.findQuadrant = function(particle) {
    var verticalMid = this.bounds.x + this.bounds.width / 2,
        horizontalMid = this.bounds.y + this.bounds.height / 2;

    var fitsLeft   = particle.x + particle.radius < verticalMid,
        fitsRight  = particle.x - particle.radius > verticalMid,
        fitsTop    = particle.y + particle.radius < horizontalMid,
        fitsBottom = particle.y - particle.radius > horizontalMid;

    if (fitsTop && fitsLeft)     return this.nodes[QuadTree.TOP_LEFT];
    if (fitsTop && fitsRight)    return this.nodes[QuadTree.TOP_RIGHT];
    if (fitsBottom && fitsLeft)  return this.nodes[QuadTree.BOTTOM_LEFT];
    if (fitsBottom && fitsRight) return this.nodes[QuadTree.BOTTOM_RIGHT];
  }

  /**
   * Checks if this tree is a leaf (has no nodes).
   * @method isLeaf
   */
  QuadTree.prototype.isLeaf = function() {
    return this.nodes.length == 0;
  }

  /**
   * Inserts a particle in the tree.
   * @method insert
   * @private
   */
  QuadTree.prototype.insert = function(particle) {
    if (!this.isLeaf()) {
      var quadrant = this.findQuadrant(particle);
      if (quadrant) {
        quadrant.insert(particle);
        return;
      }
    }

    this.particles.push(particle);

    if (this.particles.length > this.maxParticles && this.maxDepth > 0) {
      if (this.isLeaf()) {
        this.subDivide();
      }

      var i = 0;
      while (i < this.particles.length) {
        var quadrant = this.findQuadrant(this.particles[i]);

        if (quadrant) {
          quadrant.insert(this.particles.splice(i, 1)[0]);
        } else {
          i++;
        }
      }
    }
  }

  /**
   * Searchs the tree for possible collisions between the informed particle.
   * @method queryPossibleCollisions
   * @private
   * @param {Particle} particle
   * @return {Array} possible collisions
   */
  QuadTree.prototype.queryPossibleCollisions = function(particle) {
    var particles = this.particles;

    if (!this.isLeaf()) {
      var quadrant = this.findQuadrant(particle);
      if (quadrant) {
        particles = particles.concat(quadrant.queryPossibleCollisions(particle));
      }
    }

    return particles;
  }

  /**
   * Checks for collision using a quad tree spatial hashing.
   *
   * @method check
   * @param {Array} particles thie list of particles to check collisions.
   * @param {Function} comparator the function that, given two objects, return if they are
   *     colliding or not.
   * @param {Function} resolver the collision resolver which will receive each collision pair
   *     occurence.
   */
  QuadTree.prototype.check = function(particles, comparator, resolver) {
    this.clear();

    var length = particles.length,
        collisions = [],
        i;

    for (i = 0; i < length; i++) {
      this.insert(particles[i]);
    }

    for (i = 0; i < length; i++) {
      var nearParticles = this.queryPossibleCollisions(particles[i]);
      collisions.concat(this.bruteForce.check(nearParticles, comparator, resolver));
    }
  }

  BroadPhase.QuadTree = QuadTree;
})(window.BroadPhase, window.BroadPhase.BruteForce);
