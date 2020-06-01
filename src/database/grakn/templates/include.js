module.exports = (include) => {
  const { deploymentId, imageName } = include;

  let graqlInsertQuery = `match $deployment isa deployment, has rid "${deploymentId}"; `;
  graqlInsertQuery += `$image isa image, has name "${image}"; `;
  
  graqlInsertQuery +=
      "insert (inclusion: $deployment, included: $image) isa include;";
  return graqlInsertQuery;
}
