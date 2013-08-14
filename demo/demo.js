(function() {
  var stats = new Stats();
  stats.domElement.style.position = "absolute";
  stats.domElement.style.left = "0px";
  stats.domElement.style.top = "0px";
  document.body.appendChild(stats.domElement);

  var demo = Sketch.create({
    collisionDetector: new BroadPhase.BruteForce,

    setup: function() {
      this.particles = [];

      for (var i = 0; i < 100; i++) {
        var particle = new Particle(random(this.width), random(this.height));
        this.particles.push(particle);
      }
    },

    update: function() {
      for (var i = 0, length = this.particles.length; i < length; i++) {
        var particle = this.particles[i];

        particle.integrate();
        particle.colliding = false;

        if (particle.x - particle.radius < 0) particle.x = particle.radius, particle.vx *= -1;
        if (particle.x + particle.radius > this.width) particle.x = this.width - particle.radius, particle.vx *= -1;

        if (particle.y - particle.radius < 0) particle.y = particle.radius, particle.vy *= -1;
        if (particle.y + particle.radius > this.height) particle.y = this.height - particle.radius, particle.vy *= -1;
      }

      this.checkCollisions();
    },

    checkCollisions: function() {
      stats.begin();
      this.collisionDetector.check(this.particles, function(p1, p2) {
        p1.colliding = p2.colliding = true;
      });
      stats.end();
    },

    draw: function() {
      this.fillStyle = this.strokeStyle = "red";

      for (var i = 0, length = this.particles.length; i < length; i++) {
        var particle = this.particles[i];

        this.beginPath();
        this.arc(particle.x, particle.y, particle.radius, 0, TWO_PI);
        if (particle.colliding) this.fill();
        this.stroke();
      }
    }
  });
})();
