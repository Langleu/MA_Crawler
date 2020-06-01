module.exports = (own) => {
  const { userId, repoId } = own;

  let graqlInsertQuery = `match $user isa user, has rid "${userId}"; `;
  graqlInsertQuery += `$repository isa repository, has rid "${repoId}"; `;
  
  graqlInsertQuery +=
      "insert (owner: $user, ownee: $repository) isa own;";
  return graqlInsertQuery;
}
