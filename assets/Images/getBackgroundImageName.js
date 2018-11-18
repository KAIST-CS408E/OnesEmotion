export default function getBackgroundImageName() {
	var maxNumOfImage = 4;
  var num = Math.floor(Math.random() * (maxNumOfImage)) + 1;
	num += "";
	const imagename = "background" + num;
	return imagename
}