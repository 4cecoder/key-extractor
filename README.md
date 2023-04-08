# key-extractor

code is now PY PON

### our test links
https://www.fmovies.ink/watch-movie/watch-three-days-in-the-woods-2-killin-time-full-95035.9521554

### we find the player's weird js link 
example:
```
https://rabbitstream.net/js/player/prod/e4-player.min.js?v=1680910425:1%20%20%20%20%20uk%20https://rabbitstream.net/js/player/prod/e4-player.min.js?v=1680910425:1%20%20%20%20%20uh%20https://rabbitstream.net/js/player/prod/e4-player.min.js?v=1680910425:1%20%20%20%20%20uh%20https://rabbitstream.net/js/player/prod/e4-player.min.js?v=1680910425:1%20%20%20%20%20isOpen%20https://rabbitstream.net/js/player/prod/e4-player.min.js?v=1680910425:1%20%20%20%20%20%3Canonymous%3E%20https://rabbitstream.net/js/player/prod/e4-player.min.js?v=1680910425:1%20%20%20%20%20uS%20https://rabbitstream.net/js/player/prod/e4-player.min.js?v=1680910425:1%20%20%20%20%20up%20https://rabbitstream.net/js/player/prod/e4-player.min.js?v=1680910425:1%20e4-player.min.js:1:769652
```


OUR magic
```bash
grep -Po '(?<=\W|^)[A-Za-z0-9]{20}(?=\W|$)' booty.js | grep -P '(?=.*\d)(?=.*[A-Z]).*' > key.txt
```
