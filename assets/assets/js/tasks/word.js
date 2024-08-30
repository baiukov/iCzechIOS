const sounds = {}
let step = 0;
let isFinishButtonEnabled = false;

const swiper = new Swiper('.swiper', {
	effect: "cards",
	loop: false,
	initialSlide: 0,
	mouseWheel: {
		invert: false
	}
});

const render = (data) => {
	const slides = JSON.parse(data.words)
	$(".swiper-wrapper").css("display", "none")
	slides.forEach((slide) => {
		const slideContainer = document.createElement("div")
		$(slideContainer).addClass("swiper-slide card")
		const image = document.createElement("img")
		$(image).addClass("picture").attr("src", `../assets/images/vocabulary/${slide.picture}`).attr("id", "picture")

		const title = document.createElement("h1")
		$(title).text(slide.word).addClass("card-title")
			.on("click", (event) => {
				sounds[getFileNameFromTitle($(event.target).text())].play()
			})
		const subtitle = document.createElement("h3")
		$(subtitle).text(slide.subTitle)

		$(slideContainer).append(image).append(title).append(subtitle)
		$(".swiper-wrapper").append(slideContainer)

		const fileName = getFileNameFromTitle(slide.word)
		sounds[fileName] = new Audio(`../assets/sounds/tts/${fileName}.mp3`)
	})
	progress = (1 / slides.length) * 100
	step = 100 / slides.length
	$(".header * .progress-bar").width(`${progress}%`)
	$(".swiper-wrapper").css("display", "flex")
}

$(document).ready(() => {
	$("#finish").on("click", () => {
		if (!isFinishButtonEnabled) return
		sendData("NEXT", {answer: ""})
	})

	// render({ title: "123", words: JSON.stringify([ {word: "Dobrý večer", subTitle: "Добрый вечер", picture: "hi.svg"}, {word: "Dobrý večer", subTitle: "Добрый вечер", picture: "yes.svg"}, {word: "Dobrý večer", subTitle: "Добрый вечер", picture: "handshake.svg"}, {word: "Dobrý večer", subTitle: "Добрый вечер", picture: "evening.jpg"}, {word: "Dobrý večer", subTitle: "Добрый вечер", picture: "hi.svg"}, {word: "Dobrý večer", subTitle: "Добрый вечер", picture: "yes.svg"}, {word: "Dobrý večer", subTitle: "Добрый вечер", picture: "handshake.svg"}, {word: "Dobrý večer", subTitle: "Добрый вечер", picture: "evening.jpg"} ])})
})

const playSound = () => {
	const soundNumber = Math.round(Math.random())
	const audio = new Audio(`../assets/sounds/book_sound_${soundNumber + 1}.mp3`)
	audio.play()
}

swiper.on( 'slideChange', function() {
	const prevIndex = swiper.previousIndex ? swiper.previousIndex : 0
	const isNext = swiper.activeIndex > prevIndex
	if (isNext) {
		const newProgress = progress + step
		progress = newProgress >= 100 ? 100 : newProgress
	} else {
		const newProgress = progress - step
		progress = newProgress <= step ? step : newProgress
	}
	$(".header * .progress-bar").width(`${progress}%`)
	if (progress >= (100 - step + 0.01)) {
		isFinishButtonEnabled = true
		$("#finish").addClass("enabled")
	}
});
