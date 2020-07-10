module.exports = (include) => {
  const { deploymentId, serviceName } = include;

  let graqlInsertQuery = `match $deployment isa deployment, has rid "${deploymentId}"; `;
  graqlInsertQuery += `$service isa service, has name "${serviceName}"; `;
  
  graqlInsertQuery +=
      "insert (inclusion: $deployment, included: $service) isa include;";
  return graqlInsertQuery;
}
