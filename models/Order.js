import { Schema, model } from "mongoose";
import Joi from "joi";
import handleMongooseError from "../helpers/handleMongooseError.js";

const PHONE_REGEXP = /^\+\d{1,3}\(\d{1,4}\)\d{3}[\s.-]\d{2}[\s.-]\d{2}$/;
const EMAIL_REGEXP = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
const NAME_REGEXP = /^[\p{L}\s]+$/u;
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
      min: 3,
      max: 30,
      match: NAME_REGEXP,
      required: [true, '"name" is required'],
    },
    comment: {
      type: String,
      trim: true,
      min: 0,
      max: 1000,
      default: "",
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
    order: new Schema(
      {
        text: {
          type: String,
          required: [true, '"text" is required'],
        },
        positionText: {
          type: String,
          enum: {
            values: ["start", "end", "center", "justify"],
            message:
              '"positionText" must be one of: start, end, center, justify',
          },
          default: "start",
        },
        styleText: {
          type: String,
          enum: {
            values: ["uppercase", "lowercase", "capitalize", "none"],
            message:
              '"styleText" must be one of: uppercase, lowercase, capitalize, none',
          },
          default: "none",
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
          required: [true, '"price" is required'],
        },
      },
      { _id: false }
    ),
  },
  { versionKey: false, timestamps: true }
);

schema.post("save", handleMongooseError);
schema.post("update", handleMongooseError);
schema.post("findOneAndUpdate", handleMongooseError);
schema.post("insertMany", handleMongooseError);

const createOrderSchema = Joi.object({
  name: Joi.string().required().min(1).max(30).regex(NAME_REGEXP).messages({
    "any.required": '"name" is required',
    "string.min": `"name" should have a minimum length of {#limit}`,
    "string.max": `"name" should have a maximum length of {#limit}`,
  }),
  phone: Joi.string().regex(PHONE_REGEXP).required().messages({
    "any.required": '"phone" is required',
    "string.pattern.base": 'Invalid "phone" format',
  }),
  email: Joi.string().regex(EMAIL_REGEXP).required().messages({
    "any.required": '"email" is required',
    "string.pattern.base": 'Invalid "email" format',
  }),
  comment: Joi.string().min(0).max(1000).messages({
    "string.min": `"name" should have a minimum length of {#limit}`,
    "string.max": `"name" should have a maximum length of {#limit}`,
  }),
  communicateBy: Joi.array()
    .required()
    .custom(communicateByValidator)
    .messages({
      "any.required": '"communicateBy" is required',
    }),
  fileURL: Joi.string(),
  order: Joi.object({
    text: Joi.string().required(),
    positionText: Joi.string().valid("start", "end", "center", "justify"),
    styleText: Joi.string().valid(
      "uppercase",
      "lowercase",
      "capitalize",
      "none"
    ),
    font: Joi.string().required(),
    color: Joi.string().required(),
    width: Joi.number().required(),
    height: Joi.number().required(),
    price: Joi.number().required(),
  }),
});

const Notice = model("order", schema);

export default Notice;
export { createOrderSchema };
