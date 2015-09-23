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
`^[a-zA-Z][a-zA-Z0-9_]+$`

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
`^[a-zA-Z0-9_]+$`

# API
Shellscripts use REST API for data access. Even web frontend servers make API
calls due to the nature of universal app.

## Session

### GET /
Returns current user.

### GET /method
Returns available authentication methods.

### /:method
Sign in using specified authentication method.

### POST /local/register
Create an account using local authentication method.

### POST /local/password
Send a password-change verification mail.

### PUT /local/password
Change a password.

### DELETE /
Delete current session. (= Sign out.)

### TODO
- Revoke / grant access to new authentication method
- Change password (local)
- Get current methods registered to the user

## User

### GET /
Returns users matching the query.

### GET /:username
Returns an user with the username.

### GET /:id
Returns an user with the ID.

### GET /self
Returns current user.
(This forbids the user 'self')

**This is duplicate of GET /session**

### PUT /self
Sets the profile of the user.

### PUT /self/:field (or /self/photo)
Sets specific field of the user's profile.

#### photo
- image - File
- x - int
- y - int
- width - int
- height - int

### DELETE /self
Deactivate the user forever.

## Script

### GET /
Search a script.

### GET /:id
Returns a script with the ID.

### PUT /:id
Edit the script.

### DELETE /:id
Remove the script.

### POST /:id/vote
Vote the script.

### DELETE /:id/vote
Cancel the vote.

### GET /:id/comments
Returns comments in the script.

### POST /:id/comments
Post a comment into the script.

### POST /:id/report
Report the script to admins.

### POST /:id/tag
Post a tag into the script.

### PUT /:id/tag
Replace entire tag list of the script.

### DELETE /:id/tag
Delete entire tag list.

### GET /:id/tag
Return a tag list.

### DELETE /:id/tag/:tag
Remove a tag from the tag list.

### POST /
Saves a new script to the database.

## Comment

### GET /:comment
Returns the comment.

### PUT /:comment
Edit the comment.

### DELETE /:comment
Remove the comment.

### POST /:comment
Post a reply comment. (What?)

### POST /:comment/vote
Vote the comment.

### DELETE /:comment/vote
Cancel the vote.

### POST /:comment/report
Report the comment to admins.

## Tag

### GET /
Returns tags matching the criteria.

### POST /
Post a new tag.

### GET /:name
Return the tag.

### PUT /:name
Edit the tag's data.

### DELETE /:name
Remove the tag.

# TODO

collection
