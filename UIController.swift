import UIKit
import WebKit
import MainViewController

class UIController {

    static func setHearts(_ amount: Int) {
        let adjustedAmount = min(max(amount, 0), 99)
        MainViewController.sendCommand("setHearts(\(adjustedAmount))")
    }

    static func setGems(_ amount: Int) {
        let adjustedAmount = min(max(amount, 0), 99999)
        MainViewController.sendCommand("setGems(\(adjustedAmount))")
    }

    static func setFireDays(_ amount: Int) {
        let adjustedAmount = min(max(amount, 0), 999)
        MainViewController.sendCommand("setFireDays(\(adjustedAmount))")
    }

    static func setFireSaturation(_ saturation: Int) {
        let adjustedSaturation = max(saturation, 0)
        MainViewController.sendCommand("setFireSaturation(\(adjustedSaturation))")
    }

    static func addLecture(_ data: String) {
        MainViewController.sendCommand("addLecture(\(data))")
    }

    static func renderTask(_ data: [String: Any]) {
        if let jsonData = try? JSONSerialization.data(withJSONObject: data, options: []),
           let jsonString = String(data: jsonData, encoding: .utf8) {
            MainViewController.sendCommand("render(\(jsonString))")
        }
    }

    static func setProgress(from: Int, to: Int) {
        MainViewController.sendCommand("setProgressBar(\(from), \(to))")
    }

    static func setIsEmailAvailable(_ isAvailable: Bool) {
        MainViewController.sendCommand("setIsEmailAvailable(\(isAvailable))")
    }

    static func setIsLoginAvailable(_ isAvailable: Bool) {
        MainViewController.sendCommand("setIsLoginAvailable(\(isAvailable))")
    }

    static func performRegCheck() {
        MainViewController.sendCommand("performRegChecks()")
    }

    static func setLoginDoesntExist(_ does: Bool) {
        MainViewController.sendCommand("setLoginDoesntExist(\(does))")
    }

    static func setLoginPasswordIncorrect(_ isCorrect: Bool) {
        MainViewController.sendCommand("setLoginPasswordIncorrect(\(isCorrect))")
    }

    static func sendResult(isCorrect: Bool, word: String) {
        MainViewController.sendCommand("setResult(\(isCorrect), '\(word)')")
    }

    static func disableTask() {
        MainViewController.sendCommand("disableTask()")
    }

    static func sendSelectResult() {
        MainViewController.sendCommand("setSelectResult()")
    }

    static func setCantHearResult(_ word: String) {
        MainViewController.sendCommand("setCantHearResult('\(word)')")
    }

    static func setCantSpeakResult(_ word: String) {
        MainViewController.sendCommand("setCantSpeakResult('\(word)')")
    }

    static func sendAudio(audioBytes: String, id: String) {
        MainViewController.sendCommand("getAudio('\(audioBytes)', '\(id)')")
    }

    static func setCircularProgress(from: Double, to: Double) {
        MainViewController.sendCommand("setCircularProgress(\(from), \(to))")
    }

    static func onGranted() {
        MainViewController.sendCommand("onGranted()")
    }

    static func playStory() {
        MainViewController.sendCommand("playStory()")
    }

    static func setStoryTaskResult(_ isCorrect: Bool) {
        MainViewController.sendCommand("setStoryTaskResult(\(isCorrect))")
    }

    static func setActiveLesson(_ lessonId: String) {
        MainViewController.sendCommand("setActiveLesson('\(lessonId))")
    }
}
