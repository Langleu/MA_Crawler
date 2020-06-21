module.exports = (depend) => {
  // A depends on B
  const { serviceNameA, serviceNameB } = depend;

  let graqlInsertQuery = `match $serviceNameA isa service, has name "${serviceNameA}"; `;
  graqlInsertQuery += `$serviceNameB isa service, has rid "${serviceNameB}"; `;
  
  graqlInsertQuery +=
      "insert (dependant: $serviceNameA, dependency: $serviceNameB) isa depend;";
  return graqlInsertQuery;
}
