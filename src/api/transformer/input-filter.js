export default (inputSchema) => {
  return {
    ...inputSchema,
    paths: Object.entries(inputSchema.paths).reduce((acc, [path, pathItem]) => {
      const operationPath = path
        .replace(/{./g, (m) => m[1].toUpperCase())
        .replace(/}/g, "")
        .replace(/\/./g, (m) => m[1].toUpperCase())
        .replace(/\-./g, (m) => m[1].toUpperCase());

      return {
        ...acc,
        [path]: Object.keys(pathItem).reduce((obj, key) => {
          obj[key] = pathItem[key];
          obj[key] = { ...obj[key], operationId: `${key}${operationPath}` };
          return obj;
        }, {}),
      };
    }, {}),
  };
};
