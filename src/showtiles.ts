import './style.css';
import tilesJSON from './../public/tiles.json';

enum Edge {
  ANY,
  GRASS,
  ROAD
}

type Circle = {
  x: number,
  y: number,
  radius: number,
  edge: Edge
}

const tileSize = 300;

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext('2d')!;
ctx.globalCompositeOperation='destination-over';

const defaultCircles: Circle[] = [
  {
    x: (canvas.width / 2) - (tileSize / 2),
    y: (canvas.height / 2) - (tileSize / 2),
    radius: 20,
    edge: Edge.ANY
  },
  {
    x: (canvas.width / 2) - (tileSize / 2),
    y: (canvas.height / 2),
    radius: 20,
    edge: Edge.ANY
  },
  {
    x: (canvas.width / 2) - (tileSize / 2),
    y: (canvas.height / 2) + (tileSize / 2),
    radius: 20,
    edge: Edge.ANY
  },
  {
    x: (canvas.width / 2),
    y: (canvas.height / 2) - (tileSize / 2),
    radius: 20,
    edge: Edge.ANY
  },
  {
    x: (canvas.width / 2),
    y: (canvas.height / 2) + (tileSize / 2),
    radius: 20,
    edge: Edge.ANY
  },
  {
    x: (canvas.width / 2) + (tileSize / 2),
    y: (canvas.height / 2) - (tileSize / 2),
    radius: 20,
    edge: Edge.ANY
  },
  {
    x: (canvas.width / 2) + (tileSize / 2),
    y: (canvas.height / 2),
    radius: 20,
    edge: Edge.ANY
  },
  {
    x: (canvas.width / 2) + (tileSize / 2),
    y: (canvas.height / 2) + (tileSize / 2),
    radius: 20,
    edge: Edge.ANY
  }
];

const updateEdges = () => {
  circles[0].edge = parseInt(currTile.left[0]);
  circles[1].edge = parseInt(currTile.left[1]);
  circles[2].edge = parseInt(currTile.left[2]);
  circles[3].edge = parseInt(currTile.top[1]);
  circles[4].edge = parseInt(currTile.bottom[1]);
  circles[5].edge = parseInt(currTile.top[2]);
  circles[6].edge = parseInt(currTile.right[1]);
  circles[7].edge = parseInt(currTile.right[2]);
}

let circles: Circle[] = structuredClone(defaultCircles);

let i = 0;

let currTile = tilesJSON[i];
updateEdges()

let imgURL = currTile.img;
let img = new Image();
img.src = imgURL;

const btn = document.createElement("button");
btn.innerHTML = "Next tile";
document.body.appendChild(btn);
btn.addEventListener('click', () => {
  circles = structuredClone(defaultCircles);
  i += 1;

  if (i === tilesJSON.length) {
    console.log("End")
  } else {
    currTile = tilesJSON[i];
    imgURL = currTile.img;
    img.src = imgURL;
    updateEdges()
  }
})





const drawArc = (circle: Circle) => {
  switch (circle.edge) {
    case Edge.ANY:
      ctx.fillStyle = 'black';
      break;
    case Edge.GRASS:
      ctx.fillStyle = 'green';
      break;
    case Edge.ROAD:
      ctx.fillStyle = 'gray';
      break;
  }
  
  ctx.beginPath();
  ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI*2);
  ctx.closePath();
  ctx.fill();
}

const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  circles.forEach(circle => {
    drawArc(circle);
  });

  ctx.save();
  ctx.translate(canvas.width/2,canvas.height/2);
  ctx.rotate(currTile.rot*Math.PI/180);
  ctx.drawImage(
    img,
    -tileSize/2,
    -tileSize/2,
    tileSize,
    tileSize
  );
  ctx.restore();
  
  requestAnimationFrame(draw)
}

requestAnimationFrame(draw)

