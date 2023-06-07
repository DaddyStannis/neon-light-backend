import { Schema, model } from "mongoose";
import Joi from "joi";
import handleMongooseError from "../helpers/handleMongooseError.js";

const PHONE_REGEXP = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;
const EMAIL_REGEXP = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const MESSENGERS = ["email", "telegram", "viber"];

function communicateByValidator(values, helper) {
  if (!values.length) {
    return helper.message(
      `The array must include at least one of: ${MESSENGERS.join(", ")}`
    );
  }

  for (let i = 0; i < values.length; ++i) {
    if (!MESSENGERS.includes(values[i])) {
      return helper.message(`"${values[i]}" not allowed`);
    }

    const dublicateIndex = values.findIndex((val) => val === values[i]);
    if (dublicateIndex !== i) {
      return helper.message(`${values[i]}" is dublicated`);
    }
  }
}

const schema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, '"name" is required'],
    },
    phone: {
      type: String,
      trim: true,
      required: [true, '"phone" is required'],
      match: PHONE_REGEXP,
    },
    email: {
      type: String,
      trim: true,
      required: [true, '"email" is required'],
      match: EMAIL_REGEXP,
    },
    communicateBy: [
      {
        type: String,
        enum: { values: MESSENGERS },
      },
    ],
    fileURL: {
      type: String,
      trim: true,
    },
    order: new Schema({
      text: {
        type: String,
        required: [true, '"text" is required'],
      },
      positionText: {
        type: String,
        enum: {
          values: ["start", "end", "center", "justify"],
          message: '"positionText" must be one of: start, end, center, justify',
        },
        required: true,
      },
      styleText: {
        type: String,
        required: [true, '"styleText" is required'],
      },
      font: {
        type: String,
        required: [true, '"font" is required'],
      },
      color: {
        type: String,
        required: [true, '"color" is required'],
      },
      width: {
        type: Number,
        required: [true, '"width" is required'],
      },
      height: {
        type: Number,
        required: [true, '"height" is required'],
      },
      price: {
        type: Number,
      },
    }),
  },
  { versionKey: false, timestamps: true }
);

schema.post("save", handleMongooseError);
schema.post("update", handleMongooseError);
schema.post("findOneAndUpdate", handleMongooseError);
schema.post("insertMany", handleMongooseError);

const createOrderSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": '"name" is required',
  }),
  phone: Joi.string().regex(PHONE_REGEXP).required().messages({
    "any.required": '"phone" is required',
    "string.pattern.base": 'Invalid "phone" format',
  }),
  email: Joi.string().regex(EMAIL_REGEXP).required().messages({
    "any.required": '"email" is required',
    "string.pattern.base": 'Invalid "email" format',
  }),
  communicateBy: Joi.array()
    .required()
    .custom(communicateByValidator)
    .messages({
      "any.required": '"communicateBy" is required',
    }),
  fileURL: Joi.string(),
  order: Joi.object({
    text: Joi.string(),
    positionText: Joi.string(),
    styleText: Joi.string(),
    font: Joi.string(),
    color: Joi.string(),
    width: Joi.number(),
    height: Joi.number(),
    price: Joi.number(),
  }),
});

const Notice = model("order", schema);

export default Notice;
export { createOrderSchema };
