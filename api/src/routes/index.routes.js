const { Router } = require("express");
const products = require("../models/Products.js");
const mercadopago = require("mercadopago");

const router = Router();

// token de MercadoPago
mercadopago.configure({
  access_token:
    "TEST-298625319681219-072818-34c0e6fd31cb993506970ee698e06331-1112761190",
});

// ruta para recibir información de los productos a pagar
router.post("/create_preference", (req, res) => {
  let preference = {
    items: [
      {
        title: req.body.description,
        unit_price: Number(req.body.price),
        quantity: Number(req.body.quantity),
      },
    ],
    back_urls: {
      success: "http://localhost:5173",
      failure: "http://localhost:5173",
      pending: "",
    },
    auto_return: "approved",
  };

  mercadopago.preferences
    .create(preference)
    .then(function (response) {
      res.json({
        id: response.body.id,
      });
    })
    .catch(function (error) {
      console.log(error);
    });
});

// ruta que llama a todos los productos de la bdd
router.get("/", (req, res) => {
  products
    .find()
    .then((data) => res.status(201).json(data))
    .catch((error) => res.status(400).json({ message: error.message }));
});

// ruta que crea un producto
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

// ruta que modifica un producto
router.put("/:id", (req, res) => {
  const { id } = req.params;
  products
    .findByIdAndUpdate(id, req.body)
    .then((data) => res.status(201).json(data))
    .catch((error) => res.status(400).json({ message: error.message }));
});

// ruta que elimina un producto
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  products
    .findByIdAndDelete(id)
    .then((data) => res.status(201).json(data))
    .catch((error) => res.status(400).json({ message: error.message }));
});

module.exports = router;