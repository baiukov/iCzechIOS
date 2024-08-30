let choosenOption;
let wrongFields = {
	login: true,
	email: true,
	password: true,
	passwordRepeat: true,
};

let progres = {progress: 0}

$(document).ready(() => {
	$("#startRegister").on("click", () => {
		sendData("GOTO", "register_step_1")
	})

	$(".option").on("click", (event) => {
		$(".option").removeClass("chosen")
		choosenOption = $(event.target).text().trim()
		$(event.target).addClass("chosen")
		$(".submit").addClass("main")
	})

	$(".field > input").on("input", (event) => {
		$(`#${event.target.id}Clear`).css("display", "flex")
	})

	$(".clear-button").on("click", (event) => {
		const id = event.target.closest("div").id
		const inputId = id.replace("Clear", "")
		$(`#${inputId}`).val("")
		$(event.target.closest("div")).css("display", "none")
		$(`#${inputId}`).parent().css("border-color", "var(--border-color)")
		$(`#${inputId}`).parent().css("box-shadow", "0 2px 0 var(--border-color)")
		$(`#${inputId}Error`).css("display", "none")
		$(`#${inputId}Error`).children("p").text();
		wrongFields[inputId] = true
	})

	$("#login").on("input", () => {
		checkLogin()
	})

	$("#password").on("input", () => {
		checkPassword()
	})

	$("#passwordRepeat").on("keyup", () => {
		checkPasswordRepeat()
	})

	$("#age").on("input", (event) => {
		const value = event.target.value
		if (!value[value.length - 1].match(/[1-9]/g)) {
			$(event.target).val(value.substr(0, value.length - 1))
		}
		if (parseInt(value) < 0) {
			$(event.target).val(0)
		}
		if (parseInt(value) > 99) {
			$(event.target).val(99)
		} 
	})

	$("#email").on("input", () => {
		checkEmail()
	})

	$("#startButton").on("click", () => {
		sendData("GOTO", {pageName: "register1"})
	})

	$("#continue").on("click", () => {
		sendData("GOTO", {pageName: "register2", chosen: choosenOption})
	})

	$("#finish").on("click", () => {
		performRegChecks()

		isCorrect = true;
		Object.values(wrongFields).forEach((field) => {
			isCorrect = isCorrect && !field
		})

		if (!isCorrect) {
			$("#finish").addClass("animated")
			setTimeout(() => {$("#finish").removeClass("animated")}, 1000)
			return
		}

		sendData("GOTO", {pageName: "registerFinish", userData: { 
			login: $("#login").val(),
			email: $("#email").val(),
			password: $("#password").val(),
			passwordRepeat: $("#passwordRepeat").val()
		}})
	})

	$("#loginFinish").on("click", () => {
		sendData("GOTO", {pageName: "loginFinish", userData: { 
			loginOrEmail: $("#loginLogin").val(),
			password: $("#loginPassword").val(),
		}})
	})

	$("#loginButton").on("click", () => {
		sendData("GOTO", { pageName: "login" })
	})

})

const checkLogin = () => {
	const value = $("#login").val();
	if (value.length > 20) {
		$("#login").val(value.substr(0, value.length - 1))
	}
	sendData("CHECKUSERNAME", {userName: value})
}

const checkEmail = () => {
	const regex = /[a-zA-Z1-9]+@[a-zA-Z1-9]+\.[a-zA-Z]{2,}/g
	const value = $("#email").val()
	const isCorrect = value.match(regex)
	setElemWrong("email", "Укажите настоящую почту", isCorrect)
	if (isCorrect) sendData("CHECKEMAIL", {email: value})
}

const checkPasswordRepeat = () => {
	const value = $("#passwordRepeat").val();
	if (value.length > 90) {
		$("#passwordRepeat").val(value.substr(0, value.length - 1))
	}

	setElemWrong("passwordRepeat", "Пароли не совпадают", value == $("#password").val())
}

const checkPassword = () => {
	const value = $("#password").val();
		if (value.length > 90) {
			$("#password").val(value.substr(0, value.length - 1))
		}

		const isOneLowerCase = value.match(/(?=.*[a-z])/g) != null;
		const isOneUpperCase = value.match(/(?=.*[A-Z])/g) != null;
		const isOneNumber = value.match(/(?=.*[1-9])/g) != null;
		const is8Symols = value.length > 8
		
		setElemWrong("password", "Пароль должен содержать хотя бы 1 маленькую букву", isOneLowerCase)
		if (isOneLowerCase) {
			setElemWrong("password", "Пароль должен содержать хотя бы 1 большую букву", isOneUpperCase)
			if (isOneUpperCase) {
				setElemWrong("password", "Пароль должен содержать хотя бы 1 цифру", isOneNumber)
				if (isOneNumber) {
					setElemWrong("password", "Пароль должен содержать минимально 8 символов", is8Symols)
				}
			}
		}

		checkPasswordRepeat()
}

const setIsLoginAvailable = (isAvailable) => {
	setElemWrong("login", "Данное имя пользователя уже занято", isAvailable)
}

const setIsEmailAvailable = (isAvailable) => {
	setElemWrong("email", "Указанный адрес уже зарегестрирован", isAvailable)
}

const setElemWrong = (elemStr, message, isCorrect) => {
	const elemError = $(`#${elemStr}Error`)
	const elem = $(`#${elemStr}`).parent()
	if (!isCorrect) {
		elem.css("border-color", "var(--wrong-border-color)")
		elem.css("box-shadow", "0 2px 0 var(--wrong-border-color)")
		elemError.css("display", "flex")
		elemError.children("p").text(message)
		wrongFields[elemStr] = true
	} else {
		elem.css("border-color", "var(--border-color)")
		elem.css("box-shadow", "0 2px 0 var(--border-color)")
		elemError.children("p").text()
		elemError.css("display", "none")
		wrongFields[elemStr] = false
	}
}

const performRegChecks = () => {
	checkEmail()
	checkLogin()
	checkPassword()
	checkPasswordRepeat()
}

const setLoginDoesntExist = (does) => {
	setElemWrong("loginLogin", "Пользователь не существует", does)
}

const setLoginPasswordIncorrect = (is) => {
	setElemWrong("loginPassword", "Неверный пароль", is)
}

