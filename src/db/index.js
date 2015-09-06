import config from '../../config/db.config.js';
import * as preCollections from './collections/index.js';
import Waterline from 'waterline';

export const collections = {};

function loadCollections(waterline, preCols) {
  for (let key in preCols) {
    waterline.loadCollection(preCols[key]);
  }
}

export default function init() {
  const waterline = new Waterline();
  loadCollections(waterline, preCollections);
  // Translate load code to a Promise
  return new Promise((resolve, reject) => {
    waterline.initialize(config, (err, ontology) => {
      if (err) {
        reject(err);
        return;
      }
      const collectionList = {};
      for (const key in ontology.collections) {
        const newKey = key.charAt(0).toUpperCase() +
          key.slice(1);
        collectionList[newKey] = ontology.collections[key];
      }
      // Seriously though, we don't need anything but this
      resolve(collectionList);
      Object.assign(collections, collectionList);
    });
  });
}
