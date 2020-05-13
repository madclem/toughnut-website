const getGeometryFaces = (mesh) => {
  const faces = [];
  
  for (let index = 0; index < mesh.indices.length; index += 3) {
    const indice1 = mesh.indices[index];
    const indice2 = mesh.indices[index + 1];
    const indice3 = mesh.indices[index + 2];
    const v1 = mesh.vertices[indice1];
    const v2 = mesh.vertices[indice2];
    const v3 = mesh.vertices[indice3];

    faces.push([v1, v2, v3]);
  }

  return faces;
};

export { getGeometryFaces };

