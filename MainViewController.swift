import UIKit
import WebKit
import AVFoundation
import CoreTelephony 
import MainActivity

@main
class MainViewController: UIViewController, WKUIDelegate, WKNavigationDelegate {
    
    var webView: WKWebView!
    let RECORD_AUDIO_REQUEST_CODE = 1
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        setupWebView()
        setupPreferences()
        
    }
    
    func setupWebView() {
        let webConfiguration = WKWebViewConfiguration()
        webView = WKWebView(frame: self.view.frame, configuration: webConfiguration)
        webView.uiDelegate = self
        webView.navigationDelegate = self
        webView.configuration.mediaTypesRequiringUserActionForPlayback = []
        self.view.addSubview(webView)
        
        webView.configuration.userContentController.add(self, name: "iOSInterface")
        
        if let url = URL(string: "https://example.com") {
            webView.load(URLRequest(url: url))
        }
    }
    
    func setupPreferences() {
        let preferences = UserDefaults.standard
        preferences.set(0, forKey: "lecture-1.lesson-1")
        preferences.set(0, forKey: "lecture-1.lesson-2")
        preferences.set(0, forKey: "lecture-1.lesson-3")
        preferences.set(0, forKey: "lecture-1.lesson-4")
        preferences.set(0, forKey: "lecture-1.lesson-5")
    }
    
    static func sendCommand(_ command: String) {
        DispatchQueue.main.async {
            self.webView.evaluateJavaScript(command, completionHandler: nil)
        }
    }
    
    static func redirect(to url: String) {
        DispatchQueue.main.async {
            if let validUrl = URL(string: url) {
                self.webView.load(URLRequest(url: validUrl))
            }
        }
    }
    
    static func redirectIfNotCurrent(_ url: String) {
        DispatchQueue.main.async {
            if self.webView.url?.absoluteString != url {
                self.redirect(to: url)
            }
        }
    }

    func grantPerms(permission: Permissions) {
        switch permission {
        case .MIC:
            AVAudioSession.sharedInstance().requestRecordPermission { granted in
                if granted {
                    UI.UI.onGranted()
                } else {
                    UI.UI.setCantSpeakResult(Lang.Ru?.getValue(key: "not_speak") ?? "")
                }
            }
        }
    }

    func isNetworkAvailable() -> Bool {
        let monitor = NWPathMonitor()
        var isAvailable = false
        monitor.pathUpdateHandler = { path in
            if path.status == .satisfied {
                isAvailable = true
            } else {
                isAvailable = false
            }
        }
        let queue = DispatchQueue(label: "NetworkMonitor")
        monitor.start(queue: queue)
        return isAvailable
    }
}

