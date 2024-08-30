import Foundation

struct User: Codable {
    var step: Int = 1
    var howHeard: String?
    var learnReason: String?
    var level: String?
    var intensivity: String?
    var email: String?
    var login: String?
    var password: String?
    var repeatPassword: String?

    enum CodingKeys: String, CodingKey {
        case step
        case howHeard
        case learnReason
        case level
        case intensivity
        case email
        case login
        case password
        case repeatPassword = "repeatPassword"
    }

    func toJSON() -> [String: Any] {
        var dictionary: [String: Any] = [:]
        dictionary["step"] = step
        dictionary["howHeard"] = howHeard
        dictionary["learnReason"] = learnReason
        dictionary["level"] = level
        dictionary["intensivity"] = intensivity
        dictionary["email"] = email
        dictionary["login"] = login
        dictionary["password"] = password
        dictionary["repeatPassword"] = repeatPassword
        return dictionary
    }
}
