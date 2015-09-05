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
      // Seriously though, we don't need anything but this
      resolve(ontology.collections);
      Object.assign(collections, ontology.collections);
    });
  });
}
