export default async (req, res) => {
  res.json({
    __filename,
    __dirname,
    cwd: process.cwd(),
  });
};
