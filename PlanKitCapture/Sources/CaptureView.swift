import SwiftUI
import RoomPlan

struct CaptureView: View {
    @EnvironmentObject var manager: RoomPlanManager
    @State private var showShare = false

    var body: some View {
        VStack(spacing: 24) {
            Text("PlanKit Capture Helper")
                .font(.title)
                .bold()
            Text("Scan one room at a time. On finish, export JSON to the PlanKit PWA or share locally.")
                .multilineTextAlignment(.center)
            Spacer()
            RoomCaptureViewRepresentable(session: manager.session)
                .frame(height: 400)
                .cornerRadius(16)
            Spacer()
            HStack {
                Button(action: manager.startCapturing) {
                    Label("Start", systemImage: "camera")
                }
                .buttonStyle(.borderedProminent)

                Button("Finish") {
                    Task {
                        await manager.finishCapture()
                        showShare = true
                    }
                }
                .buttonStyle(.bordered)
                .disabled(manager.exportState != .capturing)
            }
            if let json = manager.lastJson {
                ShareLink(item: json, preview: SharePreview("PlanKit Room", image: Image(systemName: "square.grid.3x3")))
                    .opacity(showShare ? 1 : 0)
            }
            Spacer()
            if case .failed(let message) = manager.exportState {
                Text("Export failed: \(message)")
                    .foregroundColor(.red)
            }
        }
        .padding()
    }
}

struct RoomCaptureViewRepresentable: UIViewRepresentable {
    let session: RoomCaptureSession

    func makeUIView(context: Context) -> RoomCaptureView {
        let view = RoomCaptureView(frame: .zero)
        view.captureSession = session
        return view
    }

    func updateUIView(_ uiView: RoomCaptureView, context: Context) {
        uiView.captureSession = session
    }
}
