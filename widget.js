var ChhWidget = {
  songs:        new Array(),
  activeSong:   null,
  activeAudio:  null,
  playlistName: '',

  playImage:    'play.png',
  pauseImage:   'pause.png',
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
    audio.src = "http://cdn.currenthiphop.com/stream/" + song.id + ".mp3"
    audio.addEventListener('timeupdate', function() {
      self = ChhWidget
      self.progressBarUpdate(audio)
    }, false)

    self.activeAudio = audio
  },
  
  startSong: function() {
    self = ChhWidget
    song = $(this).data('song')
    
    self.setupSong(song)
    self.playSong()
    
    $(this).addClass('selected')
    $(this).siblings().removeClass('selected')
  },
  
  playSong: function() {
    self = ChhWidget
    if (self.activeAudio != null) {
      self.activeAudio.play()
      log(self.activeSong)
      $(this).click(this.pauseSong)
      $('#' + self.buttonId).css('background-image', 'url(' + self.pauseImage + ')')
    }
  },
  
  pauseSong: function() {
    self = ChhWidget
    if (self.activeAudio != null) {
      self.activeAudio.pause()
      $(this).click(this.playSong)
      $('#' + self.buttonId).css('background-image', 'url(' + self.playImage + ')')
    }
  },
  
  progressBarUpdate: function(audio) {
    var duration = audio.duration;
    var current = audio.currentTime;
    var progress = (current / duration) * 100;
    
     // Change the width of the progress bar
     width = (progress * 2)
     $('#' + this.progressId).css('width', width + '%');

     // And finally calculate where we are in the 
     var tcMins = parseInt(duration/60);
     var tcSecs = parseInt(duration - (tcMins * 60));

     // If the number of seconds is less than 10, add a '0'
     if (tcSecs < 10) { tcSecs = '0' + tcSecs; }

     // Display the time
     $('#' + this.progressTime).html(tcMins + ':' + tcSecs);
  }
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