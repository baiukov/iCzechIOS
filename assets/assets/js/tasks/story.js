let stories = []
let translations = []
let selectedOption
let currentTask

const render = (data) => {

	$("#titleImage").attr("src", `../assets/images/stories/${data.picture}`).hide().fadeIn(500)
	$("#title").text(data.title).hide().fadeIn(500)

	new Audio(`../assets/sounds/stories/${data.music}`).play()

	let counter = 1
	data.stories.forEach((story) => {

		const isTask = story.isTask
		const question = story.question

		const isNarrator = story.isNarrator
		const characterPicture = story.characterPicture
		const text = story.text
		const translation = story.translation

		// 	<div class='story'>
		// 	<img class='icon' src='../assets/images/speaker.svg'>
		// 	<div class='story-text'>
		// 		<div class='translation'>
		// 			<p></p>Эрик и Марцела встрачаются в школьном классе</p>
		// 			<div class='translation-cloud'></div>
		// 		</div>
		// 		<p class='underlined'>Erik a Marcela se schazejí ve školní třídě</p>
		// 	</div>
		// </div>

		let storyElement
		let audio
		const wordElements = []
		if (!isTask) {
			storyElement = document.createElement("div")
			const speakerIcon = document.createElement("img")
			$(speakerIcon).attr("src", '../assets/images/speaker.svg').addClass("icon")


			if (!isNarrator) {
				const character = document.createElement("img")
				$(character).addClass("character").attr("src", `../assets/images/stories/characters/${characterPicture}`)
				$(storyElement).append(character)
				if (counter % 2 == 0) {
					$(storyElement).addClass("story-reversed")
				}
				counter += 1
			}

			$(storyElement).addClass(isNarrator ? "narrator-story" : "story").append(speakerIcon)

			const storyContent = document.createElement("div")
			$(storyContent).addClass("story-text")
			const translationContent = document.createElement("div")
			$(translationContent).addClass("translation")
			const translationText = document.createElement("p")
			$(translationText).text(translation)
			$(translationContent).hide()
			const translationCloud = document.createElement("div")
			$(translationCloud).addClass("translation-cloud")
			$(translationContent).append(translationText).append(translationCloud)

			const contentText = document.createElement("div")
			audio = new Audio(`../assets/sounds/stories/tts/${getFileNameFromTitle(text)}.mp3`)

			$(contentText)
			const words = text.split(" ")
			words.forEach((word) => {
				const span = document.createElement("span")
				$(span).addClass("underlined").text(word + " ").css("color", "gray").addClass("story-clickable-text")
					.on("click", () => {
						audio.play()

						translations.forEach((translation) => {
							$(translation).hide()
							translations = []
						})

						$(translationContent).fadeIn(500)

						translations.push(translationContent)
					})
				wordElements.push(span)
				$(contentText).append(span)
			})

			$(storyContent).append(translationContent).append(contentText)
			$(storyElement).append(storyContent)
		} else {
			storyElement = document.createElement("div")
			$(storyElement).addClass("story-question")
			const questionText = document.createElement("h3")
			$(questionText).text(question)
			$(storyElement).append(questionText)
			story.options.forEach((optionText) => {
				const option = document.createElement("button")
				$(option).addClass("option").text(optionText).on("click", () => {
					selectedOption = option
					currentTask = storyElement
					sendData("ANSWER", { answer: optionText })
				})
				$(storyElement).append(option)
			})
		}

		stories.push({
			story: storyElement,
			audio: audio,
			words: wordElements,
			isTask: isTask
		})

		$(storyElement).css("display", "none")
		$(".stories").append(storyElement)
	})

	setTimeout(playStory, 3 * 1000)
}

const playStory = () => {
	if (stories.length == 0) {
		nextButtonEnabled = true
		$("#check").unbind()
		$("#check").addClass("enabled").on(() => {
			sendData("NEXT", {})
		})
		return
	}
	nextButtonEnabled = false
	$("#check").removeClass("enabled")
	let story = stories[0]
	stories = stories.slice(1)
	$(story.story).fadeIn(500)
	let scrollCounter = 0
	let scrollSize = story.isTask ? 200 : 80
	const scrollInterval = setInterval(() => {
		window.scrollBy(0, 1)
		scrollCounter += 1
		if (scrollCounter >= scrollSize) {
			clearInterval(scrollInterval)
		}
	}, 1)

	if (story.isTask) {
		return
	}
	story.audio.play()

	if (story.words.length == 1) {
		nextButtonEnabled = true
		$("#check").addClass("enabled")
		$(story.words[0]).css("color", "white")
		return
	}

	let timer = 80 * $(story.words[0]).text().length
	let wordCounter = 0
	const interval = setInterval(() => {
		const nextWord = story.words[wordCounter]
		const wordsSize = $(nextWord).text().length
		if ((timer / 80) >= wordsSize) {
			$(nextWord).css("color", "white")
			wordCounter++
			if (story.words.length <= wordCounter) {
				clearInterval(interval)
				// playStory()
				nextButtonEnabled = true
				$("#check").addClass("enabled")
			}
			const lastChar = $(nextWord).text().slice(-2, -1)
			const isEndOfSentence = lastChar == "." || lastChar == "!" || lastChar == "?"
			timer = isEndOfSentence ? -800 : 0
		}
		timer += 80
	}, 80)
}

let nextButtonEnabled = false
$(document).ready(() => {
	$("body").on("click", (event) => {
		if ($(event.target).hasClass("story-clickable-text")) return

		translations.forEach((translation) => {
			$(translation).hide()
			translations = []
		})
	})

	render({
		title: "Seznamení", picture: "meeting.png", music: "university.wav", stories: [
			// {
			// 	isTask: false,
			// 	isNarrator: true,
			// 	text: "Erik a Marcela se scházejí ve školní třídě",
			// 	translation: "Эрик и Марцела встрачаются в школьном классе",
			// },
			// {
			// 	isTask: false,
			// 	isNarrator: false,
			// 	characterPicture: "student-girl.svg",
			// 	text: "Ahoj! Kdo jsi?",
			// 	translation: "Привет! Кто ты?",
			// },
			// {
			// 	isTask: false,
			// 	isNarrator: false,
			// 	characterPicture: "student-boy.svg",
			// 	text: "Jsem nový student. Jmenuju se Erik. A ty?",
			// 	translation: "Привет! Кто ты?",
			// },
			{
				isTask: true,
				question: "Кем является Эрик?",
				options: ["Студентом", "Профессором", "Охранником"]
			},
		]
	})

	$("#check").on("click", () => {
		if (!nextButtonEnabled) return
		sendData("ANSWER", { answer: "" })
	})
})

const setStoryTaskResult = (isCorrect) => {
	$(currentTask).children().each((option) => {
		$(option).unbind()
	})
	if (isCorrect) {
		$(selectedOption).css("border-color", "var(--green-border)")
		$(selectedOption).css("box-shadow", "0 2px var(--green-border)")
		$(selectedOption).css("background", "var(--dark-green)")
	} else {
		$(selectedOption).css("border-color", "var(--red-border)")
		$(selectedOption).css("box-shadow", "0 2px var(--red-border)")
		$(selectedOption).css("background", "var(--dark-red)")
	}

	const interval = setInterval(() => {
		$(currentTask).remove()
		playStory()
		clearInterval(interval)
	}, 1 * 1000)

}