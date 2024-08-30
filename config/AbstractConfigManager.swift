import Foundation
import UIKit
import Yams

class AbstractConfigManager {

    let data: [String: Any]

    init?(context: UIViewController, filePath: String) {
        guard let fileUrl = Bundle.main.url(forResource: filePath, withExtension: nil),
              let yamlString = try? String(contentsOf: fileUrl),
              let yamlData = try? Yams.load(yaml: yamlString) as? [String: Any] else {
            return nil
        }

        self.data = yamlData
    }

    func getValue(key: String) -> Any? {
        let keys = key.split(separator: ".").map { String($0) }
        var value: Any? = data
        for k in keys {
            if let dict = value as? [String: Any] {
                value = dict[k]
            }
        }
        return value
    }
}
