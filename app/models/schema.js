module.exports.schema = {
	Example: {
		attrs: {
			name: { type: String, unique: true },
			type: String,
		},
		helpers: {}//Helper object if for functions or global variables that the model could need in the future NOT IN THIS VERSION APPARENTLY
	}
};