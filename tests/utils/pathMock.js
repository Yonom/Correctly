module.exports = {
  process(_, src) {
    return `module.exports = ${JSON.stringify(src)};`;
  },
};
