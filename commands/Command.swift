class Command: CommandProtocol {
    
    var name: CommandNames
    
    init(name: CommandNames) {
        self.name = name
    }
    
    func execute(data: [String: Any]) {
        print("Command with no implementation '\(name.rawValue)' has been executed")
    }
}