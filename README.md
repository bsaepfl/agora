# agora
EPFL Blockchain Reputation System

## :wrench: setup

Make sure you have [yarn](https://yarnpkg.com/) installed.

Clone the project to your computer:
```
git clone https://github.com/bsaepfl/agora.git
cd agora
```

Install dependencies:
```
yarn
```

## :rocket: launch

You will need two terminals open to launch the full project.

###### :gem: terminal 1 : blockchain

In the root directory, run:
```
yarn develop
```
and then, inside the console:
```
compile
migrate --reset
```

###### :sparkles: terminal 2 : frontend & server

In the root directory, run:
```
yarn start
```
Now you can browse to [localhost:3000](http://localhost:3000) :tada:.
