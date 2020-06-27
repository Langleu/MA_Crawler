module.exports = (repo) => {
  const { rid, name, fork, description } = repo;
  const schemaVersion = 1;
  const updated = new Date().toISOString().split('T')[0];
  const created = new Date().toISOString().split('T')[0];

  let graqlInsertQuery = `insert $repository isa repository, has rid "${rid}"`;
  
  graqlInsertQuery += `, has name "${name}"`;
  graqlInsertQuery += `, has fork "${fork}"`;
  graqlInsertQuery += `, has description "${description}"`;
  graqlInsertQuery += `, has schemaVersion "${schemaVersion}"`;
  graqlInsertQuery += `, has updated "${updated}"`;
  graqlInsertQuery += `, has created "${created}"`;

  graqlInsertQuery += ";";
  return graqlInsertQuery;
}
