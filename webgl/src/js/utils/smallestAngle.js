const smallestAngle = (angle, targetAngle) => {
  targetAngle %= Math.PI * 2
  angle %= Math.PI * 2
  if (angle < 0)angle += Math.PI * 2
  if (targetAngle < 0)targetAngle += Math.PI * 2
  let difference1 = targetAngle - angle
  let difference2 = (targetAngle + (Math.PI * 2)) - angle
  let difference3 = (targetAngle - (Math.PI * 2)) - angle
  let absDifference1 = Math.abs(difference1)
  let absDifference2 = Math.abs(difference2)
  let absDifference3 = Math.abs(difference3)
  let difference = difference1
  if (absDifference2 < absDifference1 && absDifference2 < absDifference3) {
    difference = difference2
  } else if (absDifference3 < absDifference1 && absDifference3 < absDifference2) {
    difference = difference3
  }
  return difference
};

export { smallestAngle };