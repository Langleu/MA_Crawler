module.exports = (deployment) => {
  const { id, type, rawUrl, name, executable, version } = deployment;
  const schemaVersion = 1;
  const updated = new Date().toISOString().split('T')[0];
  const created = new Date().toISOString().split('T')[0];

  let graqlInsertQuery = `insert $deployment isa deployment, has rid "${id}"`;
  
  graqlInsertQuery += `, has name "${name}"`;
  graqlInsertQuery += `, has rtype "${type}"`;
  graqlInsertQuery += `, has rawUrl "${rawUrl}"`;
  graqlInsertQuery += `, has executable ${executable}`;
  graqlInsertQuery += `, has version "${version}"`;
  graqlInsertQuery += `, has schemaVersion ${schemaVersion}`;
  graqlInsertQuery += `, has updated ${updated}`;
  graqlInsertQuery += `, has created ${created}`;

  graqlInsertQuery += ";";
  return graqlInsertQuery;
}
