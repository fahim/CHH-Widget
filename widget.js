var ChhWidget = {
  songs:        new Array(),
  activeSong:   null,
  activeAudio:  null,
  playlistName: '',

  playImage:    'play.png',
  pauseImage:   'pause.png',
  loaderImage:  'loader.gif',
  buttonId:     'chh-widget-button',
  progressId:   'chh-widget-progress-bar',
  progressTime: '',
  
  initialize: function(parentElem) {
    this.drawPlayer( $('.player', parentElem) )
    this.drawPlaylist( $('.playlist', parentElem) )
    this.drawFooter( $('.footer', parentElem) )
  },
  
  drawPlaylist: function(element) {
    var song_list = document.createElement('ul')
    song_list.className = 'songs'

    for (var i in this.songs) {
      song = this.songs[i]
      
      list_item = document.createElement('li')
      list_item.className = "song"
      list_item.id        = "song-" + song.id
      list_item.innerText = song.artists + ' - ' + song.name
      $(list_item).data('song', song)
      $(list_item).click(this.startSong)
      if (this.activeSong == song) $(list_item).addClass('selected')

      song_list.appendChild(list_item)    
    }
    
    $(element).append(song_list)
  },
  
  drawPlayer: function(element) {
    $(element).append('<div class="button play" id="'+ this.buttonId +'"></div>\
                       <div class="progress">\
                         <div class="playlist-name">'+ this.playlistName +'</div>\
                         <div id="chh-widget-time-left"></div>\
                         <div id="'+ this.progressId +'"></div>\
                       </div>')
    $('.button', element).click(this.pauseSong)
  },
  
  drawFooter: function(element) {
    logo = document.createElement('img')
    logo.src = "chh.png"
    logo.className = 'logo'
    
    //meta = document.createElement('div')
    //meta.className = 'playlist-meta'
    //meta.innerText = this.songs.length + " songs"
    
    //$(element).append(meta)
    $(element).append(logo)
  },
  
  addSongs: function(songs_array) {
    for (var i in songs_array) {
      song_data = songs_array[i]
      song = {
        id:      song_data[0],
        artists: song_data[1],
        name:    song_data[2] 
      }
      this.songs.push(song)
    }
  },
  
  setupSong: function(song) {
    self = ChhWidget
    self.activeSong = song
    
    if (self.activeAudio) {
      self.activeAudio.pause()
    }
    
    audio = document.createElement('audio')
    self.activeAudio = audio
    audio.src = "http://cdn.currenthiphop.com/stream/" + song.id + ".mp3"
  },
  
  startSong: function() {
    self = ChhWidget
    song = $(this).data('song')
    
    self.showBuffer()
    self.setupSong(song)
    self.playSong()
    
    $(this).addClass('selected')
    $(this).siblings().removeClass('selected')
  },
  
  playSong: function() {
    self = ChhWidget
    
    if (self.activeAudio != null) {
      self.activeAudio.play()
      $(self).click(self.pauseSong)
      //button = $('#' + self.buttonId).removeClass('play', 'buffer').addClass('pause')
    }
    
    self.progressInterval = window.setInterval(this.updateProgress, 30)
  },
  
  pauseSong: function() {
    self = ChhWidget
    
    if (self.activeAudio != null) {
      self.activeAudio.pause()
      window.clearInterval(self.progressInterval);
      
      $(self).click(self.playSong)
      button = $('#' + self.buttonId).removeClass('pause', 'buffer').addClass('play')
    }
  },
  
  updateProgress: function() {
    self = ChhWidget
    audio = self.activeAudio
    
    var loaded;
    if ((audio.buffered != undefined) && (audio.buffered.length != 0)) {
      loaded = parseInt((audio.currentTime - audio.buffered.end(0)), 10);
      log(loaded)
      self.progressBarUpdate()
    } else {
      loaded = 0
    }
    
    if (loaded > 0) {
      self.showBuffer()
    } else if (audio.currentTime > 0) {
      $('#' + self.buttonId).removeClass('buffer')
      $('#' + self.buttonId).addClass('pause')
    }

  },
  
  showBuffer: function() {
    self = ChhWidget
    $('#' + self.buttonId).removeClass('play', 'pause').addClass('buffer')
  },
  
  progressBarUpdate: function(audio) {
    self = ChhWidget
    audio = self.activeAudio
    
    var remaining = parseInt(audio.duration - audio.currentTime, 10),
    progress      = (audio.currentTime / audio.duration) * 100,
    minutes       = Math.floor(remaining / 60,10),
    seconds       = remaining - minutes *60;

    $('#chh-widget-time-left').html('-' + minutes + ':' + (seconds > 9 ? seconds : '0' + seconds));
    if (!self.audioLoaded) {
      self.audioLoaded = true;
    }
    
    // Change the width of the progress bar
    width = (progress * 2)
    $('#' + this.progressId).css('width', width + '%');
    //if (!manualSeek) { positionIndicator.css({left: pos + '%'}); }
  },
}

ChhWidget.playlistName = "Birthday Philosophy Mixtape"
ChhWidget.addSongs([
  ["d3jrjq" ,"Mann (ft. Lonny Breaux)" ,"Lovely Day (Intro)"],
  ["ocisai" ,"Mann" ,"For You"],
  ["i4tank" ,"Mann" ,"BDay"],
  ["bw3yr8" ,"Mann" ,"'Til I'm On Top"],
  ["us77j5" ,"Mann" ,"Love Me Back"],
  ["pai4xt" ,"Mann" ,"I'm Cold"],
  ["72ooeo" ,"Mann (ft. Fly Guy Tone)" ,"Swaggin' Heavy"],
  ["k97gt3" ,"Mann" ,"West LA"],
  ["5b2a5s" ,"Mann" ,"Ambition To Win"],
  ["ue1mxs" ,"Mann" ,"Take Me Or Leave ME"],
  ["r3g5vk" ,"Mann (ft. Tone P & Shawn Chrystopher)" ,"Never Give"],
  ["5y207" ,"Mann" ,"Aura"],
])

function log(text) {
  if (console) console.log(text)
}