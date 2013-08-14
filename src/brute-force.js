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
