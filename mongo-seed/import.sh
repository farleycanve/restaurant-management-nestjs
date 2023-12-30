#! /bin/bash

mongoimport --host mongodb --db testing_db --collection restaurants --type json --file mongo-seed/restaurant.json