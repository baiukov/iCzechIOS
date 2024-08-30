$(document).ready(() => {

	$(".icon").on("click", (event) => {
		sendData("GOTO", { pageName: event.target.closest('.icon').id })
	})
	
})