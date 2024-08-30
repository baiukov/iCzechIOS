$(document).ready(() => {
	// $("button.option").on("click", move)

	// render({ isSound: true, title: "Переведите", text: "Děkuju", options: ["Jsem", "čečen"] })
})

let isAnswered = false
let wordSound

const render = (data) => {
	const title = data.title
	const text = data.text
	try {
		wordSound = new Audio(`../assets/sounds/tts/${getFileNameFromTitle(text)}.mp3`)
	} catch (error) {
		wordSound = null
	}
	const options = data.options

	if (data.isSound) {
		$("#text").css("display", "none")
		$(".sound-box").css("display", "block")
	}

	$("#title").text(title)

	$("#text").text(text).on("click", () => {
		if (wordSound) {
			wordSound.play()
		}
	})

	options.forEach((option) => {
		const button = document.createElement("button")
		$(button).addClass("option").text(option).on("click", move)
		$(".options-list").append(button)
	})
}

const move = (event) => {
	const element = event.target
	const isToAnswer = !$(element).parent().hasClass("answer")
	const clone = $(element).clone()
	const movementClone = $(element).clone()
	$(movementClone).css("position", "absolute")
	$(clone).css("visibility", "hidden")
	$(isToAnswer ? ".answer" : ".options-list").append(clone)
	const positionClone = $(clone).offset()
	const positionElement = $(element).offset()
	$(movementClone).css("left", `${positionElement.left}px`)
	$(movementClone).css("top", `${positionElement.top}px`)
	$(isToAnswer ? ".options-list" : ".answer").append(movementClone)

	let counter = 0
	let currentDX = $(movementClone).offset().left
	let currentDY = $(movementClone).offset().top
	const interval = setInterval(() => {
		$(element).remove()
		if (counter >= 46) {
			clearInterval(interval)
			$(clone).css("visibility", "visible").on("click", move)
			$(movementClone).remove()

			if ($(".answer").children().length > 0) {
				$("#check").addClass("enabled")
				isAnswered = true
			} else {
				$("#check").removeClass("enabled")
				isAnswered = false
			}
		}
		const dY = (positionClone.top - positionElement.top) / 50
		const dX = (positionClone.left - positionElement.left) / 50
		currentDX += dX
		currentDY += dY

		$(movementClone).css("left", `${currentDX}px`)
		$(movementClone).css("top", `${currentDY}px`)
		counter += 1
	}, 1)

	$("#check").on("click", () => {
		if (!isAnswered) return
		let answer = ""
		let delimiter = ""
		const answerElements = $(".answer").children()
		answerElements.each((childId) => {
			answer += delimiter + $(answerElements[childId]).text().trim()
			delimiter = " "
		})
		console.log(answer)
		sendData("ANSWER", { answer: answer })
	})
}