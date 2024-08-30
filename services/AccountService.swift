import Foundation
import UIKit
import MainViewController

enum Pages {
    case register1, registerFinish, login, loginFinish
}

enum RegisterErrors: String {
    case doesntExist = "DOESNTEXIST"
    case incorrectPassword = "INCORRECTPASSWORD"
}

class AccountService {

    private let uri = "file:///android_asset/registrationPages/index.html"
    // private let uri = "file:///android_asset/registrationPages/register-step-5.html"

    private let registers = [
        "file:///android_asset/registrationPages/register-step-1.html",
        "file:///android_asset/registrationPages/register-step-2.html",
        "file:///android_asset/registrationPages/register-step-3.html",
        "file:///android_asset/registrationPages/register-step-4.html",
        "file:///android_asset/registrationPages/register-step-5.html"
    ]

    var newUser: User?
    var progress: Int = 0

    func onLoad() {
        UI.shared.setProgress(0, progress: progress)
    }

    func goTo(pageName: Pages, data: [String: Any]) {
        let userData = data["userData"] as? [String: Any] ?? [:]

        switch pageName {
        case .register1:
            newUser = User()
            MainViewController.redirect(registers[0])
            progress = Int(((Double(newUser?.step ?? 1) / 6) * 100).rounded())
            
        case .registerFinish:
            newUser?.email = userData["email"] as? String
            newUser?.login = userData["login"] as? String
            newUser?.password = userData["password"] as? String
            newUser?.repeatPassword = userData["passwordRepeat"] as? String
            register()
            
        case .login:
            MainViewController.redirect("file:///android_asset/registrationPages/login.html")
            
        case .loginFinish:
            let loginData = [
                "loginOrEmail": userData["loginOrEmail"] as? String,
                "password": userData["password"] as? String
            ]
            login(data: loginData)
            
        default:
            let chosen = data["chosen"] as? String
            if let step = newUser?.step {
                progress = Int((((Double(step) + 1) / 6) * 100).rounded())
                
                switch step {
                case 1:
                    newUser?.howHeard = chosen
                case 2:
                    newUser?.learnReason = chosen
                case 3:
                    newUser?.level = chosen
                case 4:
                    newUser?.intesivity = chosen
                default:
                    break
                }
                
                if step < registers.count {
                    MainViewController.redirectIfNotCurrent(registers[step])
                }
                
                newUser?.step = (newUser?.step ?? 0) + 1
                print(newUser ?? "No user data")
            }
        }
    }

    func runApp() {
        let preferences = UserDefaults.standard
        let userId = preferences.string(forKey: "user_id")
        MainViewController.redirect("file:///android_asset/mainPage/index.html")
        
        // Uncomment if you want to use the uri logic
        // if userId == nil {
        //     ActivityProvider.shared.mainActivity?.redirect(uri)
        // } else {
        //     ActivityProvider.shared.mainActivity?.redirect("file:///android_asset/mainPage/index.html")
        // }
    }

    func checkUserName(name: String, completion: @escaping (Bool) -> Void) {
        guard let url = URL(string: "http://10.0.2.2:8080/isUserNameAvailable?name=\(name)") else { return }

        var request = URLRequest(url: url)
        request.httpMethod = "GET"

        URLSession.shared.dataTask(with: request) { data, response, error in
            guard let data = data, error == nil else {
                print("Error: \(error?.localizedDescription ?? "Unknown error")")
                return
            }
            
            let responseString = String(data: data, encoding: .utf8) ?? "false"
            let isAvailable = Bool(responseString) ?? false
            UI.setIsLoginAvailable(isAvailable)
            completion(isAvailable)
        }.resume()
    }

    func checkUserEmail(email: String, completion: @escaping (Bool) -> Void) {
        guard let url = URL(string: "http://10.0.2.2:8080/isEmailAvailable?email=\(email)") else { return }

        var request = URLRequest(url: url)
        request.httpMethod = "GET"

        URLSession.shared.dataTask(with: request) { data, response, error in
            guard let data = data, error == nil else {
                print("Error: \(error?.localizedDescription ?? "Unknown error")")
                return
            }
            
            let responseString = String(data: data, encoding: .utf8) ?? "false"
            let isAvailable = Bool(responseString) ?? false
            UI.setIsEmailAvailable(isAvailable)
            completion(isAvailable)
        }.resume()
    }

    func register() {
        guard let url = URL(string: "http://10.0.2.2:8080/register") else { return }

        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("application/json", forHTTPHeaderField: "Accept")

        guard let newUserJSON = newUser?.toJSON() else { return }
        request.httpBody = try? JSONSerialization.data(withJSONObject: newUserJSON, options: [])

        URLSession.shared.dataTask(with: request) { data, response, error in
            guard let data = data, error == nil else {
                print("Error: \(error?.localizedDescription ?? "Unknown error")")
                return
            }
            
            guard let responseJSON = try? JSONSerialization.jsonObject(with: data, options: []) as? [String: Any] else {
                print("Error: Unable to parse response")
                return
            }
            
            let hasUserBeenSaved = responseJSON["hasUserBeenSaved"] as? Bool ?? false
            if hasUserBeenSaved {
                let preferences = UserDefaults.standard
                preferences.set(responseJSON["userId"] as? String, forKey: "user_id")
                ActivityProvider.shared.mainActivity?.redirectIfNotCurrent("file:///android_asset/mainPage/index.html")
            } else {
                UI.performRegCheck()
            }
        }.resume()
    }

    func login(data: [String: Any]) {
        guard let url = URL(string: "http://10.0.2.2:8080/login") else { return }

        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("application/json", forHTTPHeaderField: "Accept")

        request.httpBody = try? JSONSerialization.data(withJSONObject: data, options: [])

        URLSession.shared.dataTask(with: request) { data, response, error in
            guard let data = data, error == nil else {
                print("Error: \(error?.localizedDescription ?? "Unknown error")")
                return
            }
            
            guard let responseJSON = try? JSONSerialization.jsonObject(with: data, options: []) as? [String: Any] else {
                print("Error: Unable to parse response")
                return
            }
            
            let hasUserBeenSaved = responseJSON["hasUserBeenSaved"] as? Bool ?? false
            if hasUserBeenSaved {
                let preferences = UserDefaults.standard
                preferences.set(responseJSON["userId"] as? String, forKey: "user_id")
                MainViewController.redirectIfNotCurrent("file:///android_asset/mainPage/index.html")
            } else {
                let error = responseJSON["error"] as? String
                UI.setLoginDoesntExist(true)
                UI.setLoginPasswordIncorrect(true)
                if let registerError = RegisterErrors(rawValue: error ?? "") {
                    switch registerError {
                    case .doesntExist:
                        UI.setLoginDoesntExist(false)
                    case .incorrectPassword:
                        UI.setLoginPasswordIncorrect(false)
                    }
                }
            }
        }.resume()
    }
}
