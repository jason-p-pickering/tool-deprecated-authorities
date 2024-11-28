# DHIS2 Deprecated Authorities App

## License
© Copyright 2024 University of Oslo

## Overview

This app will help you to remove stale and deprecate authorities from your user roles.
Deprecated authorities can cause issues with user management and generally, should
be removed from the system if they are not needed any longer.

The app will compare the current list of authorities available from `api/authorities`
in your system, to the authorities which each  of the user roles in your system contains.
Authorities which do not appear in the current version of your server, will be flagged.

You should consider to remove these authorities, as they should not be needed.

It is important to keep in mind that the DHIS2 server generates the list of authorities
as a best-effort. Certain installations may use custom authorities which the server
is not aware of, and thus they may be flagged by this app. Consider carefully
which authorities to remove before you proceed.

As is always the case, you are advised to work first in a development environment, and
only after you have tested the changes made by this tool, should you then move to production.

## Getting started

### Install dependencies
To install app dependencies:

```
yarn install
```

### Compile to zip
To compile the app to a .zip file that can be installed in DHIS2:

```
yarn run zip
```

### Start dev server
To start the webpack development server:

```
yarn start
```

By default, webpack will start on port 8081, and assumes DHIS2 is running on 
http://localhost:8080/dhis with `admin:district` as the user and password.

A different DHIS2 instance can be used to develop against by adding a `d2auth.json` file like this:

```
{
    "baseUrl": "localhost:9000/dev",
    "username": "john_doe",
    "password": "District1!"
}
```
