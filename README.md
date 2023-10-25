
## Install

```
npm i
```

## Build viewer

```
npm run build
```

## Start web server

```
./node_modules/.bin/http-server app
```

## Run profiler

https://veripool.org/guide/latest/simulating.html#profiling


```
gprof system_example_bare > gprof_42.out
```

## View profiling data

copy profiling output file into `app` folder

```
cp gprof_42.out app
```

open viewer in the browser with URL string:

```
http://127.0.0.1:8080/?local=gprof_42.out
```
