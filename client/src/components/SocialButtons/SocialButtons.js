import React from 'react';
import PropTypes from 'prop-types';

import { ShareButtons, ShareCounts, generateShareIcon } from 'react-share';

import './SocialButtons.css';


const { VKShareButton, FacebookShareButton, TwitterShareButton, TelegramShareButton, LinkedinShareButton, GooglePlusShareButton } = ShareButtons;
const { VKShareCount, FacebookShareCount, LinkedinShareCount, GooglePlusShareCount } = ShareCounts;

const VKIcon = generateShareIcon('vk');
const FacebookIcon = generateShareIcon('facebook');
const TwitterIcon = generateShareIcon('twitter');
const TelegramIcon = generateShareIcon('telegram');
const LinkedinIcon = generateShareIcon('linkedin');
const GooglePlusIcon = generateShareIcon('google');

const description = '';
const image = 'http://www.eventsfree.by/logo.png';
const size = 32;

const propTypes = {
  link: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  isShowCount: PropTypes.bool.isRequired,
}

const SocialButtons = ({ link, title, isShowCount }) => {
  return (
    <ul className="social-buttons">

      <li>
        <VKShareButton url={link} title={title} description={description} image={image}>
          <VKIcon size={size} round={true} />
          {isShowCount &&
            <VKShareCount url={link}>
              {shareCount => (
                <span className="myShareCountWrapper">{shareCount}</span>
              )}
            </VKShareCount>}
        </VKShareButton>
      </li>

      <li>
        <FacebookShareButton url={link} title={title} description={description} picture={image}>
          <FacebookIcon size={size} round={true} />
          {isShowCount &&
            <FacebookShareCount url={link}>
              {shareCount => (
                <span className="myShareCountWrapper">{shareCount}</span>
              )}
            </FacebookShareCount>}
        </FacebookShareButton>
      </li>

      <li>
        <TwitterShareButton url={link} title={title}>
          <TwitterIcon size={size} round={true} />
        </TwitterShareButton>
      </li>

      <li>
        <TelegramShareButton url={link} title={title}>
          <TelegramIcon size={size} round={true} />
        </TelegramShareButton>
      </li>

      <li>
        <LinkedinShareButton url={link} title={title} description={description}>
          <LinkedinIcon size={size} round={true} />
          {isShowCount &&
            <LinkedinShareCount url={link}>
              {shareCount => (
                <span className="myShareCountWrapper">{shareCount}</span>
              )}
            </LinkedinShareCount>}
        </LinkedinShareButton>
      </li>

      <li>
        <GooglePlusShareButton url={link}>
          <GooglePlusIcon size={size} round={true} />
          {isShowCount &&
            <GooglePlusShareCount url={link}>
              {shareCount => (
                <span className="myShareCountWrapper">{shareCount}</span>
              )}
            </GooglePlusShareCount>}
        </GooglePlusShareButton>
      </li>

    </ul>
  )
}

SocialButtons.propTypes = propTypes;

export default SocialButtons;
