const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const iseseisvuspartei = 'https://ariregister.rik.ee/erakonnad/liikmete_nimekiri?ark=80051885&lang=est';
const keskerakond = 'https://ariregister.rik.ee/erakonnad/liikmete_nimekiri?ark=80053370&lang=est';
let linkList = [iseseisvuspartei,keskerakond];
let dlinkList = [];

/*
const getWebsiteLinks = async (url) => {
  try {
    const response = await axios.get(url)
    const $ = cheerio.load(response.data)
    $('.subcontent.active div:first-child').each(function (i, elem) {
      let link = $(elem).find('a').attr('href')
      linkList.push(url+link)
    });
  } catch (error) {
    console.error(error)
  }
}
*/

const downloadLinks = async (linkList) => {
  let idx = 0;
  for (const link of linkList) {
    const response = await axios.get(link)
    const $ = cheerio.load(response.data)
    let name = $('.subcontent.active div:first-child a:first-child').attr("href");
    //name = 'https://ariregister.rik.ee/' + name
   // let dlink = link + name[1]
    let dlink = 'https://ariregister.rik.ee' + name;
    dlinkList.push({
      name: idx,
      dlink: dlink
    })

    idx ++
  }

  console.log(dlinkList);

}


const downloadFiles = async (dlinkList) => {
  for (const link of dlinkList) {
    let name = link.name + '.csv'
    let url = link.dlink
    let file = fs.createWriteStream(name)
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream'
    })
    response.data.pipe(file)
  }
}


(async () => {
 // await getWebsiteLinks(url)
  await downloadLinks(linkList);
  await downloadFiles(dlinkList);
})();