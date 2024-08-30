import Command
import Commad

class Answer: Command {
    
    private let controllerManager: ControllerManager
    
    init(controllerManager: ControllerManager) {
        self.controllerManager = controllerManager
        super.init(name: .Answer)
    }
    
    override func execute(data: [String: Any]) {
        guard let answer = data["answer"] as? String else {
            print("\(name.rawValue) command doesn't contain answer and task id.")
            return
        }
        
        if let lessonController = controllerManager.getRegisteredController(ofType: LessonController.self) {
            lessonController.checkAnswer(answer)
        }
    }
}