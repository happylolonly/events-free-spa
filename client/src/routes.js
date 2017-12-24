// import React from 'react';

import App from './App';

import TodayPageContainer from './pages/TodayPage/TodayPageContainer';
import EventPageContainer from './pages/EventPage/EventPageContainer';
import AboutPage from './pages/AboutPage/AboutPage';
import FeedbackPage from './pages/FeedbackPage/FeedbackPage';
import ModerateContainer from './pages/ModeratePage/ModerateContainer';
import SettingsPage from './pages/SettingsPage/SettingsPage';


export default [
	{
		onEnter: (a,b,c) => console.log(a,b,c),
		component: App,
		path: '/',
		routes: [
			{ ...TodayPageContainer, path: '/events' },
			{ ...EventPageContainer, path: '/event/:id' },
			{ component: AboutPage, path: '/about' },
			{ component: SettingsPage, path: '/settings' },
			{ component: FeedbackPage, path: '/feedback1' },
			{ component: ModerateContainer, path: '/moder' },
		],
	}
];

//  const routes = (
// 	<Route path="/" component={App}>
// 		<IndexRedirect from="/" to="events" />
//
// 		<Redirect from="event" to="events" />
//
// 		<Redirect from="*" to="/" />
// 	</Route>
// );
