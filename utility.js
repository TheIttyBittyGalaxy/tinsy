function capitalise(str) {
	str = str.charAt(0).toUpperCase() + str.slice(1);
	return str.replace(/([\.\!\?]\s)([a-z])/, (_, p, c) => p + c.toUpperCase());
}

function quote(str) {
	// FIXME: Won't escape strings
	return `"${str}"`;
}

function join_with_and(list) {
	const len = list.length;
	if (len == 0) return "";
	else if (len == 1) return list[0];
	else if (len == 2) return list[0] + " and " + list[1];
	else return list.filter((v, i) => i < len - 1).join(", ") + ", and " + list[len - 1];
}

function assert_fields(obj, fields) {
	const missing = [];
	for (const field of fields) if (!obj[field]) missing.push(field);

	const invalid = [];
	for (const key in obj)
		if (Object.hasOwnProperty.call(obj, key)) if (fields.indexOf(key) == -1) invalid.push(key);

	const is_missing = missing.length > 0;
	const is_invalid = invalid.length > 0;
	const multiple_missing = missing.length > 1;
	const multiple_invalid = invalid.length > 1;

	if (!is_missing & !is_invalid) return null;

	let error = "";

	if (is_missing) {
		error +=
			" is missing the " +
			join_with_and(missing.map(quote)) +
			(multiple_missing ? " fields" : " field");
	}

	if (is_missing && is_invalid) error += ", and";

	if (is_invalid) {
		error +=
			" should not have the " +
			join_with_and(invalid.map(quote)) +
			(multiple_invalid ? " fields" : " field");
	}

	error += ".";

	return error;
}
