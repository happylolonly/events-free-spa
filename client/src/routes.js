import React from 'react';
import { Route, Redirect, IndexRedirect } from 'react-router';

import TodayPageContainer from './components/TodayPage/TodayPageContainer';
import EventPageContainer from './components/EventPage/EventPageContainer';
import AboutPage from './components/AboutPage/AboutPage';
import FeedbackPage from './components/FeedbackPage/FeedbackPage';
import ModerateContainer from './components/ModeratePage/ModerateContainer';
import SettingsPage from './components/SettingsPage/SettingsPage';

/*IndexRoute
Redirect*/

import App from './components/App';

export default (
	<Route path="/" component={App}>
		<IndexRedirect from="/" to="today" />
		<Route path="today" component={TodayPageContainer} />
		<Route path="all" component={TodayPageContainer} />

		<Route path="past" component={TodayPageContainer} />

		<Redirect from="event" to="today" />
		<Route path="event/:id" component={EventPageContainer} />
		<Route path="about" component={AboutPage} />
		<Route path="settings" component={SettingsPage} />
		<Route path="feedback1" component={FeedbackPage} />
		<Route path="moder" component={ModerateContainer} />

		<Redirect from="*" to="/" />
	</Route>
);

// <Route path=":id" component={Event}/>
