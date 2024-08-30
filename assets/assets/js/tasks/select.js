$(document).ready(() => {
	// render({title: "Connect", leftCards: ["Ahoj", "abc", "123"], rightCards: ["Cau", "bca", "321"]})

})
let wordSound;
let leftCards = []
let rightCards = []
let selectedItem1
let selectedItem2
const disabledItemIds = [];

const render = (data) => {
	$("#title").text(data.title)

	leftCards = data.leftCards
	rightCards = data.rightCards

	counter = 0

	leftCards.forEach((card) => {
		const elem = document.createElement("button")
		$(elem).addClass("option")
		const word = document.createElement("p")
		$(word).text(card)
		const id = `card-${counter}`
		$(elem).append(word).attr("id", id)
		counter++

		$(elem).on("click", () => {
			if (disabledItemIds.includes($(elem).attr("id"))) return
			if (data.isSound) {
				new Audio(`../assets/sounds/tts/${getFileNameFromTitle(card)}.mp3`).play()
			}
			const value = card
			if (selected == value) return
			if (selected && rightCards.includes(selected)) {
				selectedItem2 = elem
				sendData("ANSWER", {answer: JSON.stringify({left: selected, right: value})})
				return
			}
			selectedItem1 = elem
			registeredButtons.forEach((button) => {
				if (disabledItemIds.includes($(button).attr("id"))) return
				$(button).css("border-color", "inherit")
				$(button).css("background", "inherit")
				$(button).css("box-shadow", "inherit")
			})
			$(elem).css("border-color", "var(--blue-border)")
			$(elem).css("background", "var(--blue-bg)")
			$(elem).css("box-shadow", "0 2px var(--blue-bg)")
			selected = value
		})
		registeredButtons.push(elem)
		$("#left").append(elem)

		if (data.isSound) {
			$(word).css("display", "none")
			sendData("GETAUDIO", {fileName: getFileNameFromTitle(card), id: id})
		}
	})

	rightCards.forEach((card) => {
		const elem = document.createElement("button")
		$(elem).addClass("option")
		const word = document.createElement("p")
		$(word).text(card)
		$(elem).append(word)
		$(elem).append(word).attr("id", `card-${counter}`)
		counter++
		registeredButtons.push(elem)

		$(elem).on("click", () => {
			if (disabledItemIds.includes($(elem).attr("id"))) return
			const value = $(elem).children("p").text()
			if (selected == value) return
			if (selected && leftCards.includes(selected)) {
				selectedItem2 = elem
				sendData("ANSWER", {answer: JSON.stringify({left: selected, right: value})})
				return
			}
			selectedItem1 = elem
			registeredButtons.forEach((button) => {
				if (disabledItemIds.includes($(button).attr("id"))) return
				$(button).css("border-color", "inherit")
				$(button).css("background", "inherit")
			})
			$(elem).css("border-color", "var(--blue-border)")
			$(elem).css("background", "var(--blue-bg)")
			$(elem).css("box-shadow", "0 2px var(--blue-bg)")
	
			selected = value
		})

		$("#right").append(elem)
	})
}

const setSelectResult = () => {
	$(selectedItem1).css("border-color", "var(--green-border)")
	$(selectedItem1).css("box-shadow", "0 2px var(--green-border)")
	$(selectedItem1).css("background", "var(--dark-green)")
	$(selectedItem2).css("border-color", "var(--green-border)")
	$(selectedItem2).css("box-shadow", "0 2px var(--green-border)")
	$(selectedItem2).css("background", "var(--dark-green)")
	disabledItemIds.push($(selectedItem1).attr("id"))
	$(selectedItem1).unbind()
	disabledItemIds.push($(selectedItem2).attr("id"))
	$(selectedItem2).unbind()
	const elem1 = selectedItem1
	const elem2 = selectedItem2
	selectedItem1 = null
	selectedItem2 = null
	selected = null

	setTimeout(() => {
		$(elem1).addClass("fade-out-gray-anim")
		$(elem2).addClass("fade-out-gray-anim")
	}, 1000)

	setTimeout(() => {
		$(elem1).removeClass("fade-out-gray-anim")
		$(elem2).removeClass("fade-out-gray-anim")
		$(elem1).addClass("faded-out-to-gray")
		$(elem2).addClass("faded-out-to-gray")
		$(elem1).css("filter", "grayscale(1) brightness(0.5)")
		$(elem2).css("filter", "grayscale(1) brightness(0.5)")
	}, 3 * 1000)
	
}

const disableTask = () => {
	registeredButtons.forEach((button) => {
		$(button).unbind()
	})
}

$(document).ready(() => {
	// render({isSound: true, title: "Connect", leftCards: ["ahoj/cau/nazdar"], rightCards: ["dobre"]})
})

const getAudio = (dataUrl, id) => {
	console.log(dataUrl, id)
	fetch(dataUrl)
		.then(response => response.blob())
		.then(blob => {
				const audioUrl = URL.createObjectURL(blob);

				const audio = new Audio(audioUrl);
				audio.controls = true;
				const wavesurfer = WaveSurfer.create({
					"container": `#${id}`,
					"height": 60,
					"width": 70,
					"splitChannels": false,
					"normalize": false,
					"waveColor": "#84dfff",
					"progressColor": "#84d8ff",
					"cursorColor": "#ddd5e9",
					"cursorWidth": 0,
					"barWidth": 4,
					"barGap": 3,
					"barRadius": 22,
					"barHeight": 1,
					"barAlign": "",
					"minPxPerSec": 11,
					"fillParent": true,
					"url": dataUrl,
					"mediaControls": false,
					"autoplay": false,
					"interact": false,
					"dragToSeek": false,
					"hideScrollbar": false,
					"audioRate": 1,
					"autoScroll": true,
					"autoCenter": true,
					"sampleRate": 8000
				})
			})
		.catch(error => console.error('Error creating Blob from Data URL:', error));
}