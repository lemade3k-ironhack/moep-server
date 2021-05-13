# moep

## Description

a festival-app to overview the timetable, store favourites and get festival information

## User Stories

-  **404:** As an anon/user I can see a 404 page if I try to reach a page that does not exist so that I know it's my fault
-  **Signup:** As an anon I can sign up in the platform so that I can start using the festivaL planer;
-  **Login:** As a user I can login to the platform so that I can start using the festivaL planer
-  **Logout:** As a user I can logout from the platform so no one else can use it
-  **Welcome** As a user I can see the timetable, my favourites, and a live ticker with special information (e.g. delays)
-  **Timetable** a timetable with different stages and bands, bands can be added to favourites by the user.
-  **Band Detail** The user can find more information about the band on this page
-  **Support-Chat** If the user needs any help he can find a support chat at the bottom.
-  **Admin-Role** The admin can create, edit and delete stages and concerts

## Backlog

-  **Bands** All bands listed, the user can see a short bandinfo and the information when the band is playing
-  **Search**
-  **Map**

# Client

## Pages / Routes

-  Landing (public) including Login, "/"
-  Signup Page (anon only), "/signup
-  Welcome (user only), "/welcome"
-  Timetable (user only), "/timetable"
-  Band-Detail (user only), "/bands/:bandid"
-  Admin Timetable (admin only), /admin/timetable
-  Admin Ticker (admin only), /admin/news/new //news/edit
-  404 Page (public)

# Server

## Models

User model

```
username - String // required &unique
email - String // required & unique
password - String // required
favorites - [Ref ObjectID<Concert>]
```

Concert model

```
band - String // required
starttime - Date // required
endtime - Date // required
day - Date // required
description - String
image - String
stage - [Ref ObjectID<Stage>]
```

Stage model

```
name - String //required
```

## API Endpoints/Backend Routes

-  POST /auth/signup
-  POST /auth/signin
-  POST /auth/logout
-  GET /auth/user

-  PATCH /favorites/add
-  add a users favorite
-  PATCH /favorites/remove
-  remove a users favorite

-  GET /stages get all stages
-  POST /stages/create create new stage
-  GET /stages/:stageId get stage details
-  PATCH /stages/:stageId/update edit stage
-  DELETE /stages/:stageId/delete delete stage

-  GET /stages/:stageId/concerts get all concerts of a stage
-  POST /stages/:stageId/concerts/create create new concert
-  GET /stages/:stageId/concerts/:concertId get concert details
-  PATCH /stages/:stageId/concerts/:concertId/update edit concert
-  DELETE /stages/:stageId/concerts/:concertId/delete delete concert
-  GET /concerts get all concerts

## Links

### Trello/Kanban

https://trello.com/b/VP1CbHx0/project3

### Whimsical

https://whimsical.com/wireframes-ExoMHUB6FMFSbqG33e773p

### Git

The url to your repository and to your deployed project

[Client repository Link](https://github.com/lemade3k-ironhack/moep-client)
[Server repository Link](https://github.com/lemade3k-ironhack/moep-server)

[Deploy Link](http://heroku.com)

### Slides

The url to your presentation slides

[Slides Link](http://slides.com)
