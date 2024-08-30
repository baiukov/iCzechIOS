const startButton = document.getElementById('startButton1')
const stopButton = document.getElementById('stopButton')
const downloadLink = document.getElementById('downloadLink')

let recorder
let mediaRecorder
let audioChunks = []

const render = (data) => {

	$("#title").text(data.title)
	$("#text").text(data.word)

}

async function convertBlobToWav(blob) {
	const audioContext = new (window.AudioContext || window.webkitAudioContext)()
	const arrayBuffer = await blob.arrayBuffer()
	const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)

	// Get audio data from the buffer
	const channelData = audioBuffer.getChannelData(0)

	// Define WAV file parameters
	const sampleRate = audioBuffer.sampleRate
	const numChannels = audioBuffer.numberOfChannels
	const bitDepth = 16

	// Create a WAV file header
	const wavHeader = new ArrayBuffer(44)
	const view = new DataView(wavHeader)

	view.setUint32(0, 0x46464952, true) // "RIFF"
	view.setUint32(4, 36 + channelData.length * 2, true)
	view.setUint32(8, 0x45564157, true) // "WAVE"
	view.setUint32(12, 0x20746d66, true) // "fmt "
	view.setUint32(16, 16, true) // PCM format
	view.setUint16(20, 1, true)
	view.setUint16(22, numChannels, true)
	view.setUint32(24, sampleRate, true)
	view.setUint32(28, sampleRate * numChannels * bitDepth / 8, true)
	view.setUint16(32, numChannels * bitDepth / 8, true)
	view.setUint16(34, bitDepth, true)
	view.setUint32(36, 0x61746164, true) // "data"
	view.setUint32(40, channelData.length * 2, true)

	// Create the WAV file buffer
	const wavBuffer = new ArrayBuffer(44 + channelData.length * 2)
	const wavView = new DataView(wavBuffer)

	// Write the header
	for (let i = 0; i < 44; i++) {
		wavView.setUint8(i, view.getUint8(i))
	}

	// Write the PCM samples
	let offset = 44
	for (let i = 0; i < channelData.length; i++) {
		const s = Math.max(-1, Math.min(1, channelData[i]))
		wavView.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true)
		offset += 2
	}

	return new Blob([wavBuffer], { type: 'audio/wav' })
}

function convertBlobToBase64(blob) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader()
		reader.onloadend = () => {
			resolve(reader.result.split(',')[1])
		}
		reader.onerror = reject
		reader.readAsDataURL(blob)
	})
}

let isRecording = false


$(document).ready(() => {
	$("#voice").on("click", () => {
		sendData("GRANT", { permission: "MIC" })
	})
})

const onGranted = () => {
	navigator.mediaDevices.getUserMedia({ audio: true })
		.then(async function (stream) {
			recorder = RecordRTC(stream, { type: 'audio' })

			recorder.startRecording()

			$("#voice > .content").css("display", "none")
			$("#wavesurfer").css("display", "block")
			const wavesurfer = WaveSurfer.create({
				"container": '#wavesurfer',
				"interact": false,
				"cursorWidth": 0,
				"height": 60,
				"width": 70,
				"splitChannels": false,
				"normalize": true,
				"waveColor": "#84dfff",
				"progressColor": "#84d8ff",
				"cursorColor": "#ddd5e9",
				"barWidth": 5,
				"barGap": 7,
				"barRadius": 5,
				"barHeight": 2,
				"barAlign": "",
				"minPxPerSec": 0.1,
				"fillParent": true,
				"mediaControls": false,
				"autoplay": false,
				"dragToSeek": false,
				"hideScrollbar": false,
				"audioRate": 1,
				"autoScroll": false,
				"autoCenter": true,
				"sampleRate": 8000,
				"plugins": [
					WaveSurfer.microphone.create()
				]
			})

			const microphone = wavesurfer.microphone

			microphone.start()

			const silenceThreshold = 0.01 // Adjust this threshold as needed
			const silenceDuration = 500 // Duration in milliseconds to consider as silence
			let silenceStart = null

			microphone.reloadBuffer = function (event) {
				const buffer = event.inputBuffer
				const rawData = buffer.getChannelData(0)
				let isSilent = true

				for (let i = 0; i < rawData.length; i++) {
					if (Math.abs(rawData[i]) > silenceThreshold) {
						isSilent = false
						break
					}
				}

				if (isSilent) {
					if (silenceStart === null) {
						silenceStart = Date.now()
					} else if (Date.now() - silenceStart > silenceDuration) {
						stopRecordingOnSilence()
					}
				} else {
					silenceStart = null
				}

				wavesurfer.loadDecodedBuffer(buffer)
			}

			const stopRecordingOnSilence = () => {
				recorder.stopRecording(async function () {
					let blob = recorder.getBlob()
					const wavBlob = await convertBlobToWav(blob)

					const base64String = await convertBlobToBase64(wavBlob)
					sendData("ANSWER", { answer: base64String })

					microphone.stop()
					$("#wavesurfer").css("display", "none")
					$("#voice > .content").css("display", "flex")
				})
			}

			$("#voice").unbind()
			$("#voice").on('click', () => {
				stopRecordingOnSilence()
			})
		})
		.catch(error => {
			console.error('Error accessing audio media:', error)
		})
}