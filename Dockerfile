# #Dockerfile
FROM docker.elastic.co/elasticsearch/elasticsearch:8.7.0


# COPY elasticsearch-analysis-vietnamese-8.7.0.zip /usr/share/elasticsearch/

# RUN cd /usr/share/elasticsearch && \
#   bin/elasticsearch-plugin install file:///usr/share/elasticsearch/elasticsearch-analysis-vietnamese-8.7.0.zip 

RUN elasticsearch-plugin install --batch https://github.com/duydo/elasticsearch-analysis-vietnamese/releases/download/v8.7.0/elasticsearch-analysis-vietnamese-8.7.0.zip && \
    elasticsearch-plugin install --batch analysis-icu

USER elasticsearch

  # && \
  # bin/elasticsearch-plugin install analysis-icu

#Dockerfile
# FROM --platform=linux/amd64 elasticsearch:5.3.1

# COPY elasticsearch-analysis-vietnamese-5.3.1.zip /usr/share/elasticsearch/

# RUN cd /usr/share/elasticsearch && \
#   bin/elasticsearch-plugin install file:///usr/share/elasticsearch/elasticsearch-analysis-vietnamese-5.3.1.zip && \
#   bin/elasticsearch-plugin install analysis-icu
