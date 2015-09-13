import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GitHubStrategy } from 'passport-github';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import localLogin from './local.js';
import oAuthLogin from './oauth.js';
import * as config from '../../../../config/auth.config.js';

export default {
  local: {
    name: 'Local',
    enabled: true,
    redirect: false,
    strategy: new LocalStrategy(localLogin)
  },
  github: {
    name: 'GitHub',
    enabled: true,
    redirect: true,
    strategy: new GitHubStrategy(config.github, oAuthLogin.bind(null, 'github'))
  },
  facebook: {
    name: 'Facebook',
    enabled: true,
    redirect: true,
    strategy: new FacebookStrategy(config.facebook, oAuthLogin.bind(null,
      'facebook'))
  }
};
