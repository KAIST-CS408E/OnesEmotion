import rq from "request-promise-native";
// TODO: change request to axios
export default nlp = {
  nounNumber: async function (text) {
    try {
      const result = await rq(`http://parser.datanada.com/parse?version=1&string=${text}`);
      const morphemes  = JSON.parse(result);
      let noun = 0;
      morphemes.forEach((morpheme) => {
        if (morpheme[pos].indexOf('N')) {
          noun++;
        }
      });
      console.log(noun);
      return noun;
    } catch (e) {
      console.log(e.toString());
      throw e;
    }
  }
}