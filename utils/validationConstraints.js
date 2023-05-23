import { validate } from "validate.js";

export const validateString = (id, value) => {
  const constraints = {
    presence: { allowEmpty: false },
  };

  if (value !== "") {
    constraints.format = {
      pattern: "[a-z]*",
      flags: "i",
      message: "Value can only contains letters",
    };
  }

  const validationRes = validate({ [id]: value }, { [id]: constraints });

  return validationRes && validationRes[id];
};
