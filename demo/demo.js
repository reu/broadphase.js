(function() {
  var stats = new Stats();
  stats.domElement.style.position = "absolute";
  stats.domElement.style.left = "0px";
  stats.domElement.style.top = "0px";
  document.body.appendChild(stats.domElement);

  var demo = Sketch.create({
    collisionDetector: new BroadPhase.BruteForce,

    setup: function() {
      this.particleCount = 100;
      this.maxSize = 10;

      this.gui = new dat.GUI;
      this.gui.add(this, "particleCount", 10, 2000).onChange(this.populate.bind(this));
      this.gui.add(this, "maxSize", 5, 100).onChange(function() {
        for (var i = 0; i < this.particles.length; i++) {
          this.particles[i].radius = random(5, this.maxSize);
        }
      }.bind(this));

      this.populate();
    },

    populate: function() {
      this.particles = [];

      for (var i = 0; i < this.particleCount; i++) {
        var particle = new Particle(random(this.width), random(this.height), random(5, this.maxSize));
        this.particles.push(particle);
      }
    },

    resizeParticles: function() {
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
