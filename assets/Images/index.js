export default function getSource(imageName) {
    if (imageName == "background1") return require("./background1.png")
    if (imageName == "background2") return require("./background2.png")
    if (imageName == "background3") return require("./background3.png")
    if (imageName == "background4") return require("./background4.png")
};
