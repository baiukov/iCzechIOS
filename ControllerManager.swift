import Foundation

class MainPageController: IController {}
class TresurePageController: IController {}
class ProfilePageController: IController {}
class NotificationPageController: IController {}
class SettingsPageController: IController {}
class LessonController: IController {}
class AccountController: IController {}

class ControllerManager {

    private var registeredControllers = [String: IController]()

    init() {
        registeredControllers[String(describing: MainPageController.self)] = MainPageController()
        registeredControllers[String(describing: TresurePageController.self)] = TresurePageController()
        registeredControllers[String(describing: ProfilePageController.self)] = ProfilePageController()
        registeredControllers[String(describing: NotificationPageController.self)] = NotificationPageController()
        registeredControllers[String(describing: SettingsPageController.self)] = SettingsPageController()
        registeredControllers[String(describing: LessonController.self)] = LessonController()
        registeredControllers[String(describing: AccountController.self)] = AccountController()
    }

    // Method to get the dictionary of registered controllers
    func getRegisteredControllers() -> [String: IController] {
        return registeredControllers
    }

    // Generic method to get a specific controller by type
    func getRegisteredController<T: IController>(ofType type: T.Type) -> T? {
        let key = String(describing: type)
        return registeredControllers[key] as? T
    }
}

