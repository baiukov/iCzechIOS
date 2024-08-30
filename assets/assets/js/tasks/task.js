let selected
let selectedItem
let registeredButtons = []
let isChecked = false

const setResult = (isCorrect, word) => {
	isChecked = true
	isCorrect ? setSuccessfullResult(word) : setFailedResult(word)
}

const setSuccessfullResult = (word) => {
	new Audio("../assets/sounds/success.mp3").play()
	$(".footer").hide()
	$(".result").show()
	$(".result").addClass("slideUpAnim")
	$(".button > p").text("Далее")
	$("#check").unbind()
	$("#check").addClass("enabled")
	$("#check").on("click", () => {
		sendData("NEXT", {})
	})
	$("#resultWord").text(word)
	$(selectedItem).css("border-color", "var(--green-border)")
	$(selectedItem).css("box-shadow", "0 2px var(--green-border)")
	$(selectedItem).css("background", "var(--dark-green)")
	$(".button").css("border-color", "var(--green-border)")

}

const setFailedResult = (word) => {
	new Audio("../assets/sounds/fail.mp3").play()
	$(".footer").hide()
	$(".result").show()
	$(".result-title > img").attr("src", "../assets/images/checkmark-fail.svg")
	$(".result").addClass("slideUpAnim")
	$(".button > p").text("Далее")
	$("#check").unbind()
	$("#check").on("click", () => {
		sendData("NEXT", {})
	})
	$("#resultWord").text(word)
	$(selectedItem).css("border-color", "var(--darker-red)")
	$(selectedItem).css("box-shadow", "0 2px var(--dark-red)")
	$(selectedItem).css("background", "var(--dark-red)")
	$(".button").css("border-color", "var(--darker-red)")
	$(".button").addClass("failed")
	$(".result").css("background", "var(--darker-red)")
	$(".result").css("border-color", "var(--dark-red)")
}

const setCantHearResult = (word) => {
	$(".footer").hide()
	$(".result").show()
	$(".result-title > img").attr("src", "../assets/images/warning.svg")
	$(".result").addClass("slideUpAnim")
	$(".button > p").text("Далее")
	$("#check").unbind()
	$("#check").on("click", () => {
		sendData("CANTHEARRESTART", {})
	})
	$("#resultWord").text(word)
	$(selectedItem).css("border-color", "var(--darker-orange)")
	$(selectedItem).css("box-shadow", "0 2px var(--dark-orange)")
	$(selectedItem).css("background", "var(--dark-orange)")
	$(".button").css("border-color", "var(--darker-orange)")
	$("#check").addClass("enabled")
	selected = "cantHear"
	$(".button").addClass("success")
	$(".result").css("background", "var(--darker-orange)")
	$(".result").css("border-color", "var(--dark-orange)")
}

const setCantSpeakResult = (word) => {
	$(".footer").hide()
	$(".result").show()
	$(".result-title > img").attr("src", "../assets/images/warning.svg")
	$(".result").addClass("slideUpAnim")
	$(".button > p").text("Далее")
	$("#check").unbind()
	$("#check").on("click", () => {
		sendData("NEXT", {})
	})
	$("#resultWord").text(word)
	$(selectedItem).css("border-color", "var(--darker-orange)")
	$(selectedItem).css("box-shadow", "0 2px var(--dark-orange)")
	$(selectedItem).css("background", "var(--dark-orange)")
	$(".button").css("border-color", "var(--darker-orange)")
	$("#check").addClass("enabled")
	selected = "cantHear"
	$(".button").addClass("success")
	$(".result").css("background", "var(--darker-orange)")
	$(".result").css("border-color", "var(--dark-orange)")
}

$(document).ready(() => {

	$("#check").on("click", () => {
		if (!selected) return
		sendData("ANSWER", { answer: selected })
	})

	$(".play-sound-normal").on("click", () => {
		wordSound.playbackRate = 1
		wordSound.play()
		$(".play-sound-normal > img").addClass("lower-bigger-anim")
		setTimeout(() => {
			$(".play-sound-normal > img").removeClass("lower-bigger-anim")
		}, 500)
	})

	$(".play-sound-slow").on("click", () => {
		$(".play-sound-slow > img").addClass("lower-bigger-anim")
		wordSound.playbackRate = 0.5
		wordSound.play()
		setTimeout(() => {
			$(".play-sound-slow > img").removeClass("lower-bigger-anim")
		}, 500)
	})

	$("#cantHear").on("click", () => {
		sendData("CANTHEAR", {})
	})

	$("#cantSpeak").on("click", () => {
		sendData("CANTSPEAK", {})
	})
})
