## Setup
You need to have python installed so pip works. Then while in root of the project run the following command to install all requirements:

`pip install -r requirements.txt` 

You also need Docker installed.

## Running the program
To run the program, the Docker container and server needs to be run the following commands:

### Docker container
Go to the `docker_setup` folder and run:

`docker build . -t compiler`

`docker run -d -p 5000:5000 compiler`

### Backend Server
After that run `server.py`
Then your system should be up and running and can be found at the url stated by the terminal.
