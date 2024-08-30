const registeredClouds = []

$(document).ready(() => {

	const nativeSpan = $("#lexiconInfo > .cloud-box").offset().left
	$("#lexiconInfo").hide()
	$("#lexiconInfoButton").on("click", () => {
		if ($("#lexiconInfo").is(":visible")) {
			$("#lexiconInfo").fadeOut(100)
			return
		}
		const x = $("#lexiconInfoButton").offset().left + 10
		$("#lexiconInfo").fadeIn(500)
		$("#lexiconInfo > .cloud-box").css("left", (x - nativeSpan) + "px")
		registeredClouds.push($("#lexiconInfo"))

	})

	$("body").on("click", (event) => {
		if ($(event.target).hasClass("open-cloud")) return

		registeredClouds.forEach((cloud) => {
			$(cloud).fadeOut(100)
		})
	})

	$("#check").on("click", () => {
		sendData("NEXT", {})
	})
})