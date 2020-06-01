module.exports = (contain) => {
  const { repoId, deploymentId } = contain;

  let graqlInsertQuery = `match $repository isa repository, has rid "${userId}"; `;
  graqlInsertQuery += `$deployment isa deployment, has rid "${deploymentId}"; `;
  
  graqlInsertQuery +=
      "insert (container: $repository, containment: $deployment) isa contain;";
  return graqlInsertQuery;
}
