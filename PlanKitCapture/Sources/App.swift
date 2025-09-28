import SwiftUI

@main
struct PlanKitCaptureApp: App {
    @StateObject private var manager = RoomPlanManager()

    var body: some Scene {
        WindowGroup {
            CaptureView()
                .environmentObject(manager)
        }
    }
}
