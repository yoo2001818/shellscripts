# Shellscripts Planning Document
Shellscripts is a shell script repository website; You can easily get and run
shellentries as simple as package managers such as `apt-get`.

There will be two frontend for Shellscripts:
- Web frontend.
- Shell frontend. People can use the website even on the CUI mode.
  It'll be probably will be written /w Node.js, though I'm willing to write it
  using Python.

# Schema
Shellscripts use Sequelize ORM for its database.

## User
Represents single entity using the website.

- username - String, Unique
- email - String, Unique  
  Although I don't think email address is vital here.
- enabled - Boolean, default 'true'
- signedUp - Boolean, default 'false'
- isAdmin - Boolean, default 'false'
- name - String
- website - String

### Username convention
`^[a-zA-Z0-9][a-zA-Z0-9-_]*[a-zA-Z0-9]$`

## Passport
Represents an authentication method to sign in as an User.

Users can have multiple auth methods.

- user - User
- type - String
- identifier - String
- data - Text

## Entry
Represents a script or a collection.

- name - String
- title - String
- author - User
- tags - Tag
- brief - Text
- description - Text
- type - Enum

Script only:

- script - Text
- requiresRoot - Boolean

Collection only:

**TODO**

### Accessing

- /entries/:username/:name

`:name` is like a slug - it's an unique identifier.
Also, each entry resides in a user: That means entries can be accessed like
`testAccount/rmRfv`.

Why use `username/name` format? It's much better than `5323214` format right?

### TODO

- Versions
- Comments
- License
- Upvotes / Downvotes or Stars
- Collections

## Tag
Represents a tag. Tag can be used as a 'distribution' marker, etc.

- name - String, Unique
- description - Text
- type - TagType
- ~~author - User~~
- entries - Entry

## TagType
A tag type, such as 'distribution', 'language', 'arch'.

- name - String, Unique
- description - Text
- tags - Tag

### Tag name convention
`^[a-zA-Z0-9_-.]+$`

# API
Shellscripts use REST API for data access. Even web frontend servers make API
calls due to the nature of universal app.

## Session

### GET /session
Returns current user.

### GET /session/methods
Returns available authentication methods. (And current methods user have)

### GET /session/:method
Sign in using specified oAuth authentication method.

### POST /session/:method
Sign in using specified credentials.

### DELETE /session/:method
Unregister specified method. This can't be done if the method is last method
user have.

### POST /session/local/register
Create an account using local authentication method.

### POST /session/local/password
Send a password-change verification mail.

### PUT /session/local
Change the password.

### DELETE /session
Delete current session. (= Sign out.)

## User

### GET /users
Returns users matching the query.

### GET /users/:username
Returns an user with the username.

### GET /user
Returns current user.

**This is duplicate of GET /session**

### PUT /user
Sets the profile of the user.

### PUT /user/:field (or /user/photo)
Sets specific field of the user's profile.

#### photo
- image - File
- x - int
- y - int
- width - int
- height - int

### DELETE /user
Deactivate the user forever.

## Entries

### GET /entries/
Search entries.

### GET /entries/:author/:name
Returns a entry.

### PUT /entries/:author/:name
Edit the entry.

### DELETE /entries/:author/:name
Remove the entry.

### POST /entries/:author/:name/vote
Cast a vote.

### DELETE /entries/:author/:name/vote
Cancel the vote.

### GET /entries/:author/:name/comments
Returns comments in the entry.

### POST /entries/:author/:name/comments
Post a comment into the entry.

### POST /entries/:author/:name/report
Report the entry to admins.

### POST /entries/:author/:name/tag
Post a tag into the entry.

### PUT /entries/:author/:name/tag
Replace entire tag list of the entry.

### DELETE /entries/:author/:name/tag
Delete entire tag list.

### GET /entries/:author/:name/tag
Return a tag list.

### DELETE /entries/:author/:name/tag/:tag
Remove a tag from the tag list.

### POST /entries/
Save a new entry to the database.

## Comment

### GET /comments/:comment
Returns the comment.

### PUT /comments/:comment
Edit the comment.

### DELETE /comments/:comment
Remove the comment.

### POST /comments/:comment
Post a reply comment. (What?)

### POST /comments/:comment/vote
Vote the comment.

### DELETE /comments/:comment/vote
Cancel the vote.

### POST /comments/:comment/report
Report the comment to admins.

## Tag

### GET /tags
Returns tags matching the criteria.

### POST /tags
Post a new tag.

### GET /tags/:name
Return the tag.

### PUT /tags/:name
Edit the tag's data.

### DELETE /tags/:name
Remove the tag.

## TagType

### GET /tag-types
Returns tag types matching the criteria.

### POST /tag-types
Post a new tag type. (Only for admins)

### GET /tag-types/:name
Return the tag type.

### PUT /tag-types/:name
Edit the tag type's data. (Admin only)

### DELETE /tag-types/:name
Remove the tag type. (Admin only)

# TODO

collection
