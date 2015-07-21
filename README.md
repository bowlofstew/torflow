# TorFlow

## Building

NodeJS and NPM are required for building and running.  Once NPM is installed, install the gulp plugin globally to build the Javascript source:

	npm install -g gulp

Install modules (from root project directory):

    npm install

Build:

    cd public
    gulp install

## Running

Run the server:

	npm start

In your browser:

	http://localhost:3000

## Ingest Data

Ingest relays into ElasticSearch via Logstash.  There is a set of sample data in the $PROJECT_ROOT/data/relays_small folder.  To import this from logstash:

	logstash -f $PROJECT_ROOT$/data/es_import_small.conf
	
NOTE: You must manually edit the configuration file!  It only supports absolute file paths, so the ones checked into source control will be wrong for your local machine

## Building the Docker container

Prepare the build directory:

	cd .
	gulp build

Start the VM:

    vagrant up
    vagrant ssh
    cd /vagrant

You may need to start docker:

	sudo systemctl start docker

Build the container:

    sudo docker build -t="docker.uncharted.software/torflow" .

Run the container:

    sudo docker run -ti --rm --name torflow -p 3000:3000 -p 9200:9200 -p 9300:9300 -v /vagrant/esdata:/usr/share/elasticsearch-1.7.0/data -v /vagrant/eslogs:/var/log/supervisor docker.uncharted.software/torflow

Ingest the data:

	cd ~
	wget https://download.elastic.co/logstash/logstash/logstash-1.5.2.tar.gz ; tar xzf logstash-1.5.2.tar.gz
	
This installs logstash in your vagrant home directory.  We will use logstash to ingest the data.  Copy the processed Tor csv files into the mounted vagrant data directory temporarily under the path:

	/vagrant/data/processed
	
(We don't check these files into source control as they are several GB of data).  Invoke logstash to start the import process:

	cd logstash-1.5.2/bin/
	./logstash -f /vagrant/data/es_import_docker.conf

The data will be stored in `esdata` and the logs are in `eslogs`.  If you have prebuilt esdata directories, you can skip the above step and copy them into your /vagrant/ directory as is.

To push the image to the repository:

	sudo docker login docker.uncharted.software
	sudo docker push docker.uncharted.software/torflow

To run on another machine:

	sudo docker pull docker.uncharted.software/torflow
