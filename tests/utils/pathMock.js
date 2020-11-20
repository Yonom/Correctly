module.exports = {
  process(_, src) {
    return `module.exports = "${src}";`;
  },
};
