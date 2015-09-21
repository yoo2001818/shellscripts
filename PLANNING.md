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

## Passport
Represents an authentication method to sign in as an User.

Users can have multiple auth methods.

- user - User
- type - String
- identifier - String
- data - String

## Script
Represents a script.

- name - String
- author - User
- tags - Tag
- description - String
- script - String (Preferably Text)

## Tag
Represents a tag. Tag can be used as a 'distribution' marker, etc.

- name - String, Unique
- type - int
- scripts - Script

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

### DELETE /
Delete current session. (= Sign out.)

### TODO
- Revoke / grant access to new authentication method
- Change password (local)
- Get current methods registered to the user

## User

### GET /username/:username
Returns an user with that username.

### GET /id/:id
Returns an user with that ID.

### GET /email/:email
Returns a **boolean** marking whether if there is an user using that email.

### GET /self
Returns current user.

**This is duplicate of GET /session**

### POST /self
Sets the profile of the user.

### POST /self/:field (or /self/photo)
Sets specific field of the user's profile.

#### photo
- image - File
- x - int
- y - int
- width - int
- height - int

### DELETE /self
Deactivate the user forever.
