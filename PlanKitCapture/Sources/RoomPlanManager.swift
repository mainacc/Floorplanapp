import Foundation
import RoomPlan

@MainActor
final class RoomPlanManager: ObservableObject {
    @Published var session: RoomCaptureSession
    @Published var captureEnabled = false
    @Published var exportState: ExportState = .idle
    @Published var lastJson: String?

    enum ExportState {
        case idle
        case capturing
        case exporting
        case finished
        case failed(String)
    }

    init() {
        session = RoomCaptureSession()
    }

    func startCapturing() {
        session = RoomCaptureSession()
        session.delegate = self
        captureEnabled = true
        exportState = .capturing
        session.run(configuration: RoomCaptureSession.Configuration())
    }

    func finishCapture() async {
        exportState = .exporting
        do {
            let data = try await session.captureData
            let mapper = ExportMapper()
            let jsonData = try mapper.jsonData(from: data)
            let jsonString = String(data: jsonData, encoding: .utf8)
            lastJson = jsonString
            exportState = .finished
        } catch {
            exportState = .failed(error.localizedDescription)
        }
    }
}

extension RoomPlanManager: RoomCaptureSessionDelegate {
    func captureSession(_ session: RoomCaptureSession, didUpdate: CapturedRoom) {}
    func captureSession(_ session: RoomCaptureSession, didAdd: CapturedRoom) {}
    func captureSession(_ session: RoomCaptureSession, didRemove: CapturedRoom) {}

    func captureSession(_ session: RoomCaptureSession, didEndWith data: CapturedRoomData, error: Error?) {}
}
