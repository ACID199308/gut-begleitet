import UIKit
@main
final class AppDelegate: UIResponder, UIApplicationDelegate {
    var window: UIWindow?
    func application(_ application: UIApplication, didFinishLaunchingWithOptions options: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        let window = UIWindow(frame: UIScreen.main.bounds)
        window.rootViewController = LocalAppViewController()
        window.makeKeyAndVisible()
        self.window = window
        AppPrivacyLock.shared.coverContents()
        return true
    }
    func applicationWillResignActive(_ application: UIApplication) { AppPrivacyLock.shared.coverContents() }
    func applicationDidEnterBackground(_ application: UIApplication) { AppPrivacyLock.shared.backgrounded() }
    func applicationDidBecomeActive(_ application: UIApplication) { AppPrivacyLock.shared.activated() }
}

import LocalAuthentication
import Security

/// A separate native window covers the complete app, including presented document viewers.
final class AppPrivacyLock: NSObject {
    static let shared = AppPrivacyLock()
    private var cover: UIWindow?
    private var locked = true
    private var promptOnActive = true
    private var authenticating = false
    private var context: LAContext?
    private let account = "device-app-lock"
    private var query: [String: Any] { [kSecClass as String:kSecClassGenericPassword,kSecAttrService as String:"de.acid199308.gutbegleitet.security",kSecAttrAccount as String:account] }
    var enabled: Bool {
        var q=query;q[kSecReturnData as String]=true;q[kSecMatchLimit as String]=kSecMatchLimitOne
        var result: CFTypeRef?;let status=SecItemCopyMatching(q as CFDictionary,&result)
        if status == errSecItemNotFound { return false }
        guard status == errSecSuccess, let data=result as? Data else { NSLog("App-Sperre: Schlüsselbund nicht verfügbar (OSStatus %d)", status); return true }
        return data == Data([1])
    }
    var accessible: Bool { !enabled || !locked }
    func status() -> [String: Any] { let c=LAContext();return ["enabled":enabled,"available":c.canEvaluatePolicy(.deviceOwnerAuthentication,error:nil)] }
    private func persist(_ value: Bool) -> Bool {
        let attributes: [String:Any]=[kSecValueData as String:Data([value ? 1 : 0]),kSecAttrAccessible as String:kSecAttrAccessibleWhenUnlockedThisDeviceOnly]
        let existing=SecItemUpdate(query as CFDictionary,attributes as CFDictionary)
        if existing == errSecSuccess {return true}
        if existing != errSecItemNotFound {return false}
        return SecItemAdd(query.merging(attributes){_,new in new} as CFDictionary,nil) == errSecSuccess
    }
    func coverContents() {
        guard enabled else {return}
        if cover == nil {
            let window=UIWindow(frame:UIScreen.main.bounds);window.windowLevel=UIWindow.Level(rawValue:UIWindow.Level.alert.rawValue+1)
            let controller=UIViewController();controller.view.backgroundColor=UIColor(red:247/255,green:248/255,blue:243/255,alpha:1)
            let title=UILabel();title.text="Gut begleitet\nDeine App ist gesperrt";title.numberOfLines=0;title.textAlignment = .center;title.font = .preferredFont(forTextStyle:.title2)
            let button=UIButton(type:.system);button.setTitle("App entsperren",for:.normal);button.addTarget(self,action:#selector(unlockTapped),for:.touchUpInside)
            let emergency=UIButton(type:.system);emergency.setTitle("Notruf 112",for:.normal);emergency.addTarget(self,action:#selector(emergencyTapped),for:.touchUpInside)
            let stack=UIStackView(arrangedSubviews:[title,button,emergency]);stack.axis = .vertical;stack.spacing=24;stack.translatesAutoresizingMaskIntoConstraints=false;controller.view.addSubview(stack)
            NSLayoutConstraint.activate([stack.centerXAnchor.constraint(equalTo:controller.view.centerXAnchor),stack.centerYAnchor.constraint(equalTo:controller.view.centerYAnchor),stack.leadingAnchor.constraint(greaterThanOrEqualTo:controller.view.leadingAnchor,constant:24),stack.trailingAnchor.constraint(lessThanOrEqualTo:controller.view.trailingAnchor,constant:-24)])
            window.rootViewController=controller;cover=window
        }
        cover?.isHidden=false
        (UIApplication.shared.delegate as? AppDelegate)?.window?.accessibilityElementsHidden=true
    }
    func backgrounded(){guard enabled else{return};locked=true;promptOnActive=true;context?.invalidate();coverContents()}
    func activated(){if !enabled {hide();return};if locked {coverContents();if promptOnActive {promptOnActive=false;unlockTapped()}}else{hide()}}
    private func hide(){cover?.isHidden=true;(UIApplication.shared.delegate as? AppDelegate)?.window?.accessibilityElementsHidden=false}
    @objc private func emergencyTapped(){if let url=URL(string:"tel:112"){UIApplication.shared.open(url)}}
    @objc private func unlockTapped(){guard !authenticating else{return};authenticate {ok in if ok {self.locked = UIApplication.shared.applicationState == .background;if !self.locked {self.hide()}}}}
    private func authenticate(_ completion:@escaping (Bool)->Void){
        guard !authenticating else{completion(false);return};let c=LAContext();c.localizedCancelTitle="Abbrechen";c.touchIDAuthenticationAllowableReuseDuration=0
        guard c.canEvaluatePolicy(.deviceOwnerAuthentication,error:nil) else{completion(false);return}
        authenticating=true;context=c
        c.evaluatePolicy(.deviceOwnerAuthentication,localizedReason:"Schütze deine persönlichen Angaben und Dokumente in Gut begleitet."){ok,_ in DispatchQueue.main.async{self.authenticating=false;self.context=nil;completion(ok)}}
    }
    func change(_ value:Bool,completion:@escaping(Bool)->Void){
        guard accessible,!authenticating else{completion(false);return}
        authenticate {ok in guard ok,self.persist(value) else{completion(false);return};self.locked=value && UIApplication.shared.applicationState == .background;if !self.locked {self.hide()};completion(true)}
    }
}
