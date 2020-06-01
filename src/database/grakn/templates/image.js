module.exports = (image) => {
  const { name, rtype, metadata, version } = image;

  let graqlInsertQuery = `insert $image isa image, has name "${name}"`;
  
  graqlInsertQuery += `, has rtype "${rtype}"`;
  graqlInsertQuery += `, has metadata "${metadata}"`;
  graqlInsertQuery += `, has version "${version}"`;

  graqlInsertQuery += ";";
  return graqlInsertQuery;
}
