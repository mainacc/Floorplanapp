import Foundation

@MainActor
final class Uploader {
    struct Response: Decodable { let token: String }

    func upload(json: String) async throws -> String {
        guard let data = json.data(using: .utf8) else {
            throw URLError(.badServerResponse)
        }
        guard let url = URL(string: "https://app.plankit.dev/api/upload") else {
            throw URLError(.badURL)
        }
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = data
        let (body, _) = try await URLSession.shared.data(for: request)
        let response = try JSONDecoder().decode(Response.self, from: body)
        return response.token
    }
}
