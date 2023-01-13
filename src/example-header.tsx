import * as Server from 'react-dom/server';
import {MainHeader} from '@financial-times/o-header/src/tsx/header';
import {Drawer} from '@financial-times/o-header/src/tsx/drawer';
const fs = require('node:fs');
const path = require('node:path');

const navigationData = JSON.parse(fs.readFileSync(
    path.join(__dirname, 'build/v2/navigation.json'), 'utf8'
));

const props = {
    "currentPath": undefined,
    "userIsAnonymous": true,
    "userIsLoggedIn": true,
    "showSubNavigation": true,
    "showUserNavigation": false,
    "showStickyHeader": true,
    "data": {
      "account": navigationData['account'],
      "anon": navigationData['anon'],
      "breadcrumb": [
        {
          "label": "World",
          "url": "/world"
        },
        {
          "label": "UK",
          "url": "/world/uk",
          "selected": true,
          "submenu": null
        }
      ],
      "drawer": navigationData['drawer-uk'],
      "editions": {
        "current": {
          "id": "uk",
          "name": "UK",
          "url": "https://www.ft.com/?edition=uk"
        },
        "others": [
          {
            "id": "international",
            "name": "International",
            "url": "https://www.ft.com/?edition=international"
          }
        ]
      },
      "footer": null,
      "navbar": navigationData['navbar-uk'],
      "navbar-right": navigationData['navbar-right'],
      "navbar-right-anon": navigationData['navbar-right-anon'],
      "navbar-simple": navigationData['navbar-simple'],
      "subsections": [
        {
          "label": "UK Business & Economy",
          "url": "/uk-business-economy",
          "submenu": null
        },
        {
          "label": "UK Politics & Policy",
          "url": "/world/uk/politics",
          "submenu": null
        },
        {
          "label": "UK Companies",
          "url": "/companies/uk",
          "submenu": null
        }
      ],
      "subsections-right": [],
      "user": navigationData['user']
    },
    "variant": "simple",
    "showMegaNav": false,
    "userIsSubscribed": false,
    "showLogoLink": true
  }

console.log(Server.renderToString(
    <>
        <MainHeader {...props} />
        <Drawer
            data={props.data}
            userIsLoggedIn={props.userIsLoggedIn}
            userIsSubscribed={props.userIsSubscribed}
        />
    </>
));
