export default function getSource(imageName) {
    if (imageName == "sogood") return require("./sogood.png")
    if (imageName == "good") return require("./good.png")
    if (imageName == "soso") return require("./soso.png")
    if (imageName == "bad") return require("./bad.png")
    if (imageName == "sobad") return require("./sobad.png")
    if (imageName == "crowd") return require("./crowd.png")
    if (imageName == "search") return require("./search.png")
    if (imageName == "save") return require("./save.png")
    if (imageName == "cancel") return require("./cancel.png")
    if (imageName == "bot") return require("./bot.png")
    if (imageName == "user") return require("./user.png")
};
