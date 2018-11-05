import axios from "axios";
// TODO: change request to axios
export default nlp = {
  meaningless: async function (text) {
    try {
      const {data} = await axios.get(`http://parser.datanada.com/parse?version=1&string=${text}`);
      let noun = 0;
      let verb = 0;
      data.forEach((morpheme) => {
        let pos = morpheme["pos"]
        if (pos.indexOf('N') == 0) {
          // 명사
          noun++;
        }
        if (pos.indexOf('VV') == 0) {
          // 동사
          verb++;
        }
      });
      if (noun > 1 && verb > 0) {
        return false;
      }
      return true;
    } catch (e) {
      console.log(e.toString());
      throw e;
    }
  }
}