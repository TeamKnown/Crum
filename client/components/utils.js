export const computePos = (crumInstance, locations) => {
  const z = // positive z means to the south, this should be correct
    (-(crumInstance.latitude - locations.latitude) * 6356000 * 3.14 * 2) / 360.0
  const x = // more negative longitude means positive x means to the east
    ((crumInstance.longitude - locations.longitude) *
      6356000 *
      3.14 *
      Math.cos((locations.longitude * 2 * 3.14) / 360) *
      2) /
    360.0
  const y = 0
  return {x, y, z}
}
export const SCALER = 1000

export const crumPlaneNamer = crumInstance => {
  return 'Crum?id=' + crumInstance.id + '&name=' + crumInstance.crum.name
}
