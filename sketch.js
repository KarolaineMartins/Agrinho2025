// VARIÁVEIS GLOBAIS
let agricultor;
let caminhoneiro;
let recursos = [];
let temperaturaCidade = 25;
let nivelAguaCampo = 100;
let alimentosEntregues = 0;

function setup() {
  createCanvas(800, 400);
  
  // Inicializa os personagens
  agricultor = new Agricultor(100, height - 50);
  caminhoneiro = new Caminhoneiro(width/2, height - 80);
}

function draw() {
  // Fundo dinâmico que reflete o estado do ambiente
  background(lerpColor(color(34, 139, 34), color(245, 245, 220), temperaturaCidade/50));
  desenharAmbiente();
  
  atualizarElementos();
  mostrarInformacoes();
  verificarEstadoJogo();
}

function desenharAmbiente() {
  // Campo (lado esquerdo)
  fill(34, 139, 34); // Verde floresta
  rect(0, height/2, width/2, height/2);
  
  // Cidade (lado direito)
  fill(169, 169, 169); // Cinza escuro
  rect(width/2, height/2, width/2, height/2);
  
  // Rio 
  fill(30, 144, 255);
  rect(0, height-20, width/2, 20);
}

function atualizarElementos() {
  // Atualiza personagens
  agricultor.atualizar();
  caminhoneiro.atualizar();
  
  // Dinâmica ambiental
  temperaturaCidade += 0.02;
  nivelAguaCampo -= 0.005;
  
  // Verifica colisões
  gerenciarRecursos();
}

class Agricultor {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.velocidade = 3;
    this.carregandoAgua = false;
  }

  atualizar() {
    // Movimento limitado ao campo
    if (keyIsDown(LEFT_ARROW)) this.x = max(20, this.x - this.velocidade);
    if (keyIsDown(RIGHT_ARROW)) this.x = min(width/2 - 20, this.x + this.velocidade);
    if (keyIsDown(UP_ARROW)) this.y = max(50, this.y - this.velocidade);
    if (keyIsDown(DOWN_ARROW)) this.y = min(height-20, this.y + this.velocidade);
    
    // Coleta de água
    if (this.y > height-30 && !this.carregandoAgua) {
      this.carregandoAgua = true;
      nivelAguaCampo -= 5;
    }
  }

  mostrar() {
    fill(210, 180, 140); // Cor terrosa
    ellipse(this.x, this.y, 30, 40);
    if (this.carregandoAgua) {
      fill(30, 144, 255);
      rect(this.x-5, this.y-50, 10, 20);
    }
  }
}

class Caminhoneiro {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.velocidade = 4;
    this.carga = 0;
  }

  atualizar() {
    // Movimento entre zonas
    if (keyIsDown(65)) this.x -= this.velocidade; // Tecla A
    if (keyIsDown(68)) this.x += this.velocidade; // Tecla D
    
    // Limites de movimento
    this.x = constrain(this.x, 50, width-50);
    
    // Entrega automática ao alcançar a cidade
    if (this.x > width/2 && this.carga > 0) {
      alimentosEntregues += this.carga;
      this.carga = 0;
      temperaturaCidade -= this.carga * 0.5;
    }
  }

  mostrar() {
    fill(255, 165, 0); // Laranja
    rect(this.x-25, this.y, 50, 30);
    fill(0);
    text(`Carga: ${this.carga}L`, this.x, this.y+15);
  }
}

function gerenciarRecursos() {
  // Transferência de recursos entre personagens
  if (dist(agricultor.x, agricultor.y, caminhoneiro.x, caminhoneiro.y) < 30) {
    if (agricultor.carregandoAgua && caminhoneiro.carga < 100) {
      caminhoneiro.carga += 10;
      agricultor.carregandoAgua = false;
    }
  }
}

function mostrarInformacoes() {
  // HUD informativo
  fill(0);
  textSize(14);
  textAlign(LEFT);
  text(`Água: ${nf(nivelAguaCampo, 1, 1)}%`, 20, 30);
  text(`Temperatura: ${nf(temperaturaCidade, 1, 1)}°C`, width-180, 30);
  text(`Entregas: ${alimentosEntregues}`, width/2-40, 30);
  
  // Barra de progresso
  fill(30, 144, 255);
  rect(width/2-50, height-30, map(alimentosEntregues, 0, 100, 0, 100), 15);
}

function verificarEstadoJogo() {
  // Condições de vitória/derrota
  if (temperaturaCidade > 45 || nivelAguaCampo < 10) {
    textSize(32);
    fill(255, 0, 0);
    textAlign(CENTER);
    text('Sistema Desequilibrado!\nPressione R', width/2, height/2);
    noLoop();
  }
  if (alimentosEntregues >= 100) {
    textSize(32);
    fill(0, 255, 0);
    textAlign(CENTER);
    text('Sustentabilidade Alcançada!', width/2, height/2);
    noLoop();
  }
}

function keyPressed() {
  // Reiniciar jogo
  if (key === 'R' || key === 'r') {
    resetarJogo();
    loop();
  }
}

function resetarJogo() {
  temperaturaCidade = 25;
  nivelAguaCampo = 100;
  alimentosEntregues = 0;
  agricultor = new Agricultor(100, height - 50);
  caminhoneiro = new Caminhoneiro(width/2, height - 80);
}
