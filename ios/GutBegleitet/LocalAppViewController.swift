import UIKit
import WebKit
import QuickLook
import UniformTypeIdentifiers
import EventKit
import EventKitUI

private final class WeakHandler: NSObject, WKScriptMessageHandler {
    weak var owner: LocalAppViewController?
    init(_ owner: LocalAppViewController) { self.owner = owner }
    func userContentController(_ controller: WKUserContentController, didReceive message: WKScriptMessage) { owner?.receive(message) }
}
private final class LocalTransfer {
    let url: URL
    let handle: FileHandle
    let metadata: [String: Any]
    let operation: String
    var bytes = 0
    init(url: URL, metadata: [String: Any], operation: String) throws {
        self.url = url; self.metadata = metadata; self.operation = operation
        FileManager.default.createFile(atPath: url.path, contents: nil)
        self.handle = try FileHandle(forWritingTo: url)
    }
}
final class LocalAppViewController: UIViewController, WKNavigationDelegate, WKUIDelegate, QLPreviewControllerDataSource, EKEventEditViewDelegate {
    private var web: WKWebView!
    private var transfers: [String: LocalTransfer] = [:]
    private var documents: [[String: Any]] = []
    private var previewURL: URL?
    private var root: URL!
    private var documentsFolder: URL!
    private var indexURL: URL!
    private let eventStore = EKEventStore()
    private var smokeStarted = false

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = UIColor(red: 247/255, green: 248/255, blue: 243/255, alpha: 1)
        do {
            root = try FileManager.default.url(for: .applicationSupportDirectory, in: .userDomainMask, appropriateFor: nil, create: true).appendingPathComponent("GutBegleitet", isDirectory: true)
            try FileManager.default.createDirectory(at: root, withIntermediateDirectories: true)
            var values = URLResourceValues(); values.isExcludedFromBackup = true; try root.setResourceValues(values)
            documentsFolder = root.appendingPathComponent("Documents", isDirectory: true)
            try FileManager.default.createDirectory(at: documentsFolder, withIntermediateDirectories: true)
            if let data = try? Data(contentsOf: root.appendingPathComponent("documents.json")), let stored = try? JSONSerialization.jsonObject(with: data) as? [[String: Any]] { documents = stored }
            guard let file = Bundle.main.url(forResource: "index", withExtension: "html", subdirectory: "WebContent") else { throw CocoaError(.fileNoSuchFile) }
            indexURL = file
            let stateURL = root.appendingPathComponent("state.json")
            let saved = (try? String(contentsOf: stateURL, encoding: .utf8)) ?? ""
            let initial = try json(["weiter-demo": saved.isEmpty ? NSNull() : saved as Any])
            let bootstrap = "window.GutBegleitetIOSStorage={values:\(initial),getItem:function(k){return this.values[k]??null},setItem:function(k,v){this.values[k]=String(v);if(k==='weiter-demo')window.webkit.messageHandlers.gutBegleitet.postMessage({id:'state',action:'persistState',payload:{json:String(v)}})}};"
            let config = WKWebViewConfiguration()
            config.websiteDataStore = .default()
            config.userContentController.add(WeakHandler(self), name: "gutBegleitet")
            if CommandLine.arguments.contains("--smoke-test") { config.userContentController.add(WeakHandler(self), name: "smokeResult") }
            config.userContentController.addUserScript(WKUserScript(source: bootstrap, injectionTime: .atDocumentStart, forMainFrameOnly: true))
            web = WKWebView(frame: .zero, configuration: config)
            web.translatesAutoresizingMaskIntoConstraints = false
            web.navigationDelegate = self; web.uiDelegate = self
            web.isOpaque = false; web.backgroundColor = view.backgroundColor
            web.allowsBackForwardNavigationGestures = true
            view.addSubview(web)
            NSLayoutConstraint.activate([web.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor),web.bottomAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor),web.leadingAnchor.constraint(equalTo: view.leadingAnchor),web.trailingAnchor.constraint(equalTo: view.trailingAnchor)])
            web.loadFileURL(file, allowingReadAccessTo: file.deletingLastPathComponent())
        } catch { showError("Die lokalen App-Inhalte konnten nicht geladen werden.") }
    }
    private func json(_ object: Any) throws -> String {
        let data = try JSONSerialization.data(withJSONObject: object, options: [.fragmentsAllowed])
        return String(decoding: data, as: UTF8.self)
    }
    private func reply(_ id: String, _ ok: Bool, _ value: Any = NSNull()) {
        guard let args = try? json([id, ok, value]) else { return }
        web.evaluateJavaScript("window.gutIOSReply&&window.gutIOSReply.apply(null,\(args))", completionHandler: nil)
    }
    private func saveDocumentIndex() throws {
        try JSONSerialization.data(withJSONObject: documents).write(to: root.appendingPathComponent("documents.json"), options: [.atomic, .completeFileProtectionUntilFirstUserAuthentication])
    }
    private func validID(_ id: String) -> Bool { !id.isEmpty && id.count < 150 && id.range(of: "^[A-Za-z0-9_-]+$", options: .regularExpression) != nil }
    private func document(_ id: String) throws -> [String: Any] {
        guard validID(id), let record = documents.first(where: { $0["id"] as? String == id }) else { throw CocoaError(.fileNoSuchFile) }; return record
    }
    private func documentURL(_ record: [String: Any]) throws -> URL {
        guard let name = record["storedFilename"] as? String, name == URL(fileURLWithPath: name).lastPathComponent else { throw CocoaError(.fileReadNoPermission) }
        return documentsFolder.appendingPathComponent(name)
    }
    private func sanitizedName(_ name: String) -> String {
        let last = URL(fileURLWithPath: name).lastPathComponent
        let safe = last.components(separatedBy: CharacterSet.controlCharacters).joined().replacingOccurrences(of: ":", with: "_")
        return safe.isEmpty ? "Dokument.pdf" : String(safe.suffix(120))
    }
    func receive(_ message: WKScriptMessage) {
        guard message.frameInfo.isMainFrame, let url = message.frameInfo.request.url, url.isFileURL, url.standardizedFileURL.path == indexURL?.standardizedFileURL.path else { return }
        if message.name == "smokeResult", CommandLine.arguments.contains("--smoke-test") {
            if let data = try? JSONSerialization.data(withJSONObject: message.body) { try? data.write(to: root.appendingPathComponent("smoke-result.json"), options: .atomic) }; return
        }
        guard let body = message.body as? [String: Any], let id = body["id"] as? String, let action = body["action"] as? String else { return }
        let payload = body["payload"] as? [String: Any] ?? [:]
        do {
            switch action {
            case "persistState":
                guard let text = payload["json"] as? String, text.utf8.count <= 4*1024*1024, let data = text.data(using: .utf8), (try JSONSerialization.jsonObject(with: data)) is [String: Any] else { throw CocoaError(.fileWriteInvalidFileName) }
                try data.write(to: root.appendingPathComponent("state.json"), options: [.atomic, .completeFileProtectionUntilFirstUserAuthentication]); reply(id, true)
            case "listDocuments":
                reply(id, true, documents.map { record in var value = record; value.removeValue(forKey: "storedFilename"); return value })
            case "deleteDocument":
                let target = payload["id"] as? String ?? ""
                if let existing = documents.first(where: { $0["id"] as? String == target }) {
                    let old = documents; documents.removeAll { $0["id"] as? String == target }
                    do { try saveDocumentIndex() } catch { documents = old; throw error }
                    try? FileManager.default.removeItem(at: documentURL(existing))
                }; reply(id, true)
            case "startTransfer":
                guard transfers.count < 2, let metadata = payload["metadata"] as? [String: Any], let operation = payload["operation"] as? String, ["upload", "export", "preview"].contains(operation), let mime = metadata["type"] as? String, mime == "application/pdf" || mime == "text/calendar" || mime.hasPrefix("image/") else { throw CocoaError(.fileWriteInvalidFileName) }
                if operation == "upload" { guard let docID = metadata["id"] as? String, validID(docID), !documents.contains(where: { $0["id"] as? String == docID }) else { throw CocoaError(.fileWriteFileExists) } }
                let token = UUID().uuidString
                let folder = FileManager.default.temporaryDirectory.appendingPathComponent("GutBegleitet", isDirectory: true)
                try FileManager.default.createDirectory(at: folder, withIntermediateDirectories: true)
                let name = sanitizedName(metadata["name"] as? String ?? "Dokument.pdf")
                let transfer = try LocalTransfer(url: folder.appendingPathComponent(token+"-"+name), metadata: metadata, operation: operation)
                transfers[token] = transfer; reply(id, true, token)
            case "appendTransfer":
                guard let token = payload["token"] as? String, let transfer = transfers[token], let chunk = payload["chunk"] as? String, chunk.count <= 262144, let bytes = Data(base64Encoded: chunk), transfer.bytes + bytes.count <= 20*1024*1024 else { throw CocoaError(.fileWriteOutOfSpace) }
                try transfer.handle.write(contentsOf: bytes); transfer.bytes += bytes.count; reply(id, true)
            case "cancelTransfer":
                if let token = payload["token"] as? String, let transfer = transfers.removeValue(forKey: token) { try? transfer.handle.close(); try? FileManager.default.removeItem(at: transfer.url) }; reply(id, true)
            case "finishTransfer":
                guard let token = payload["token"] as? String, let transfer = transfers.removeValue(forKey: token), transfer.bytes > 0 else { throw CocoaError(.fileReadUnknown) }
                try transfer.handle.close()
                if transfer.operation == "upload" {
                    let ext = transfer.url.pathExtension
                    let filename = UUID().uuidString + (ext.isEmpty ? "" : "."+ext)
                    let target = documentsFolder.appendingPathComponent(filename)
                    try FileManager.default.moveItem(at: transfer.url, to: target)
                    var metadata = transfer.metadata; metadata["storedFilename"] = filename; metadata["size"] = transfer.bytes
                    documents.append(metadata)
                    do { try saveDocumentIndex() } catch { documents.removeLast(); try? FileManager.default.removeItem(at: target); throw error }
                    reply(id, true, metadata["id"] ?? NSNull())
                } else {
                    reply(id, true)
                    if transfer.operation == "preview" { preview(transfer.url) } else { export(transfer.url) }
                }
            case "previewDocument": preview(try documentURL(document(payload["id"] as? String ?? ""))); reply(id, true)
            case "exportDocument":
                let record = try document(payload["id"] as? String ?? "")
                let folder = FileManager.default.temporaryDirectory.appendingPathComponent(UUID().uuidString, isDirectory: true)
                try FileManager.default.createDirectory(at: folder, withIntermediateDirectories: true)
                let target = folder.appendingPathComponent(sanitizedName(record["name"] as? String ?? "Dokument.pdf"))
                try FileManager.default.copyItem(at: documentURL(record), to: target); reply(id, true); export(target)
            case "openExternal":
                guard let text = payload["url"] as? String, let url = URL(string: text), ["https", "http", "tel", "mailto"].contains(url.scheme?.lowercased() ?? "") else { throw CocoaError(.fileReadUnsupportedScheme) }
                UIApplication.shared.open(url); reply(id, true)
            case "calendar": try openCalendar(payload); reply(id, true)
            case "message": showError(payload["text"] as? String ?? "Aktion fehlgeschlagen."); reply(id, true)
            default: throw CocoaError(.featureUnsupported)
            }
        } catch {
            reply(id, false, "Die Aktion konnte nicht abgeschlossen werden. Bitte Speicherplatz und Eingaben prüfen.")
            if id == "state" { showError("Deine Angaben konnten nicht gespeichert werden. Bitte den freien Speicherplatz prüfen.") }
        }
    }
    private func preview(_ url: URL) {
        previewURL = url; let controller = QLPreviewController(); controller.dataSource = self; present(controller, animated: true)
    }
    func numberOfPreviewItems(in controller: QLPreviewController) -> Int { previewURL == nil ? 0 : 1 }
    func previewController(_ controller: QLPreviewController, previewItemAt index: Int) -> QLPreviewItem { previewURL! as NSURL }
    private func export(_ url: URL) { let picker = UIDocumentPickerViewController(forExporting: [url], asCopy: true); present(picker, animated: true) }
    private func openCalendar(_ payload: [String: Any]) throws {
        guard let date = payload["date"] as? String else { throw CocoaError(.fileReadUnknown) }
        let parts = date.split(separator: "-").compactMap { Int($0) }
        guard parts.count == 3, let start = Calendar.current.date(from: DateComponents(year: parts[0], month: parts[1], day: parts[2], hour: 9)) else { throw CocoaError(.fileReadUnknown) }
        let event = EKEvent(eventStore: eventStore); event.title = payload["title"] as? String ?? "Gut begleitet"; event.startDate = start; event.endDate = start.addingTimeInterval(1800); event.notes = payload["note"] as? String
        let lead = payload["lead"] as? Int ?? 0; event.addAlarm(EKAlarm(relativeOffset: -Double(max(0,min(lead,30)))*86400))
        let controller = EKEventEditViewController(); controller.eventStore = eventStore; controller.event = event; controller.editViewDelegate = self; present(controller, animated: true)
    }
    func eventEditViewController(_ controller: EKEventEditViewController, didCompleteWith action: EKEventEditViewAction) { controller.dismiss(animated: true) }
    private func showError(_ text: String) { let alert = UIAlertController(title: "Gut begleitet", message: text, preferredStyle: .alert); alert.addAction(UIAlertAction(title: "OK", style: .default)); if presentedViewController == nil { present(alert, animated: true) } }
    func webView(_ webView: WKWebView, decidePolicyFor action: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
        guard let url = action.request.url else { decisionHandler(.cancel); return }
        if url.isFileURL && url.standardizedFileURL.path == indexURL?.standardizedFileURL.path { decisionHandler(.allow); return }
        if action.targetFrame?.isMainFrame != false && ["https","http","tel","mailto"].contains(url.scheme?.lowercased() ?? "") { UIApplication.shared.open(url) }
        decisionHandler(.cancel)
    }
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        let size = 16 * UIFont.preferredFont(forTextStyle: .body).pointSize / 17
        webView.evaluateJavaScript("document.documentElement.style.fontSize='\(size)px'", completionHandler: nil)
        if CommandLine.arguments.contains("--smoke-test") && !smokeStarted {
            smokeStarted = true
            webView.evaluateJavaScript("window.gutIOSSmoke().then(value=>window.webkit.messageHandlers.smokeResult.postMessage(value)).catch(error=>window.webkit.messageHandlers.smokeResult.postMessage({ok:false,error:String(error)}))", completionHandler: nil)
        }
    }
}
