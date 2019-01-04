import React from 'react';
import { Redirect } from 'react-router-dom';

import App from './App';

import TodayPageContainer from './pages/TodayPage/TodayPageContainer';
import EventPageContainer from './pages/EventPage/EventPageContainer';
import AboutPage from './pages/AboutPage/AboutPage';
import FeedbackPage from './pages/FeedbackPage/FeedbackPage';
import ModerateContainer from './pages/ModeratePage/ModerateContainer';
import SettingsPage from './pages/SettingsPage/SettingsPage';
import WeekEventsPage from './pages/WeekEvents/WeekEventsContainer';
import AdminPage from './pages/Admin/AdminContainer';

export default [
  {
    component: App,
    path: '/',
    routes: [
      { ...TodayPageContainer, path: '/events' },
      { ...EventPageContainer, path: '/event/:id' },
      { ...EventPageContainer, path: '/check/:id' },
      { component: AboutPage, path: '/about' },
      { component: WeekEventsPage, path: '/weekevents' },
      { component: SettingsPage, path: '/settings' },
      { component: FeedbackPage, path: '/feedback1' },
      { component: ModerateContainer, path: '/moder' },
      { component: AdminPage, path: '/somepath' },
      {
        path: ['/', '/event', '*'],
        exact: true,
        component: () => <Redirect to="/events" />,
      }
    ],
  }
];
