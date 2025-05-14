docker stop conference-container
docker rm conference-container
docker build -t conference .
docker run -d -p 8000:80 -p 3000:3000 --name conference-container conference