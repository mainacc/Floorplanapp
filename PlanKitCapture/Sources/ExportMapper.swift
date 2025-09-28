import Foundation
import RoomPlan

struct ExportMapper {
    struct Opening: Codable {
        let type: String
        let width_mm: Double
        let height_mm: Double?
        let sill_height_mm: Double?
        let position_along_wall_mm: Double
        let swing: String?
    }

    struct Wall: Codable {
        let start: Point
        let end: Point
        let thickness_mm: Double
        let openings: [Opening]
    }

    struct Point: Codable {
        let x: Double
        let y: Double
    }

    struct Room: Codable {
        let name: String?
        let height_m: Double?
        let walls: [Wall]
    }

    struct Payload: Codable {
        let room: Room
    }

    func jsonData(from data: CapturedRoomData) throws -> Data {
        let walls = data.room.walls.map { wall -> Wall in
            let openings = wall.openings.map { opening -> Opening in
                let swing: String?
                switch opening.type {
                case .door(let door):
                    swing = door.opensInwards ? "L" : "R"
                case .opening:
                    swing = nil
                case .window:
                    swing = "fixed"
                @unknown default:
                    swing = nil
                }
                return Opening(
                    type: opening.kind.rawValue,
                    width_mm: opening.dimensions.width * 1000.0,
                    height_mm: opening.dimensions.height * 1000.0,
                    sill_height_mm: opening.dimensions.bottom * 1000.0,
                    position_along_wall_mm: opening.position.x * 1000.0,
                    swing: swing
                )
            }

            return Wall(
                start: Point(x: wall.start.x * 1000.0, y: wall.start.z * 1000.0),
                end: Point(x: wall.end.x * 1000.0, y: wall.end.z * 1000.0),
                thickness_mm: wall.thickness * 1000.0,
                openings: openings
            )
        }

        let room = Room(
            name: data.room.identifier,
            height_m: data.room.height,
            walls: walls
        )

        let payload = Payload(room: room)
        return try JSONEncoder().encode(payload)
    }
}
