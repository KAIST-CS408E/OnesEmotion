import axios from "axios";

export default nlp = {
  analyse: async function (text) {
    try {
      const {data} = await axios.get(`http://parser.datanada.com/parse?version=1&string=${text}`);
      return data
    } catch (e) {
      console.log(e.toString())
      throw e;
    }
  },
  meaningless: async function (text) {
    try {
      const morphemes = await this.analyse(text)
      let noun = 0;
      let verb = 0;
      let previous = {
        "deprel": "",
        "pos": "",
        "form": "",
        "head": "",
        "id": ""
      };
      console.log(morphemes)
      morphemes.forEach((morpheme) => {
        let pos = morpheme["pos"]
        // if (morpheme["deprel"] == previous["deprel"]) {
        //   return;
        // }
        if (pos.indexOf('N') == 0) {
          // 명사
          noun++;
        }
        if (pos.indexOf('V') == 0) {
          // 동사
          verb++;
        }
        previous = morpheme
      });
      if (noun > 1 && verb > 0) {
        return false;
      }
      return true;
    } catch (e) {
      console.log(e.toString());
      throw e;
    }
  },
  test: async function (text) {
    try {
      const morphemes = await this.analyse(text)
      let sentences = 0;
      morphemes.forEach((morpheme) => {
        if (morpheme["deprel"] == "ROOT") {
          sentences++
        }
      });
      console.log(sentences)
    } catch (e) {
      console.log(e.toString());
      throw e;
    }
  }
}