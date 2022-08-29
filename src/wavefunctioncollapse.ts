import tilesJSON from './../public/tiles.json';
import './style.css';

const tileSize = 64;

const startingTile = tilesJSON[0];

const canvas = document.getElementById('canvas') as HTMLCanvasElement;

const resizeCanvas = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas)


const ctx = canvas.getContext('2d')!;
// ctx.globalCompositeOperation='destination-over';

type TileT = {
  img: string,
  rot: number,
  left: string,
  top: string,
  right: string,
  bottom: string
} 

type PlacedTileT = {
  img: HTMLImageElement;
  tile: TileT,
  worldX: number,
  worldY: number
}

type EmptyTileT = {
  worldX: number,
  worldY: number,
  leftRes: string,
  topRes: string,
  rightRes: string,
  bottomRes: string
}

// const placedTiles: PlacedTileT[] = [];
// const emptyTiles: EmptyTileT[] = [];

const placedTilesMap: Map<string, PlacedTileT> = new Map();
const emptyTilesMap: Map<string, EmptyTileT> = new Map();

const addToPlacedMap = (worldX: number, worldY: number, tile: PlacedTileT) => {
  placedTilesMap.set(worldX.toString() + ',' + worldY.toString(), tile);
}

const getFromPlacedMap = (worldX: number, worldY: number) => {
  return placedTilesMap.get(worldX.toString() + ',' + worldY.toString());
}

const addToEmptyMap = (worldX: number, worldY: number, tile: EmptyTileT) => {
  emptyTilesMap.set(worldX.toString() + ',' + worldY.toString(), tile);
}

const getFromEmptyMap = (worldX: number, worldY: number) => {
  return emptyTilesMap.get(worldX.toString() + ',' + worldY.toString());
}

const checkNeighbours = (placedTile: PlacedTileT) => {
  const pushTiles = {
    left: true,
    top: true,
    right: true,
    bottom: true
  }
  // Check place tiles
  // left
  if (getFromPlacedMap(placedTile.worldX - tileSize, placedTile.worldY)) {
    pushTiles.left = false;
  }
  // right
  if (getFromPlacedMap(placedTile.worldX + tileSize, placedTile.worldY)) {
    pushTiles.right = false;
  }
  // top
  if (getFromPlacedMap(placedTile.worldX, placedTile.worldY - tileSize)) {
    pushTiles.top = false;
  }
  // bottom
  if (getFromPlacedMap(placedTile.worldX, placedTile.worldY + tileSize)) {
    pushTiles.bottom = false;
  }

  // Check Empty Tiles
  // left
  if (getFromEmptyMap(placedTile.worldX - tileSize, placedTile.worldY)) {
    const tile = getFromEmptyMap(placedTile.worldX - tileSize, placedTile.worldY)!
    tile.rightRes = placedTile.tile.left;
    addToEmptyMap(placedTile.worldX - tileSize, placedTile.worldY, tile);
    pushTiles.left = false;
  }
  // right
  if (getFromEmptyMap(placedTile.worldX + tileSize, placedTile.worldY)) {
    const tile = getFromEmptyMap(placedTile.worldX + tileSize, placedTile.worldY)!
    tile.leftRes = placedTile.tile.right;
    addToEmptyMap(placedTile.worldX + tileSize, placedTile.worldY, tile);
    pushTiles.right = false;
  }
  // top
  if (getFromEmptyMap(placedTile.worldX, placedTile.worldY - tileSize)) {
    const tile = getFromEmptyMap(placedTile.worldX, placedTile.worldY - tileSize)!
    tile.bottomRes = placedTile.tile.top;
    addToEmptyMap(placedTile.worldX, placedTile.worldY - tileSize, tile);
    pushTiles.top = false;
  }
  // bottom
  if (getFromEmptyMap(placedTile.worldX, placedTile.worldY + tileSize)) {
    const tile = getFromEmptyMap(placedTile.worldX, placedTile.worldY + tileSize)!
    tile.topRes = placedTile.tile.bottom;
    addToEmptyMap(placedTile.worldX, placedTile.worldY + tileSize, tile);
    pushTiles.bottom = false;
  }

  // left
  if (pushTiles.left) {
    const tile = {
      worldX: placedTile.worldX - tileSize,
      worldY: placedTile.worldY,
      leftRes: "",
      topRes: "",
      rightRes: placedTile.tile.left,
      bottomRes: ""
    }
    addToEmptyMap(tile.worldX, tile.worldY, tile);
  }
  // right
  if (pushTiles.right) {
    const tile = {
      worldX: placedTile.worldX + tileSize,
      worldY: placedTile.worldY,
      leftRes: placedTile.tile.right,
      topRes: "",
      rightRes: "",
      bottomRes: ""
    }
    addToEmptyMap(tile.worldX, tile.worldY, tile);
  } 
  // top
  if (pushTiles.top) {
    const tile = {
      worldX: placedTile.worldX,
      worldY: placedTile.worldY - tileSize,
      leftRes: "",
      topRes: "",
      rightRes: "",
      bottomRes: placedTile.tile.top
    }
    addToEmptyMap(tile.worldX, tile.worldY, tile);
  }
  // bottom
  if (pushTiles.bottom) {
    const tile = {
      worldX: placedTile.worldX,
      worldY: placedTile.worldY + tileSize,
      leftRes: "",
      topRes: placedTile.tile.bottom,
      rightRes: "",
      bottomRes: ""
    }
    addToEmptyMap(tile.worldX, tile.worldY, tile);
  }
  // console.log(emptyTiles)
}

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const addNewPlacedTile = (tile: TileT, worldX: number, worldY: number) => {
  let tmpImg = new Image();
  tmpImg.src = tile.img;
  const newPlacedTile = {
    img: tmpImg,
    tile: tile,
    worldX: worldX,
    worldY: worldY
  }
  addToPlacedMap(worldX, worldY, newPlacedTile);
  checkNeighbours(newPlacedTile);
}

addNewPlacedTile(startingTile, Math.floor(canvas.width / 2), Math.floor(canvas.height / 2));

const checkPossibleTiles = (emptyTile: EmptyTileT) => {
  const workingTile = [];
  for(let i = 0; i < tilesJSON.length; i++) {
    const tile = tilesJSON[i];
    if (emptyTile.leftRes !== "" && emptyTile.leftRes !== tile.left) {
      continue;
    }
    if (emptyTile.topRes !== "" && emptyTile.topRes !== tile.top) {
      continue;
    }
    if (emptyTile.rightRes !== "" && emptyTile.rightRes !== tile.right) {
      continue;
    }
    if (emptyTile.bottomRes !== "" && emptyTile.bottomRes !== tile.bottom) {
      continue;
    }
    workingTile.push(tile);
  }
  if (workingTile.length === 0) {
    console.log("Working tiles:")
    console.log(workingTile)
  }
  let workingTileI = getRandomInt(0, workingTile.length - 1);
  addNewPlacedTile(workingTile[workingTileI], emptyTile.worldX, emptyTile.worldY);
}

// const btn = document.createElement("button");
// btn.innerHTML = "Next tile";
// document.body.appendChild(btn);
// btn.addEventListener('click', () => {
//   const emptyTilesI = 0 //getRandomInt(0, emptyTilesMap.values.length - 1);
//   const emptyTiles = Array.from(emptyTilesMap);
//   const [cordStr, emptyTile] = emptyTiles[emptyTilesI];
//   emptyTilesMap.delete(cordStr);
//   checkPossibleTiles(emptyTile);
// })

for (let i = 0; i < 400; i++) {
  const emptyTilesI = 0
  const emptyTiles = Array.from(emptyTilesMap);
  const [cordStr, emptyTile] = emptyTiles[emptyTilesI];
  emptyTilesMap.delete(cordStr);
  checkPossibleTiles(emptyTile);
}

// const drawArc = (circle: Circle) => {
//   switch (circle.edge) {
//     case Edge.ANY:
//       ctx.fillStyle = 'black';
//       break;
//     case Edge.GRASS:
//       ctx.fillStyle = 'green';
//       break;
//     case Edge.ROAD:
//       ctx.fillStyle = 'gray';
//       break;
//   }
  
//   ctx.beginPath();
//   ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI*2);
//   ctx.closePath();
//   ctx.fill();
// }

const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // circles.forEach(circle => {
  //   drawArc(circle);
  // });
  for (const placedTile of placedTilesMap.values()) {
    ctx.save();
    ctx.translate(placedTile.worldX, placedTile.worldY);
    ctx.rotate(placedTile.tile.rot*Math.PI/180);
    ctx.drawImage(
      placedTile.img,
      -tileSize/2,
      -tileSize/2,
      tileSize,
      tileSize
    );
    ctx.restore();
  }
  // for(let i = 0; i < placedTiles.length; i++) {
  //   const placedTile = placedTiles[i];
  //   ctx.save();
  //   ctx.translate(placedTile.worldX, placedTile.worldY);
  //   ctx.rotate(placedTile.tile.rot*Math.PI/180);
  //   ctx.drawImage(
  //     placedTile.img,
  //     -tileSize/2,
  //     -tileSize/2,
  //     tileSize,
  //     tileSize
  //   );
  //   ctx.restore();
  // }

  // for (const emptyTile of emptyTilesMap.values()) {
  //   ctx.beginPath();
  //   ctx.fillStyle = "red";
  //   ctx.rect(emptyTile.worldX -tileSize/2, emptyTile.worldY -tileSize/2, tileSize, tileSize);
  //   ctx.fill();
  //   ctx.stroke();
  // }

  requestAnimationFrame(draw)
}

requestAnimationFrame(draw)