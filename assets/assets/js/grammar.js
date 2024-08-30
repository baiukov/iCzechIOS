$(document).ready(() => {
	$("#close").on("click", () => {
		sendData("GOTO", { pageName: "home" })
	})

	const setProgressBar = () => {
		const pageSize = document.body.scrollHeight
		const scroll = window.scrollY + window.screen.height
		let scrollProgress = ((scroll / pageSize) * 100)
		scrollProgress = scrollProgress > 100 ? 100 : scrollProgress
		$(".progress-bar").width(`${scrollProgress}%`)
	}

	setProgressBar()
	$(window).on("scroll", setProgressBar)

})