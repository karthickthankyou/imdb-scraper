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
    const urls = require('./allSeasons.json')

    const page = await browser.newPage()
    const allEpisodes = []

    for (let i = 0; i < urls.length; i++) {
      const episodeDetails = urls[i]
      const { episode: id, link: url } = episodeDetails
      console.log('Episode: ', id)

      await page.goto(url, { waitUntil: 'load', timeout: 40000 })
      await page.waitForSelector('body')
      // await page.waitForTimeout(1000)

      // Screenshots will help us see what puppeteer sees.
      // await page.screenshot({
      //   path: `${id}.png`,
      //   fullPage: true,
      // })
      //manipulating the page's content

      let article = await page.evaluate((episodeDetails) => {
        const coverImg = document
          .querySelector(
            '#__next > main > div > section.ipc-page-background.ipc-page-background--base.TitlePage__StyledPageBackground-wzlr49-0.dDUGgO > section > div:nth-child(4) > section > section > div.Hero__MediaContentContainer__NoVideo-kvkd64-6.hAJqld > div.Hero__MediaContainer__NoVideo-kvkd64-7.ytFvJ > div > div > div.ipc-media.ipc-media--poster-27x40.ipc-image-media-ratio--poster-27x40.ipc-media--baseAlt.ipc-media--poster-l.ipc-poster__poster-image.ipc-media__img > img',
          )
          ?.getAttribute('src')
        // const imagesDiv = document.querySelectorAll(
        //   '#__next > main > div > section.ipc-page-background.ipc-page-background--base.TitlePage__StyledPageBackground-wzlr49-0.dDUGgO > div > section > div > div.TitleMainBelowTheFoldGroup__TitleMainPrimaryGroup-sc-1vpywau-1.btXiqv.ipc-page-grid__item.ipc-page-grid__item--span-2 > section:nth-child(6) > div.ipc-shoveler > div.ipc-sub-grid.ipc-sub-grid--page-span-2.ipc-sub-grid--nowrap.ipc-shoveler__grid > img',
        // )
        // const imagesDiv = document.querySelectorAll('img.ipc-image')
        const imagesDiv = document.querySelectorAll(
          '[data-testid="Photos"] .ipc-sub-grid img.ipc-image',
        )
        const allImages = []
        for (let i = 0; i < imagesDiv.length; i++) {
          const image = imagesDiv[i]
          allImages.push(image.getAttribute('src'))
        }

        document.querySelector(
          '#__next > main > div > section.ipc-page-background.ipc-page-background--base.TitlePage__StyledPageBackground-wzlr49-0.dDUGgO > div > section > div > div.TitleMainBelowTheFoldGroup__TitleMainPrimaryGroup-sc-1vpywau-1.btXiqv.ipc-page-grid__item.ipc-page-grid__item--span-2 > section:nth-child(6)',
        )

        // const duration = document.querySelector(
        //   '#__next > main > div > section.ipc-page-background.ipc-page-background--base.TitlePage__StyledPageBackground-wzlr49-0.dDUGgO > div > section > div > div.TitleMainBelowTheFoldGroup__TitleMainPrimaryGroup-sc-1vpywau-1.btXiqv.ipc-page-grid__item.ipc-page-grid__item--span-2 > section:nth-child(34) > div.styles__MetaDataContainer-sc-12uhu9s-0.cgqHBf > ul > li > div',
        // )?.innerHTML
        const duration = document.querySelector(
          '[data-testid="TechSpecs"] .ipc-metadata-list-item__content-container',
        )?.innerHTML

        // ;('.ipc-metadata-list-item__list-content-item')

        const certificate = document.querySelector(
          '[data-testid="Storyline"] [data-testid="storyline-certificate"] .ipc-metadata-list-item__list-content-item',
        )?.innerHTML
        const storyline = document.querySelector(
          '[data-testid="Storyline"] .ipc-html-content',
        )?.textContent
        const genres = document.querySelector(
          '[data-testid="storyline-genres"] .ipc-metadata-list-item__content-container',
        )?.textContent

        // .ipc-sub-grid img.ipc-image

        // const allImages = imagesDiv.forEach((image) =>
        //   image.getAttribute('src'),
        // )
        // const allImages = imagesDiv
        //   ?.querySelectorAll('img')
        //   .forEach((item) => item.getAttribute('src'))

        return {
          coverImg,
          allImages,
          duration,
          storyline,
          genres,
          certificate,
          ...episodeDetails,
        }
      }, episodeDetails)
      // console.log(article)
      // article.allEpisodesData.forEach((episode: any) => {
      //   saveImageToDisk(episode.src, `images/${id}_${episode.title}.jpg`)
      // })
      // console.log('allImages: ', article.allImages)

      allEpisodes.push(article)
      saveJsonToFile(
        article, // Json object
        `${episodeDetails.episode}.json`, // Output path
      )
    }
    saveJsonToFile(
      allEpisodes, // Json object
      `allEpisodes.json`, // Output path
    )

    //closing the browser
    await browser.close()
  })
  //handling any errors
  .catch(function (err) {
    console.error(err)
  })
