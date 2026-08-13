(function(){
  'use strict';

  var tracks=[
    {title:'Sunroom Glow',src:'assets/audio/sunroom-glow.mp3',colour:'#F0C27B'},
    {title:'Afterglow Drift',src:'assets/audio/afterglow-drift.mp3',colour:'#E8956A'},
    {title:'Evensong at Dusk',src:'assets/audio/evensong-at-dusk.mp3',colour:'#D9A86A'},
    {title:'Window With Rain',src:'assets/audio/window-with-rain.mp3',colour:'#89A7C2'},
    {title:'Still Water',src:'assets/audio/still-water.mp3',colour:'#7FBBA9'}
  ];
  var audio=document.getElementById('queue-audio');
  if(!audio)return;

  var queue=document.querySelector('.queue');
  var play=document.getElementById('queue-play');
  var action=document.getElementById('queue-action');
  var title=document.getElementById('queue-title');
  var count=document.getElementById('queue-count');
  var status=document.getElementById('queue-status');
  var scrub=document.getElementById('queue-scrub');
  var elapsed=document.getElementById('queue-elapsed');
  var duration=document.getElementById('queue-duration');
  var rows=document.querySelectorAll('[data-track-index]');
  var index=0;

  function format(seconds){
    if(!isFinite(seconds))return '0:00';
    seconds=Math.max(0,Math.floor(seconds));
    return Math.floor(seconds/60)+':'+String(seconds%60).padStart(2,'0');
  }

  function paint(){
    var track=tracks[index];
    queue.style.setProperty('--queue-colour',track.colour);
    title.textContent=track.title;
    count.textContent=String(index+1).padStart(2,'0')+' / '+String(tracks.length).padStart(2,'0');
    for(var i=0;i<rows.length;i++)rows[i].classList.toggle('is-queue-current',+rows[i].dataset.trackIndex===index);
    if('mediaSession' in navigator){
      navigator.mediaSession.metadata=new MediaMetadata({title:track.title,album:'Quiet Pieces',artist:'Readark Club'});
    }
  }

  function load(next,autoplay){
    index=(next+tracks.length)%tracks.length;
    audio.src=tracks[index].src;
    scrub.value=0;
    elapsed.textContent='0:00';
    paint();
    audio.load();
    if(autoplay){
      audio.play().catch(function(){status.textContent='Press play to continue';});
    }
  }

  function toggle(){
    if(!audio.src)load(index,false);
    if(audio.paused){audio.play().catch(function(){status.textContent='Playback could not start';});}
    else audio.pause();
  }

  function skip(step){load(index+step,!audio.paused || play.getAttribute('aria-pressed')==='true');}

  play.addEventListener('click',toggle);
  document.getElementById('queue-prev').addEventListener('click',function(){
    if(audio.currentTime>3){audio.currentTime=0;return;}
    skip(-1);
  });
  document.getElementById('queue-next').addEventListener('click',function(){skip(1);});
  scrub.addEventListener('input',function(){
    if(audio.duration)audio.currentTime=(+scrub.value/1000)*audio.duration;
  });
  audio.addEventListener('loadedmetadata',function(){duration.textContent=format(Math.round(audio.duration));});
  audio.addEventListener('timeupdate',function(){
    elapsed.textContent=format(audio.currentTime);
    scrub.value=audio.duration?(audio.currentTime/audio.duration)*1000:0;
  });
  audio.addEventListener('play',function(){
    play.setAttribute('aria-pressed','true');
    action.textContent='Pause';
    status.textContent='Playing continuously · track '+(index+1)+' of '+tracks.length;
  });
  audio.addEventListener('pause',function(){
    play.setAttribute('aria-pressed','false');
    action.textContent='Resume';
    if(!audio.ended)status.textContent='Paused · the queue stays here';
  });
  audio.addEventListener('ended',function(){load(index+1,true);});
  audio.addEventListener('error',function(){status.textContent='This track could not load · moving to the next';setTimeout(function(){load(index+1,true);},900);});

  if('mediaSession' in navigator){
    navigator.mediaSession.setActionHandler('play',toggle);
    navigator.mediaSession.setActionHandler('pause',toggle);
    navigator.mediaSession.setActionHandler('previoustrack',function(){skip(-1);});
    navigator.mediaSession.setActionHandler('nexttrack',function(){skip(1);});
  }

  load(0,false);
})();
