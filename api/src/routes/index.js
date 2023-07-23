const { Router } = require("express");
const products = require("../models/Products.js");

const router = Router();

router.get("/", (req, res) => {
  products
    .find()
    .then((data) => res.status(201).json(data))
    .catch((error) => res.status(400).json({ message: error.message }));
});

router.post("/", (req, res) => {
  const product = products(req.body);
  if (req.file) {
    const { filename } = req.file;
    product.setImgUrl(filename);
  }
  product
    .save()
    .then((data) => res.status(201).json(data))
    .catch((error) => res.status(400).json({ message: error.message }));
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  products
    .findByIdAndUpdate(id, req.body)
    .then((data) => res.status(201).json(data))
    .catch((error) => res.status(400).json({ message: error.message }));
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  products
    .findByIdAndDelete(id)
    .then((data) => res.status(201).json(data))
    .catch((error) => res.status(400).json({ message: error.message }));
});

module.exports = router;
