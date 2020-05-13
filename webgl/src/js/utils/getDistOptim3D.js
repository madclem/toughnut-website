const getDistOptim3D = function(x1, y1, z1, x2, y2, z2) {
  let xDist = x1 - x2
  let yDist = y1 - y2
  let zDist = z1 - z2

  return xDist * xDist + yDist * yDist + zDist * zDist
}

export { getDistOptim3D }