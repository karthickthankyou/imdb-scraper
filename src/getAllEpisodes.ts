/** @ts-ignore */
import { saveJsonToFile } from 'savejsontofile'
/** @ts-ignore */
import { saveImageToDisk } from 'saveimagetodisk'

import puppeteer from 'puppeteer'

//initiating Puppeteer
puppeteer
  .launch()
  .then(async (browser) => {
    //opening a new page and navigating to Reddit
    const urls = [
      {
        id: 'S01',
        url: 'https://www.imdb.com/title/tt2861424/episodes?season=1',
      },
      {
        id: 'S02',
        url: 'https://www.imdb.com/title/tt2861424/episodes?season=2',
      },
      {
        id: 'S03',
        url: 'https://www.imdb.com/title/tt2861424/episodes?season=3',
      },
      {
        id: 'S04',
        url: 'https://www.imdb.com/title/tt2861424/episodes?season=4',
      },
      {
        id: 'S05',
        url: 'https://www.imdb.com/title/tt2861424/episodes?season=5',
      },
    ]

    const page = await browser.newPage()
    const allSeasons: any = []

    for (let i = 0; i < urls.length; i++) {
      const { id, url } = urls[i]
      console.log('Season: ', id)

      await page.goto(url, { waitUntil: 'load', timeout: 40000 })
      await page.waitForSelector('body')
      // await page.waitForTimeout(1000)

      // Screenshots will help us see what puppeteer sees.
      // await page.screenshot({
      //   path: `${id}.png`,
      //   fullPage: true,
      // })
      //manipulating the page's content

      let article = await page.evaluate((id) => {
        const allEpisodes = document.querySelectorAll('.list_item')
        const allEpisodesData: any = []
        allEpisodes.forEach((episode, index) => {
          const src = episode.querySelector('img')?.src
          const title = episode.querySelector('strong')?.innerText

          const episodeLink = episode
            .querySelector('strong > a')
            ?.getAttribute('href')
          const rating = episode.querySelector(
            '.ipl-rating-star__rating',
          )?.innerHTML
          const desc = episode.querySelector('.item_description')?.innerHTML
          const totalRatings = episode.querySelector(
            '.ipl-rating-star__total-votes',
          )?.innerHTML

          allEpisodesData.push({
            src,
            title,
            rating,
            desc,
            totalRatings,
            link: 'https://www.imdb.com' + episodeLink,
            episode: `${id}E${(index + 1).toString().padStart(2, '0')}`,
          })
        })
        return allEpisodesData
      }, id)
      // console.log(article)
      // article.allEpisodesData.forEach((episode: any) => {
      //   saveImageToDisk(episode.src, `images/${id}_${episode.title}.jpg`)
      // })

      allSeasons.push(...article)
    }
    saveJsonToFile(
      allSeasons, // Json object
      `allSeasons.json`, // Output path
    )

    //closing the browser
    await browser.close()
  })
  //handling any errors
  .catch(function (err) {
    console.error(err)
  })
