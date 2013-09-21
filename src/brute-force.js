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
