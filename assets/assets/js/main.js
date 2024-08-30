const sendData = (commandName, data) => {
	AndroidInterface.onCommand(JSON.stringify({
		commandName: commandName,
		data: data || {}
	}));
}


let updateQueue = []

$(document).ready(() => {
	sendData("ONREADY", {})

	$("#close").on("click", () => {
		sendData("GOTO", { pageName: "home" })
	})
})

const setHearts = (amount) => { $("#hearts").text(amount) }

const setGems = (amount) => { $("#gems").text(amount) }

const setFireDays = (amount) => { $("#fireDays").text(amount) }

const setFireSaturation = (percentage) => { $("#fire").css("filter", `saturate(${percentage})`) } 

const setProgressBar = (from, to) => {
	document.documentElement.style.setProperty('--progress', `${to}%`);
}

const setProgressBarLink = (isBack, page) => {
	if (isBack) {
		$("#close").attr("src", "../assets/images/back.svg")
	}
	$("#close").on("click", () => {
		sendData("GOTO", { pageName: page })
	})
}

const setCircularProgress = (from, to) => {
	document.documentElement.style.setProperty('--circ-progress', `${to}`);
}