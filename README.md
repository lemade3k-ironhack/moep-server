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
username - String // required & unique
email - String // required & unique
password - String // required
role - String // enum['admin', 'user'], default: 'user'
concerts - [Ref ObjectID<Concert>]
timestamps
```

Concert model

```
band - String // required & unique
starttime - Date // required
endtime - Date // required
description - String
image - String
stage - [Ref ObjectID<Stage>]
timestamps
```

Stage model

```
name - String //required & unique
timestamps
```

News model

```
message - String //required
timestamps
```

## API Endpoints/Backend Routes

##### Session handling
-  POST /api/auth/signup
-  POST /api/auth/signin
-  POST /api/auth/logout
-  GET /api/auth/user

##### Stages routes
-  GET /api/stages - get all stages
-  POST /api/stage/create - create new stage
-  GET /api/stage/:stageId - get stage details
-  PATCH /api/stage/:stageId/update - edit stage
-  DELETE /api/stage/:stageId/delete - delete stage

##### Concert routes
- GET /api/upcoming - get the next 5 upcoming shows
-  GET /api/concerts - get all concerts
-  GET /api/concerts/:concertId - get concert details
-  GET /api/stages/:stageId/concerts - get all concerts of a stage
-  POST /api/stages/:stageId/concerts/create - create new concert for a stage
-  PATCH /api/concerts/:concertId/update - edit concert
-  DELETE /api/concerts/:concertId/delete - delete concert

##### Favorites
-  PATCH /api/favorites/add - add a users favorite
-  PATCH /api/favorites/remove - remove a users favorite

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
