import Foundation
import Command

enum CommandNames: String {
    case Goto
    case OnReady
    case OpenLesson
    case Answer
    case CheckUserName
    case CheckEmail
    case Next
    case CantHear
    case CantHearRestart
    case CantSpeak
    case GetAudio
    case Grant
}

class CommandController {
    
    private var registeredCommands: [Command] = []
    
    init(controllerManager: ControllerManager) {
        registeredCommands = [
            Goto(controllerManager: controllerManager),
            OnReady(controllerManager: controllerManager),
            OpenLesson(controllerManager: controllerManager),
            Answer(controllerManager: controllerManager),
            CheckUserName(controllerManager: controllerManager),
            CheckEmail(controllerManager: controllerManager),
            Next(controllerManager: controllerManager),
            CantHear(controllerManager: controllerManager),
            CantHearRestart(controllerManager: controllerManager),
            CantSpeak(controllerManager: controllerManager),
            GetAudio(controllerManager: controllerManager),
            Grant(controllerManager: controllerManager)
        ]
    }
    
    func onCommand(message: String) {
        guard let json = parseMessage(message: message) else { return }
        
        guard let name = json["commandName"] as? String,
              let commandName = CommandNames(rawValue: name) else {
            print("Command with name \(String(describing: json["commandName"])) isn't registered.")
            return
        }
        
        for command in registeredCommands {
            if command.name.rawValue != commandName.rawValue { continue }
            if let data = json["data"] as? [String: Any] {
                command.execute(data: data)
            }
        }
    }
    
    func parseMessage(message: String) -> [String: Any]? {
        guard let data = message.data(using: .utf8) else {
            print("Couldn't parse executed command \(message) to JSON")
            return nil
        }
        
        do {
            if let json = try JSONSerialization.jsonObject(with: data, options: []) as? [String: Any] {
                guard let _ = json["commandName"] as? String else {
                    print("Command with no name executed")
                    return nil
                }
                guard let _ = json["data"] as? [String: Any] else {
                    print("Command with no data executed")
                    return nil
                }
                return json
            }
        } catch {
            print("Couldn't parse executed command \(message) to JSON")
            return nil
        }
        return nil
    }
}

// Example Command classes
class Goto: Command {
    init(controllerManager: ControllerManager) {
        super.init(controllerManager: controllerManager, name: .Goto)
    }
    
    override func execute(data: [String: Any]) {
        // Implement Goto command logic
    }
}

class OnReady: Command {
    init(controllerManager: ControllerManager) {
        super.init(controllerManager: controllerManager, name: .OnReady)
    }
    
    override func execute(data: [String: Any]) {
        // Implement OnReady command logic
    }
}

// Add similar classes for each command as needed...
