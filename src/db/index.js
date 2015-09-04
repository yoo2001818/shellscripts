import config from '../../config/db.config.js';
import * as preCollections from './collections/index.js';
import Waterline from 'waterline';

function loadCollections(waterline, collections) {
  for (let key in collections) {
    waterline.loadCollection(collections[key]);
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
    });
  });
}
