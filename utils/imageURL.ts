import { Image } from "react-native";

export const imageSource = require("./red-sky.jpg");
export const imageUrl = Image.resolveAssetSource(imageSource).uri;
