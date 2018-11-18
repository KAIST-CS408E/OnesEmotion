export default function getGirlIcon() {
	var maxNumOfImage = 6;
  var num = Math.floor(Math.random() * (maxNumOfImage)) + 1;
	num += "";
	const usericon = "girlicon" + num;
	return usericon
}