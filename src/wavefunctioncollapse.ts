import tilesJSON from './../public/final.json';
import './style.css';

const NUM_TILES = 10000;
const TILE_SIZE = 64;

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
  if (getFromPlacedMap(placedTile.worldX - TILE_SIZE, placedTile.worldY)) {
    pushTiles.left = false;
  }
  // right
  if (getFromPlacedMap(placedTile.worldX + TILE_SIZE, placedTile.worldY)) {
    pushTiles.right = false;
  }
  // top
  if (getFromPlacedMap(placedTile.worldX, placedTile.worldY - TILE_SIZE)) {
    pushTiles.top = false;
  }
  // bottom
  if (getFromPlacedMap(placedTile.worldX, placedTile.worldY + TILE_SIZE)) {
    pushTiles.bottom = false;
  }

  // Check Empty Tiles
  // left
  if (getFromEmptyMap(placedTile.worldX - TILE_SIZE, placedTile.worldY)) {
    const tile = getFromEmptyMap(placedTile.worldX - TILE_SIZE, placedTile.worldY)!
    tile.rightRes = placedTile.tile.left;
    addToEmptyMap(placedTile.worldX - TILE_SIZE, placedTile.worldY, tile);
    pushTiles.left = false;
  }
  // right
  if (getFromEmptyMap(placedTile.worldX + TILE_SIZE, placedTile.worldY)) {
    const tile = getFromEmptyMap(placedTile.worldX + TILE_SIZE, placedTile.worldY)!
    tile.leftRes = placedTile.tile.right;
    addToEmptyMap(placedTile.worldX + TILE_SIZE, placedTile.worldY, tile);
    pushTiles.right = false;
  }
  // top
  if (getFromEmptyMap(placedTile.worldX, placedTile.worldY - TILE_SIZE)) {
    const tile = getFromEmptyMap(placedTile.worldX, placedTile.worldY - TILE_SIZE)!
    tile.bottomRes = placedTile.tile.top;
    addToEmptyMap(placedTile.worldX, placedTile.worldY - TILE_SIZE, tile);
    pushTiles.top = false;
  }
  // bottom
  if (getFromEmptyMap(placedTile.worldX, placedTile.worldY + TILE_SIZE)) {
    const tile = getFromEmptyMap(placedTile.worldX, placedTile.worldY + TILE_SIZE)!
    tile.topRes = placedTile.tile.bottom;
    addToEmptyMap(placedTile.worldX, placedTile.worldY + TILE_SIZE, tile);
    pushTiles.bottom = false;
  }

  // left
  if (pushTiles.left) {
    const tile = {
      worldX: placedTile.worldX - TILE_SIZE,
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
      worldX: placedTile.worldX + TILE_SIZE,
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
      worldY: placedTile.worldY - TILE_SIZE,
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
      worldY: placedTile.worldY + TILE_SIZE,
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
    if (
      (emptyTile.leftRes === "" || emptyTile.leftRes === tile.left) &&
      (emptyTile.topRes === "" || emptyTile.topRes === tile.top) &&
      (emptyTile.rightRes === "" || emptyTile.rightRes === tile.right) &&
      (emptyTile.bottomRes === "" || emptyTile.bottomRes === tile.bottom)
      ) {
        workingTile.push(tile);
      }
  }
  if (workingTile.length === 0) {
    console.log("No more working tiles")
    console.log(emptyTile)
  } else {
    let workingTileI = getRandomInt(0, workingTile.length - 1);
    addNewPlacedTile(workingTile[workingTileI], emptyTile.worldX, emptyTile.worldY);
  }
}

// const btn = document.createElement("button");
// btn.innerHTML = "Next tile";
// document.body.appendChild(btn);
// btn.addEventListener('click', () => {
//   const emptyTiles = Array.from(emptyTilesMap);
//   const emptyTilesI = getRandomInt(0, emptyTiles.length - 1);
//   const [cordStr, emptyTile] = emptyTiles[emptyTilesI];
//   emptyTilesMap.delete(cordStr);
//   checkPossibleTiles(emptyTile);
// })

for (let i = 0; i < NUM_TILES; i++) {
  // const emptyTilesI = 0;
  const emptyTiles = Array.from(emptyTilesMap);
  if (emptyTiles.length === 0) {
    break;
  }
  const emptyTilesI = 0 //getRandomInt(0, emptyTiles.length - 1);
  const [cordStr, emptyTile] = emptyTiles[emptyTilesI];
  emptyTilesMap.delete(cordStr);
  checkPossibleTiles(emptyTile);
}

let cameraOffset = { x: window.innerWidth/2, y: window.innerHeight/2 }
let cameraZoom = 0.3
let MAX_ZOOM = 5
let MIN_ZOOM = 0.1
let SCROLL_SENSITIVITY = 0.002

let isDragging = false
let dragStart = { x: window.innerWidth / 2, y: window.innerHeight / 2 }

type Point = {
  x: number,
  y: number
}

let initialPinchDistance: any = null
let lastZoom = cameraZoom

const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  ctx.translate(window.innerWidth / 2, window.innerHeight / 2)
  ctx.scale(cameraZoom, cameraZoom)
  ctx.translate(-window.innerWidth / 2 + cameraOffset.x, -window.innerHeight / 2 + cameraOffset.y)
  // circles.forEach(circle => {
  //   drawArc(circle);
  // });
  for (const placedTile of placedTilesMap.values()) {
    ctx.save();
    ctx.translate(placedTile.worldX, placedTile.worldY);
    ctx.rotate(placedTile.tile.rot*Math.PI/180);
    ctx.drawImage(
      placedTile.img,
      -TILE_SIZE/2,
      -TILE_SIZE/2,
      TILE_SIZE,
      TILE_SIZE
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
  //     -TILE_SIZE/2,
  //     -TILE_SIZE/2,
  //     TILE_SIZE,
  //     TILE_SIZE
  //   );
  //   ctx.restore();
  // }

  // const debugDraw = (res: string, x: number, y: number) => {
  //   if (res === "") {
  //     return
  //   }
  //   switch (parseInt(res[1])) {
  //     case 0:
  //       ctx.fillStyle = 'green';
  //       break;
  //     case 1:
  //       ctx.fillStyle = 'gray';
  //       break;
  //     case 2:
  //       ctx.fillStyle = 'red';
  //       break;
  //     case 3:
  //       ctx.fillStyle = 'blue';
  //       break;
  //   }

  //   ctx.beginPath();
  //   ctx.arc(x, y, 5, 0, Math.PI*2);
  //   ctx.closePath();
  //   ctx.fill();
  // }

  // for (const emptyTile of emptyTilesMap.values()) {
  //   ctx.beginPath();
  //   ctx.fillStyle = "white";
  //   ctx.rect(emptyTile.worldX -TILE_SIZE/2, emptyTile.worldY -TILE_SIZE/2, TILE_SIZE, TILE_SIZE);
  //   ctx.fill();
  //   ctx.stroke();
  //   debugDraw(emptyTile.leftRes, emptyTile.worldX - TILE_SIZE/3, emptyTile.worldY)
  //   debugDraw(emptyTile.rightRes, emptyTile.worldX + TILE_SIZE/3, emptyTile.worldY)
  //   debugDraw(emptyTile.topRes, emptyTile.worldX, emptyTile.worldY - TILE_SIZE/3)
  //   debugDraw(emptyTile.bottomRes, emptyTile.worldX, emptyTile.worldY + TILE_SIZE/3)
  // }

  requestAnimationFrame(draw)
}

requestAnimationFrame(draw)

const getEventLocation = (e: any): Point => {
  if (e.touches && e.touches.length == 1) {
    return { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }
  else if (e.clientX && e.clientY) {
    return { x: e.clientX, y: e.clientY }
  }
  return {x: 0, y: 0}
}

const onPointerDown = (e: MouseEvent) => {
    isDragging = true
    dragStart.x = getEventLocation(e).x/cameraZoom - cameraOffset.x
    dragStart.y = getEventLocation(e).y/cameraZoom - cameraOffset.y
}

const onPointerUp = (e: MouseEvent) => {
  isDragging = false
  initialPinchDistance = null
  lastZoom = cameraZoom
}

const onPointerMove = (e: MouseEvent) => {
  if (isDragging) {
    cameraOffset.x = getEventLocation(e).x / cameraZoom - dragStart.x
    cameraOffset.y = getEventLocation(e).y / cameraZoom - dragStart.y
  }
}

const handlePinch = (e: TouchEvent) => {
  e.preventDefault()

  let touch1 = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  let touch2 = { x: e.touches[1].clientX, y: e.touches[1].clientY }

  // This is distance squared, but no need for an expensive sqrt as it's only used in ratio
  let currentDistance = (touch1.x - touch2.x) ** 2 + (touch1.y - touch2.y) ** 2

  if (initialPinchDistance == null) {
    initialPinchDistance = currentDistance
  }
  else {
    adjustZoom(null, currentDistance / initialPinchDistance)
  }
}

const adjustZoom = (zoomAmount: number|null, zoomFactor?: number) => {
  if (!isDragging) {
    if (zoomAmount) {
      cameraZoom -= zoomAmount
    }
    else if (zoomFactor) {
      console.log(zoomFactor)
      cameraZoom = zoomFactor * lastZoom
    }

    cameraZoom = Math.min(cameraZoom, MAX_ZOOM)
    cameraZoom = Math.max(cameraZoom, MIN_ZOOM)

    console.log(zoomAmount)
  }
}

const handleTouch = (e: TouchEvent, singleTouchHandler: Function) => {
  if (e.touches.length == 1) {
    singleTouchHandler(e)
  }
  else if (e.type == "touchmove" && e.touches.length == 2) {
    isDragging = false
    handlePinch(e)
  }
}


canvas.addEventListener('mousedown', onPointerDown)
canvas.addEventListener('touchstart', (e) => handleTouch(e, onPointerDown))
canvas.addEventListener('mouseup', onPointerUp)
canvas.addEventListener('touchend',  (e) => handleTouch(e, onPointerUp))
canvas.addEventListener('mousemove', onPointerMove)
canvas.addEventListener('touchmove', (e) => handleTouch(e, onPointerMove))
canvas.addEventListener( 'wheel', (e) => adjustZoom(e.deltaY*SCROLL_SENSITIVITY))