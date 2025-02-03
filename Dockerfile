# Use httpd:2.4 as base image
FROM httpd:2.4

# Install necessary tools
RUN apt-get update && \
    apt-get install -y curl && \
    apt-get install -y wget && \
    rm -rf /var/lib/apt/lists/*
# Set environment variables for NEXUS  credentials and URL
ENV NEXUS_USER=admin 
ENV NEXUS_PASS=Rafik.123 
ENV NEXUS_URL=http://10.10.10.1:8081 
ENV NEXUS_REPO=front-repo

# Download artifacts from Nexus

RUN wget --user=$NEXUS_USER --password=$NEXUS_PASS --auth-no-challenge "$NEXUS_URL/repository/$NEXUS_REPO/dist.tar.gz"


RUN tar -xvzf dist.tar.gz 
RUN rm -rf /usr/local/apache2/htdocs/*

RUN echo "Deploying your Angular application..." 
RUN cp -r dist/* /usr/local/apache2/htdocs/
