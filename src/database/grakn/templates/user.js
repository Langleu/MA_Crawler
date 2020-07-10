module.exports = (user) => {
  const { id, name, platform } = user;
  const schemaVersion = 1;
  const updated = new Date().toISOString().split('T')[0];
  const created = new Date().toISOString().split('T')[0];

  let graqlInsertQuery = `insert $user isa user, has rid "${id}"`;
  
  graqlInsertQuery += `, has name "${name}"`;
  graqlInsertQuery += `, has platform "${platform}"`;
  graqlInsertQuery += `, has schemaVersion ${schemaVersion}`;
  graqlInsertQuery += `, has updated ${updated}`;
  graqlInsertQuery += `, has created ${created}`;

  graqlInsertQuery += ";";
  return graqlInsertQuery;
}
