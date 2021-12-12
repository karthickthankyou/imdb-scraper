/** @ts-ignore */
import { saveJsonToFile } from 'savejsontofile'
/** @ts-ignore */
import { saveImageToDisk } from 'saveimagetodisk'

export const cleanData = () => {
  const allEpisodes = require('../allEpisodes_.json')
  console.log('Hello World')
  const updatedAllEpisodes = []
  for (let i = 0; i < allEpisodes.length; i++) {
    const { allImages, src, coverImg, ...rest } = allEpisodes[i]
    const updatedSrc = src.split('._V1_')[0]
    saveImageToDisk(updatedSrc, `images/` + rest.episode + '.jpg')
    const updatedSubImages = []
    for (let j = 0; j < allImages.length; j++) {
      updatedSubImages.push(allImages[j].split('._V1_')[0])
      saveImageToDisk(
        updatedSrc,
        `images/` + rest.episode + '_' + j.toString().padStart(2, '0') + '.jpg',
      )
    }
    updatedAllEpisodes.push({
      ...rest,
      image: updatedSrc,
      subImages: updatedSubImages,
    })
  }
  saveJsonToFile(
    updatedAllEpisodes, // Json object
    `updatedAllEpisodes.json`, // Output path
  )
}
