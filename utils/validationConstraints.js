import { validate } from "validate.js";

// validation of strings using validate.js
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

export const validateEmail = (id, value) => {
	const constraints = {
		presence: { allowEmpty: false },
	};

	if (value !== "") {
		constraints.email = true;
	}

	const validationRes = validate({ [id]: value }, { [id]: constraints });

	return validationRes && validationRes[id];
};

export const validatePassword = (id, value) => {
	const constraints = {
		presence: { allowEmpty: false },
	};

	if (value !== "") {
		constraints.length = {
			minimum: 6,
			message: "must be at least 6 characters",
		};
	}

	const validationRes = validate({ [id]: value }, { [id]: constraints });

	return validationRes && validationRes[id];
};

export const validateLength = (id, value, minLength, maxLength, allowEmpty) => {
	const constraints = {
		presence: { allowEmpty: allowEmpty },
	};

	if (!allowEmpty || value !== "") {
		constraints.length = {};

		if (minLength !== null) {
			constraints.length.minimum = minLength;
		}

		if (maxLength !== null) {
			constraints.length.maximum = maxLength;
		}
	}

	const validationRes = validate({ [id]: value }, { [id]: constraints });

	return validationRes && validationRes[id];
};
