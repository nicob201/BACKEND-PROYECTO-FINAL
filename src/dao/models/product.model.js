import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productCollection = "Products";

const productSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  price: { type: Number },
  thumbnail: { type: String },
  code: { type: String },
  category: { type: String },
  status: { type: Boolean, default: true },
  stock: { type: Number },
});

productSchema.plugin(mongoosePaginate);

const productModel = mongoose.model(productCollection, productSchema);

export default productModel;
