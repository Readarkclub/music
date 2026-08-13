(function(){
  'use strict';
  var audio=document.getElementById('track');
  var canvas=document.getElementById('visualizer');
  if(!audio||!canvas)return;
  var ctx=canvas.getContext('2d');
  var play=document.getElementById('play');
  var scrub=document.getElementById('scrub');
  var elapsed=document.getElementById('elapsed');
  var duration=document.getElementById('duration');
  var state=document.getElementById('player-state');
  var volume=document.getElementById('volume');
  var chapters=document.getElementById('chapters');
  var data=JSON.parse(document.getElementById('piece-data').textContent);
  var ac=null,analyser=null,bins=null,source=null,raf=0,w=0,h=0,dpr=1;
  var trail=[];

  function format(n){
    if(!isFinite(n))return '0:00';
    n=Math.max(0,Math.floor(n));
    return Math.floor(n/60)+':'+String(n%60).padStart(2,'0');
  }
  function color(alpha){
    var c=getComputedStyle(document.documentElement).getPropertyValue('--piece').trim()||'#E0A458';
    if(alpha==null)return c;
    var v=c.match(/^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
    if(v)return 'rgba('+parseInt(v[1],16)+','+parseInt(v[2],16)+','+parseInt(v[3],16)+','+alpha+')';
    return c;
  }
  function resize(){
    var r=canvas.getBoundingClientRect();dpr=Math.min(devicePixelRatio||1,2);w=r.width;h=r.height;
    canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  function initAudio(){
    if(ac)return;
    ac=new (window.AudioContext||window.webkitAudioContext)();
    analyser=ac.createAnalyser();analyser.fftSize=512;analyser.smoothingTimeConstant=.84;
    bins=new Uint8Array(analyser.frequencyBinCount);
    source=ac.createMediaElementSource(audio);source.connect(analyser);analyser.connect(ac.destination);
  }
  function spectrum(){
    if(analyser){analyser.getByteFrequencyData(bins);return bins}
    var idle=new Uint8Array(128),t=performance.now()/1100;
    for(var i=0;i<idle.length;i++)idle[i]=10+7*Math.sin(t+i*.31)+5*Math.sin(t*.41+i*.12);
    return idle;
  }
  function drawWave(a,alpha,offset){
    ctx.beginPath();var mid=h*.52;
    for(var i=0;i<a.length;i+=2){
      var x=i/(a.length-1)*w;var fall=Math.pow(1-i/a.length,.34);var y=mid-(a[i]/255-.16)*h*.34*fall+offset;
      if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
    }
    ctx.strokeStyle=color(alpha);ctx.lineWidth=1.35;ctx.stroke();
  }
  function frame(){
    raf=requestAnimationFrame(frame);var a=spectrum();var mode=document.documentElement.getAttribute('data-motion')||'bloom';
    ctx.clearRect(0,0,w,h);
    if(mode==='still'){ctx.beginPath();ctx.moveTo(0,h*.52);ctx.lineTo(w,h*.52);ctx.strokeStyle=color(.26);ctx.stroke();return}
    var energy=0;for(var i=2;i<56;i++)energy+=a[i];energy/=54*255;
    if(mode==='ripple'){
      var cx=w*.5,cy=h*.52,max=Math.min(w,h)*.44;
      for(i=0;i<7;i++){var band=a[3+i*7]/255;ctx.beginPath();ctx.ellipse(cx,cy,max*(.18+i*.13)+band*18,max*(.08+i*.055)+band*9,0,0,Math.PI*2);ctx.strokeStyle=color(.11+i*.045);ctx.lineWidth=1;ctx.stroke()}
    }else if(mode==='trails'){
      trail.unshift(Array.from(a));if(trail.length>9)trail.pop();
      for(i=trail.length-1;i>=0;i--)drawWave(trail[i],.08+(trail.length-i)*.035,(i-trail.length/2)*7);
    }else{
      var g=ctx.createRadialGradient(w*.5,h*.54,4,w*.5,h*.54,Math.min(w,h)*(.2+energy*.42));
      g.addColorStop(0,color(.27+energy*.28));g.addColorStop(.42,color(.1));g.addColorStop(1,color(0));ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
      drawWave(a,.78,0);drawWave(a,.18,6);
    }
  }
  function update(){
    var p=audio.duration?audio.currentTime/audio.duration:0;
    scrub.value=p*1000;elapsed.textContent=format(audio.currentTime);duration.textContent=format(audio.duration);
    var cs=chapters.querySelectorAll('.chapter');
    for(var i=0;i<cs.length;i++)cs[i].classList.toggle('active',p+1e-5>=+cs[i].dataset.start&&p+1e-5<(i===cs.length-1?1:+cs[i+1].dataset.start));
  }
  function buildChapters(){
    var total=data.sections.reduce(function(s,x){return s+x.weight},0),at=0;
    data.sections.forEach(function(sec){
      var b=document.createElement('button');b.type='button';b.className='chapter';b.dataset.start=at/total;b.style.flex=sec.weight;
      b.innerHTML='<span class="chapter-name">'+sec.name+'</span>';b.title=sec.name;
      b.addEventListener('click',function(){if(audio.duration){audio.currentTime=+b.dataset.start*audio.duration;update()}});
      chapters.appendChild(b);at+=sec.weight;
    });
  }
  async function toggle(){
    initAudio();if(ac.state==='suspended')await ac.resume();
    if(audio.paused){try{await audio.play()}catch(e){state.textContent='Playback unavailable'}}else audio.pause();
  }
  play.addEventListener('click',toggle);
  audio.addEventListener('play',function(){play.setAttribute('aria-pressed','true');state.textContent='Now playing'});
  audio.addEventListener('pause',function(){play.setAttribute('aria-pressed','false');state.textContent=audio.ended?'Finished':'Paused'});
  audio.addEventListener('ended',function(){play.setAttribute('aria-pressed','false');state.textContent='Finished'});
  audio.addEventListener('loadedmetadata',update);audio.addEventListener('timeupdate',update);audio.addEventListener('seeked',update);
  audio.addEventListener('error',function(){state.textContent='Audio could not be loaded'});
  scrub.addEventListener('input',function(){if(audio.duration){audio.currentTime=(+scrub.value/1000)*audio.duration;update()}});
  volume.addEventListener('input',function(){audio.volume=+volume.value});
  canvas.addEventListener('click',function(e){if(audio.duration)audio.currentTime=(e.offsetX/canvas.clientWidth)*audio.duration});
  document.addEventListener('keydown',function(e){if(e.code==='Space'&&!/INPUT|BUTTON/.test(e.target.tagName)){e.preventDefault();toggle()}});
  window.addEventListener('resize',resize);buildChapters();resize();frame();audio.load();
})();
