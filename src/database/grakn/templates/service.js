module.exports = (service) => {
  const { name, type, metadata, version, image } = service;
  const schemaVersion = 1;
  const updated = new Date().toISOString().split('T')[0];
  const created = new Date().toISOString().split('T')[0];

  let graqlInsertQuery = `insert $service isa service, has name "${name}"`;
  
  graqlInsertQuery += `, has rtype "${type}"`;
  graqlInsertQuery += `, has metadata "${encodeURIComponent(metadata)}"`;
  graqlInsertQuery += `, has version "${version}"`;
  graqlInsertQuery += `, has image "${image}"`;
  graqlInsertQuery += `, has schemaVersion ${schemaVersion}`;
  graqlInsertQuery += `, has updated ${updated}`;
  graqlInsertQuery += `, has created ${created}`;

  graqlInsertQuery += ";";
  return graqlInsertQuery;
}
