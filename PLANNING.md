# Shellscripts Planning Document
Shellscripts is a shell script repository website; You can easily get and run
shellscripts as simple as package managers such as `apt-get`.

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
- admin - Boolean, default 'false'

### Username convention
`^[a-zA-Z0-9][a-zA-Z0-9-_]*[a-zA-Z0-9]$`

## Passport
Represents an authentication method to sign in as an User.

Users can have multiple auth methods.

- user - User
- type - String
- identifier - String
- data - Text

## Script
Represents a script.

- name - String
- author - User
- tags - Tag
- description - Text
- script - Text

## Tag
Represents a tag. Tag can be used as a 'distribution' marker, etc.

- name - String, Unique
- description - Text
- type - TagType
- author - User
- scripts - Script

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

## Script

### GET /scripts/
Search a script.

### GET /scripts/:id
Returns a script with the ID.

### PUT /scripts/:id
Edit the script.

### DELETE /scripts/:id
Remove the script.

### POST /scripts/:id/vote
Vote the script.

### DELETE /scripts/:id/vote
Cancel the vote.

### GET /scripts/:id/comments
Returns comments in the script.

### POST /scripts/:id/comments
Post a comment into the script.

### POST /scripts/:id/report
Report the script to admins.

### POST /scripts/:id/tag
Post a tag into the script.

### PUT /scripts/:id/tag
Replace entire tag list of the script.

### DELETE /scripts/:id/tag
Delete entire tag list.

### GET /scripts/:id/tag
Return a tag list.

### DELETE /scripts/:id/tag/:tag
Remove a tag from the tag list.

### POST /scripts/
Saves a new script to the database.

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
