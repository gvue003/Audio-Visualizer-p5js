// Declare variables
let song;
let fft;
let particles = [];

// Preload the song before setup
function preload() {
  song = loadSound("Confetti - Hot.mp3");
}

function setup() {
  // Create canvas and set angle mode
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  
  // Initialize FFT analyzer
  fft = new p5.FFT();
}

function draw() {
  background(0);
  stroke(255);
  strokeWeight(3);
  noFill();

  // Translate origin to center of canvas
  translate(width / 2, height / 2);

  // Analyze audio and get amplitude
  fft.analyze();
  let amp = fft.getEnergy(20, 200);

  // Get waveform data
  let wave = fft.waveform();

  // Draw the waves
  for (let t = -1; t <= 1; t += 2) {
    beginShape();
    for (let i = 0; i <= 180; i += 0.5) {
      let index = floor(map(i, 0, 180, width, 0, wave.length - 1));
      let r = map(wave[index], -1, 1, 150, 350);
      let x = r * sin(i) * t;
      let y = r * cos(i);
      vertex(x, y);
    }
    endShape();
  }

  // Create and manage particles
  let p = new Particle();
  particles.push(p);

  for (let i = particles.length - 1; i >= 0; i--) {
    if (!particles[i].edges()) {
      particles[i].update(amp > 230);
      particles[i].show();
    } else {
      particles.splice(i, 1);
    }
  }
}

// Handle mouse click for audio control
function mouseClicked() {
  if (song.isPlaying()) {
    song.pause();
    noLoop();
  } else {
    song.play();
    loop();
  }
}

// Particle class
class Particle {
  constructor() {
    this.pos = p5.Vector.random2D().mult(250);
    this.vel = createVector(0, 0);
    this.acc = this.pos.copy().mult(random(0.0001, 0.00001));
    this.w = random(3, 5);
    this.color = [random(200, 255), random(200, 255), random(200, 255)];
  }

  update(cond) {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    if (cond) {
      this.pos.add(this.vel);
      this.pos.add(this.vel);
      this.pos.add(this.vel);
    }
  }

  edges() {
    return (
      this.pos.x < -width / 2 ||
      this.pos.x > width / 2 ||
      this.pos.y < -height / 2 ||
      this.pos.y > height / 2
    );
  }

  show() {
    noStroke();
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.w);
  }
}
