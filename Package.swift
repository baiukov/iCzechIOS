import PackageDescription

let package = Package(
    name: "iCzech",
    platforms: [
        .iOS(.v14)
    ],
    dependencies: [
        .package(url: "https://github.com/jpsim/Yams.git", from: "4.0.0")
    ],
    targets: [
        .target(
            name: "iCzech",
            dependencies: ["Yams"])
    ]
)
