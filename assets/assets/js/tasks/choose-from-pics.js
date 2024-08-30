let wordSound

const render = (data) => {
	const title = data.title
	const word = data.word
	const isSound = data.isSound || false
	try {
		console.log()
		wordSound = new Audio(`../assets/sounds/tts/${getFileNameFromTitle(word)}.mp3`)
	} catch (error) {
		wordSound = null
	}
	const cards = JSON.parse(data.cards)

	if (isSound) {
		$("#word").css("display", "none")
		$(".sound-box").css("display", "block")
	}

	$("#title").text(title)
	$("#word").text(word).on("click", () => {
		if (wordSound) {
			wordSound.play()
		}
	})


	cards.forEach((card) => {
		const translation = card.subTitle
		const picture = card.picture

		const cardElement = document.createElement("button")
		$(cardElement).addClass("option").addClass("card").val(translation)
			.on("click", (event) => {
				if (isChecked) return
				const target = event.currentTarget
				selectedItem = target
				registeredButtons.forEach((button) => {
					$(button).css("border-color", "inherit")
					$(button).css("background", "inherit")
				})
				selected = $(target).text()
				$(target).css("border-color", "var(--blue-border)")
				$(target).css("background", "var(--blue-bg)")

				$("#check").addClass("enabled")
			})

		registeredButtons.push(cardElement)
		const image = document.createElement("img")
		$(image).attr("src", `../assets/images/vocabulary/${picture}`)
		const header = document.createElement("h1")
		$(header).text(translation)
		$(cardElement).append(image).append(header)

		$(".card-wrapper").append(cardElement)
	})
}

$(document).ready(() => {
	// render({isSound: false, title: "Choose a correct one", word: "Ne", cards: JSON.stringify([{ subTitle: "Вечер в хату", picture: "evening.jpg" }, { subTitle: "Да", picture: "yes.jpg" }, { subTitle: "Привет", picture: "good.svg" }, { subTitle: "Добрый день", picture: "evening.jpg" }])})
})