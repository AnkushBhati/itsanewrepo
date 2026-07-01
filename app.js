 const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  stock: Number
});

module.exports = mongoose.model("Product", ProductSchema);

const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  },
  quantity: {
    type: Number,
    default: 1
  }
});

module.exports = mongoose.model("Cart", CartSchema);

const express = require("express");
const Cart = require("../models/Cart");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const cart = await Cart.find().populate("productId");
    res.json(cart);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/add", async (req, res) => {
  try {
    const { productId } = req.body;

    const existing = await Cart.findOne({ productId });

    if (existing) {
      existing.quantity += 1;
      await existing.save();
      return res.json(existing);
    }

    const item = await Cart.create({
      productId,
      quantity: 1
    });

    res.json(item);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { quantity } = req.body;

    const item = await Cart.findByIdAndUpdate(
      req.params.id,
      { quantity },
      { new: true }
    );

    res.json(item);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);

    res.json({
      message: "Item removed"
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const cartRoutes = require("./routes/cartRoutes");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(
  "mongodb://127.0.0.1:27017/ecommerce"
);

app.use("/api/cart", cartRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});


import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:5000/api"
});

import { useEffect, useState } from "react";
import api from "../api";

function Cart() {
  const [cart, setCart] = useState([]);

  const fetchCart = async () => {
    const res = await api.get("/cart");
    setCart(res.data);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQty = async (id, quantity) => {
    if (quantity < 1) return;

    await api.put(`/cart/${id}`, {
      quantity
    });

    fetchCart();
  };

  const removeItem = async (id) => {
    await api.delete(`/cart/${id}`);
    fetchCart();
  };

  const total = cart.reduce(
    (sum, item) =>
      sum + item.productId.price * item.quantity,
    0
  );

  return (
    <div>
      <h2>Shopping Cart</h2>

      {cart.map(item => (
        <div
          key={item._id}
          style={{
            border: "1px solid gray",
            padding: "10px",
            marginBottom: "10px"
          }}
        >
          <h4>{item.productId.name}</h4>

          <p>
            ₹{item.productId.price}
          </p>

          <button
            onClick={() =>
              updateQty(
                item._id,
                item.quantity - 1
              )
            }
          >
            -
          </button>

          <span
            style={{
              margin: "0 10px"
            }}
          >
            {item.quantity}
          </span>

          <button
            onClick={() =>
              updateQty(
                item._id,
                item.quantity + 1
              )
            }
          >
            +
          </button>

          <button
            style={{
              marginLeft: "20px",
              color: "red"
            }}
            onClick={() =>
              removeItem(item._id)
            }
          >
            Remove
          </button>
        </div>
      ))}

      <h3>Total: ₹{total}</h3>
    </div>
  );
}

export default Cart;

import Cart from "./components/Cart";

function App() {
  return (
    <div>
      <h1>E-Commerce Store</h1>
      <Cart />
    </div>
  );
}

export default App;

db.products.insertMany([
{
name:"Laptop",
price:50000,
stock:10,
image:"laptop.jpg"
},
{
name:"Mobile",
price:20000,
stock:15,
image:"mobile.jpg"
},
{
name:"Headphones",
price:2000,
stock:20,
image:"headphone.jpg"
}
])
