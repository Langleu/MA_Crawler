module.exports = (service) => {
  const { name, rtype, metadata, version, image } = service;

  let graqlInsertQuery = `insert $service isa service, has name "${name}"`;
  
  graqlInsertQuery += `, has rtype "${rtype}"`;
  graqlInsertQuery += `, has metadata "${metadata}"`;
  graqlInsertQuery += `, has version "${version}"`;
  graqlInsertQuery += `, has image "${image}"`;

  graqlInsertQuery += ";";
  return graqlInsertQuery;
}
