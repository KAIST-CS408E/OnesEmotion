import axios from "axios";

import {ETRI_ACCESS_KEY} from '../configs/nlpConfig';

export default nlp = {
  analyseByDparser: async function (text) {
    try {
      const {data} = await axios.get(`http://parser.datanada.com/parse?version=1&string=${text}`);
      let morphemes = [];
      data.forEach((morpheme) => {
        morphemes.push({
          type: morpheme.pos
        })
      })
      return morphemes
    } catch (e) {
      console.log(e.toString())
      throw e;
    }
  },
  analyseByEtri: async function (text) {
    try {
      const {data} = await axios.post('http://aiopen.etri.re.kr:8000/WiseNLU', {
        'access_key': ETRI_ACCESS_KEY,
        'argument': {
            'text': text,
            'analysis_code': 'ner'
        }
      });
      let morphemes = [];
      data.return_object.sentence.forEach((sentence) => {
        sentence.morp.forEach((morpheme) => {
          morphemes.push({
            type: morpheme.type
          })
        })
      })
      return morphemes
    } catch (e) {
      console.log(e.toString())
      throw e;
    }
  },
  analyse: async function (text) {
    try {
      const data = await this.analyseByEtri(text);
      return data;
    } catch (e) {
      const data = await this.analyseByDparser(text);
      return data;
    }
  },
  isMeaningful: async function (text) {
    try {
      const morphemes = await this.analyse(text)
      let noun = 0;
      let verb = 0;
      morphemes.forEach((morpheme) => {
        morpheme.type.split('+').forEach((morp) => {
          if (morp.indexOf('N') == 0) {
            // 명사
            noun++;
          }
          if (morp.indexOf('V') == 0) {
            // 동사
            verb++;
          }
        })
      });
      if (noun > 1 && verb > 0) {
        return true;
      }
      return false;
    } catch (e) {
      console.log(e.toString());
      throw e;
    }
  },
  isNotEmpty: function (text) {
    if (!text.trim()) {
      return false
    }
    return true
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