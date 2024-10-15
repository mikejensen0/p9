# p9 
You need to have python installed so pip works. Then while in root of the project run pip install -r requirements.txt to install all requirements. 
To run the code you need docker installed and running. Go to the docker_setup folder and run:
docker build . -t compiler
docker run -d -p 5000:5000 compiler

After that run server.py. Then your system should be up and running and can be found at the url stated by the terminal
