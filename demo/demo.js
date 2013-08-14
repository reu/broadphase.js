(function() {
  var stats = new Stats();
  stats.domElement.style.position = "absolute";
  stats.domElement.style.left = "0px";
  stats.domElement.style.top = "0px";
  document.body.appendChild(stats.domElement);

  var demo = Sketch.create({
    detectorClass: "BruteForce",
    collisionDetector: new BroadPhase.BruteForce,

    setup: function() {
      this.particleCount = 100;
      this.maxSize = 10;

      this.cols = 100;
      this.rows = 100;
      this.showGrid = false;

      this.configureGUI();

      this.populate();
    },

    configureGUI: function() {
      this.gui = new dat.GUI;
      this.gui.add(this, "particleCount", 1, 2000).onChange(this.populate.bind(this));
      this.gui.add(this, "maxSize", 5, 100).onChange(function() {
        for (var i = 0; i < this.particles.length; i++) {
          this.particles[i].radius = random(5, this.maxSize);
        }
      }.bind(this));

      this.gui.add(this, "detectorClass", ["BruteForce", "HashGrid"]).onChange(function(detectorClass) {
        switch (detectorClass) {
          case "BruteForce":
            this.collisionDetector = new BroadPhase.BruteForce;
            break;
          case "HashGrid":
            this.collisionDetector = new BroadPhase.HashGrid(this.width, this.height, this.cols, this.rows);
            break;
        }
      }.bind(this));

      var hashMenu = this.gui.addFolder("HashGrid");
      hashMenu.add(this, "showGrid");
      hashMenu.add(this, "rows", 1, 500).onChange(function() {
        this.collisionDetector = new BroadPhase.HashGrid(this.width, this.height, this.cols, this.rows);
      }.bind(this));

      hashMenu.add(this, "cols", 1, 500).onChange(function() {
        this.collisionDetector = new BroadPhase.HashGrid(this.width, this.height, this.cols, this.rows);
      }.bind(this));
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

      if (this.showGrid && this.collisionDetector instanceof BroadPhase.HashGrid) {
        this.drawGrid();
      }
    },

    drawGrid: function() {
      var rows = this.collisionDetector.rows,
          cols = this.collisionDetector.cols,
          cellWidth = this.collisionDetector.cellWidth,
          cellHeight = this.collisionDetector.cellHeight,
          grid = this.collisionDetector.grid;

      this.beginPath();

      for (var y = 0; y < rows; y++) {
        this.moveTo(0, cellHeight * y);
        this.lineTo(this.width, cellHeight * y);

        for (var x = 0; x < cols; x++) {
          this.moveTo(cellWidth * x, 0);
          this.lineTo(cellWidth * x, this.height);

          var number = grid[y] && grid[y][x] && grid[y][x].length || 0;
          this.fillText(number, cellWidth * x + 2, cellHeight * y + 10);
        }
      }

      this.stroke();
    }
  });
})();
