import mongoose from "mongoose";

const cartCollection = "Carts";

const cartSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products",
      },
      units: {
        type: Number,
        default: 1,
      },
    },
  ],
});

const cartModel = mongoose.model(cartCollection, cartSchema);

export default cartModel;
