module.exports = (repo) => {
  const { rid, name, fork, description } = repo;

  let graqlInsertQuery = `insert $repository isa repository, has rid "${rid}"`;
  
  graqlInsertQuery += `, has name "${name}"`;
  graqlInsertQuery += `, has fork "${fork}"`;
  graqlInsertQuery += `, has description "${description}"`;

  graqlInsertQuery += ";";
  return graqlInsertQuery;
}
