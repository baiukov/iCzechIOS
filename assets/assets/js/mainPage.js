$(document).ready(() => {
	$("#lesson-1").on("click", () => {
		sendData("GOTO", { pageName: "treasure" })
	})

	// addLecture({
	// 	title: "Title", subTitle: "subtitle", color: "#ffffff", lectureID: "lecture-1", "lessons": [
	// 		{ lessonID: 1, status: "ACTIVE", type: "" }
	// 	]
	// })
})

const lessonStatuses = {
	COMPLETED: "COMPLETED",
	ACTIVE: "ACTIVE",
	UNAVAILABLE: "UNAVAILABLE"
}

const lessonTypes = {
	THEORY: "../assets/images/book.svg",
	GRAMMAR: "../assets/images/grammar.svg",
	VOCABULARY: "../assets/images/book.svg",
	LISTENING: "../assets/images/listen.svg",
	SPEAKING: "../assets/images/speak.svg",
	REPEAT: "../assets/images/repeat.svg"
}

const addLecture = (data) => {
	const subTitle = data.subTitle
	const title = data.title
	let color = data.color
	const lectureID = data.lectureID
	const lessons = data.lessons

	const newLecture = document.createElement("div")
	$(newLecture).addClass("lecture").attr("id", lectureID)
	const lectureHeader = document.createElement("div")
	$(lectureHeader).addClass("lecture-header").css("background-color", color)
	const subTitleElem = document.createElement("h3")
	$(subTitleElem).text(subTitle)
	const titleElem = document.createElement("h1")
	$(titleElem).text(title)
	$(lectureHeader).append(subTitleElem).append(titleElem)
	$(newLecture).append(lectureHeader)
	const lessonElems = document.createElement("div")
	$(lessonElems).addClass("lessons")

	lessons.forEach((lesson) => {
		const lessonID = lesson.id
		const status = lesson.status
		const type = lesson.type

		const newLesson = document.createElement("div")
		$(newLesson).addClass("lesson").attr("id", lessonID)
			.on("click", () => {
				if (status == "UNAVAILABLE") return
				sendData("OPENLESSON", { lessonID: lessonID })
			})
		const image = document.createElement("img")
		$(image).attr("src", lessonTypes.THEORY).addClass("icon")

		const colorSpan = document.createElement("span")
		$(colorSpan).addClass(".color-span")
		const svg = document.createElement("img")
		$(svg).attr("src", "../assets/images/misc/button.svg").addClass("button-misc")
		$(colorSpan).append(svg).css("color", "#000")

		$(newLesson).append(colorSpan).append(image)

		if (status === lessonStatuses.COMPLETED) {
			$(newLecture).css("--lecture-color", `${color}`)
		} else if (status === lessonStatuses.ACTIVE) {
			$(":root").css("--lecture-color", getActiveColor(color))

		} else if (status === lessonStatuses.UNAVAILABLE) {
			$(image).css("filter", "brightness(80%)")
			$(newLesson).css("filter", "grayscale(1)")
		}

		Object.keys(lessonTypes).forEach((currentType) => {
			if (currentType != type) return
			$(image).attr("src", lessonTypes[currentType])
		})

		$(lessonElems).append(newLesson)
	})
	$(newLecture).append(lessonElems)

	$(".main").append(newLecture)
}

const setActiveLesson = (lessonID) => {
	const svgns = "http://www.w3.org/2000/svg"

	const circularProgress = document.createElementNS("http://www.w3.org/2000/svg", "svg")
	circularProgress.setAttribute('width', '125')
	circularProgress.setAttribute('height', '145')
	circularProgress.setAttribute("viewBox", "0 0 150 140")
	circularProgress.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink")
	$(circularProgress).addClass("circular-progress")
	const circleBg = document.createElementNS(svgns, "circle")
	$(circleBg).addClass("bg")
	const circleFg = document.createElementNS(svgns, "circle")
	$(circleFg).addClass("fg")
	$(circularProgress).append(circleBg).append(circleFg)
	document.getElementById(lessonID).append(circularProgress)
}

const getActiveColor = (color) => {
	const rgb = hexToRgb(color)
	rgb.r = rgb.r + 30 > 255 ? 255 : rgb.r + 40
	rgb.b = rgb.b + 30 > 255 ? 255 : rgb.b + 40
	rgb.g = rgb.g + 30 > 255 ? 255 : rgb.g + 40
	return rgbToHex(rgb)
}

const hexToRgb = (hex) => {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
	return result ? {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16)
	} : null
}

const componentToHex = (c) => {
	const hex = c.toString(16)
	return hex.length == 1 ? "0" + hex : hex
}

const rgbToHex = (rgb) => {
	return "#" + componentToHex(rgb.r) + componentToHex(rgb.g) + componentToHex(rgb.b)
}