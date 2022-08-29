import './style.css';

enum Edge {
  ANY,
  GRASS,
  ROAD
}

type Point = {
  x: number,
  y: number
}

type Circle = {
  x: number,
  y: number,
  radius: number,
  edge: Edge
}

const tileImages = [
  'road_2.png',
  'road_3.png',
  'road_curved.png'
]

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

let circles: Circle[] = structuredClone(defaultCircles);

let i = 0;

let imgURL = 'tiles/' + tileImages[i];
let img = new Image();
img.src = imgURL;

const btn = document.createElement("button");
btn.innerHTML = "Save Tile";
document.body.appendChild(btn);
btn.addEventListener('click', () => {
  
  saveTile();
  circles = structuredClone(defaultCircles);
  i += 1;

  if (i === tileImages.length) {
    saveAll();
  } else {
    imgURL = 'tiles/' + tileImages[i];
    img.src = imgURL;
  }
})


function isIntersect(point: Point, circle: Circle) {
  return Math.sqrt((point.x-circle.x) ** 2 + (point.y - circle.y) ** 2) < circle.radius;
}

canvas.addEventListener('click', (e) => {
  const point = {
    x: e.clientX,
    y: e.clientY
  };
  circles.forEach((circle, id) => {
    if (isIntersect(point, circle)) {
      if (circle.edge === Edge.ROAD) {
        circle.edge = Edge.ANY
      } else {
        circle.edge += 1
      }
    }
  });
});

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

  ctx.drawImage(
    img,
    (canvas.width / 2) - (tileSize / 2),
    (canvas.height / 2) - (tileSize / 2),
    tileSize,
    tileSize
  );
  
  requestAnimationFrame(draw)
}

requestAnimationFrame(draw)

type Tile = {
  img: string,
  rot: number,
  left: string,
  top: string,
  right: string,
  bottom: string
} 

const tiles: Tile[] = [];

const saveTile = () => {
  console.log("Saving tile");
  const left = circles[0].edge.toString() + circles[1].edge.toString() + circles[2].edge.toString();
  const top = circles[0].edge.toString() + circles[3].edge.toString() + circles[5].edge.toString();
  const right = circles[5].edge.toString() + circles[6].edge.toString() + circles[7].edge.toString();
  const bottom = circles[2].edge.toString() + circles[4].edge.toString() + circles[7].edge.toString();

  tiles.push({
    img: imgURL,
    rot: 0,
    left: left,
    top: top,
    right: right,
    bottom: bottom
  });
  tiles.push({
    img: imgURL,
    rot: 90,
    left: bottom,
    top: left,
    right: top,
    bottom: right
  });
  tiles.push({
    img: imgURL,
    rot: 180,
    left: right,
    top: bottom,
    right: left,
    bottom: top
  });
  tiles.push({
    img: imgURL,
    rot: 270,
    left: top,
    top: right,
    right: bottom,
    bottom: left
  });
}

const saveAll = () => {
  console.log("Saving all to a json")
  const jsonTiles = JSON.stringify(tiles);
  console.log(jsonTiles);
}
