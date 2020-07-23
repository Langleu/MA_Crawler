module.exports = (depend) => {
  // A depends on B
  const { serviceA, serviceB } = depend;

  let graqlInsertQuery = `match $serviceA isa service, has rid "${serviceA}"; `;
  graqlInsertQuery += `$serviceB isa service, has rid "${serviceB}"; `;
  
  graqlInsertQuery +=
      `insert (dependant: $serviceA, dependency: $serviceB) isa depend, has rid "${serviceA}-${serviceB}";`;
  return graqlInsertQuery;
}
