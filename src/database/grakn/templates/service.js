module.exports = (service) => {
  const { name, rtype, metadata, version, image } = service;
  const schemaVersion = 1;
  const updated = new Date().toISOString().split('T')[0];
  const created = new Date().toISOString().split('T')[0];

  let graqlInsertQuery = `insert $service isa service, has name "${name}"`;
  
  graqlInsertQuery += `, has rtype "${rtype}"`;
  graqlInsertQuery += `, has metadata "${metadata}"`;
  graqlInsertQuery += `, has version "${version}"`;
  graqlInsertQuery += `, has image "${image}"`;
  graqlInsertQuery += `, has schemaVersion "${schemaVersion}"`;
  graqlInsertQuery += `, has updated "${updated}"`;
  graqlInsertQuery += `, has created "${created}"`;

  graqlInsertQuery += ";";
  return graqlInsertQuery;
}
