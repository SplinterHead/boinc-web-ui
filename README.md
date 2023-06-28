# BOINC Web UI

A simple Web UI for managing multiple BOINC clients. This is born from wanting to use the basic BOINC client docker image to execute work items, but not have a desktop application to manage them.

## Introdution

This project intends to make it simple and inviting to connect all of your BOINC clients in one simple web-based dashboard


## Features

* Supports multiple clients
* Allows registering a client to a new project
* Overview of the currently attached projects and the work items

#### Roadmap

* Manage a project's state (pause, resume, disconnect)
* Message list
* Client Preferences
* Account Manager

## See it in action

![New Client Modal](docs/img/new_client_modal.png)
_Add a new client_

![Basic Client View](docs/img/client_info.png)
_See the client's state_

![Project List](docs/img/project_list.png)
_View, search and join projects_

## Deploy it yourself

While work is currently underway to create a simplified Docker image for this project, it can be run independantly already.

### BOINC API

1. Clone the [SplinterHead/boinc-api](https://github.com/SplinterHead/boinc-api) repo
2. Install dependencies
  > `poetry install`
3. Run the API
  > `FLASK_APP=src/boinc_api/app.py poetry run flask run`

### BOINC Web UI

1. Clone the [SplinterHead/boinc-web-ui](https://github.com/SplinterHead/boinc-web-ui) repo
2. Install the dependencies
  > `npm install`
3. Run the frontend
  > `npm run serve`