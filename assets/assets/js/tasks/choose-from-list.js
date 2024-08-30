$(document).ready(() => {
	// render({isSound: true, text: "... jsem Tomas", title: "Choose correct one", options: ['Ja', "TY", "VY"]})

})
let wordSound;

const render = (data) => {
	const text = data.text
	try {
		wordSound = new Audio(`../assets/sounds/tts/${getFileNameFromTitle(text)}.mp3`)
	} catch (error) {
		wordSound = null
	}
	const title = data.title
	const options = data.options
	const isSound = data.isSound || false

	if (isSound) {
		$("#text").css("display", "none")
		$(".sound-box").css("display", "block")
	}

	$("#text").text(text).on("click", () => {
		if (wordSound) {
			wordSound.play()
		}
	})
	$("#title").text(title)

	options.forEach((option) => {
		const button = document.createElement("button")
		const buttonText = document.createElement("p")
		$(buttonText).text(option)
		$(button).addClass("option").append(buttonText)		
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
			$(target).css("box-shadow", "0 2px var(--blue-bg)")
	
			$("#check").addClass("enabled")
		})
		registeredButtons.push(button)

		$(".options-list").append(button)
	})
}