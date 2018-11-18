export default function getManIcon() {
	var maxNumOfImage = 8;
  var num = Math.floor(Math.random() * (maxNumOfImage)) + 1;
	num += "";
	const usericon = "manicon" + num;
	return usericon
}