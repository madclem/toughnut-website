const getDistOptim = function(x1, y1, x2, y2) {
  let xDist = x1 - x2
  let yDist = y1 - y2

  return xDist * xDist + yDist * yDist
}

export { getDistOptim }