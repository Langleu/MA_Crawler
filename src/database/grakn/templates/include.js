module.exports = (include) => {
  const { deploymentId, serviceId } = include;

  let graqlInsertQuery = `match $deployment isa deployment, has rid "${deploymentId}"; `;
  graqlInsertQuery += `$service isa service, has rid "${serviceId}"; `;
  
  graqlInsertQuery +=
      `insert (inclusion: $deployment, included: $service) isa include, has rid "${deploymentId}-${serviceId}";`;
  return graqlInsertQuery;
}
