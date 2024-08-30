const getFileNameFromTitle = (str) => {
	return str.toLowerCase()
			.replaceAll("/", "_")
			.replaceAll(" ", "_")
			.normalize("NFD")
			.replaceAll(/[\u0300-\u036f]/g, "")
			.replaceAll("?", "")
			.replaceAll("!", "")
}