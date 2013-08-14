(function() {
  /**
   * The base circle Particle class.
   *
   * @class Particle
   * @property {Number} x
   * @property {Number} y
   * @property {Number} vy x velocity
   * @property {Number} vy y velocity
   */
  function Particle(x, y) {
    this.x = x;
    this.y = y;

    this.radius = random(5, 15);

    var theta = random(TWO_PI);
    this.vx = sin(theta) * 1;
    this.vy = cos(theta) * 1;
  }

  /**
   * Simple euler integration for now...
   *
   * @method integrate
   */
  Particle.prototype.integrate = function() {
    this.x += this.vx;
    this.y += this.vy;
  }

  /**
   * Checks if this particle intersects another one.
   *
   * @method intersects
   * @param {Particle} particle
   */
  Particle.prototype.intersects = function(particle) {
    var dx = this.x - particle.x;
    var dy = this.y - particle.y;
    var radii = this.radius + particle.radius;

    return (dx*dx + dy*dy) < (radii*radii);
  }

  window.Particle = Particle;
})();
