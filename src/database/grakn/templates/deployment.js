module.exports = (deployment) => {
  const { rid, rtype, rawUrl, name, executable, version } = deployment;

  let graqlInsertQuery = `insert $deployment isa deployment, has rid "${rid}"`;
  
  graqlInsertQuery += `, has name "${name}"`;
  graqlInsertQuery += `, has rtype "${rtype}"`;
  graqlInsertQuery += `, has rawUrl "${rawUrl}"`;
  graqlInsertQuery += `, has executable "${executable}"`;
  graqlInsertQuery += `, has version "${version}"`;

  graqlInsertQuery += ";";
  return graqlInsertQuery;
}
