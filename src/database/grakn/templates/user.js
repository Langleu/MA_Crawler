module.exports = (user) => {
  const { rid, name, platform } = user;

  let graqlInsertQuery = `insert $user isa user, has rid "${rid}"`;
  
  graqlInsertQuery += `, has name "${name}"`;
  graqlInsertQuery += `, has platform "${platform}"`;

  graqlInsertQuery += ";";
  return graqlInsertQuery;
}
