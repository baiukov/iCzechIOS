$(document).ready(() => {
	sendData("SETPROGRESSBAR", {progress: getScrollProgress()})
	$(window).on("scroll", () => {
		sendData("SETPROGRESSBAR", {progress: getScrollProgress()})
	})
})

const getScrollProgress = () => {
	const pageSize = document.body.scrollHeight
	const scroll = window.scrollY + window.screen.height
	let scrollProgress = ((scroll / pageSize) * 100)
	scrollProgress = scrollProgress > 100 ? 100 : scrollProgress
	return scrollProgress
}